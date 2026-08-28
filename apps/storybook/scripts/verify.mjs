/**
 * Auditeur du Storybook construit.
 *
 * Monte chacune des stories dans un vrai navigateur et relève ce qu'aucune
 * vérification statique ne peut voir :
 *
 *   — une story qui lève à l'exécution ;
 *   — une erreur ou un avertissement React dans la console ;
 *   — une violation d'accessibilité, détectée par axe-core ;
 *   — un débordement horizontal, qui trahit une largeur non contrainte.
 *
 * Travaille sur le Storybook **construit**, donc sur exactement ce qui est
 * déployé — pas sur une version de développement qui pourrait différer.
 *
 *   node ./scripts/verify.mjs            → thème clair
 *   node ./scripts/verify.mjs --dark     → thème sombre
 *   node ./scripts/verify.mjs --brand=ai → autre marque
 */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { chromium } from "playwright";

const DIST = fileURLToPath(new URL("../dist", import.meta.url));
// Résolu par le moteur de modules : avec la disposition stricte de pnpm, le
// paquet n'est pas à la racine du dépôt.
const AXE = createRequire(import.meta.url).resolve("axe-core/axe.min.js");

const args = process.argv.slice(2);
const theme = args.includes("--dark") ? "dark" : "light";
const brand = (args.find((a) => a.startsWith("--brand=")) ?? "--brand=sakura").split("=")[1];
const only = (args.find((a) => a.startsWith("--only=")) ?? "").split("=")[1];

const MIME = {
  ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml",
  ".woff2": "font/woff2", ".png": "image/png", ".map": "application/json",
};

/** Serveur statique minimal — pas de dépendance pour servir 156 fichiers. */
function serve() {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      const path = normalize(decodeURIComponent(req.url.split("?")[0]));
      const file = join(DIST, path === "/" ? "index.html" : path);
      if (!file.startsWith(DIST)) return res.writeHead(403).end();
      res.setHeader("Content-Type", MIME[extname(file)] ?? "application/octet-stream");
      createReadStream(file).on("error", () => res.writeHead(404).end()).pipe(res);
    });
    server.listen(0, "127.0.0.1", () => resolve({ server, port: server.address().port }));
  });
}

const { server, port } = await serve();
const base = `http://127.0.0.1:${port}`;

const index = JSON.parse(await readFile(join(DIST, "index.json"), "utf8"));
let stories = Object.values(index.entries).filter((e) => e.type === "story");
if (only) stories = stories.filter((s) => s.title.toLowerCase().includes(only.toLowerCase()));

const axeSource = await readFile(AXE, "utf8");
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

/** Bruit connu et sans intérêt, qui noierait les vrais signaux. */
const IGNORE = [
  /Failed to load resource/i,          // images distantes volontairement invalides
  /exemple\.invalide/i,
  /pravatar/i,
  /Download the React DevTools/i,
];

const findings = [];
let checked = 0;

for (const story of stories) {
  const logs = [];
  const onConsole = (m) => {
    if (m.type() === "error" || m.type() === "warning") logs.push(`${m.type()}: ${m.text()}`);
  };
  const onError = (e) => logs.push(`pageerror: ${e.message}`);

  page.on("console", onConsole);
  page.on("pageerror", onError);

  const url = `${base}/iframe.html?id=${encodeURIComponent(story.id)}&viewMode=story`
    + `&globals=theme:${theme};brand:${brand}`;

  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 20000 });
    // Laisse les animations d'entrée se terminer avant de mesurer.
    await page.waitForTimeout(450);

    const overflow = await page.evaluate(() => {
      const d = document.documentElement;
      return Math.max(0, d.scrollWidth - d.clientWidth);
    });

    /**
     * Assertions géométriques — des approximations calculables de « ça a
     * l'air faux », que ni le typecheck ni axe ne peuvent voir.
     */
    const layout = await page.evaluate(() => {
      const problems = [];
      const visible = (el) => {
        const cs = getComputedStyle(el);
        return cs.display !== "none" && cs.visibility !== "hidden" && cs.opacity !== "0";
      };

      // 1. Texte recouvert. Pour chaque élément qui porte du texte propre, on
      //    demande au navigateur ce qui se trouve à son centre. Si ce n'est ni
      //    lui, ni un de ses descendants, ni un de ses ancêtres, quelque chose
      //    est passé par-dessus. `elementFromPoint` ignore les calques en
      //    `pointer-events: none`, donc les décors n'y déclenchent rien.
      for (const el of document.body.querySelectorAll("*")) {
        const own = [...el.childNodes]
          .filter((n) => n.nodeType === 3)
          .map((n) => n.textContent.trim())
          .join("");
        if (own.length < 2 || !visible(el)) continue;

        const r = el.getBoundingClientRect();
        if (r.width < 4 || r.height < 4) continue;
        const x = r.left + r.width / 2;
        const y = r.top + r.height / 2;
        if (x < 0 || y < 0 || x > innerWidth || y > innerHeight) continue;

        const top = document.elementFromPoint(x, y);
        if (!top) continue;
        if (top === el || el.contains(top) || top.contains(el)) continue;
        problems.push(`texte recouvert : « ${own.slice(0, 32)} » masqué par <${top.tagName.toLowerCase()} class="${(top.className || "").toString().slice(0, 48)}">`);
      }

      // Le texte PROPRE d'un élément, hors descendants : un conteneur dont
      // les enfants sont positionnés en absolu a légitimement une hauteur
      // nulle, et le compter produirait un bruit qui noie tout le reste.
      const ownText = (el) =>
        [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join("");

      // 2. Élément visible de taille nulle alors qu'il porte du texte.
      for (const el of document.body.querySelectorAll("*")) {
        if (ownText(el).length < 2 || !visible(el)) continue;
        const r = el.getBoundingClientRect();
        if ((r.width === 0) !== (r.height === 0)) {
          problems.push(`taille nulle sur un axe : <${el.tagName.toLowerCase()}> ${r.width}×${r.height}`);
        }
      }

      // 3. Contenu tronqué sans que ce soit voulu : un conteneur qui coupe
      //    son texte sans ellipse ni défilement possible.
      for (const el of document.body.querySelectorAll("*")) {
        const cs = getComputedStyle(el);
        if (cs.overflow !== "hidden" || cs.textOverflow === "ellipsis") continue;
        if (ownText(el).length < 2 || !visible(el)) continue;
        if (el.scrollWidth > el.clientWidth + 2 && el.clientWidth > 0) {
          problems.push(`texte coupé sans ellipse : <${el.tagName.toLowerCase()}> ${el.scrollWidth}px dans ${el.clientWidth}px`);
        }
      }

      return [...new Set(problems)].slice(0, 6);
    });

    await page.addScriptTag({ content: axeSource });
    const axe = await page.evaluate(async () => {
      const r = await window.axe.run(document.body, {
        resultTypes: ["violations"],
        rules: { region: { enabled: false } }, // pas de repère de page dans un canvas isolé
      });
      return r.violations.map((v) => ({
        id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.length,
      }));
    });

    const noise = logs.filter((l) => !IGNORE.some((re) => re.test(l)));
    if (noise.length || axe.length || overflow > 2 || layout.length) {
      findings.push({ story: `${story.title} · ${story.name}`, logs: noise, axe, overflow, layout });
    }
  } catch (error) {
    findings.push({ story: `${story.title} · ${story.name}`, fatal: error.message.split("\n")[0] });
  }

  page.off("console", onConsole);
  page.off("pageerror", onError);
  checked += 1;
  if (checked % 25 === 0) process.stdout.write(`  ${checked}/${stories.length}\n`);
}

await browser.close();
server.close();

console.log(`\n${stories.length} stories · thème ${theme} · marque ${brand}\n`);

if (!findings.length) {
  console.log("Aucun problème relevé.");
} else {
  for (const f of findings) {
    console.log(`\n▸ ${f.story}`);
    if (f.fatal) console.log(`    FATAL  ${f.fatal}`);
    if (f.overflow > 2) console.log(`    DÉBORDEMENT  ${f.overflow}px horizontalement`);
    for (const l of f.logs ?? []) console.log(`    CONSOLE  ${l.slice(0, 160)}`);
    for (const v of f.axe ?? []) console.log(`    A11Y     [${v.impact}] ${v.id} — ${v.help} (${v.nodes})`);
    for (const l of f.layout ?? []) console.log(`    MISE EN PAGE  ${l}`);
  }
  console.log(`\n${findings.length} stories avec au moins un signalement.`);
}

/**
 * Planches-contact du système.
 *
 * Regarder 171 captures une par une n'est pas praticable. Les assembler en
 * grilles rend l'inspection visuelle possible : on balaie tout le design
 * system en quelques images.
 *
 * Assemblage sans dépendance : une page HTML qui pointe sur les captures,
 * chargée puis photographiée à son tour.
 *
 *   node ./scripts/contact.mjs            → les galeries, thème clair
 *   node ./scripts/contact.mjs --dark
 *   node ./scripts/contact.mjs --name=Fantaisie
 */
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const DIST = fileURLToPath(new URL("../dist", import.meta.url));
const OUT = "/tmp/kirari-contact";
const args = process.argv.slice(2);
const theme = args.includes("--dark") ? "dark" : "light";
const brand = (args.find((a) => a.startsWith("--brand=")) ?? "--brand=sakura").split("=")[1];
const wanted = (args.find((a) => a.startsWith("--name=")) ?? "--name=Galerie").split("=")[1];
const COLS = 3, ROWS = 3, CELL_W = 620, CELL_H = 460;

const MIME = { ".html":"text/html", ".js":"text/javascript", ".css":"text/css", ".json":"application/json", ".svg":"image/svg+xml", ".woff2":"font/woff2", ".png":"image/png" };
const server = createServer((req,res)=>{const p=normalize(decodeURIComponent(req.url.split("?")[0]));const f=join(DIST,p==="/"?"index.html":p);res.setHeader("Content-Type",MIME[extname(f)]??"application/octet-stream");createReadStream(f).on("error",()=>res.writeHead(404).end()).pipe(res);});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const base = `http://127.0.0.1:${server.address().port}`;

await mkdir(OUT, { recursive: true });
const index = JSON.parse(await readFile(join(DIST, "index.json"), "utf8"));
const stories = Object.values(index.entries).filter((e) => e.type === "story" && e.name === wanted);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: CELL_W, height: CELL_H } });

const shots = [];
for (const s of stories) {
  await page.goto(`${base}/iframe.html?id=${encodeURIComponent(s.id)}&viewMode=story&globals=theme:${theme};brand:${brand}`, { waitUntil: "networkidle", timeout: 20000 });
  await page.waitForTimeout(500);
  // En base64 et non par chemin : une page créée via `setContent` n'a pas
  // d'origine, donc pas le droit de charger des `file://`.
  const buf = await page.screenshot();
  shots.push({
    data: `data:image/png;base64,${buf.toString("base64")}`,
    title: s.title.replace("Composants/", "").replace("Fondations/", ""),
  });
}

// Assemblage : une page HTML par planche, photographiée à son tour.
const per = COLS * ROWS;
const sheets = Math.ceil(shots.length / per);
for (let i = 0; i < sheets; i += 1) {
  const group = shots.slice(i * per, (i + 1) * per);
  const html = `<!doctype html><meta charset="utf-8"><style>
    body{margin:0;background:#1c1c1c;font:13px ui-sans-serif,system-ui;display:grid;
         grid-template-columns:repeat(${COLS},${CELL_W}px);gap:14px;padding:14px}
    figure{margin:0;background:#000;border-radius:6px;overflow:hidden}
    figcaption{color:#fff;padding:5px 9px;font-weight:600;letter-spacing:.02em}
    img{display:block;width:${CELL_W}px;height:${CELL_H}px;object-fit:cover;object-position:top left}
  </style>${group.map((s) => `<figure><figcaption>${s.title}</figcaption><img src="${s.data}"></figure>`).join("")}`;
  const page2 = await browser.newPage({ viewport: { width: COLS * (CELL_W + 14) + 14, height: 100 } });
  await page2.setContent(html);
  await page2.waitForTimeout(400);
  const out = `${OUT}/planche-${theme}-${i + 1}.png`;
  await page2.screenshot({ path: out, fullPage: true });
  await page2.close();
  console.log(out);
}

await browser.close();
server.close();

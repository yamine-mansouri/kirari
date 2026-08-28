/**
 * Vérifie les contrastes des tokens sémantiques, dans les deux thèmes.
 *
 * Un design system qui échoue au contraste échoue partout à la fois : le
 * défaut n'est pas dans un composant, il est dans le token. Ce contrôle
 * s'exécute sur les valeurs, sans navigateur, donc il peut tourner en CI.
 *
 * Seuils WCAG 2.2 AA : 4.5:1 pour du texte normal, 3:1 pour du texte large
 * (≥ 24px, ou ≥ 18.66px gras) et pour les éléments d'interface.
 */
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const SRC = fileURLToPath(new URL("../src", import.meta.url));

/** Résout une chaîne de `var()` jusqu'à une couleur littérale. */
function resolve(name, vars, seen = new Set()) {
  if (seen.has(name)) return null;
  seen.add(name);
  const raw = vars[name];
  if (!raw) return null;
  const ref = raw.match(/^var\((--[\w-]+)/);
  return ref ? resolve(ref[1], vars, seen) : raw.trim();
}

function parse(hex) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? [...h].map((c) => c + c).join("") : h;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
}

function luminance(hex) {
  return parse(hex)
    .map((v) => v / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
    .reduce((acc, v, i) => acc + v * [0.2126, 0.7152, 0.0722][i], 0);
}

function ratio(a, b) {
  const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}

/** Extrait les custom properties d'un bloc de sélecteur donné. */
function block(css, selector) {
  const i = css.indexOf(selector);
  if (i < 0) return {};
  const start = css.indexOf("{", i);
  let depth = 0, end = start;
  for (let j = start; j < css.length; j += 1) {
    if (css[j] === "{") depth += 1;
    if (css[j] === "}") { depth -= 1; if (!depth) { end = j; break; } }
  }
  return Object.fromEntries(
    [...css.slice(start, end).matchAll(/(--[\w-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]),
  );
}

const palette = await readFile(`${SRC}/tokens/palette.css`, "utf8");
const color = await readFile(`${SRC}/tokens/color.css`, "utf8");

// Le thème fournit l'échelle de marque. Sans lui, `--k-accent` ne se résout
// pas — et c'est justement la paire la plus importante du système : le texte
// d'un bouton plein. L'angle mort a laissé passer un échec réel.
const themeName = process.argv.find((a) => a.startsWith("--theme="))?.split("=")[1] ?? "sakura";
const brand = await readFile(`${SRC}/themes/${themeName}.css`, "utf8");

const themes = {};
for (const [label, theme] of [["thèmes", null]]) void label, theme;

for (const [name, css, sel] of [
  ["clair", color, ":root {"],
  ["sombre", color, ':root[data-theme="dark"]'],
]) {
  themes[name] = { ...block(palette, ":root {"), ...block(brand, ":root {"), ...block(color, ":root {") };
  if (sel !== ":root {") Object.assign(themes[name], block(css, sel));
}

/** Paires réellement rendues dans les composants. */
const PAIRS = [
  ["--k-text", "--k-bg", 4.5, "texte sur le fond"],
  ["--k-text", "--k-surface", 4.5, "texte sur une surface"],
  ["--k-text", "--k-surface-sunken", 4.5, "texte sur surface enfoncée"],
  ["--k-text-muted", "--k-surface", 4.5, "texte atténué sur surface"],
  ["--k-text-muted", "--k-bg", 4.5, "texte atténué sur le fond"],
  ["--k-text-subtle", "--k-surface", 4.5, "texte discret sur surface"],
  ["--k-text-subtle", "--k-bg", 4.5, "texte discret sur le fond"],
  ["--k-text-on-accent", "--k-accent", 4.5, "texte sur l'accent"],
  ["--k-accent-text", "--k-accent-subtle", 4.5, "texte d'accent sur accent discret"],
  ["--k-accent-text", "--k-surface", 4.5, "texte d'accent sur surface"],
  ["--k-success-text", "--k-success-subtle", 4.5, "texte succès sur son fond"],
  ["--k-warning-text", "--k-warning-subtle", 4.5, "texte avertissement sur son fond"],
  ["--k-danger-text", "--k-danger-subtle", 4.5, "texte danger sur son fond"],
  ["--k-success", "--k-surface", 3, "succès (aplat, icône)"],
  ["--k-danger", "--k-surface", 3, "danger (aplat, icône)"],
  ["--k-accent", "--k-surface", 3, "accent (élément d'interface)"],
  ["--k-border-strong", "--k-surface", 3, "bordure marquée"],
];

let failures = 0;
for (const [theme, vars] of Object.entries(themes)) {
  console.log(`\n── thème ${theme} · marque ${themeName} ──`);
  for (const [fg, bg, min, label] of PAIRS) {
    const a = resolve(fg, vars), b = resolve(bg, vars);
    if (!a || !b || !a.startsWith("#") || !b.startsWith("#")) {
      console.log(`  ?    ${label.padEnd(34)} non calculable (${a ?? fg} / ${b ?? bg})`);
      continue;
    }
    const r = ratio(a, b);
    const ok = r >= min;
    if (!ok) failures += 1;
    console.log(
      `  ${ok ? "OK " : "ÉCHEC"} ${label.padEnd(34)} ${r.toFixed(2)}:1 (min ${min}) ${a} / ${b}`,
    );
  }
}

console.log(`\n${failures} paire(s) sous le seuil.`);
process.exit(failures ? 1 : 0);

/**
 * Build de @kirari-ds/core.
 *
 * Résout les `@import` en un fichier plat par point d'entrée : un consommateur
 * peut ainsi charger `kirari.css` via un simple <link> dans une page statique,
 * sans bundler. La version minifiée n'est produite que pour l'entrée complète.
 */
import { mkdir, readFile, writeFile, rm } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import postcss from "postcss";
import atImport from "postcss-import";
import cssnano from "cssnano";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = join(root, "src");
const outDir = join(root, "dist");

const ENTRIES = [
  { in: "index.css", out: "kirari.css", minify: true },
  { in: "tokens.css", out: "tokens.css" },
  { in: "motion.css", out: "motion.css" },

  // Thèmes. `template.css` sort à la racine sous un nom explicite : c'est le
  // fichier que l'on copie dans un projet, il mérite d'être trouvable.
  { in: "themes/template.css", out: "theme-template.css", raw: true },
  { in: "themes/sakura.css", out: "themes/sakura.css", raw: true },
  { in: "themes/ai.css", out: "themes/ai.css", raw: true },
  { in: "themes/matcha.css", out: "themes/matcha.css", raw: true },
];

const BANNER = `/*!
 * Kirari — Design System personnel de Yamine Mansouri
 * https://github.com/yamine-mansouri/kirari
 *
 * Licence MIT.
 */
`;

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

for (const entry of ENTRIES) {
  const from = join(srcDir, entry.in);
  const css = await readFile(from, "utf8");
  await mkdir(dirname(join(outDir, entry.out)), { recursive: true });

  // Les thèmes sont copiés tels quels : leurs commentaires sont la
  // documentation, et le modèle serait illisible une fois traité.
  if (entry.raw) {
    await writeFile(join(outDir, entry.out), css, "utf8");
    console.log(`  dist/${entry.out}  ${(css.length / 1024).toFixed(1)} kB`);
    continue;
  }

  const result = await postcss([atImport()]).process(css, { from });
  await writeFile(join(outDir, entry.out), BANNER + result.css, "utf8");
  console.log(`  dist/${entry.out}  ${(result.css.length / 1024).toFixed(1)} kB`);

  if (entry.minify) {
    const min = await postcss([
      atImport(),
      cssnano({ preset: ["default", { discardComments: { removeAll: true } }] }),
    ]).process(css, { from });
    const name = entry.out.replace(/\.css$/, ".min.css");
    await writeFile(join(outDir, name), BANNER + min.css, "utf8");
    console.log(`  dist/${name}  ${(min.css.length / 1024).toFixed(1)} kB`);
  }
}

console.log("\n@kirari-ds/core — build terminé.");

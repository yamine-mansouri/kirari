/**
 * Le README et le guide d'usage sont livrés dans les deux paquets npm, donc
 * dupliqués sur le disque. Une copie périmée ment au consommateur sans que
 * rien n'échoue — c'est exactement ce qui a laissé passer la promesse d'un
 * `@source` déclaré par la bibliothèque, démentie à l'installation.
 *
 *   node scripts/sync-docs.mjs          recopie depuis la racine
 *   node scripts/sync-docs.mjs --check  échoue si une copie a dérivé (CI)
 */
import { readFileSync, writeFileSync } from "node:fs";

const COPIES = [
  ["README.md", ["packages/core/README.md", "packages/react/README.md"]],
  ["packages/core/AGENTS.md", ["packages/react/AGENTS.md"]],
];

const check = process.argv.includes("--check");
let derive = 0;

for (const [source, cibles] of COPIES) {
  const attendu = readFileSync(source, "utf8");
  for (const cible of cibles) {
    if (readFileSync(cible, "utf8") === attendu) continue;
    derive++;
    if (check) console.error(`✗ ${cible} a dérivé de ${source}`);
    else { writeFileSync(cible, attendu); console.log(`✎ ${cible} ← ${source}`); }
  }
}

if (check && derive) {
  console.error(`\n${derive} copie(s) désynchronisée(s). Lancer : pnpm sync:docs`);
  process.exit(1);
}
console.log(check ? "✓ documentation synchronisée" : `${derive} copie(s) mise(s) à jour`);

import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: true,
  // Pas de `treeshake: true` : cette étape repasse le bundle dans rollup, qui
  // supprime les directives de module — la bannière `"use client"` ci-dessous
  // disparaissait silencieusement. esbuild élague déjà le mort-code, et le
  // vrai tree-shaking se fait chez le consommateur, à qui `sideEffects: false`
  // suffit.
  external: ["react", "react-dom"],

  // Tous les composants Kirari sont interactifs, et Base UI porte lui-même
  // `"use client"`. Sans cette bannière, importer la bibliothèque depuis un
  // Server Component Next.js échoue — le bundle perdrait la directive au
  // passage par tsup.
  banner: { js: '"use client";' },
});

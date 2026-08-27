import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import type { StorybookConfig } from "@storybook/react-vite";

const resolve = (path: string) => fileURLToPath(new URL(path, import.meta.url));

const config: StorybookConfig = {
  // Les stories des composants sont colocalisées dans le package : sur une
  // bibliothèque, une story appartient au composant, pas à l'app qui l'affiche.
  // Seules les pages transversales (fondations) vivent ici.
  stories: [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(ts|tsx)",
    "../../../packages/react/src/**/*.stories.@(ts|tsx)",
  ],

  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],

  framework: { name: "@storybook/react-vite", options: {} },

  // Projet perso : pas de télémétrie sortante.
  core: { disableTelemetry: true },

  viteFinal: (viteConfig) => ({
    ...viteConfig,
    plugins: [...(viteConfig.plugins ?? []), tailwindcss()],
    resolve: {
      ...viteConfig.resolve,
      alias: {
        ...viteConfig.resolve?.alias,
        // Pointe sur les sources : éditer un composant se recharge à chaud,
        // sans rebuild du package.
        "@kirari-ds/react": resolve("../../../packages/react/src/index.ts"),
        "@kirari-ds/core": resolve("../../../packages/core/src/index.css"),
        // Permet de charger les fichiers de thème RÉELS avec `?inline`.
        "@kirari-themes": resolve("../../../packages/core/src/themes"),
      },
    },
  }),
};

export default config;

import { useEffect } from "react";
import type { Decorator, Preview } from "@storybook/react-vite";
import { ThemeProvider, useTheme, type ThemePreference } from "@kirari-ds/react";
import aiTheme from "@kirari-themes/ai.css?inline";
import matchaTheme from "@kirari-themes/matcha.css?inline";
import "../src/kirari.css";

/**
 * Les fichiers de thème RÉELS, chargés en texte brut. Rien n'est recopié :
 * si `themes/ai.css` change, la barre d'outils change avec lui.
 */
const BRANDS: Record<string, string | null> = {
  sakura: null, // déjà chargé par Kirari — aucune surcharge à injecter
  ai: aiTheme,
  matcha: matchaTheme,
};

const BRAND_STYLE_ID = "kirari-brand-override";

/** Pilote le ThemeProvider depuis la barre d'outils Storybook. */
function ThemeSync({ theme }: { theme: ThemePreference }) {
  const { setTheme } = useTheme();
  useEffect(() => setTheme(theme), [theme, setTheme]);
  return null;
}

const withTheme: Decorator = (Story, context) => {
  const theme = (context.globals["theme"] ?? "light") as ThemePreference;
  const brand = (context.globals["brand"] ?? "sakura") as string;

  // Injecté en fin de <head> : à spécificité égale, c'est l'ordre de
  // chargement qui tranche — exactement comme dans un vrai projet.
  useEffect(() => {
    const existing = document.getElementById(BRAND_STYLE_ID);
    const css = BRANDS[brand];

    if (!css) {
      existing?.remove();
      return;
    }
    const node = existing ?? document.createElement("style");
    node.id = BRAND_STYLE_ID;
    node.textContent = css;
    if (!existing) document.head.appendChild(node);
  }, [brand]);

  return (
    // `storageKey={null}` : en vitrine, c'est la barre d'outils qui fait
    // autorité. Persister le choix ferait diverger l'UI de l'état réel.
    <ThemeProvider storageKey={null}>
      <ThemeSync theme={theme} />
      <div className="bg-bg p-6 text-ink">
        <Story />
      </div>
    </ThemeProvider>
  );
};

const preview: Preview = {
  decorators: [withTheme],

  globalTypes: {
    theme: {
      description: "Thème clair / sombre",
      toolbar: {
        title: "Thème",
        icon: "circlehollow",
        items: [
          { value: "light", title: "Clair", icon: "sun" },
          { value: "dark", title: "Sombre", icon: "moon" },
          { value: "system", title: "Système", icon: "browser" },
        ],
        dynamicTitle: true,
      },
    },
    brand: {
      description: "Palette de marque — vérifie qu'un rebranding tient",
      toolbar: {
        title: "Marque",
        icon: "paintbrush",
        items: [
          { value: "sakura", title: "Sakura 桜" },
          { value: "ai", title: "Ai 藍" },
          { value: "matcha", title: "Matcha 抹茶" },
        ],
        dynamicTitle: true,
      },
    },
  },

  initialGlobals: { theme: "light", brand: "sakura" },

  parameters: {
    layout: "fullscreen",
    controls: { expanded: true, matchers: { color: /(background|color)$/i } },
    a11y: { test: "todo" },
    options: {
      // Fondations d'abord : c'est la porte d'entrée quand on vient designer.
      storySort: {
        order: [
          "Introduction",
          "Fondations",
          ["Couleurs", "Courbes", "Durées", "Animations", "Séquence", "Marque"],
          "Composants",
        ],
      },
    },
  },
};

export default preview;

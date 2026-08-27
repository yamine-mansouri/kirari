import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export interface ThemeContextValue {
  /** Ce que l'utilisateur a choisi, `system` inclus. */
  theme: ThemePreference;
  /** Ce qui est réellement affiché, une fois `system` résolu. */
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemePreference) => void;
  /** Bascule entre clair et sombre en partant du thème résolu. */
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const DEFAULT_STORAGE_KEY = "kirari-theme";

function isPreference(value: unknown): value is ThemePreference {
  return value === "light" || value === "dark" || value === "system";
}

function systemTheme(): ResolvedTheme {
  if (typeof window === "undefined" || !window.matchMedia) return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function readStored(key: string): ThemePreference | null {
  // Un navigateur en navigation privée ou avec les données de site bloquées
  // peut lever à la simple lecture : on retombe silencieusement sur le défaut.
  try {
    const value = window.localStorage.getItem(key);
    return isPreference(value) ? value : null;
  } catch {
    return null;
  }
}

export interface ThemeProviderProps {
  children: ReactNode;
  /** Thème appliqué avant toute préférence stockée. */
  defaultTheme?: ThemePreference;
  /** Clé localStorage. `null` désactive la persistance. */
  storageKey?: string | null;
}

/**
 * Pilote l'attribut `data-theme` sur `<html>`, que le CSS de Kirari lit.
 *
 * L'état initial est volontairement `defaultTheme` et non la valeur stockée :
 * lire localStorage au premier rendu ferait diverger le HTML serveur du HTML
 * client. La préférence réelle est appliquée dans un effet, et `themeScript`
 * (ci-dessous) évite le flash entre les deux.
 */
export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = DEFAULT_STORAGE_KEY,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemePreference>(defaultTheme);
  const [systemResolved, setSystemResolved] = useState<ResolvedTheme>("light");

  // Reprend la préférence stockée après hydratation.
  useEffect(() => {
    if (storageKey === null) return;
    const stored = readStored(storageKey);
    if (stored) setThemeState(stored);
  }, [storageKey]);

  // Suit la préférence OS tant que `system` est sélectionné.
  useEffect(() => {
    setSystemResolved(systemTheme());
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (event: MediaQueryListEvent) => {
      setSystemResolved(event.matches ? "dark" : "light");
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const resolvedTheme: ResolvedTheme = theme === "system" ? systemResolved : theme;

  // `system` retire l'attribut : le CSS repasse alors sur prefers-color-scheme.
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "system") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", theme);
  }, [theme]);

  // Les transitions de couleur ne s'activent qu'après le premier rendu, pour
  // qu'un changement de thème au chargement ne soit pas animé.
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      document.documentElement.classList.add("k-theme-ready");
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const setTheme = useCallback(
    (next: ThemePreference) => {
      setThemeState(next);
      if (storageKey === null) return;
      try {
        window.localStorage.setItem(storageKey, next);
      } catch {
        /* stockage indisponible : la préférence ne survivra pas au rechargement */
      }
    },
    [storageKey],
  );

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme, setTheme, toggleTheme }),
    [theme, resolvedTheme, setTheme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme doit être appelé à l'intérieur d'un <ThemeProvider>.");
  }
  return context;
}

/**
 * Script à injecter en tête de `<head>`, avant tout rendu, pour appliquer le
 * thème stocké sans flash de thème incorrect.
 *
 * Next.js (app router) :
 *   <script dangerouslySetInnerHTML={{ __html: themeScript() }} />
 */
export function themeScript(storageKey: string = DEFAULT_STORAGE_KEY): string {
  return `(function(){try{var t=localStorage.getItem(${JSON.stringify(storageKey)});if(t==="light"||t==="dark"){document.documentElement.setAttribute("data-theme",t);}}catch(e){}})();`;
}

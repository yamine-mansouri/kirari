import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void): () => void {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

function getSnapshot(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia(QUERY).matches;
}

/**
 * `true` si l'utilisateur a demandé une réduction des animations.
 *
 * Le CSS gère déjà le cas pour toutes les animations Kirari ; ce hook sert
 * aux décisions que le CSS ne peut pas prendre (ne pas monter un composant
 * purement décoratif, par exemple).
 *
 * Rend `false` côté serveur, ce qui évite toute divergence d'hydratation :
 * la préférence est appliquée au premier rendu client.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

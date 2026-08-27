import { useEffect, useLayoutEffect } from "react";

/**
 * `useLayoutEffect` côté client, `useEffect` côté serveur.
 *
 * React avertit à l'usage de `useLayoutEffect` pendant un rendu serveur.
 * On a pourtant besoin d'un effet *avant peinture* pour tout ce qui doit
 * éviter un scintillement — d'où cette bascule.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

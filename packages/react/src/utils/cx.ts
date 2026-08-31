import clsx, { type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";
import { TYPOGRAPHY_ROLES } from "../styles/roles";

/**
 * Les rôles typographiques de Kirari, déclarés comme des TAILLES.
 *
 * `tailwind-merge` ne peut pas deviner si `text-label-md` est une taille ou
 * une couleur : il ne connaît que l'échelle standard de Tailwind. Faute de
 * cette déclaration, il rangeait nos rôles avec les couleurs de texte et
 * écartait la couleur réelle — un `<Button variant="danger">` perdait son
 * `text-white` et retombait sur la couleur d'encre héritée, à 3.82:1 sur le
 * rouge au lieu des 4.5 requis.
 *
 * Le défaut était silencieux : aucune erreur, juste une couleur qui disparaît.
 */

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: [...TYPOGRAPHY_ROLES] }],
    },
  },
});

/**
 * Concatène des classes et résout les conflits Tailwind.
 *
 * Indispensable dans une bibliothèque : sans fusion, un consommateur qui
 * passe `className="bg-surface"` à un `<Button>` verrait sa classe coexister
 * avec `bg-accent` au lieu de la remplacer — le gagnant dépendrait alors de
 * l'ordre dans la feuille de style, pas de son intention.
 */
export function cx(...parts: ClassValue[]): string {
  return twMerge(clsx(parts));
}

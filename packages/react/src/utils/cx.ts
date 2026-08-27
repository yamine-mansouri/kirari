import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Concatène des classes et résout les conflits Tailwind.
 *
 * Indispensable dans une bibliothèque : sans `twMerge`, un consommateur qui
 * passe `className="bg-surface"` à un `<Button>` verrait sa classe coexister
 * avec `bg-accent` au lieu de la remplacer — le gagnant dépendrait alors de
 * l'ordre dans la feuille de style, pas de son intention.
 */
export function cx(...parts: ClassValue[]): string {
  return twMerge(clsx(parts));
}

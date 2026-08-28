import { createTV } from "tailwind-variants";
import { TYPOGRAPHY_ROLES } from "./roles";

/**
 * `tv` configuré pour connaître les rôles typographiques de Kirari.
 *
 * `tailwind-variants` embarque sa PROPRE fusion, distincte de celle de
 * `cx()`. Sans cette configuration, elle ne peut pas deviner que
 * `text-label-md` est une taille et non une couleur : elle le range avec les
 * couleurs de texte et écarte la vraie couleur.
 *
 * Le symptôme observé : un `<Button variant="danger">` perdait son
 * `text-white` et retombait sur la couleur d'encre héritée — 3.82:1 sur le
 * rouge, sous le seuil. Aucune erreur, juste une couleur qui disparaît.
 *
 * Tout composant du système doit importer `tv` d'ici, jamais de
 * `tailwind-variants` directement.
 */
export const tv = createTV({
  twMergeConfig: {
    extend: {
      classGroups: {
        "font-size": [{ text: [...TYPOGRAPHY_ROLES] }],
      },
    },
  },
});

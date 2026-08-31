/**
 * Les rôles typographiques du système, sous forme de liste.
 *
 * Partagée entre `cx()` et `tv` : les deux fusionnent des classes et doivent
 * toutes deux savoir que ces noms désignent des TAILLES, pas des couleurs.
 * Ajouter un rôle dans `theme/typography.css` sans l'ajouter ici le rendrait
 * silencieusement destructeur pour la couleur du texte.
 */
export const TYPOGRAPHY_ROLES = [
  "display-lg", "display-md", "display-sm",
  "title-lg", "title-md", "title-sm",
  "body-lg", "body-md", "body-sm", "body-xs",
  "label-lg", "label-md", "label-sm",
  "overline",
] as const;

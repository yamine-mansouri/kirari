# Journal des changements

Le format suit [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/), et le
versionnage [SemVer](https://semver.org/lang/fr/).

Tant que la version majeure est `0`, l'API peut changer sur une version
mineure. Les ruptures y sont signalées explicitement.

## 0.1.0 — 2026-08-31

Première version publiée.

### Ajouté

**33 composants React.** Ancrés (Popover, Tooltip, Menu, ContextMenu, Select,
Combobox), contrôles de formulaire (Field, Switch, Checkbox, Radio, Slider,
NumberField, OtpField, ToggleGroup), navigation et divulgation (Tabs,
Accordion, Collapsible, Drawer, Dialog, Separator, Breadcrumb, Pagination),
affichage et retour (Button, Card, Badge, Alert, Toast, Avatar, Progress,
Skeleton, EmptyState, Stat, Stepper, Table, Kbd, Sparkle).

Le comportement et l'accessibilité des composants complexes viennent de
[Base UI](https://base-ui.com) ; Kirari apporte le style et le mouvement.

**Une couche de mouvement.** Dix courbes d'accélération, une échelle de durées,
23 keyframes, un séquençage en CSS pur (`Stagger`), une révélation au
défilement (`Reveal`), et une couche expressive opt-in de huit animations.

Règle fondatrice du système : une entrée et une sortie n'ont jamais la même
courbe.

**Un theming à cinq axes.** Un fichier par projet change la marque, la police,
l'échelle typographique, la forme et la densité. Le mapping clair/sombre reste
le travail du système, donc un thème s'écrit une seule fois.

**Quatorze rôles typographiques** — display, title, body, label, overline —
regroupant taille, interlignage, graisse et interlettrage.

**Un guide pour les agents**, livré dans le paquet
(`node_modules/@kirari-ds/core/AGENTS.md`) : démarrage, référence d'API des 33
composants, recettes de composition, interdits et pièges connus.

### Accessibilité

Tous les tokens sémantiques satisfont WCAG 2.2 AA sur les trois marques
livrées, dans les deux thèmes. Vérifié automatiquement à chaque poussée, sans
navigateur pour les tokens et dans Chromium pour les 171 stories.

`prefers-reduced-motion` neutralise toutes les animations, à l'exception de
celles qui portent une information.

### Limitation connue

`OtpField` rend un champ de validation caché et non étiqueté, interne à Base
UI. Signalé par nos vérifications comme une exception nommée.

# Kirari キラリ

Bibliothèque de composants React **motion-first**, bâtie sur Tailwind v4.

Ma patte graphique et mes animations, réutilisables d'un projet à l'autre, avec
une palette qui change en un fichier.

**[Voir le Storybook →](https://yamine-mansouri.github.io/kirari/)** — 33 composants, leurs galeries d'états, les
fondations et une page « Fantaisie » par composant.

## Le parti pris

La plupart des bibliothèques traitent l'animation comme une finition. Ici c'est
le socle : les courbes et les durées sont des tokens de première classe, au
même titre que les couleurs, et les composants sont conçus autour d'elles.

Trois règles structurent tout le système.

**Une entrée et une sortie n'ont jamais la même courbe.** Une entrée démarre
instantanément et se dépose longuement (`ease-enter`). Une sortie retient puis
claque (`ease-exit`). C'est ce qui distingue un mouvement vivant d'un
`ease-in-out` générique.

**La chorégraphie se fait en CSS.** Les séquences reposent sur des
`animation-delay` échelonnés, calculés par `nth-child`. Aucun runtime
d'animation, aucun timer JS, aucun recalcul au rendu.

**Chaque animation embarque sa durée et sa courbe.** `animate-slide-up` suffit,
et respecte la règle ci-dessus sans qu'on ait à y penser.

## Installation

Tailwind v4 est **obligatoire** — c'est le prix de l'intégration.

```bash
npm i @kirari-ds/core @kirari-ds/react tailwindcss
```

```css
/* app.css */
@import "tailwindcss";
@import "@kirari-ds/core";
@import "./kirari-theme.css";   /* optionnel — la palette du projet */
```

L'ordre compte deux fois : Tailwind d'abord pour que les blocs `@theme` s'y
greffent, le thème du projet en dernier pour qu'il l'emporte sur Sakura.
Le scan des composants est déjà déclaré par Kirari, rien à configurer.

Tous les composants sont **clients** : le paquet porte `"use client"`, et Base
UI est embarqué comme dépendance — rien de plus à installer. En Next.js app
router, importer Kirari depuis un Server Component fonctionne, la frontière
client est franchie par le paquet lui-même.

```tsx
import { ThemeProvider, Button, Animate, Stagger } from "@kirari-ds/react";

<ThemeProvider>
  <Stagger step={0.09}>
    <Animate animation="slide-up"><Button>Un</Button></Animate>
    <Animate animation="slide-up"><Button variant="soft">Deux</Button></Animate>
  </Stagger>
</ThemeProvider>;
```

## Vocabulaire

### Couleurs

`bg-bg` · `bg-surface` · `bg-surface-raised` · `bg-surface-sunken` ·
`text-ink` · `text-ink-muted` · `text-ink-subtle` · `text-on-accent` ·
`border-line` · `border-line-strong` · `bg-accent` · `bg-accent-hover` ·
`bg-accent-active` · `bg-accent-subtle` · `text-accent-text` · `bg-accent-2` ·
`bg-success` · `bg-warning` · `bg-danger` (chacun avec sa variante `-subtle`)

Pas de suffixe numérique : c'est le signe qu'on est sur un token sémantique,
qui suivra le thème et le rebranding. Les couleurs par défaut de Tailwind
(`bg-blue-500`…) contournent le système — ne pas les utiliser.

### Courbes

Très typées, loin des `ease-in-out` symétriques : c'est ce qui fait qu'un
mouvement se remarque.

| Utilitaire | Bézier | Usage |
|---|---|---|
| `ease-enter` | `0.01, 0.24, 0, 1` | Entrées |
| `ease-exit` | `0.87, -0.01, 1, 1` | Sorties |
| `ease-hold` | `1, 0.01, 1, 0.99` | Tenue longue puis rattrapage |
| `ease-brake` | `0.01, 0, 1, 0.26` | Entrée sèche, freinage dur |
| `ease-snap` | `1, 0, 0, 1` | Claquement, le plus dramatique |
| `ease-smooth` | `0.16, 0.46, 0.18, 1.01` | Confort, in-out doux |
| `ease-swift` | `0.76, -0.01, 0.25, 1` | Micro-interactions |
| `ease-glide` | `0.64, 0.04, 0.13, 1` | Glissade longue |
| `ease-bounce` | `0.34, 1.63, 0.61, 0.3` | Rebond |
| `ease-spring` | `0.39, 2, 0.41, 0.39` | Ressort, moments forts |

### Durées

Tailwind v4 n'a pas de namespace `--duration-*` : les durées s'écrivent
`duration-(--k-dur-3)`.

`--k-dur-3` (0.4s) est la base. `1`/`2` pour les micro-interactions, `4`/`5`
pour les modales, `6` pour une séquence narrative. Les boucles d'ambiance
vivent dans `--k-dur-ambient-1|2|3` (2s, 4s, 7s).

### Animations

Entrées — `animate-fade-in` `animate-slide-up` `animate-slide-down`
`animate-slide-left` `animate-slide-right` `animate-scale-in` `animate-bloom`
`animate-popup` `animate-bound` `animate-fall` `animate-wipe-up`
`animate-wipe-right`

Sorties — `animate-fade-out` `animate-slide-up-out` `animate-slide-down-out`
`animate-scale-out` `animate-curtain-out`

Ambiance — `animate-spin-slow` `animate-sway` `animate-float`
`animate-pulse-soft` `animate-shimmer`

Amplitudes ajustables par custom property sur l'élément :
`--k-anim-distance`, `--k-anim-scale`, `--k-anim-angle`.

## Composants

**Ancrés** — `Popover` `Tooltip` `Menu` `ContextMenu` `Select` `Combobox`

**Formulaire** — `Field` `Switch` `Checkbox` `Radio` `Slider` `NumberField`
`OtpField` `ToggleGroup`

**Navigation** — `Tabs` `Accordion` `Collapsible` `Drawer` `Dialog`
`Separator` `Breadcrumb` `Pagination`

**Affichage** — `Button` `Card` `Badge` `Alert` `Toast` `Avatar` `Progress`
`Skeleton` `EmptyState` `Stat` `Stepper` `Table` `Kbd`

**Primitives de mouvement** — `Animate` (applique une animation),
`Stagger` (échelonne ses enfants), `Reveal` (déclenche à l'entrée dans le
viewport), `useReducedMotion`.

**Hooks et providers** — `ThemeProvider` / `useTheme` / `themeScript`,
`ToastProvider` / `useToast`. Plusieurs composants ont un compagnon :
`AvatarGroup`, `CheckboxGroup`, `RadioGroup`, `MenuItem` / `MenuSeparator` /
`MenuLabel` / `Submenu`, `TooltipProvider`.

Le comportement et l'accessibilité des composants complexes viennent de
[Base UI](https://base-ui.com) — positionnement anti-collision, piégeage du
focus, navigation clavier, typeahead. Kirari apporte le style et le mouvement,
branchés sur leurs attributs `data-open` / `data-closed`.

## Couche expressive

Huit animations opt-in — `animate-squish` `animate-jelly` `animate-pop-in`
`animate-tick` `animate-swing` `animate-shake` `animate-twinkle`
`animate-drift` — et un composant décoratif `<Sparkle>`. **Aucune n'est posée
par défaut** : c'est un vocabulaire à convoquer sur le seul élément d'un écran
qui mérite d'être remarqué.

Le motif canonique combine un pivot et une déformation :

```tsx
<Button className="origin-bottom active:animate-squish">Ajouter</Button>
```

Le pivot compte autant que la déformation. Un élément qui grandit depuis son
bord bas se lit comme une chose articulée, posée sur une surface ; depuis son
centre, il flotte.

Chaque composant a une page **Fantaisie** dans Storybook : plusieurs
traitements expressifs, avec le code de chacun, et un ralenti pour étudier la
mécanique.

## Palette : une par projet

Les composants ne consomment que des tokens **sémantiques**, jamais une
couleur brute — c'est cette discipline qui rend le rebranding possible.

**1.** Copier le modèle :

```bash
cp node_modules/@kirari-ds/core/dist/theme-template.css src/kirari-theme.css
```

**2.** Remplir le palier 1 — sept nuances de marque et deux couleurs de texte :

```css
:root {
  --k-brand-100: #e0eaf7;
  --k-brand-200: #bed3ee;
  --k-brand-300: #92b4e2;
  --k-brand-400: #6690d3;
  --k-brand-500: #4470c0;
  --k-brand-600: #3557a1;
  --k-brand-700: #2a4482;

  --k-on-accent-light: #ffffff;
  --k-on-accent-dark:  #172445;
}
```

**3.** L'importer après Kirari. C'est tout.

### Pourquoi une échelle et pas des tokens finaux

Un thème ne déclare que le *quoi*. Le *comment* — quelle nuance devient
l'accent, comment cela change en sombre — reste le travail de Kirari :

| | Clair | Sombre |
|---|---|---|
| `--k-accent` | `--k-brand-500` | `--k-brand-400` |
| `--k-accent-hover` | `--k-brand-600` | `--k-brand-300` |
| `--k-accent-active` | `--k-brand-700` | `--k-brand-200` |

Conséquence : **un thème s'écrit une seule fois**, pas deux.

### Les trois paliers

| Palier | Contenu | Fréquence |
|---|---|---|
| **1** | Échelle de marque, texte sur accent | Toujours — le seul obligatoire |
| **2** | Neutres, surfaces, bordures | Rarement |
| **3** | Couleurs d'état | Presque jamais |

### Le seul point de vigilance

`--k-text-on-accent` est le seul token que le CSS ne peut pas déduire :
`color-contrast()` n'est pas utilisable aujourd'hui. Sur une marque claire,
un texte blanc tombe sous le seuil WCAG AA. Le thème `matcha.css` documente
ce cas.

### Thèmes livrés

```ts
import "@kirari-ds/core/themes/ai.css";      // indigo
import "@kirari-ds/core/themes/matcha.css";  // vert thé
```

`sakura.css` (rose poudré) est le défaut, déjà inclus.

## Mode clair / sombre

Trois états : clair (défaut), sombre, et `system` qui suit l'OS.

```tsx
const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
```

En SSR (Next.js), injecter `themeScript()` dans le `<head>` pour éviter le
flash de thème incorrect.

## Accessibilité

`prefers-reduced-motion: reduce` neutralise toutes les animations. La classe
`.k-motion-safe` permet de conserver celles qui portent du sens.

## Guidelines pour les agents

Kirari embarque ses règles d'usage, livrées dans le package :

```
node_modules/@kirari-ds/core/AGENTS.md
```

C'est un manuel complet, pas une liste de règles : démarrage et premier écran,
**référence d'API des 33 composants** avec leurs props et leurs variantes,
quatre recettes de composition (formulaire validé, tableau trié et paginé,
panneau de réglages, retour utilisateur), le vocabulaire de couleurs et de
mouvement, et les pièges connus.

Les interdits y sont explicites : couleur en dur, couleur Tailwind par défaut,
**nom de classe construit dynamiquement**, librairie d'animation JS ajoutée à
côté, courbe identique en entrée et en sortie.

Le référencer depuis le `AGENTS.md` ou `CLAUDE.md` du projet :

```markdown
@node_modules/@kirari-ds/core/AGENTS.md
```

Pour un agent travaillant **sur** Kirari, les règles sont dans
l'[`AGENTS.md`](./AGENTS.md) à la racine.

## Développement

```bash
pnpm install
pnpm dev        # Storybook sur http://localhost:6006
pnpm build      # les deux packages
pnpm typecheck
```

```
packages/core      @kirari-ds/core   tokens, thèmes, keyframes, passerelle Tailwind
packages/react     @kirari-ds/react  composants React + stories colocalisées
apps/storybook     Storybook : fondations et vitrine
.github/workflows  publication du Storybook sur GitHub Pages à chaque push
```

Storybook est la **source de vérité** du système. Chaque composant y a sa
documentation, sa **galerie** (toutes les variantes et tous les états en une
vue) et son **playground**. Ceux dont le mouvement est signifiant ont en plus
une story *Mouvement* : une grille figée ne montre pas une animation.

Deux sélecteurs dans la barre d'outils changent le **thème** (clair / sombre /
système) et la **marque** (Sakura / Ai / Matcha, en chargeant les fichiers de
thème réels). Un rebranding qui tient doit rester lisible dans les six
combinaisons.

Les stories des composants sont **colocalisées** dans `packages/react` : sur
une bibliothèque, une story appartient au composant, pas à l'app qui l'affiche.
Storybook pointe sur les sources — éditer un composant se recharge à chaud.

## Licence

MIT — voir [LICENSE](./LICENSE).

# Kirari — règles d'usage

> Pour un agent qui écrit du code dans un projet **consommant** Kirari.
> Livré dans le package : `node_modules/@kirari-ds/core/AGENTS.md`.

Kirari est une bibliothèque de composants React motion-first, bâtie sur
Tailwind v4. Les tokens (couleurs, courbes, durées, rayons) sont exposés
comme vocabulaire d'utilitaires Tailwind. Il n'y a **aucun runtime
d'animation** : le mouvement est du CSS.

---

## Installation dans un projet

Tailwind v4 est une dépendance **obligatoire** — Kirari ne fonctionne pas sans.

```css
/* app.css */
@import "tailwindcss";
@import "@kirari-ds/core";
@import "./kirari-theme.css";   /* optionnel — la palette du projet */
```

L'ordre compte deux fois : Tailwind d'abord pour que les blocs `@theme` s'y
greffent, le thème du projet en dernier pour qu'il l'emporte sur Sakura.

`@kirari-ds/core` déclare déjà son `@source` vers la bibliothèque React :
aucune configuration de scan à ajouter.

Poser les deux providers une fois, à la racine :

```tsx
import { ThemeProvider, ToastProvider } from "@kirari-ds/react";

<ThemeProvider>
  <ToastProvider>{children}</ToastProvider>
</ThemeProvider>;
```

En SSR (Next.js app router), injecter `themeScript()` dans le `<head>` pour
éviter le flash de thème incorrect. Tous les composants sont clients — le
paquet porte `"use client"`.

## Premier écran

De quoi juger le style de la bibliothèque en une minute.

```tsx
import { Card, Field, Button, Badge, useToast } from "@kirari-ds/react";

function Exemple() {
  const toast = useToast();

  return (
    <Card
      title="Inviter quelqu'un"
      footer={
        <Button onClick={() => toast.add({ title: "Invitation envoyée", data: { tone: "success" } })}>
          Envoyer
        </Button>
      }
    >
      <Badge tone="neutral">3 places restantes</Badge>
      <Field label="Adresse e-mail" type="email" placeholder="vous@exemple.fr" />
    </Card>
  );
}
```

Trois choses à retenir de cet exemple : les composants exposent leurs zones par
**props** (`title`, `footer`) plutôt que par sous-composants ; les tonalités
passent par `tone` et les allures par `variant` ; et le toast se déclenche par
un hook, pas par un état local.

## Thème du projet

Copier `node_modules/@kirari-ds/core/dist/theme-template.css` dans le projet.
**Seul le palier 1 est à remplir** : sept nuances de marque
(`--k-brand-100` → `--k-brand-700`) et deux couleurs de texte sur accent.

Ne **pas** écrire de bloc `prefers-color-scheme: dark` pour la marque :
Kirari dérive déjà le sombre de l'échelle (accent = 500 en clair, 400 en
sombre). Un thème s'écrit une fois, pas deux.

`--k-text-on-accent` est le seul token que le CSS ne peut pas calculer :
`color-contrast()` n'est pas utilisable aujourd'hui. Sur une marque claire
(jaune, lime, vert clair), le blanc tombe sous le seuil WCAG AA — poser une
nuance foncée. Vérifier, ne pas supposer.

---

## Interdits

**Ne jamais écrire une couleur, une durée ou une courbe en dur.**
Chaque valeur visuelle a un utilitaire ou un token.

```tsx
/* NON */  <div className="bg-[#e05586] duration-300 ease-in-out" />
/* OUI */  <div className="bg-accent duration-(--k-dur-2) ease-smooth" />
```

**Ne jamais utiliser les couleurs par défaut de Tailwind.**
`bg-blue-500`, `text-gray-700`, `border-slate-200` contournent le thème et
ne suivront pas un rebranding ni le mode sombre. Utiliser exclusivement les
couleurs Kirari listées plus bas. Elles n'ont volontairement pas de suffixe
numérique — c'est le signe qu'on est sur un token sémantique.

**Ne jamais construire un nom de classe dynamiquement.**
Tailwind analyse le code source à la recherche de chaînes littérales : une
classe assemblée à l'exécution n'est jamais générée, et le style manque
silencieusement.

```tsx
/* NON */  <div className={`animate-${name} bg-${tone}`} />
/* OUI */  const CLASS = { up: "animate-slide-up", down: "animate-slide-down" };
           <div className={CLASS[name]} />
```

Pour une valeur réellement dynamique (un délai calculé), passer par le style
inline plutôt que par une classe.

**Ne jamais ajouter une bibliothèque d'animation JS.**
Pas de framer-motion, GSAP, react-spring. Si un mouvement manque, ajouter un
keyframe à Kirari plutôt qu'empiler un second système.

**Ne jamais utiliser la même courbe pour une entrée et une sortie.**
Règle fondatrice : `ease-enter` à l'aller, `ease-exit` au retour. Un
`ease-in-out` symétrique annule la signature du système.

**Ne jamais contourner `prefers-reduced-motion`.**
Kirari le gère globalement. La classe `.k-motion-safe` existe pour les rares
mouvements porteurs de sens — jamais décoratifs.

**Ne jamais modifier un fichier sous `node_modules/@kirari-ds/`.**
Toute adaptation passe par une surcharge de token dans le fichier de thème.

---

## Référence

Les props listées sont les propres à Kirari. Chaque composant accepte en plus
les attributs HTML natifs de son élément, et `className` — fusionné avec
`tailwind-merge`, donc une surcharge remplace réellement.

### Saisie

| Composant | Props |
|---|---|
| `<Field>` | `label` `hint` `error` `containerClassName` + attributs `<input>` |
| `<Select>` | `items` `value` `defaultValue` `onValueChange` `placeholder` `disabled` `id` `name` `popupClassName` |
| `<Combobox>` | `items` `value` `defaultValue` `onValueChange` `placeholder` `emptyMessage` `disabled` |
| `<Switch>` | `size`=`sm\|md\|lg` `checked` `defaultChecked` `onCheckedChange` `disabled` |
| `<Checkbox>` | `label` `description` `checked` `indeterminate` `disabled` — dans `<CheckboxGroup allValues value onValueChange>` |
| `<Radio>` | `label` `description` `value` — **toujours** dans `<RadioGroup>` |
| `<Slider>` | `label` `showValue` `min` `max` `step` `defaultValue` (tableau = plage) `format` (options `Intl.NumberFormat`) |
| `<NumberField>` | `label` `placeholder` `min` `max` `step` `format` |
| `<OtpField>` | `length` `grouped` `mask` `defaultValue` |
| `<ToggleGroup>` | `items` `multiple` `value` `defaultValue` `onValueChange` |

`items` de `Select` / `Combobox` : `{ value, label, disabled? }`.
`items` de `ToggleGroup` : `{ value, label, disabled?, ariaLabel? }`.

### Ancrés

| Composant | Props |
|---|---|
| `<Popover>` | `trigger` `title` `description` `side` `align` `sideOffset` `arrow` `open` `onOpenChange` |
| `<Tooltip>` | `content` `side` `align` `sideOffset` `arrow` `delay` `closeDelay` — enveloppe son déclencheur |
| `<Menu>` | `trigger` `side` `align` `sideOffset` `open` `onOpenChange` |
| `<MenuItem>` | `inset` `danger` `shortcut` `disabled` `onClick` |
| `<Submenu>` | `label` |
| `<ContextMenu>` | `items` — enveloppe la zone du clic droit |

`<MenuSeparator>` et `<MenuLabel>` complètent le menu.
`<TooltipProvider delay>` partage le délai de grâce d'un groupe.

### Navigation et divulgation

| Composant | Props |
|---|---|
| `<Tabs>` | `items` `value` `defaultValue` `onValueChange` `orientation` |
| `<Accordion>` | `items` `multiple` `value` `defaultValue` `onValueChange` |
| `<Collapsible>` | `trigger` `open` `defaultOpen` `onOpenChange` |
| `<Dialog>` | `open` `onClose` `title` `footer` `closeOnBackdrop` |
| `<Drawer>` | `open` `onOpenChange` `trigger` `title` `description` `footer` `side`=`left\|right\|top\|bottom` |
| `<Breadcrumb>` | `items` `maxItems` `separator` |
| `<Pagination>` | `page` `pageCount` `onChange` `siblings` `disabled` |
| `<Separator>` | `orientation` `label` |

`items` de `Tabs` : `{ value, label, content?, disabled? }`.
`items` d'`Accordion` : `{ value, title, content, disabled? }`.
`items` de `Breadcrumb` : `{ label, href?, onClick? }`.

### Affichage et retour

| Composant | Props |
|---|---|
| `<Button>` | `variant`=`solid\|soft\|outline\|ghost\|danger` `size`=`sm\|md\|lg` `block` `loading` `startIcon` `endIcon` |
| `<Card>` | `variant`=`raised\|flat\|sunken` `interactive` `title` `footer` |
| `<Badge>` | `tone`=`accent\|neutral\|success\|warning\|danger` `dot` `live` |
| `<Alert>` | `tone`=`info\|success\|warning\|danger` `title` `action` |
| `<Avatar>` | `src` `alt` `name` `fallback` `size`=`xs\|sm\|md\|lg\|xl` `shape`=`circle\|squircle` — groupés par `<AvatarGroup overlap>` |
| `<Progress>` | `value` (`null` = indéterminé) `label` `showValue` |
| `<Skeleton>` | `shape`=`block\|text\|circle` `width` `height` `lines` |
| `<EmptyState>` | `title` `description` `icon` `action` `compact` |
| `<Stat>` | `label` `value` `hint` `trend`=`up\|down\|flat` `delta` `countUp` `countDuration` `format` |
| `<Stepper>` | `steps` `current` `orientation` |
| `<Table>` | `columns` `rows` `rowKey` `sort` `onSortChange` `stickyHeader` `density` `empty` `onRowClick` |
| `<Kbd>` | `keys` (`"Cmd+K"`) |

`<ToastProvider limit timeout>` à la racine, puis `useToast().add({ title, description, timeout?, data: { tone } })`.

Une colonne de `<Table>` : `{ key, header, cell(row, index), align?, sortable?, width?, numeric? }`.
Une étape de `<Stepper>` : `{ label, description? }`.

### Choisir le bon composant

Ces confusions reviennent constamment. Les trancher correctement compte plus
que le style.

| Situation | Le bon choix |
|---|---|
| Effet immédiat au clic | `<Switch>` |
| Effet appliqué à l'envoi du formulaire | `<Checkbox>` |
| Choix unique, ≤ 10 options | `<Select>` |
| Choix unique, > 10 options | `<Combobox>` |
| Des **actions** dans un menu déroulant | `<Menu>` |
| Une **valeur** à choisir dans un déroulant | `<Select>` |
| État persistant, dans le flux | `<Alert>` |
| Confirmation transitoire, flottante | `<ToastProvider>` |
| Change ce qui est affiché en dessous | `<Tabs>` |
| Change un réglage | `<ToggleGroup>` |
| Panneau modal sur mobile | `<Drawer>` |
| Panneau modal sur bureau | `<Dialog>` |

Un `<Radio>` seul n'existe pas : toujours dans un `<RadioGroup>`, sans quoi il
ne peut plus être décoché.

### Surcharge

Tous acceptent `className`, fusionné avec `tailwind-merge` : une surcharge
remplace réellement l'utilitaire d'origine au lieu de dépendre de l'ordre
dans la feuille de style.

```tsx
<Button className="rounded-full px-8">…</Button>   // rounded-md remplacé
```

### Échapper à l'API composée

Les composants ancrés exposent leurs parties brutes — `PopoverParts`,
`MenuParts`, `SelectParts`, `ComboboxParts`, `TooltipParts`, `DrawerParts`… —
pour les cas que l'API par défaut ne couvre pas : groupes dans un Select,
items à cocher dans un Menu, contenu hors du padding par défaut.

Les recomposer avec `POPUP_SURFACE`, `POPUP_ITEM` et `POPUP_BOUNDS`, exportés
par `@kirari-ds/react`, pour rester cohérent avec le reste du système.

Pour un composant absent : le construire avec les utilitaires Kirari, et
`tailwind-variants` pour les variantes. Ne pas réinventer un jeu de couleurs
ou d'espacements en parallèle.

---

## Recettes

Quatre compositions courantes, écrites comme il faut les écrire.

### Un formulaire

La validation vit chez le parent : `error` est une prop, jamais un état
interne du champ.

```tsx
const [email, setEmail] = useState("");
const emailError = email.length > 0 && !email.includes("@")
  ? "Adresse e-mail invalide."
  : undefined;

<form className="flex flex-col gap-5" onSubmit={handleSubmit}>
  <Field
    label="Adresse e-mail"
    type="email"
    value={email}
    error={emailError}
    hint="Nous ne la partagerons jamais."
    onChange={(e) => setEmail(e.target.value)}
  />
  {/* Select n'a pas de prop `label` : le libellé est externe et relié par `id`. */}
  <label htmlFor="pays" className="flex flex-col gap-2 text-sm font-medium text-ink">
    Pays
    <Select id="pays" items={PAYS} placeholder="Choisir un pays…" />
  </label>
  <Checkbox label="J'accepte les conditions" />
  <Button type="submit" loading={pending}>Créer le compte</Button>
</form>
```

Ne pas mettre de `<Switch>` dans un formulaire qui se valide : il promet un
effet immédiat, qui n'aura pas lieu avant l'envoi.

### Un tableau trié et paginé

Les deux composants sont **entièrement contrôlés**, ce qui leur permet de se
composer et de fonctionner aussi bien côté serveur qu'en mémoire.

```tsx
const [sort, setSort] = useState({ key: "nom", direction: "asc" as const });
const [page, setPage] = useState(1);

const columns: Array<Column<Membre>> = [
  { key: "nom", header: "Membre", sortable: true, cell: (r) => r.nom },
  { key: "statut", header: "Statut", cell: (r) => <Badge tone="success">{r.statut}</Badge> },
  { key: "projets", header: "Projets", numeric: true, sortable: true, cell: (r) => r.projets },
];

<div className="flex flex-col gap-4">
  <Table
    columns={columns}
    rows={rows}
    rowKey={(r) => r.id}
    sort={sort}
    onSortChange={(key, direction) => setSort({ key, direction })}
    empty={<EmptyState compact title="Aucun membre" action={<Button size="sm">Inviter</Button>} />}
  />
  <div className="flex justify-end">
    <Pagination page={page} pageCount={pageCount} onChange={setPage} />
  </div>
</div>
```

`numeric` n'est pas cosmétique : il aligne à droite **et** active
`tabular-nums`, sans quoi les chiffres ne se comparent pas en colonne.

### Un panneau de réglages

```tsx
<Card className="p-0">
  {reglages.map((r, i) => (
    <label
      key={r.id}
      className="flex cursor-pointer items-start justify-between gap-6 p-4 not-last:border-b not-last:border-line"
    >
      <span>
        <span className="block text-sm font-medium text-ink">{r.titre}</span>
        <span className="block text-xs text-ink-muted">{r.description}</span>
      </span>
      <Switch checked={r.actif} onCheckedChange={(v) => set(r.id, v)} />
    </label>
  ))}
</Card>
```

Ici le `<Switch>` est légitime : chaque bascule s'applique immédiatement.

### Le retour utilisateur

```tsx
const toast = useToast();

// Une action vient d'aboutir — transitoire.
toast.add({ title: "Document publié", data: { tone: "success" } });

// Un état persiste et doit rester relisible — dans le flux.
<Alert tone="warning" title="Quota bientôt atteint" action={<Button size="sm">Augmenter</Button>}>
  Il vous reste 12 % d'espace.
</Alert>
```

La question à se poser : **l'utilisateur doit-il pouvoir relire ce message ?**
Si oui, ce n'est pas un Toast.

## Vocabulaire

### Couleurs

| Utilitaire | Usage |
|---|---|
| `bg-bg` | Fond du document |
| `bg-surface` / `bg-surface-raised` / `bg-surface-sunken` | Surfaces |
| `text-ink` / `text-ink-muted` / `text-ink-subtle` | Texte |
| `text-on-accent` | Texte posé sur l'accent |
| `border-line` / `border-line-strong` | Bordures |
| `bg-accent` / `bg-accent-hover` / `bg-accent-active` / `bg-accent-subtle` | Accent |
| `text-accent-text` | Texte d'accent sur fond clair |
| `bg-accent-2` / `bg-accent-2-subtle` | Accent secondaire |
| `bg-success` / `bg-warning` / `bg-danger` (+ `-subtle`) | États |

### Courbes

`ease-enter` · `ease-exit` · `ease-swift` · `ease-smooth` · `ease-bounce` ·
`ease-spring` · `ease-snap` · `ease-hold` · `ease-brake` · `ease-glide`

| Token | Quand |
|---|---|
| `ease-enter` | Toute entrée. **Défaut.** |
| `ease-exit` | Toute sortie. |
| `ease-swift` | Micro-interaction : survol, focus, bascule. |
| `ease-smooth` | Transition de confort, changement d'état. |
| `ease-bounce` | Apparition qui doit attirer l'œil. Avec parcimonie. |
| `ease-spring` | Moment fort uniquement. Une par écran au maximum. |
| `ease-snap` | Effet dramatique, transition de scène. |

### Survol : ce qu'on traverse ne s'anime pas

La règle la plus souvent ratée du système, et celle qui se ressent le plus.

**Un survol sur lequel on s'attarde peut être animé.** Un bouton, une carte,
un onglet : on l'approche délibérément, on s'y arrête. Une transition de
`--k-dur-1` y donne de la douceur.

**Un survol qu'on traverse doit être instantané.** Un item de liste, une ligne
de tableau, une option de menu : le pointeur passe de l'un à l'autre en bien
moins de 200 ms, et une flèche maintenue au clavier va plus vite encore. Toute
transition fait alors traîner le repère derrière l'intention — ce qui se lit
comme de la **latence**, jamais comme de la fluidité.

C'est le même principe que la poignée du `<Slider>`, qui ne transitionne pas :
un élément qui doit *suivre* un geste ne s'anime jamais.

```tsx
/* NON — le surlignage traîne derrière le curseur */
"transition-colors duration-(--k-dur-1) data-highlighted:bg-accent-subtle"

/* OUI — instantané */
"data-highlighted:bg-accent-subtle"
```

### Durées

Il n'existe pas de namespace `--duration-*` en Tailwind v4 : les durées
s'écrivent `duration-(--k-dur-3)`.

`--k-dur-3` (0.4s) est la base. `1`/`2` pour les micro-interactions, `4`/`5`
pour les modales et entrées de scène, `6` pour une séquence narrative.
Les boucles d'ambiance utilisent `--k-dur-ambient-1|2|3` (2s, 4s, 7s) et ne
sont **jamais** liées à une interaction.

### Animations

Chaque utilitaire embarque déjà sa durée et sa courbe.

Entrées — `animate-fade-in` `animate-slide-up` `animate-slide-down`
`animate-slide-left` `animate-slide-right` `animate-scale-in` `animate-bloom`
`animate-popup` `animate-bound` `animate-fall` `animate-wipe-up`
`animate-wipe-right`

Sorties — `animate-fade-out` `animate-slide-up-out` `animate-slide-down-out`
`animate-scale-out` `animate-curtain-out`

Accent — `animate-jump`

Ambiance — `animate-spin-slow` `animate-sway` `animate-float`
`animate-pulse-soft` `animate-shimmer` `animate-spinner`

Les amplitudes restent ajustables par custom property sur l'élément :
`--k-anim-distance` (translations), `--k-anim-scale` (échelles),
`--k-anim-angle` (rotations).

---

## Couche expressive

Huit animations et un composant décoratif, **jamais posés par défaut par un
composant**. C'est un vocabulaire à convoquer sciemment.

| Utilitaire | Ce que ça fait |
|---|---|
| `animate-squish` | Écrasement-étirement. Avec `origin-bottom`, c'est un atterrissage. |
| `animate-jelly` | Oscillation amortie sur les deux axes. Le plus « jouet ». |
| `animate-pop-in` | Surgissement depuis rien, avec dépassement. |
| `animate-tick` | Hochement bref. Le « oui » d'un objet. |
| `animate-swing` | Balancement pendulaire. Avec `origin-top`, l'objet est suspendu. |
| `animate-shake` | Tremblement. **Réservé au refus** — jamais décoratif. |
| `animate-twinkle` | Scintillement, pour les particules. |
| `animate-drift` | Dérive lente, pour un décor de fond. |

`<Sparkle>` enveloppe un élément d'éclats scintillants. Décoratif, `aria-hidden`,
et sa constellation est **fixe** — un tirage aléatoire casserait l'hydratation
en SSR.

### Les deux principes

**Le pivot.** Ces animations ne présument pas de leur origine : poser
`origin-bottom`, `origin-top`… La différence est plus grande qu'elle n'en a
l'air. Un élément qui grandit depuis son bord bas se lit comme une chose
articulée, posée sur une surface ; depuis son centre, il flotte.

**La rareté.** Un seul élément fantaisie par écran. Appliquée partout, la
fantaisie devient du bruit — et le composant sur lequel on voulait attirer
l'œil se noie dans les autres.

```tsx
/* Le motif canonique : pivot + déformation */
<Button className="origin-bottom active:animate-squish">Ajouter</Button>
```

Chaque composant a une page **Fantaisie** dans Storybook : quatre à sept
traitements expressifs, avec le code de chacun. C'est le catalogue d'idées à
consulter avant d'en inventer un.

---

## Mouvement en React

```tsx
<Animate animation="slide-up" delay={0.2}>…</Animate>
```

Séquencer une liste — décalage calculé en CSS par `nth-child`, aucun timer :

```tsx
<Stagger step={0.09}>
  {items.map((i) => <Animate key={i} animation="slide-up">{i}</Animate>)}
</Stagger>
```

Révéler au défilement (observer déconnecté après déclenchement) :

```tsx
<Reveal animation="slide-up">…</Reveal>
```

---

## Où trouver des idées

Chaque composant a une page **Fantaisie** dans le Storybook du design system :
plusieurs traitements expressifs du même composant, avec le code de chacun et
un ralenti pour étudier la mécanique. C'est le catalogue à consulter avant
d'inventer un effet — et tout y est composé avec les utilitaires du système,
donc reprenable tel quel.

## Accessibilité

- L'anneau de focus est global via `:focus-visible`. Ne pas poser
  `outline-none` sans remplacement visible.
- `<Field>` câble déjà `aria-describedby`, `aria-invalid` et `role="alert"`.
- `<Dialog>` s'appuie sur `<dialog>` natif : focus piégé, Échap et inertie de
  la page sont gérés par le navigateur. Ne pas les réimplémenter.
- Les couleurs d'état ne doivent jamais être le seul véhicule d'une
  information.

---

## Pièges connus

**Ordre d'import** — Tailwind, puis Kirari, puis le thème du projet.

**Classes dynamiques** — voir les interdits. C'est la source d'erreur numéro
un avec Tailwind.

**`--k-text-on-accent`** n'est pas calculable en CSS : à vérifier à l'œil sur
chaque nouvelle marque.

**`<Stagger>` plafonne à 24 enfants directs.** Au-delà, le décalage retombe à
zéro. Délibéré : une séquence plus longue devient illisible.

**`<Dialog>` utilise `starting:` et `transition-discrete`**
(Chrome 117+, Safari 17.4+, Firefox 129+). En dessous la modale fonctionne,
elle apparaît sans transition.

**`color-mix()` est requis** (Chrome 111+, Safari 16.2+, Firefox 113+).

---

## Points d'entrée CSS

| Import | Contenu |
|---|---|
| `@kirari-ds/core` | Tout : tokens, thème Sakura, passerelle Tailwind, motion |
| `@kirari-ds/core/tokens.css` | Variables seules, sans passerelle |
| `@kirari-ds/core/motion.css` | Mouvement seul, sans les couleurs |
| `@kirari-ds/core/theme-template.css` | Modèle de thème à copier |
| `@kirari-ds/core/themes/{sakura,ai,matcha}.css` | Thèmes prêts à l'emploi |

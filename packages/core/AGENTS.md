# Kirari — règles d'usage

> Pour un agent qui écrit du code dans un projet **consommant** Kirari.
> Livré dans le package : `node_modules/@kirari-ds/core/AGENTS.md`.

Kirari est une bibliothèque de composants React motion-first, bâtie sur
Tailwind v4. Les tokens (couleurs, courbes, durées, rayons) sont exposés
comme vocabulaire d'utilitaires Tailwind. Il n'y a **aucun runtime
d'animation** : le mouvement est du CSS.

---

## Installation dans un projet

Tailwind est une dépendance **obligatoire** — Kirari ne fonctionne pas sans.

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

## Composants

`<Button>` · `<Card>` · `<Field>` · `<Badge>` · `<Skeleton>` · `<Dialog>`

Tous acceptent `className`, fusionné avec `tailwind-merge` : une surcharge
remplace réellement l'utilitaire d'origine au lieu de dépendre de l'ordre
dans la feuille de style.

```tsx
<Button className="rounded-full px-8">…</Button>   // rounded-md remplacé
```

Pour un composant absent : le construire avec les utilitaires Kirari
ci-dessus, et `tailwind-variants` pour les variantes. Ne pas réinventer un
jeu de couleurs ou d'espacements en parallèle.

---

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

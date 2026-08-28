# Kirari — développer le Design System

> Ce document s'adresse à un agent qui travaille **sur** Kirari.
> Pour un agent qui **consomme** Kirari dans un projet, voir
> [`packages/core/AGENTS.md`](./packages/core/AGENTS.md) — c'est le fichier
> livré dans le package npm.

## Structure

```
packages/core      @kirari-ds/core   tokens, thèmes, keyframes, passerelle Tailwind
packages/react     @kirari-ds/react  composants React + stories colocalisées
apps/storybook     Storybook, pointe sur les SOURCES des packages
```

Tailwind v4 est une **peer dependency** des deux packages : c'est le projet
consommateur qui l'apporte.

```bash
pnpm install
pnpm dev         # Storybook sur http://localhost:6006
pnpm build       # construit les deux packages
pnpm typecheck
```

## Les trois invariants

Ils priment sur toute autre considération. Une modification qui en casse un
est à refuser, même si elle est demandée.

**1. Les composants ne consomment que des tokens sémantiques.**
Jamais `bg-blue-500` ni `var(--k-sumi-300)` dans un composant : uniquement
`bg-accent`, `text-ink`, `border-line`, `bg-danger`… C'est ce qui rend un
rebranding possible en un fichier.

Vérification :

```bash
# aucune primitive Kirari dans les composants
grep -rnE 'var\(--k-(sumi|matcha|kohaku|beni|brand)-' packages/react/src
# aucune couleur Tailwind par défaut
grep -rnE '(bg|text|border)-(slate|gray|zinc|red|blue|green|amber)-[0-9]' packages/react/src
```

**2. Une entrée et une sortie n'ont jamais la même courbe.**
Tout raccourci `--animate-*-out` de `theme/motion.css` porte `--k-ease-exit`.
Tout état de survol utilise deux courbes : `ease-exit` au repos, `ease-enter`
au survol. Le motif canonique est dans `components/Button.tsx`.

**3. Aucun nom de classe construit dynamiquement.**
Tailwind ne génère que ce qu'il lit littéralement dans les sources. Un
`` `animate-${x}` `` produit un style silencieusement absent. Les noms
variables passent par une table statique — voir `ANIMATION_CLASS` dans
`motion/tokens.ts`. Les valeurs réellement dynamiques (délai calculé) passent
en style inline.

Vérification :

```bash
grep -rnE 'className=\{`[^`]*\$\{' packages/react/src
# doit ne rien retourner
```

## Conventions

**Passerelle Tailwind** — `theme/colors.css` utilise `@theme inline`, et c'est
obligatoire : sans `inline`, l'utilitaire généré référencerait
`var(--color-accent)`, résolu à la racine où `--k-accent` n'a pas encore la
valeur du thème actif. Le bug serait silencieux — correct en clair, figé en
sombre. `theme/motion.css` est `inline` pour les courbes (qui pointent vers
des tokens) et `@theme` simple pour les raccourcis `--animate-*`, qui sont des
valeurs littérales composées.

**Couleurs** — une primitive va dans `tokens/palette.css` si elle est
indépendante de la marque, dans `themes/*.css` si elle en dépend. Le mapping
primitive → sémantique vit exclusivement dans `tokens/color.css`, écrit pour
les trois états : `:root`, `@media (prefers-color-scheme: dark) >
:root:not([data-theme=light])`, et `:root[data-theme="dark"]`. Les deux blocs
sombres ont un contenu identique. Aucune couleur ne doit avoir sa seule
définition dans un bloc sombre.

**Mouvement** — un nouveau keyframe va dans `motion/keyframes.css`, préfixé
`k-`, avec ses amplitudes en custom properties. Son raccourci `--animate-*`
va dans `theme/motion.css`, et son entrée dans `ANIMATION_CLASS`. Une entrée
doit avoir sa sortie symétrique.

**CSS hors Tailwind** — `motion/stagger.css`, `motion/reveal.css`,
`motion/reduced-motion.css` et `base/app.css` restent en CSS parce que
Tailwind ne sait pas les exprimer. Ils sont volontairement **hors `@layer`** :
les utilitaires Tailwind posent la propriété raccourcie `animation`, qui
remet `animation-delay` à zéro, et en CSS les déclarations hors layer priment
sur celles qui sont dans un layer. Ne pas les envelopper dans un `@layer`.

**Base UI** — le comportement et l'accessibilité des composants complexes
viennent de `@base-ui/react`. Ses conventions ne sont **pas** celles de Radix,
et s'en souvenir évite des styles silencieusement morts :

| | Base UI |
|---|---|
| États d'ouverture | `data-open` / `data-closed` (pas `data-state="open"`) |
| Transitions | `data-starting-style` / `data-ending-style` |
| Item survolé | `data-highlighted` |
| Origine d'un popup | `--transform-origin` |
| Hauteur mesurée | `--accordion-panel-height`, `--collapsible-panel-height` |
| Onglet actif | `--active-tab-left`, `--active-tab-width`… |
| Pile de toasts | `--toast-index`, `--toast-offset-y` |

`data-starting-style` n'est présent qu'une frame : y accrocher une **animation**
ne fonctionne pas, il faut une **transition**. C'est la règle générale sur tout
ce qui bouge en permanence — une pile de toasts, un tiroir qu'on peut refermer
en cours d'ouverture : une transition s'interrompt et repart de la position
courante, une animation se rejoue depuis le début.

Vérifier l'API dans le package plutôt que la supposer :
`packages/react/node_modules/@base-ui/react/<composant>/**/*.d.ts`.

**Composants** — variantes via `tailwind-variants` (slots pour les composants
à plusieurs parties). Le `className` du consommateur passe toujours par `cx()`
en dernier, pour que `tailwind-merge` résolve les conflits.

**TypeScript** — `strict`, `noUncheckedIndexedAccess`, `verbatimModuleSyntax`.
`ANIMATION_CLASS` doit rester exhaustif : son type `Record<KirariAnimation,
string>` fait échouer la compilation si une animation est ajoutée à l'union
sans sa classe.

**Accessibilité** — toute animation ajoutée est couverte par la règle globale
de `motion/reduced-motion.css`, qui écrase la durée plutôt que de supprimer
l'animation — sans quoi une entrée démarrée à `opacity: 0` resterait
invisible.

## Avant de livrer

```bash
pnpm typecheck && pnpm build
```

Puis vérifier dans Storybook, **dans les deux thèmes et sur au moins deux
marques** (Fondations → Marque → Échantillon) : une régression de contraste ne
se voit que sur un rebranding.

Tout nouveau composant arrive avec ses stories, colocalisées à côté de lui :
`Docs` (via `tags: ["autodocs"]`), `Galerie` (toutes les variantes et tous les
états en une vue) et `Playground` (une instance, tous les contrôles). Ajouter
une story `Mouvement` dès que le composant en porte un — une grille figée ne
montre pas une animation.

Tout nouveau composant reçoit aussi une story **Fantaisie** : quatre à sept
traitements expressifs, chacun avec le code qui le produit. C'est un catalogue
d'idées de webdesign, pas une démonstration — sans le code affiché, l'idée
n'est pas reprenable.

Les spécimens dont l'effet se joue à l'apparition prennent `replayable` et la
forme fonction (`{(run) => <X key={run} />}`) : remonter l'élément est ce qui
redéclenche une animation CSS. Ceux déclenchés au survol ou au clic n'en ont
pas besoin — l'interaction est le rejeu.

`<FantaisiePage>` fournit aussi un ralenti 1× / ¼× / ⅒×, qui redéfinit
simplement les tokens `--k-dur-*` sur son conteneur. Rien à câbler : tout ce
qui lit ces tokens ralentit avec lui.

Une story Fantaisie ne doit contenir **aucun CSS jetable** : chaque traitement
se compose avec les utilitaires du système et la couche expressive. Sinon on
montre une idée que le lecteur ne peut pas reprendre.

Vérifier aussi que les classes des composants sont bien **générées** — une
classe absente du CSS produit est le symptôme d'un nom construit
dynamiquement, pas d'une erreur de style.

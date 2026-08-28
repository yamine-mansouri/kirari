/**
 * Surface partagée par tous les composants ancrés — Popover, Tooltip, Menu,
 * Select, Combobox, ContextMenu.
 *
 * Deux détails portent tout le reste :
 *
 * `origin-(--transform-origin)` — Base UI calcule cette variable en fonction
 * du côté où le popup a réellement pu s'ouvrir. Sans elle, un menu qui bascule
 * au-dessus de son déclencheur faute de place s'ouvrirait quand même vers le
 * bas : le mouvement mentirait sur l'ancrage.
 *
 * `data-open` / `data-closed` — la convention Base UI, et non le `data-state`
 * de Radix. L'ouverture et la fermeture ont donc chacune leur animation, donc
 * chacune sa courbe, conformément à la règle du système.
 */
export const POPUP_SURFACE = [
  "rounded-lg border border-line bg-surface-raised text-ink shadow-lg",
  "origin-(--transform-origin)",
  "data-open:animate-popup-in",
  "data-closed:animate-popup-out",
].join(" ");

/** Contraint un popup à la place réellement disponible, calculée par Base UI. */
export const POPUP_BOUNDS = [
  "max-h-(--available-height) max-w-(--available-width) overflow-y-auto",
].join(" ");

/**
 * Item de liste ou de menu : surligné à la souris comme au clavier.
 *
 * **Aucune transition sur le surlignage, volontairement.** C'est une liste
 * qu'on *traverse* : le pointeur passe d'un item à l'autre en bien moins de
 * 200 ms, et une flèche maintenue au clavier va plus vite encore. La moindre
 * transition fait traîner le surlignage derrière l'intention — ce qui se lit
 * comme de la latence, pas comme de la fluidité.
 *
 * Même raisonnement que la poignée du Slider, qui ne transitionne pas non
 * plus : un mouvement qui doit *suivre* un geste ne s'anime jamais.
 */
export const POPUP_ITEM = [
  "relative flex cursor-default items-center gap-2 rounded-sm px-2.5 py-1.5 text-sm outline-none select-none",
  "data-highlighted:bg-accent-subtle data-highlighted:text-accent-text",
  "data-disabled:pointer-events-none data-disabled:opacity-50",
].join(" ");

/** Flèche pointant vers l'ancre. Se retourne selon le côté d'ouverture. */
export const POPUP_ARROW = [
  "data-[side=bottom]:top-[-5px] data-[side=top]:bottom-[-5px]",
  "data-[side=left]:right-[-5px] data-[side=right]:left-[-5px]",
  "size-2.5 rotate-45 border border-line bg-surface-raised",
  "data-[side=bottom]:border-r-0 data-[side=bottom]:border-b-0",
  "data-[side=top]:border-t-0 data-[side=top]:border-l-0",
].join(" ");

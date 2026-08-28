import { Menu as Base } from "@base-ui/react/menu";
import { ContextMenu as BaseContext } from "@base-ui/react/context-menu";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cx } from "../utils/cx";
import { POPUP_BOUNDS, POPUP_ITEM, POPUP_SURFACE } from "../styles/popup";

const POPUP = cx(POPUP_SURFACE, POPUP_BOUNDS, "min-w-44 p-1 outline-none");
// Idem : constant, donc calculé une fois et non à chaque rendu.
const SUBMENU_TRIGGER = cx(POPUP_ITEM, "data-popup-open:bg-accent-subtle");

export interface MenuProps {
  /** L'élément qui ouvre le menu. Rendu tel quel. */
  trigger: ReactNode;
  children: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

/**
 * Menu d'actions.
 *
 * Le comportement vient de Base UI : navigation par flèches, typeahead,
 * fermeture des sous-menus au bon moment, et le « triangle de sécurité » qui
 * permet de traverser un item en diagonale pour atteindre un sous-menu sans
 * le refermer au passage.
 *
 * Un menu contient des **actions**, pas de la sélection de valeur — pour cela,
 * `Select`. Et pas de formulaire : un menu se ferme au premier clic.
 */
export function Menu({
  trigger,
  children,
  side = "bottom",
  align = "start",
  sideOffset = 6,
  open,
  onOpenChange,
  className,
}: MenuProps) {
  return (
    <Base.Root open={open} onOpenChange={onOpenChange}>
      <Base.Trigger render={<span className="inline-flex" />}>{trigger}</Base.Trigger>
      <Base.Portal>
        <Base.Positioner side={side} align={align} sideOffset={sideOffset}>
          <Base.Popup className={cx(POPUP, className)}>{children}</Base.Popup>
        </Base.Positioner>
      </Base.Portal>
    </Base.Root>
  );
}

export interface MenuItemProps extends ComponentPropsWithoutRef<typeof Base.Item> {
  /** Décale l'item vers la droite, pour s'aligner sur ceux qui ont une icône. */
  inset?: boolean;
  /** Rend l'item en tonalité danger. Réservé aux actions destructrices. */
  danger?: boolean;
  /** Raccourci clavier affiché à droite. Purement indicatif. */
  shortcut?: string;
}

export function MenuItem({ inset, danger, shortcut, className, children, ...rest }: MenuItemProps) {
  return (
    <Base.Item
      {...rest}
      className={cx(
        POPUP_ITEM,
        inset && "pl-8",
        danger && "text-danger data-highlighted:bg-danger-subtle data-highlighted:text-danger",
        className,
      )}
    >
      <span className="flex-1">{children}</span>
      {shortcut !== undefined && (
        <kbd className="font-mono text-xs text-ink-subtle">{shortcut}</kbd>
      )}
    </Base.Item>
  );
}

export function MenuSeparator({ className, ...rest }: ComponentPropsWithoutRef<typeof Base.Separator>) {
  return <Base.Separator {...rest} className={cx("my-1 h-px bg-line", className)} />;
}

export function MenuLabel({ className, ...rest }: ComponentPropsWithoutRef<typeof Base.GroupLabel>) {
  return (
    <Base.GroupLabel
      {...rest}
      className={cx("px-2.5 py-1.5 text-xs font-medium text-ink-subtle", className)}
    />
  );
}

export interface SubmenuProps {
  label: ReactNode;
  children: ReactNode;
  className?: string;
}

/** Sous-menu. S'ouvre au survol comme au clavier. */
export function Submenu({ label, children, className }: SubmenuProps) {
  return (
    <Base.SubmenuRoot>
      <Base.SubmenuTrigger className={SUBMENU_TRIGGER}>
        <span className="flex-1">{label}</span>
        <svg viewBox="0 0 16 16" className="size-3.5 text-ink-subtle" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M6 3.5L10.5 8L6 12.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Base.SubmenuTrigger>
      <Base.Portal>
        <Base.Positioner align="start" sideOffset={2}>
          <Base.Popup className={cx(POPUP, className)}>{children}</Base.Popup>
        </Base.Positioner>
      </Base.Portal>
    </Base.SubmenuRoot>
  );
}

export interface ContextMenuProps {
  /** La zone sur laquelle le clic droit ouvre le menu. */
  children: ReactNode;
  items: ReactNode;
  className?: string;
}

/** Menu contextuel, ouvert au clic droit ou par appui long. */
export function ContextMenu({ children, items, className }: ContextMenuProps) {
  return (
    <BaseContext.Root>
      <BaseContext.Trigger className="block">{children}</BaseContext.Trigger>
      <BaseContext.Portal>
        <BaseContext.Positioner>
          <BaseContext.Popup className={cx(POPUP, className)}>{items}</BaseContext.Popup>
        </BaseContext.Positioner>
      </BaseContext.Portal>
    </BaseContext.Root>
  );
}

/** Les parties brutes, pour les items à cocher, les groupes radio et les liens. */
export const MenuParts = Base;
export const ContextMenuParts = BaseContext;

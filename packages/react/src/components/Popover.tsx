import { Popover as Base } from "@base-ui/react/popover";
import type { ReactNode, ReactElement } from "react";
import { cx } from "../utils/cx";
import { POPUP_ARROW, POPUP_BOUNDS, POPUP_SURFACE } from "../styles/popup";

export type PopoverSide = "top" | "right" | "bottom" | "left";
export type PopoverAlign = "start" | "center" | "end";

export interface PopoverProps {
  /**
   * L'élément qui ouvre le popover — un `<Button>`, un `<button>`.
   *
   * Doit être un élément unique : Base UI y fusionne directement ses attributs
   * ARIA. Une chaîne ou un fragment ne pourrait pas les recevoir.
   */
  trigger: ReactElement;
  children?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  side?: PopoverSide;
  align?: PopoverAlign;
  /** Distance entre l'ancre et le popup, en pixels. */
  sideOffset?: number;
  /** Affiche une flèche pointant vers l'ancre. */
  arrow?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  className?: string;
}

/**
 * Panneau ancré à un déclencheur.
 *
 * C'est la clé de voûte du système : Tooltip, Menu, Select et Combobox
 * reposent sur le même socle de positionnement anti-collision, et partagent sa
 * surface (`styles/popup.ts`).
 *
 * Le comportement — ancrage, portail, piégeage du focus, restitution au
 * déclencheur à la fermeture — vient de Base UI. Kirari n'apporte que la
 * surface et le mouvement.
 */
export function Popover({
  trigger,
  children,
  title,
  description,
  side = "bottom",
  align = "center",
  sideOffset = 8,
  arrow = false,
  open,
  onOpenChange,
  defaultOpen,
  className,
}: PopoverProps) {
  return (
    <Base.Root open={open} onOpenChange={onOpenChange} defaultOpen={defaultOpen}>
      <Base.Trigger render={trigger} />
      <Base.Portal>
        <Base.Positioner side={side} align={align} sideOffset={sideOffset}>
          <Base.Popup
            className={cx(POPUP_SURFACE, POPUP_BOUNDS, "w-72 p-4 outline-none", className)}
          >
            {arrow && (
              <Base.Arrow className={POPUP_ARROW} />
            )}
            {title !== undefined && (
              <Base.Title className="text-sm font-bold tracking-tight">{title}</Base.Title>
            )}
            {description !== undefined && (
              <Base.Description className="mt-1 text-sm text-ink-muted">
                {description}
              </Base.Description>
            )}
            {children !== undefined && (
              <div className={cx("text-sm", (title ?? description) !== undefined && "mt-3")}>
                {children}
              </div>
            )}
          </Base.Popup>
        </Base.Positioner>
      </Base.Portal>
    </Base.Root>
  );
}

/**
 * Les parties brutes, pour les cas que l'API composée ne couvre pas :
 * un popover contrôlé finement, un contenu qui doit vivre hors du padding
 * par défaut, un déclencheur multiple.
 */
export const PopoverParts = Base;

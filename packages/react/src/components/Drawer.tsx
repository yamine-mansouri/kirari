import { Drawer as Base } from "@base-ui/react/drawer";
import type { ReactNode, ReactElement } from "react";
import { cx } from "../utils/cx";

export type DrawerSide = "left" | "right" | "top" | "bottom";

/**
 * Un objet et non un template : Tailwind ne génère que les classes qu'il lit
 * littéralement dans les sources.
 *
 * `--drawer-swipe-movement-*` est la position du doigt pendant un glissement.
 * En l'appliquant au `transform`, le panneau suit la main au lieu de sauter à
 * la fin du geste — et `data-swiping:transition-none` évite que la transition
 * traîne derrière le doigt.
 */
const SIDE: Record<DrawerSide, { popup: string; swipe: "left" | "right" | "up" | "down" }> = {
  right: {
    popup: cx(
      "inset-y-0 right-0 h-full w-[min(24rem,calc(100vw-3rem))] border-l",
      "[transform:translateX(var(--drawer-swipe-movement-x,0px))]",
      "data-starting-style:[transform:translateX(100%)]",
      "data-ending-style:[transform:translateX(100%)]",
    ),
    swipe: "right",
  },
  left: {
    popup: cx(
      "inset-y-0 left-0 h-full w-[min(24rem,calc(100vw-3rem))] border-r",
      "[transform:translateX(var(--drawer-swipe-movement-x,0px))]",
      "data-starting-style:[transform:translateX(-100%)]",
      "data-ending-style:[transform:translateX(-100%)]",
    ),
    swipe: "left",
  },
  bottom: {
    popup: cx(
      "inset-x-0 bottom-0 max-h-[85vh] w-full rounded-t-xl border-t",
      "[transform:translateY(var(--drawer-swipe-movement-y,0px))]",
      "data-starting-style:[transform:translateY(100%)]",
      "data-ending-style:[transform:translateY(100%)]",
    ),
    swipe: "down",
  },
  top: {
    popup: cx(
      "inset-x-0 top-0 max-h-[85vh] w-full rounded-b-xl border-b",
      "[transform:translateY(var(--drawer-swipe-movement-y,0px))]",
      "data-starting-style:[transform:translateY(-100%)]",
      "data-ending-style:[transform:translateY(-100%)]",
    ),
    swipe: "up",
  },
};

export interface DrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Élément unique — Base UI y fusionne ses attributs ARIA. */
  trigger?: ReactElement;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  side?: DrawerSide;
  className?: string;
}

/**
 * Panneau glissant depuis un bord.
 *
 * **Drawer ou Dialog ?** Sur mobile, une modale centrée est presque toujours
 * un mauvais choix : elle est loin des pouces et le clavier virtuel la pousse
 * hors de l'écran. Un tiroir bas règle les deux.
 *
 * On utilise ici des **transitions** et non des animations : contrairement à
 * une animation, une transition s'interrompt et s'inverse proprement en cours
 * de route. Sur un panneau qu'on peut refermer d'un geste avant la fin de
 * l'ouverture, c'est la différence entre un mouvement fluide et un à-coup.
 */
export function Drawer({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  footer,
  side = "right",
  className,
}: DrawerProps) {
  const config = SIDE[side];

  return (
    <Base.Root open={open} onOpenChange={onOpenChange} swipeDirection={config.swipe}>
      {trigger !== undefined && <Base.Trigger render={trigger} />}
      <Base.Portal>
        <Base.Backdrop
          className={cx(
            "fixed inset-0 z-(--k-z-overlay) bg-overlay",
            "transition-opacity duration-(--k-dur-3) ease-enter",
            "data-starting-style:opacity-0 data-ending-style:opacity-0",
          )}
        />
        <Base.Popup
          className={cx(
            "fixed z-(--k-z-modal) flex flex-col border-line bg-surface text-ink shadow-xl outline-none",
            "transition-transform duration-(--k-dur-4) ease-enter",
            "data-ending-style:duration-(--k-dur-2) data-ending-style:ease-exit",
            // Pendant le glissement, le panneau suit le doigt sans latence.
            "data-swiping:transition-none",
            config.popup,
            className,
          )}
        >
          {/* Poignée de préhension — le signal visuel que le panneau se glisse. */}
          {(side === "bottom" || side === "top") && (
            <span
              aria-hidden="true"
              className={cx(
                "mx-auto h-1 w-10 shrink-0 rounded-full bg-line-strong",
                side === "bottom" ? "mt-3" : "mb-3 order-last",
              )}
            />
          )}

          {(title ?? description) !== undefined && (
            <div className="flex flex-col gap-1 px-6 pt-6 pb-3">
              {title !== undefined && (
                <Base.Title className="text-title-md">{title}</Base.Title>
              )}
              {description !== undefined && (
                <Base.Description className="text-body-sm text-ink-muted">
                  {description}
                </Base.Description>
              )}
            </div>
          )}

          {children !== undefined && (
            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-2 text-body-sm">{children}</div>
          )}

          {footer !== undefined && (
            <div className="flex justify-end gap-2 px-6 pt-3 pb-6">{footer}</div>
          )}
        </Base.Popup>
      </Base.Portal>
    </Base.Root>
  );
}

export const DrawerParts = Base;

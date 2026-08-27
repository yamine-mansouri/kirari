import { useCallback, useEffect, useRef } from "react";
import type { MouseEvent, ReactNode } from "react";
import { cx } from "../utils/cx";

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  /** Cliquer sur le fond ferme la boîte. */
  closeOnBackdrop?: boolean;
  className?: string;
}

/**
 * Boîte de dialogue bâtie sur l'élément `<dialog>` natif.
 *
 * On délègue au navigateur ce qu'il fait déjà bien — piégeage du focus,
 * restitution du focus à la fermeture, touche Échap, inertie du reste de la
 * page — et l'on n'ajoute que la mise en scène.
 *
 * `starting:` et `transition-discrete` (les utilitaires Tailwind pour
 * `@starting-style` et `transition-behavior: allow-discrete`) permettent
 * d'animer l'entrée ET la sortie d'un élément qui passe par `display: none`,
 * sans JS de transition. Le composant peut donc se démonter sans laisser
 * d'élément fantôme.
 */
export function Dialog({
  open,
  onClose,
  title,
  children,
  footer,
  closeOnBackdrop = true,
  className,
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    // `showModal()` lève si la boîte est déjà ouverte : on vérifie d'abord.
    if (open && !node.open) node.showModal();
    else if (!open && node.open) node.close();
  }, [open]);

  // Échap déclenche `cancel` puis `close` : on remonte l'intention au parent
  // pour que l'état contrôlé reste synchrone.
  const handleClose = useCallback(() => onClose(), [onClose]);

  const handleClick = useCallback(
    (event: MouseEvent<HTMLDialogElement>) => {
      if (!closeOnBackdrop) return;
      // Un clic sur le ::backdrop a pour cible le <dialog> lui-même.
      if (event.target === ref.current) onClose();
    },
    [closeOnBackdrop, onClose],
  );

  return (
    <dialog
      ref={ref}
      onClose={handleClose}
      onClick={handleClick}
      className={cx(
        "w-full max-w-[min(32rem,calc(100vw-2rem))] rounded-xl border border-line bg-surface p-0 text-ink shadow-xl",
        // État fermé — et point de départ de l'ouverture.
        "translate-y-3 scale-[0.97] opacity-0",
        "transition-[opacity,transform,overlay,display] duration-(--k-dur-2) ease-exit transition-discrete",
        // État ouvert.
        "open:translate-y-0 open:scale-100 open:opacity-100 open:duration-(--k-dur-4) open:ease-enter",
        "starting:open:translate-y-3 starting:open:scale-[0.97] starting:open:opacity-0",
        // Le fond.
        "backdrop:bg-overlay backdrop:opacity-0",
        "backdrop:transition-[opacity,overlay,display] backdrop:duration-(--k-dur-2) backdrop:ease-exit backdrop:transition-discrete",
        "open:backdrop:opacity-100 open:backdrop:ease-enter",
        "starting:open:backdrop:opacity-0",
        className,
      )}
    >
      {title !== undefined && (
        <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-3">
          <h2 className="text-xl font-bold tracking-tight">{title}</h2>
        </div>
      )}
      {children !== undefined && <div className="px-6 text-sm text-ink-muted">{children}</div>}
      {footer !== undefined && <div className="flex justify-end gap-2 p-6">{footer}</div>}
    </dialog>
  );
}

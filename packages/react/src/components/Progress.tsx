import { Progress as Base } from "@base-ui/react/progress";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cx } from "../utils/cx";

export interface ProgressProps
  extends Omit<ComponentPropsWithoutRef<typeof Base.Root>, "render" | "children"> {
  label?: ReactNode;
  /** Affiche le pourcentage à droite du label. */
  showValue?: boolean;
  className?: string;
}

/**
 * Barre de progression, déterminée ou indéterminée.
 *
 * Passer `value={null}` bascule en indéterminé : la barre balaie en boucle,
 * pour dire « ça travaille » sans mentir sur l'avancement.
 *
 * **Le seul composant où l'animation porte du sens.** Elle est donc marquée
 * `.k-motion-safe` : `prefers-reduced-motion` la conserve, contrairement à
 * tout le reste du système. Supprimer ce mouvement-là supprimerait
 * l'information.
 */
export function Progress({ label, showValue = false, className, ...rest }: ProgressProps) {
  // Une barre de progression sans nom est muette. Quand aucun libellé visible
  // n'est fourni, on retombe sur un nom générique plutôt que sur rien — le
  // consommateur reste libre de passer son propre `aria-label`.
  const fallbackLabel =
    label === undefined && rest["aria-label"] === undefined && rest["aria-labelledby"] === undefined
      ? "Progression"
      : undefined;

  return (
    <Base.Root
      {...rest}
      aria-label={rest["aria-label"] ?? fallbackLabel}
      className={cx("flex w-full flex-col gap-2", className)}
    >
      {(label !== undefined || showValue) && (
        <div className="flex items-baseline justify-between gap-4">
          {label !== undefined && (
            <Base.Label className="text-sm font-medium text-ink">{label}</Base.Label>
          )}
          {showValue && (
            <Base.Value className="font-mono text-xs text-ink-muted tabular-nums" />
          )}
        </div>
      )}

      <Base.Track className="h-1.5 w-full overflow-hidden rounded-full bg-surface-sunken">
        <Base.Indicator
          className={cx(
            "k-motion-safe h-full rounded-full bg-accent",
            "transition-[width] duration-(--k-dur-4) ease-glide",
            // En indéterminé, la piste est pleine et c'est un dégradé qui la
            // balaie — même mécanique que le Skeleton, donc le même token.
            "data-indeterminate:w-full data-indeterminate:animate-shimmer",
            // La couleur de fond doit disparaître, sinon le dégradé se
            // superpose à un aplat et la barre paraît pleine. Propriété
            // arbitraire et non `bg-transparent` : ce dernier appartiendrait
            // au même groupe que le dégradé, que tailwind-merge écarterait.
            "data-indeterminate:[background-color:transparent]",
            "data-indeterminate:bg-[linear-gradient(90deg,transparent,var(--k-accent),transparent)]",
            "data-indeterminate:bg-[length:45%_100%] data-indeterminate:bg-no-repeat",
          )}
        />
      </Base.Track>
    </Base.Root>
  );
}

export const ProgressParts = Base;

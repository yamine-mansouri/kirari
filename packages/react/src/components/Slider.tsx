import { Slider as Base } from "@base-ui/react/slider";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cx } from "../utils/cx";

export interface SliderProps
  extends Omit<ComponentPropsWithoutRef<typeof Base.Root>, "render" | "children"> {
  label?: ReactNode;
  /**
   * Affiche la valeur courante à droite du label. Le formatage se règle par la
   * prop `format` de Base UI, qui prend des options `Intl.NumberFormat` —
   * devise, pourcentage, unités.
   */
  showValue?: boolean;
  className?: string;
}

/**
 * Curseur de valeur, unique ou en plage.
 *
 * **La règle du drag :** aucune transition sur la poignée ni sur le
 * remplissage. Une transition, même de 100 ms, fait traîner le curseur
 * derrière le doigt — le composant paraît alors cassé plutôt que fluide. Seul
 * l'anneau de survol est animé, parce qu'il ne suit pas le geste.
 *
 * Passer un tableau à `defaultValue` crée automatiquement une plage à deux
 * poignées.
 */
export function Slider({ label, showValue = false, className, ...rest }: SliderProps) {
  return (
    <Base.Root {...rest} className={cx("flex w-full flex-col gap-2", className)}>
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

      <Base.Control className="flex h-5 w-full cursor-pointer items-center py-2 select-none">
        <Base.Track className="h-1.5 w-full rounded-full bg-surface-sunken select-none">
          <Base.Indicator className="h-full rounded-full bg-accent select-none" />
          <Base.Thumb
            className={cx(
              "size-4 rounded-full border-2 border-accent bg-surface shadow-sm outline-none select-none",
              // L'anneau réagit au survol et au focus ; la poignée, elle,
              // ne transitionne jamais — elle suit le doigt.
              "ring-0 ring-accent/25 transition-[box-shadow] duration-(--k-dur-1) ease-swift",
              "hover:ring-6 focus-visible:ring-6",
              "data-dragging:ring-8",
            )}
          />
        </Base.Track>
      </Base.Control>
    </Base.Root>
  );
}

export const SliderParts = Base;

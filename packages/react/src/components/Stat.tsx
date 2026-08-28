import { useEffect, useRef, useState } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../utils/cx";
import { useReducedMotion } from "../motion/useReducedMotion";

export type StatTrend = "up" | "down" | "flat";

const TREND_CLASS: Record<StatTrend, string> = {
  up: "text-success-text",
  down: "text-danger-text",
  flat: "text-ink-subtle",
};

const TREND_ICON: Record<StatTrend, ReactNode> = {
  up: <path d="M8 12.5v-9M4 7.5L8 3.5l4 4" strokeLinecap="round" strokeLinejoin="round" />,
  down: <path d="M8 3.5v9M4 8.5l4 4l4-4" strokeLinecap="round" strokeLinejoin="round" />,
  flat: <path d="M3.5 8h9" strokeLinecap="round" />,
};

/**
 * Compte de 0 à `target` à l'apparition.
 *
 * Retourne immédiatement la valeur finale si l'utilisateur a demandé une
 * réduction des animations — un compteur qui défile n'est pas de la
 * décoration qu'on peut simplement figer à mi-course.
 */
function useCountUp(target: number, duration: number, enabled: boolean): number {
  const reduced = useReducedMotion();
  const [value, setValue] = useState(enabled && !reduced ? 0 : target);
  const frame = useRef(0);

  useEffect(() => {
    if (!enabled || reduced) {
      setValue(target);
      return;
    }

    let start: number | null = null;

    const tick = (now: number) => {
      start ??= now;
      const progress = Math.min((now - start) / duration, 1);
      // Décélération franche : le chiffre se pose au lieu de s'arrêter net.
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) frame.current = requestAnimationFrame(tick);
    };

    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [target, duration, enabled, reduced]);

  return value;
}

export interface StatProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  label: ReactNode;
  value: number | string;
  /** Texte secondaire sous la valeur. */
  hint?: ReactNode;
  trend?: StatTrend;
  /** Variation affichée à côté de la tendance, par exemple « +12,4 % ». */
  delta?: ReactNode;
  /** Anime le chiffre de 0 à sa valeur. Sans effet si `value` est une chaîne. */
  countUp?: boolean;
  /** Durée du décompte, en millisecondes. */
  countDuration?: number;
  /** Formate la valeur animée. Par défaut, l'entier local. */
  format?: (value: number) => string;
}

/**
 * Chiffre clé.
 *
 * Le décompte à l'apparition n'est pas un gadget : il attire l'œil sur la
 * valeur au moment où elle entre dans le champ, ce qu'un chiffre statique ne
 * fait pas. À coupler avec `<Reveal>` pour le déclencher au défilement.
 *
 * `tabular-nums` est indispensable ici — sans lui, la largeur du chiffre
 * saute à chaque image et le compteur tremble.
 */
export function Stat({
  label,
  value,
  hint,
  trend,
  delta,
  countUp = false,
  countDuration = 900,
  format,
  className,
  ...rest
}: StatProps) {
  const numeric = typeof value === "number";
  const animated = useCountUp(numeric ? value : 0, countDuration, countUp && numeric);

  const display = numeric
    ? (format ?? ((n: number) => Math.round(n).toLocaleString("fr-FR")))(
        countUp ? animated : value,
      )
    : value;

  return (
    <div {...rest} className={cx("flex flex-col gap-1", className)}>
      <span className="text-xs font-medium tracking-wide text-ink-subtle uppercase">{label}</span>

      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold tracking-tight text-ink tabular-nums">{display}</span>
        {trend !== undefined && (
          <span className={cx("flex items-center gap-0.5 text-sm font-medium", TREND_CLASS[trend])}>
            <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              {TREND_ICON[trend]}
            </svg>
            {delta}
          </span>
        )}
      </div>

      {hint !== undefined && <span className="text-xs text-ink-muted">{hint}</span>}
    </div>
  );
}

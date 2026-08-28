import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../utils/cx";

export interface Step {
  label: ReactNode;
  description?: ReactNode;
}

export interface StepperProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  steps: Step[];
  /** Index de l'étape en cours, à partir de 0. */
  current: number;
  orientation?: "horizontal" | "vertical";
  /** Nom de la navigation. À personnaliser si la page en contient plusieurs. */
  "aria-label"?: string;
}

/**
 * Progression en étapes.
 *
 * Le trait entre deux étapes se remplit à mesure qu'on avance : c'est le
 * mouvement qui porte l'information, pas la pastille. Il utilise la même
 * transition que le reste du système — `ease-glide`, la seule courbe pensée
 * pour un déplacement long et régulier.
 *
 * L'étape courante porte `aria-current="step"`, et la progression est annoncée
 * en toutes lettres pour les lecteurs d'écran : une pastille colorée ne dit
 * rien à qui ne la voit pas.
 */
export function Stepper({
  steps,
  current,
  orientation = "horizontal",
  "aria-label": ariaLabel,
  className,
  ...rest
}: StepperProps) {
  const vertical = orientation === "vertical";

  return (
    <nav
      {...rest}
      aria-label={ariaLabel ?? `Étape ${Math.min(current + 1, steps.length)} sur ${steps.length}`}
      className={cx("flex", vertical ? "flex-col" : "w-full items-start", className)}
    >
      {steps.map((step, index) => {
        const done = index < current;
        const active = index === current;
        const last = index === steps.length - 1;

        return (
          <div
            key={index}
            className={cx("flex min-w-0", vertical ? "gap-3" : "flex-1 flex-col gap-2 last:flex-none")}
          >
            <div className={cx("flex", vertical ? "flex-col items-center" : "w-full items-center gap-2")}>
              <span
                aria-hidden="true"
                className={cx(
                  "grid size-7 shrink-0 place-items-center rounded-full border text-xs font-medium",
                  "transition-[background-color,border-color,color] duration-(--k-dur-3) ease-enter",
                  done && "border-accent bg-accent text-on-accent",
                  active && "border-accent bg-accent-subtle text-accent-text",
                  !done && !active && "border-line-strong bg-surface text-ink-subtle",
                )}
              >
                {done ? (
                  <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M3.5 8.5L6.5 11.5L12.5 5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  index + 1
                )}
              </span>

              {!last && (
                <span
                  aria-hidden="true"
                  className={cx(
                    "relative overflow-hidden rounded-full bg-line",
                    vertical ? "my-1 w-0.5 flex-1" : "h-0.5 flex-1",
                  )}
                >
                  {/* Le remplissage glisse depuis l'étape précédente. */}
                  <span
                    className={cx(
                      "absolute inset-0 origin-top bg-accent transition-transform duration-(--k-dur-5) ease-glide",
                      vertical ? "origin-top" : "origin-left",
                      done ? "scale-100" : vertical ? "scale-y-0" : "scale-x-0",
                    )}
                  />
                </span>
              )}
            </div>

            <div className={cx("min-w-0", vertical && "pb-6")}>
              <span
                aria-current={active ? "step" : undefined}
                className={cx(
                  "block text-sm font-medium transition-colors duration-(--k-dur-3) ease-smooth",
                  active || done ? "text-ink" : "text-ink-muted",
                )}
              >
                {step.label}
              </span>
              {step.description !== undefined && (
                <span className="block text-xs text-ink-muted">{step.description}</span>
              )}
            </div>
          </div>
        );
      })}
    </nav>
  );
}

import { Checkbox as Base } from "@base-ui/react/checkbox";
import { CheckboxGroup as BaseGroup } from "@base-ui/react/checkbox-group";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cx } from "../utils/cx";

export interface CheckboxProps
  extends Omit<ComponentPropsWithoutRef<typeof Base.Root>, "render" | "children"> {
  /** Libellé rendu à côté de la case. Le tout devient cliquable. */
  label?: ReactNode;
  /** Texte secondaire sous le libellé. */
  description?: ReactNode;
}

/**
 * Case à cocher, avec état indéterminé.
 *
 * **Checkbox ou Switch ?** Une Checkbox dit « ce sera fait à l'envoi », un
 * Switch dit « c'est fait ». Dans un formulaire qui se valide, c'est toujours
 * une Checkbox.
 *
 * La coche se **dessine** plutôt qu'elle n'apparaît : le tracé est animé en
 * `stroke-dashoffset`. Sur un contrôle manipulé cent fois par jour, c'est le
 * genre de détail qui distingue un système fini d'un système fonctionnel.
 */
export function Checkbox({ label, description, className, id, ...rest }: CheckboxProps) {
  const box = (
    <Base.Root
      {...rest}
      id={id}
      className={cx(
        "flex size-[1.125rem] shrink-0 cursor-pointer items-center justify-center rounded-xs",
        "border border-line-strong bg-surface text-on-accent",
        "transition-[background-color,border-color] duration-(--k-dur-1) ease-swift",
        "data-checked:border-accent data-checked:bg-accent",
        "data-indeterminate:border-accent data-indeterminate:bg-accent",
        "data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className,
      )}
    >
      <Base.Indicator
        className="flex data-unchecked:hidden"
        render={<span />}
      >
        {rest.indeterminate ? (
          <svg viewBox="0 0 16 16" className="size-3" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path d="M3.5 8h9" strokeLinecap="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 16 16" className="size-3" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path
              d="M3 8.5L6.5 12L13 4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="[stroke-dasharray:24] animate-check-draw"
            />
          </svg>
        )}
      </Base.Indicator>
    </Base.Root>
  );

  if (label === undefined && description === undefined) return box;

  return (
    <label className="flex cursor-pointer items-start gap-2.5" htmlFor={id}>
      <span className="mt-px">{box}</span>
      <span className="min-w-0">
        <span className="block text-body-sm text-ink">{label}</span>
        {description !== undefined && (
          <span className="block text-body-xs text-ink-muted">{description}</span>
        )}
      </span>
    </label>
  );
}

/**
 * Groupe de cases, avec case parente à trois états.
 *
 * Passer `allValues` pour que la parente calcule seule son état indéterminé —
 * sans quoi il faut le dériver à la main, ce que tout le monde rate une fois.
 */
export const CheckboxGroup = BaseGroup;
export const CheckboxParts = Base;

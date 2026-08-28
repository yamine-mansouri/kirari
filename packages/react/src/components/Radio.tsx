import { Radio as Base } from "@base-ui/react/radio";
import { RadioGroup as BaseGroup } from "@base-ui/react/radio-group";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cx } from "../utils/cx";

export interface RadioProps
  extends Omit<ComponentPropsWithoutRef<typeof Base.Root>, "render" | "children"> {
  label?: ReactNode;
  description?: ReactNode;
}

/**
 * Bouton radio. À utiliser dans un `RadioGroup`, jamais seul — un radio isolé
 * ne peut pas être décoché, ce qui piège l'utilisateur.
 *
 * Au sein d'un groupe, les flèches naviguent et sélectionnent : c'est le
 * comportement natif, et Base UI le respecte. Ne pas le contrarier avec un
 * `onKeyDown` maison.
 */
export function Radio({ label, description, className, id, ...rest }: RadioProps) {
  const dot = (
    <Base.Root
      {...rest}
      id={id}
      className={cx(
        "flex size-[1.125rem] shrink-0 cursor-pointer items-center justify-center rounded-full",
        "border border-line-strong bg-surface",
        "transition-[border-color] duration-(--k-dur-1) ease-swift",
        "data-checked:border-accent",
        "data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className,
      )}
    >
      {/* Le point grandit depuis rien : `ease-bounce` sur 0.2s donne le clic
          sec d'un vrai bouton radio, sans que le mouvement se remarque. */}
      <Base.Indicator
        className={cx(
          "size-2.5 rounded-full bg-accent",
          "scale-0 transition-transform duration-(--k-dur-1) ease-bounce",
          "data-checked:scale-100",
        )}
        render={<span />}
        keepMounted
      />
    </Base.Root>
  );

  if (label === undefined && description === undefined) return dot;

  return (
    <label className="flex cursor-pointer items-start gap-2.5" htmlFor={id}>
      <span className="mt-px">{dot}</span>
      <span className="min-w-0">
        <span className="block text-sm text-ink">{label}</span>
        {description !== undefined && (
          <span className="block text-xs text-ink-muted">{description}</span>
        )}
      </span>
    </label>
  );
}

export const RadioGroup = BaseGroup;
export const RadioParts = Base;

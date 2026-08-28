import { NumberField as Base } from "@base-ui/react/number-field";
import { useId } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cx } from "../utils/cx";

export interface NumberFieldProps
  extends Omit<ComponentPropsWithoutRef<typeof Base.Root>, "render" | "children"> {
  label?: ReactNode;
  placeholder?: string;
  className?: string;
}

const BTN = cx(
  "flex w-9 shrink-0 cursor-pointer items-center justify-center text-ink-muted select-none",
  "transition-colors duration-(--k-dur-1) ease-swift",
  "hover:bg-surface-sunken hover:text-ink active:bg-accent-subtle active:text-accent-text",
  "data-disabled:pointer-events-none data-disabled:opacity-40",
);

/**
 * Champ numérique avec incrément.
 *
 * Maintenir un bouton accélère la répétition — indispensable dès que la plage
 * dépasse la dizaine. Le label est aussi une zone de « scrub » : glisser
 * horizontalement dessus fait varier la valeur, un raccourci d'outil de design
 * que Base UI fournit gratuitement.
 *
 * `format` accepte les options d'`Intl.NumberFormat` : devise, pourcentage,
 * unités, séparateurs locaux.
 */
export function NumberField({ label, placeholder, className, id, ...rest }: NumberFieldProps) {
  // `id` sur `Base.Root` désigne l'INPUT — Base UI le transmet, et s'en sert
  // aussi pour son câblage ARIA interne. Le défaut n'était pas l'endroit mais
  // l'absence : sans identifiant généré, le `htmlFor` du libellé pointait
  // dans le vide dès que l'appelant n'en fournissait pas.
  const generatedId = useId();
  const inputId = id ?? `k-number-${generatedId}`;

  return (
    <Base.Root {...rest} id={inputId} className={cx("flex w-full flex-col gap-2", className)}>
      {label !== undefined && (
        <Base.ScrubArea className="cursor-ew-resize">
          <label className="text-label-md text-ink select-none" htmlFor={inputId}>
            {label}
          </label>
          <Base.ScrubAreaCursor />
        </Base.ScrubArea>
      )}

      <Base.Group
        className={cx(
          "flex h-11 overflow-hidden rounded-md border border-line bg-surface",
          "transition-colors duration-(--k-dur-2) ease-smooth",
          "focus-within:border-line-strong",
          "data-disabled:bg-surface-sunken data-disabled:opacity-55",
        )}
      >
        <Base.Decrement className={cx(BTN, "border-r border-line")} aria-label="Diminuer">
          <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M3.5 8h9" strokeLinecap="round" />
          </svg>
        </Base.Decrement>

        <Base.Input
          placeholder={placeholder}
          className="w-full min-w-0 bg-transparent px-3 text-center text-sm text-ink tabular-nums outline-none"
        />

        <Base.Increment className={cx(BTN, "border-l border-line")} aria-label="Augmenter">
          <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M8 3.5v9M3.5 8h9" strokeLinecap="round" />
          </svg>
        </Base.Increment>
      </Base.Group>
    </Base.Root>
  );
}

export const NumberFieldParts = Base;

import { forwardRef, useId } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { tv } from "../styles/tv";
import { cx } from "../utils/cx";

/**
 * Le soulignement d'accent se déploie depuis le centre au focus, avec
 * `scale-x` et une origine centrée.
 *
 * Il est posé sur un conteneur en `focus-within` plutôt que sur l'input,
 * car un pseudo-élément ne peut pas être un enfant d'`<input>`.
 */
const field = tv({
  slots: {
    root: "flex flex-col gap-2",
    label: "text-label-md text-ink",
    control: "relative",
    input: [
      "w-full rounded-md border border-line bg-surface px-3 py-3 text-sm text-ink",
      "transition-[border-color,background-color] duration-(--k-dur-2) ease-smooth",
      "placeholder:text-ink-subtle",
      "focus:border-line-strong focus:outline-none",
      "disabled:cursor-not-allowed disabled:bg-surface-sunken disabled:opacity-55",
    ],
    underline: [
      "pointer-events-none absolute inset-x-0 bottom-0 h-0.5 origin-center scale-x-0 rounded-full bg-accent",
      "transition-transform duration-(--k-dur-2) ease-exit",
    ],
    hint: "text-label-sm text-ink-muted",
    error: "text-label-sm text-danger-text",
  },
  variants: {
    invalid: {
      true: {
        input: "border-danger focus:border-danger",
        underline: "bg-danger",
      },
    },
  },
});

export interface FieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label: ReactNode;
  /** Texte d'aide, masqué dès qu'une erreur est affichée. */
  hint?: ReactNode;
  /** Message d'erreur ; sa présence bascule le champ en état invalide. */
  error?: ReactNode;
  /** Classe posée sur le conteneur, pas sur l'`<input>`. */
  containerClassName?: string;
}

/**
 * Les liaisons ARIA sont câblées automatiquement : `aria-describedby` pointe
 * vers l'aide ou vers l'erreur selon l'état, et `aria-invalid` suit `error`.
 */
export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, hint, error, id, containerClassName, className, ...rest },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? `k-field-${generatedId}`;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;
  const invalid = error !== undefined && error !== null && error !== false;

  const styles = field({ invalid });

  return (
    <div className={cx(styles.root(), containerClassName)}>
      <label className={styles.label()} htmlFor={inputId}>
        {label}
      </label>

      <div className={cx(styles.control(), "group")}>
        <input
          {...rest}
          ref={ref}
          id={inputId}
          className={cx(styles.input(), className)}
          aria-invalid={invalid || undefined}
          aria-describedby={invalid ? errorId : hint !== undefined ? hintId : undefined}
        />
        <span
          aria-hidden="true"
          className={cx(
            styles.underline(),
            "group-focus-within:scale-x-100 group-focus-within:ease-enter",
          )}
        />
      </div>

      {invalid ? (
        <span id={errorId} className={styles.error()} role="alert">
          {error}
        </span>
      ) : (
        hint !== undefined && (
          <span id={hintId} className={styles.hint()}>
            {hint}
          </span>
        )
      )}
    </div>
  );
});

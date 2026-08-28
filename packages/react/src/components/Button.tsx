import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cx } from "../utils/cx";

/**
 * Le survol n'est pas un simple changement de couleur : un calque se déploie
 * derrière le label avec `scale-x`, et son origine bascule selon le sens —
 * il entre par la gauche, il se retire vers la droite.
 *
 * Les deux sens n'utilisent jamais la même courbe : `ease-enter` à l'aller,
 * `ease-exit` au retrait. C'est la règle fondatrice du système.
 */
const button = tv({
  slots: {
    root: [
      "group relative isolate inline-flex items-center justify-center gap-2",
      "cursor-pointer overflow-hidden rounded-md border font-medium whitespace-nowrap",
      "transition-[color,border-color,transform] duration-(--k-dur-2) ease-smooth",
      "active:scale-[0.97]",
      // L'opacité ne s'applique qu'au VRAI désactivé. Un bouton en chargement
      // est aussi `disabled` pour bloquer les clics, mais il ne doit pas
      // paraître éteint : son label est déjà masqué, et l'atténuer en plus
      // donne un rectangle délavé et vide.
      "disabled:pointer-events-none disabled:active:scale-100",
      "disabled:not-data-loading:opacity-50",
    ],
    // Le calque de survol, replié au repos.
    layer: [
      "absolute inset-0 -z-10 origin-right scale-x-0",
      "transition-transform duration-(--k-dur-2) ease-exit",
      "group-hover:origin-left group-hover:scale-x-100 group-hover:ease-enter",
      "group-focus-visible:origin-left group-focus-visible:scale-x-100 group-focus-visible:ease-enter",
    ],
  },
  variants: {
    variant: {
      solid: {
        root: "border-transparent bg-accent text-on-accent",
        layer: "bg-accent-hover",
      },
      soft: {
        root: "border-transparent bg-accent-subtle text-accent-text hover:text-on-accent focus-visible:text-on-accent",
        layer: "bg-accent",
      },
      outline: {
        root: "border-line-strong bg-transparent text-ink",
        layer: "bg-surface-sunken",
      },
      ghost: {
        root: "border-transparent bg-transparent text-ink-muted hover:text-ink focus-visible:text-ink",
        layer: "bg-surface-sunken",
      },
      danger: {
        root: "border-transparent bg-danger text-white",
        layer: "bg-[color-mix(in_oklab,var(--k-danger)_82%,black)]",
      },
    },
    size: {
      sm: { root: "gap-1 px-3 py-1 text-xs" },
      md: { root: "px-4 py-2 text-sm" },
      lg: { root: "px-6 py-3 text-base" },
    },
    block: { true: { root: "flex w-full" } },
    loading: { true: { root: "pointer-events-none text-transparent" } },
  },
  defaultVariants: { variant: "solid", size: "md" },
});

type ButtonVariants = VariantProps<typeof button>;

export type ButtonVariant = NonNullable<ButtonVariants["variant"]>;
export type ButtonSize = NonNullable<ButtonVariants["size"]>;

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    Omit<ButtonVariants, "loading"> {
  /** Affiche un spinner et neutralise les interactions. */
  loading?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "solid",
    size = "md",
    block = false,
    loading = false,
    startIcon,
    endIcon,
    disabled,
    className,
    children,
    type = "button",
    ...rest
  },
  ref,
) {
  const styles = button({ variant, size, block, loading });

  return (
    <button
      {...rest}
      ref={ref}
      type={type}
      disabled={disabled || loading}
      // Le label est masqué visuellement pendant le chargement : on l'annonce
      // aux lecteurs d'écran plutôt que de les laisser sur un bouton muet.
      aria-busy={loading || undefined}
      data-loading={loading || undefined}
      className={cx(styles.root(), className)}
    >
      <span aria-hidden="true" className={styles.layer()} />
      {startIcon}
      {children}
      {endIcon}
      {loading && (
        <span
          aria-hidden="true"
          className={cx(
            "absolute top-1/2 left-1/2 size-4 -translate-x-1/2 -translate-y-1/2",
            "rounded-full border-2 border-current/30 border-t-current",
            // `text-transparent` masque le label : on repart de la couleur
            // du variant plutôt que de `currentColor`, devenu invisible.
            variant === "solid" || variant === "danger" ? "text-on-accent" : "text-accent",
            "animate-spinner",
          )}
        />
      )}
    </button>
  );
});

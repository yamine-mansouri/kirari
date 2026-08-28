import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cx } from "../utils/cx";

const badge = tv({
  slots: {
    root: "inline-flex items-center gap-1 rounded-full px-2 py-[0.15em] text-xs font-medium whitespace-nowrap",
    dot: "size-[0.5em] rounded-full bg-current",
  },
  variants: {
    tone: {
      accent: { root: "bg-accent-subtle text-accent-text" },
      neutral: { root: "bg-surface-sunken text-ink-muted" },
      success: { root: "bg-success-subtle text-success-text" },
      warning: { root: "bg-warning-subtle text-warning-text" },
      danger: { root: "bg-danger-subtle text-danger-text" },
    },
    live: { true: { dot: "animate-pulse-soft" } },
  },
  defaultVariants: { tone: "accent" },
});

type BadgeVariants = VariantProps<typeof badge>;
export type BadgeTone = NonNullable<BadgeVariants["tone"]>;

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, BadgeVariants {
  /** Affiche un point ; `live` le fait pulser. */
  dot?: boolean;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { tone = "accent", dot = false, live = false, className, children, ...rest },
  ref,
) {
  const styles = badge({ tone, live });

  return (
    <span {...rest} ref={ref} className={cx(styles.root(), className)}>
      {(dot || live) && <span aria-hidden="true" className={styles.dot()} />}
      {children}
    </span>
  );
});

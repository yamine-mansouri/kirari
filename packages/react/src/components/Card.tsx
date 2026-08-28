import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import type { VariantProps } from "tailwind-variants";
import { tv } from "../styles/tv";
import { cx } from "../utils/cx";

/**
 * La variante `interactive` soulève la carte et fait remonter un liseré
 * d'accent depuis le bas — qui entre par la gauche et se retire par la droite,
 * avec une courbe différente dans chaque sens.
 */
const card = tv({
  slots: {
    root: "relative flex flex-col gap-3 overflow-hidden rounded-lg border border-line bg-surface p-6 text-ink",
    title: "text-title-md",
    body: "text-body-sm text-ink-muted",
    footer: "mt-auto flex items-center gap-2 pt-2",
    accent: [
      "absolute inset-x-0 bottom-0 h-[3px] origin-right scale-x-0 bg-accent",
      "transition-transform duration-(--k-dur-3) ease-exit",
      "group-hover:origin-left group-hover:scale-x-100 group-hover:ease-enter",
      "group-focus-visible:origin-left group-focus-visible:scale-x-100 group-focus-visible:ease-enter",
    ],
  },
  variants: {
    variant: {
      raised: { root: "shadow-sm" },
      flat: { root: "shadow-none" },
      sunken: { root: "bg-surface-sunken shadow-none" },
    },
    interactive: {
      true: {
        root: [
          "group cursor-pointer",
          "transition-[transform,box-shadow,border-color] duration-(--k-dur-3) ease-enter",
          "hover:-translate-y-1 hover:border-line-strong hover:shadow-lg",
          "focus-visible:-translate-y-1 focus-visible:border-line-strong focus-visible:shadow-lg",
        ],
      },
    },
  },
  defaultVariants: { variant: "raised" },
});

type CardVariants = VariantProps<typeof card>;
export type CardVariant = NonNullable<CardVariants["variant"]>;

/**
 * `title` est retiré des attributs natifs : sur une Card, un titre est du
 * contenu rendu, pas une infobulle.
 */
export interface CardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title">,
    CardVariants {
  title?: ReactNode;
  footer?: ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { variant = "raised", interactive = false, title, footer, className, children, ...rest },
  ref,
) {
  const styles = card({ variant, interactive });

  return (
    <div {...rest} ref={ref} className={cx(styles.root(), className)}>
      {title !== undefined && <h3 className={styles.title()}>{title}</h3>}
      {children !== undefined && <div className={styles.body()}>{children}</div>}
      {footer !== undefined && <div className={styles.footer()}>{footer}</div>}
      {interactive && <span aria-hidden="true" className={styles.accent()} />}
    </div>
  );
});

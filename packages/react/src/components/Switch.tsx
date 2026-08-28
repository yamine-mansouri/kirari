import type { ComponentPropsWithoutRef } from "react";
import { Switch as Base } from "@base-ui/react/switch";
import { tv, type VariantProps } from "tailwind-variants";
import { cx } from "../utils/cx";

/**
 * La course du bouton EST le composant. C'est l'un des rares endroits où
 * `ease-spring` se justifie : le pouce dépasse légèrement à l'arrivée, ce qui
 * donne la sensation d'un vrai interrupteur plutôt que d'un rectangle qui
 * change de couleur.
 */
const switchStyles = tv({
  slots: {
    root: [
      "relative inline-flex shrink-0 cursor-pointer items-center rounded-full border border-transparent p-0.5",
      "bg-surface-sunken ring-1 ring-line ring-inset",
      "transition-colors duration-(--k-dur-2) ease-smooth",
      "data-checked:bg-accent data-checked:ring-transparent",
      "data-disabled:cursor-not-allowed data-disabled:opacity-50",
    ],
    thumb: [
      "block rounded-full bg-surface shadow-sm",
      "transition-transform duration-(--k-dur-2) ease-spring",
    ],
  },
  variants: {
    size: {
      sm: { root: "h-5 w-9", thumb: "size-4 data-checked:translate-x-4" },
      md: { root: "h-6 w-11", thumb: "size-5 data-checked:translate-x-5" },
      lg: { root: "h-7 w-[3.25rem]", thumb: "size-6 data-checked:translate-x-6" },
    },
  },
  defaultVariants: { size: "md" },
});

type SwitchVariants = VariantProps<typeof switchStyles>;
export type SwitchSize = NonNullable<SwitchVariants["size"]>;

export interface SwitchProps
  extends Omit<ComponentPropsWithoutRef<typeof Base.Root>, "render">,
    SwitchVariants {}

/**
 * Bascule booléenne à effet immédiat.
 *
 * À ne pas utiliser dans un formulaire qui se valide : un Switch dit « c'est
 * fait », une Checkbox dit « ce sera fait à l'envoi ». Confondre les deux est
 * le contresens le plus fréquent sur ce composant.
 */
export function Switch({ size = "md", className, ...rest }: SwitchProps) {
  const styles = switchStyles({ size });

  return (
    <Base.Root {...rest} className={cx(styles.root(), className)}>
      <Base.Thumb className={styles.thumb()} />
    </Base.Root>
  );
}

import { Toggle as BaseToggle } from "@base-ui/react/toggle";
import { ToggleGroup as BaseGroup } from "@base-ui/react/toggle-group";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cx } from "../utils/cx";

export interface ToggleOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
  /** Libellé accessible, si `label` n'est qu'une icône. */
  ariaLabel?: string;
}

export interface ToggleGroupProps
  extends Omit<ComponentPropsWithoutRef<typeof BaseGroup>, "render" | "children"> {
  items: ToggleOption[];
  className?: string;
}

/**
 * Groupe de bascules — sélecteur de vue, filtre de segment, barre de mise en
 * forme.
 *
 * Par défaut un seul élément est actif à la fois ; `multiple` autorise
 * plusieurs. Les flèches naviguent dans le groupe, comme sur une barre
 * d'outils native.
 *
 * **Ce n'est pas un Tabs.** Un Tabs change ce qui est affiché en dessous ; un
 * ToggleGroup change un réglage. Utiliser l'un pour l'autre casse les
 * attentes de navigation au clavier.
 */
export function ToggleGroup({ items, className, ...rest }: ToggleGroupProps) {
  return (
    <BaseGroup
      {...rest}
      className={cx(
        // `w-fit` en plus d'`inline-flex` : dans un conteneur flex en colonne,
        // l'étirement par défaut (`align-items: stretch`) élargit le groupe
        // sur toute la largeur disponible malgré l'affichage en ligne.
        "inline-flex w-fit items-center gap-0.5 rounded-md border border-line bg-surface-sunken p-0.5",
        className,
      )}
    >
      {items.map((item) => (
        <BaseToggle
          key={item.value}
          value={item.value}
          disabled={item.disabled}
          aria-label={item.ariaLabel}
          className={cx(
            "flex cursor-pointer items-center gap-1.5 rounded-sm px-3 py-1.5 text-label-md",
            "text-ink-muted outline-none",
            "transition-[background-color,color,box-shadow] duration-(--k-dur-1) ease-swift",
            "hover:text-ink",
            "data-pressed:bg-surface data-pressed:text-ink data-pressed:shadow-sm",
            "data-disabled:pointer-events-none data-disabled:opacity-40",
          )}
        >
          {item.label}
        </BaseToggle>
      ))}
    </BaseGroup>
  );
}

export const Toggle = BaseToggle;

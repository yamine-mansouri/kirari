import { Accordion as Base } from "@base-ui/react/accordion";
import { Collapsible as BaseCollapsible } from "@base-ui/react/collapsible";
import type { ReactNode } from "react";
import { cx } from "../utils/cx";

const CHEVRON = (
  <svg viewBox="0 0 16 16" className="size-4 shrink-0 text-ink-subtle" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M4 6.5L8 10.5L12 6.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export interface AccordionItem {
  value: string;
  title: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  /** Autorise plusieurs panneaux ouverts en même temps. */
  multiple?: boolean;
  defaultValue?: string[];
  value?: string[];
  onValueChange?: (value: string[]) => void;
  className?: string;
}

/**
 * Panneaux repliables.
 *
 * **L'animation de hauteur est le piège classique.** Le navigateur ne sait pas
 * interpoler vers `height: auto` : la plupart des implémentations tombent donc
 * dans un `max-height` arbitraire, qui saccade quand le contenu est plus court,
 * et tronque quand il est plus long.
 *
 * Base UI mesure le panneau et expose `--accordion-panel-height`. Les keyframes
 * Kirari partent de cette valeur : le dépliage est exact, quel que soit le
 * contenu. La fermeture est plus rapide que l'ouverture — on attend un
 * dépliage, on n'attend pas un repliage.
 */
export function Accordion({
  items,
  multiple = false,
  defaultValue,
  value,
  onValueChange,
  className,
}: AccordionProps) {
  return (
    <Base.Root
      multiple={multiple}
      defaultValue={defaultValue}
      value={value}
      onValueChange={onValueChange as ((value: unknown) => void) | undefined}
      className={cx("flex w-full flex-col rounded-lg border border-line bg-surface", className)}
    >
      {items.map((item) => (
        <Base.Item
          key={item.value}
          value={item.value}
          disabled={item.disabled}
          className="not-last:border-b not-last:border-line"
        >
          <Base.Header>
            <Base.Trigger
              className={cx(
                "flex w-full cursor-pointer items-center justify-between gap-4 px-4 py-3.5 text-left outline-none",
                "text-label-md text-ink",
                "transition-colors duration-(--k-dur-2) ease-smooth hover:bg-surface-sunken",
                "data-disabled:pointer-events-none data-disabled:opacity-50",
                "[&[data-panel-open]>svg]:rotate-180",
                "[&>svg]:transition-transform [&>svg]:duration-(--k-dur-2) [&>svg]:ease-swift",
              )}
            >
              {item.title}
              {CHEVRON}
            </Base.Trigger>
          </Base.Header>
          <Base.Panel
            className={cx(
              "overflow-hidden text-body-sm text-ink-muted",
              "data-open:animate-accordion-open data-closed:animate-accordion-close",
            )}
          >
            <div className="px-4 pt-1 pb-4">{item.content}</div>
          </Base.Panel>
        </Base.Item>
      ))}
    </Base.Root>
  );
}

export interface CollapsibleProps {
  trigger: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

/**
 * La primitive de repli, seule — un « voir plus » isolé, sans le chrome de
 * l'Accordion. Même mécanique de hauteur mesurée.
 */
export function Collapsible({
  trigger,
  children,
  defaultOpen,
  open,
  onOpenChange,
  className,
}: CollapsibleProps) {
  return (
    <BaseCollapsible.Root
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={onOpenChange}
      className={cx("flex flex-col", className)}
    >
      <BaseCollapsible.Trigger
        className={cx(
          "flex cursor-pointer items-center gap-1.5 self-start text-label-md text-accent-text outline-none",
          "[&[data-panel-open]>svg]:rotate-180",
          "[&>svg]:transition-transform [&>svg]:duration-(--k-dur-2) [&>svg]:ease-swift",
        )}
      >
        {trigger}
        {CHEVRON}
      </BaseCollapsible.Trigger>
      <BaseCollapsible.Panel
        className={cx(
          "overflow-hidden",
          "data-open:animate-collapsible-open data-closed:animate-collapsible-close",
        )}
      >
        <div className="pt-2">{children}</div>
      </BaseCollapsible.Panel>
    </BaseCollapsible.Root>
  );
}

export const AccordionParts = Base;
export const CollapsibleParts = BaseCollapsible;

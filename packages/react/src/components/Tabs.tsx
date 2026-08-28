import { Tabs as Base } from "@base-ui/react/tabs";
import type { ReactNode } from "react";
import { cx } from "../utils/cx";

export interface TabItem {
  value: string;
  label: ReactNode;
  content?: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: "horizontal" | "vertical";
  className?: string;
}

/**
 * Onglets.
 *
 * L'indicateur qui glisse d'un onglet à l'autre est le geste le plus
 * reconnaissable d'un design system — et le plus souvent bâclé, parce qu'il
 * demande de mesurer l'onglet actif à chaque changement.
 *
 * Base UI expose cette mesure en variables CSS (`--active-tab-left`,
 * `--active-tab-width`…) : la transition se fait donc en CSS pur, sans
 * ResizeObserver ni recalcul au rendu. `data-activation-direction` indique en
 * prime le sens du déplacement, si l'on veut différencier l'aller du retour.
 */
export function Tabs({
  items,
  value,
  defaultValue,
  onValueChange,
  orientation = "horizontal",
  className,
}: TabsProps) {
  const vertical = orientation === "vertical";

  return (
    <Base.Root
      value={value}
      defaultValue={defaultValue ?? items[0]?.value}
      onValueChange={onValueChange as ((value: unknown) => void) | undefined}
      orientation={orientation}
      className={cx("flex gap-4", vertical ? "flex-row" : "flex-col", className)}
    >
      <Base.List
        className={cx(
          "relative flex shrink-0",
          vertical
            ? "flex-col items-stretch border-l border-line pl-0"
            : "items-center border-b border-line",
        )}
      >
        {items.map((item) => (
          <Base.Tab
            key={item.value}
            value={item.value}
            disabled={item.disabled}
            className={cx(
              // `relative z-10` : l'indicateur est un frère positionné en
              // absolu, rendu APRÈS les onglets. Sans ordre d'empilement
              // explicite, il passerait par-dessus les libellés dès qu'on lui
              // donne un fond plein — cas du traitement « pastille ».
              "relative z-10 cursor-pointer px-3.5 py-2 text-label-md whitespace-nowrap outline-none",
              "text-ink-muted transition-colors duration-(--k-dur-2) ease-smooth",
              "hover:text-ink data-selected:text-ink",
              "data-disabled:pointer-events-none data-disabled:opacity-50",
              vertical ? "text-left" : "",
            )}
          >
            {item.label}
          </Base.Tab>
        ))}

        <Base.Indicator
          className={cx(
            "absolute z-0 bg-accent transition-all duration-(--k-dur-3) ease-glide",
            vertical
              ? "left-[-1px] w-0.5 top-(--active-tab-top) h-(--active-tab-height)"
              : "bottom-[-1px] h-0.5 left-(--active-tab-left) w-(--active-tab-width)",
          )}
        />
      </Base.List>

      {items.map((item) =>
        item.content === undefined ? null : (
          <Base.Panel key={item.value} value={item.value} className="min-w-0 flex-1 outline-none">
            {item.content}
          </Base.Panel>
        ),
      )}
    </Base.Root>
  );
}

export const TabsParts = Base;

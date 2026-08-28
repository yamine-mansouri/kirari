import { Select as Base } from "@base-ui/react/select";
import { useId } from "react";
import type { ReactNode } from "react";
import { cx } from "../utils/cx";
import { POPUP_BOUNDS, POPUP_ITEM, POPUP_SURFACE } from "../styles/popup";

/**
 * Calculé une fois, au chargement du module, et non à chaque item.
 *
 * `cx()` fait passer ses arguments par `tailwind-merge` : le résultat est mis
 * en cache, mais chaque appel concatène et hache quand même une clé. Sur une
 * liste de plusieurs centaines d'options re-rendue à chaque frappe, ce coût
 * se paie par item et par rendu — alors que la valeur est constante.
 */
const ITEM = cx(POPUP_ITEM, "pr-2 pl-7");

export interface SelectOption<T extends string = string> {
  value: T;
  label: ReactNode;
  disabled?: boolean;
}

export interface SelectProps<T extends string = string> {
  items: Array<SelectOption<T>>;
  /**
   * Libellé du champ.
   *
   * Le déclencheur porte `role="combobox"`, dont le nom accessible ne vient
   * **pas** de son contenu : le texte affiché ne suffit pas. Sans `label`,
   * fournir un `aria-label` — il n'y a pas de troisième option.
   */
  label?: ReactNode;
  value?: T | null;
  defaultValue?: T | null;
  onValueChange?: (value: T) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Identifiant du champ, à relier au `htmlFor` d'un label. */
  id?: string;
  name?: string;
  className?: string;
  /** Classe posée sur le popup, pas sur le déclencheur. */
  popupClassName?: string;
}

const CHEVRON = (
  <svg viewBox="0 0 16 16" className="size-4 shrink-0 text-ink-subtle" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M4 6.5L8 10.5L12 6.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * Liste déroulante à valeur unique.
 *
 * Ce que le `<select>` natif ne sait pas faire : se styler, afficher du
 * contenu riche dans les options, et rester cohérent d'un système à l'autre.
 * Tout le reste — navigation clavier, typeahead, retour au déclencheur à la
 * fermeture, défilement de la liste — vient de Base UI.
 *
 * **Au-delà d'une dizaine d'options, préférer `Combobox`** : sans champ de
 * recherche, une longue liste devient impraticable.
 */
export function Select<T extends string = string>({
  items,
  label,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Sélectionner…",
  disabled,
  id,
  name,
  className,
  popupClassName,

}: SelectProps<T>) {
  const generatedId = useId();
  const triggerId = id ?? `k-select-${generatedId}`;
  const labelId = `${triggerId}-label`;

  const field = (
    <Base.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange as ((value: unknown) => void) | undefined}
      disabled={disabled}
      name={name}
    >
      <Base.Trigger
        id={triggerId}
        aria-labelledby={label !== undefined ? `${labelId} ${triggerId}` : undefined}
        className={cx(
          "flex w-full cursor-pointer items-center justify-between gap-2",
          "rounded-md border border-line bg-surface px-3 py-2.5 text-sm text-ink",
          "transition-colors duration-(--k-dur-2) ease-smooth",
          "hover:border-line-strong",
          "data-popup-open:border-line-strong",
          "data-disabled:cursor-not-allowed data-disabled:bg-surface-sunken data-disabled:opacity-55",
          className,
        )}
      >
        {/* `placeholder` attend une CHAÎNE, pas un nœud React : lui passer un
            élément laissait le déclencheur vide — un Select sans sélection
            n'affichait rien, et son bouton n'avait aucun nom accessible.
            La couleur du texte de substitution passe donc par l'attribut
            `data-placeholder` que Base UI expose. */}
        <Base.Value
          className="truncate text-left data-[placeholder]:text-ink-subtle"
          placeholder={placeholder}
        >
          {(v: unknown) =>
            v === null || v === undefined || v === ""
              ? placeholder
              : (items.find((i) => i.value === v)?.label ?? String(v))
          }
        </Base.Value>
        {/* La chevron pivote à l'ouverture : un état, pas une décoration. */}
        <Base.Icon
          className="transition-transform duration-(--k-dur-2) ease-swift data-popup-open:rotate-180"
          render={<span className="inline-flex" />}
        >
          {CHEVRON}
        </Base.Icon>
      </Base.Trigger>

      <Base.Portal>
        <Base.Positioner sideOffset={6} alignItemWithTrigger={false}>
          <Base.Popup
            className={cx(POPUP_SURFACE, POPUP_BOUNDS, "min-w-(--anchor-width) p-1 outline-none", popupClassName)}
          >
            <Base.List>
              {items.map((item) => (
                <Base.Item
                  key={item.value}
                  value={item.value}
                  disabled={item.disabled}
                  className={ITEM}
                >
                  <Base.ItemIndicator className="absolute left-2.5 flex">
                    <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 8.5L6.5 12L13 4.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Base.ItemIndicator>
                  <Base.ItemText className="flex-1">{item.label}</Base.ItemText>
                </Base.Item>
              ))}
            </Base.List>
          </Base.Popup>
        </Base.Positioner>
      </Base.Portal>
    </Base.Root>
  );

  if (label === undefined) return field;

  return (
    <div className="flex flex-col gap-2">
      <label id={labelId} htmlFor={triggerId} className="text-sm font-medium text-ink">
        {label}
      </label>
      {field}
    </div>
  );
}

/** Les parties brutes, pour les groupes, les séparateurs et le contenu riche. */
export const SelectParts = Base;

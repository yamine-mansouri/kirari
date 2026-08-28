import { useMemo, useState } from "react";
import { Combobox as Base } from "@base-ui/react/combobox";
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

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ComboboxProps {
  items: ComboboxOption[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  placeholder?: string;
  /** Message affiché quand aucune option ne correspond à la saisie. */
  emptyMessage?: ReactNode;
  disabled?: boolean;
  id?: string;
  name?: string;
  className?: string;
}

/**
 * Champ de saisie avec suggestions filtrées.
 *
 * **Select ou Combobox ?** Au-delà d'une dizaine d'options, un Select devient
 * impraticable — il faut pouvoir taper. C'est le seul critère.
 *
 * Le filtrage utilise `useFilter` de Base UI plutôt qu'un `includes()` maison :
 * il s'appuie sur `Intl.Collator`, donc « eleve » trouve « élevé » et la casse
 * n'a pas d'importance. Un filtre naïf échoue sur les deux.
 */
export function Combobox({
  items,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Rechercher…",
  emptyMessage = "Aucun résultat.",
  disabled,
  id,
  name,
  className,
}: ComboboxProps) {
  const { contains } = Base.useFilter({ sensitivity: "base" });
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () => (query === "" ? items : items.filter((item) => contains(item.label, query))),
    [items, query, contains],
  );

  return (
    <Base.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange as ((value: unknown) => void) | undefined}
      onInputValueChange={setQuery}
      disabled={disabled}
      name={name}
      itemToStringLabel={(item: unknown) =>
        items.find((i) => i.value === item)?.label ?? String(item ?? "")
      }
    >
      <Base.InputGroup
        className={cx(
          "flex w-full items-center gap-1 rounded-md border border-line bg-surface pr-1",
          "transition-colors duration-(--k-dur-2) ease-smooth",
          "focus-within:border-line-strong",
          "data-disabled:bg-surface-sunken data-disabled:opacity-55",
          className,
        )}
      >
        <Base.Input
          id={id}
          placeholder={placeholder}
          className="w-full min-w-0 bg-transparent px-3 py-2.5 text-sm text-ink outline-none placeholder:text-ink-subtle"
        />
        <Base.Clear
          aria-label="Effacer"
          className="shrink-0 cursor-pointer rounded-sm p-1.5 text-ink-subtle transition-colors duration-(--k-dur-1) ease-swift hover:text-ink"
        >
          <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
          </svg>
        </Base.Clear>
      </Base.InputGroup>

      <Base.Portal>
        <Base.Positioner sideOffset={6}>
          <Base.Popup
            className={cx(POPUP_SURFACE, POPUP_BOUNDS, "w-(--anchor-width) p-1 outline-none")}
          >
            <Base.Empty className="px-2.5 py-3 text-center text-body-sm text-ink-subtle">
              {emptyMessage}
            </Base.Empty>
            <Base.List>
              {filtered.map((item) => (
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
                  <span className="flex-1">{item.label}</span>
                </Base.Item>
              ))}
            </Base.List>
          </Base.Popup>
        </Base.Positioner>
      </Base.Portal>
    </Base.Root>
  );
}

export const ComboboxParts = Base;

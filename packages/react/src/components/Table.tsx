import type { ReactNode, TableHTMLAttributes } from "react";
import { cx } from "../utils/cx";

export type SortDirection = "asc" | "desc";

export interface Column<Row> {
  /** Clé unique. Sert aussi d'identifiant de tri. */
  key: string;
  header: ReactNode;
  /** Rend la cellule. Reçoit la ligne entière, pas seulement une valeur. */
  cell: (row: Row, index: number) => ReactNode;
  align?: "left" | "center" | "right";
  /** Rend la colonne triable. Le tri lui-même reste à la charge du parent. */
  sortable?: boolean;
  /** Largeur CSS. Sans valeur, la colonne s'ajuste au contenu. */
  width?: string;
  /** Aligne les chiffres en colonne. À activer sur toute donnée numérique. */
  numeric?: boolean;
}

export interface TableProps<Row> extends Omit<TableHTMLAttributes<HTMLTableElement>, "children"> {
  columns: Array<Column<Row>>;
  rows: Row[];
  /** Identifiant stable d'une ligne. Indispensable dès que les lignes bougent. */
  rowKey: (row: Row, index: number) => string;
  /** Colonne triée et sens. Contrôlé par le parent. */
  sort?: { key: string; direction: SortDirection };
  onSortChange?: (key: string, direction: SortDirection) => void;
  /** En-tête qui reste visible au défilement. */
  stickyHeader?: boolean;
  density?: "comfortable" | "compact";
  /** Rendu quand `rows` est vide — typiquement un `<EmptyState compact />`. */
  empty?: ReactNode;
  onRowClick?: (row: Row, index: number) => void;
  /** Nom du conteneur défilant, annoncé au clavier. */
  "aria-label"?: string;
  className?: string;
}

const ALIGN = { left: "text-left", center: "text-center", right: "text-right" } as const;

/**
 * Tableau de données.
 *
 * **Le tri est contrôlé, pas interne.** Une table qui trie elle-même ne sait
 * pas trier côté serveur, ni conserver l'ordre au changement de page. Le
 * composant affiche l'état et signale l'intention ; c'est au parent de
 * réordonner.
 *
 * Le conteneur porte `overflow-x-auto` : une table large défile dans sa propre
 * boîte au lieu de faire déborder la page — la faute la plus fréquente sur ce
 * composant.
 *
 * `numeric` active `tabular-nums` : sans lui, les chiffres ne s'alignent pas
 * en colonne et la comparaison visuelle devient impossible.
 */
export function Table<Row>({
  columns,
  rows,
  rowKey,
  sort,
  onSortChange,
  stickyHeader = false,
  density = "comfortable",
  empty,
  onRowClick,
  "aria-label": ariaLabel,
  className,
  ...rest
}: TableProps<Row>) {
  const pad = density === "compact" ? "px-3 py-1.5" : "px-4 py-3";

  if (rows.length === 0 && empty !== undefined) {
    return <div className={cx("rounded-lg border border-line bg-surface", className)}>{empty}</div>;
  }

  return (
    // `tabIndex={0}` : un conteneur qui défile doit être atteignable au
    // clavier, sans quoi les colonnes hors écran sont inaccessibles à qui
    // n'utilise pas de souris (WCAG 2.1.1).
    //
    // Le rôle `region` n'est posé QUE si un libellé est fourni : plusieurs
    // régions anonymes sur une même page sont indiscernables pour un lecteur
    // d'écran, et le focus seul suffit à régler le défilement.
    <div
      tabIndex={0}
      role={ariaLabel ? "region" : undefined}
      aria-label={ariaLabel}
      className={cx(
        "overflow-x-auto rounded-lg border border-line bg-surface",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--k-focus-ring)",
        className,
      )}
    >
      <table {...rest} className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-line">
            {columns.map((column) => {
              const sorted = sort?.key === column.key;
              const next: SortDirection = sorted && sort.direction === "asc" ? "desc" : "asc";

              return (
                <th
                  key={column.key}
                  scope="col"
                  style={column.width ? { width: column.width } : undefined}
                  aria-sort={sorted ? (sort.direction === "asc" ? "ascending" : "descending") : undefined}
                  className={cx(
                    pad,
                    "text-xs font-medium tracking-wide text-ink-subtle uppercase",
                    ALIGN[column.align ?? (column.numeric ? "right" : "left")],
                    stickyHeader && "sticky top-0 z-10 bg-surface",
                  )}
                >
                  {column.sortable && onSortChange !== undefined ? (
                    <button
                      type="button"
                      onClick={() => onSortChange(column.key, next)}
                      className={cx(
                        "inline-flex cursor-pointer items-center gap-1 rounded-xs uppercase",
                        "transition-colors duration-(--k-dur-1) ease-swift hover:text-ink",
                        sorted && "text-ink",
                      )}
                    >
                      {column.header}
                      {/* La flèche pivote plutôt que d'être remplacée :
                          le changement de sens se lit comme un mouvement. */}
                      <svg
                        viewBox="0 0 16 16"
                        aria-hidden="true"
                        className={cx(
                          "size-3 transition-[transform,opacity] duration-(--k-dur-2) ease-swift",
                          sorted ? "opacity-100" : "opacity-0",
                          sorted && sort.direction === "desc" && "rotate-180",
                        )}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M8 12.5v-9M4 7.5L8 3.5l4 4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, index) => (
            <tr
              key={rowKey(row, index)}
              onClick={onRowClick ? () => onRowClick(row, index) : undefined}
              // Pas de transition sur le survol : on balaie les lignes d'un
              // tableau du regard et du curseur. Une transition ferait traîner
              // le repère derrière le pointeur.
              className={cx(
                "not-last:border-b not-last:border-line",
                onRowClick !== undefined && "cursor-pointer hover:bg-surface-sunken",
              )}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={cx(
                    pad,
                    "text-ink",
                    ALIGN[column.align ?? (column.numeric ? "right" : "left")],
                    column.numeric && "tabular-nums",
                  )}
                >
                  {column.cell(row, index)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

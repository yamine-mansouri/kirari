import type { HTMLAttributes } from "react";
import { cx } from "../utils/cx";

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, "onChange"> {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
  /** Nombre de pages affichées de part et d'autre de la page courante. */
  siblings?: number;
  disabled?: boolean;
}

/**
 * Construit la suite de pages affichées, ellipses comprises.
 *
 * La première et la dernière page sont toujours visibles : ce sont les deux
 * destinations les plus demandées. On replie uniquement le milieu.
 */
function buildRange(page: number, pageCount: number, siblings: number): Array<number | "gap"> {
  const total = siblings * 2 + 5; // premières, dernières, courante, deux ellipses
  if (pageCount <= total) return Array.from({ length: pageCount }, (_, i) => i + 1);

  const left = Math.max(page - siblings, 1);
  const right = Math.min(page + siblings, pageCount);
  const showLeftGap = left > 2;
  const showRightGap = right < pageCount - 1;

  const range: Array<number | "gap"> = [1];
  if (showLeftGap) range.push("gap");

  for (let i = Math.max(left, 2); i <= Math.min(right, pageCount - 1); i += 1) {
    range.push(i);
  }

  if (showRightGap) range.push("gap");
  range.push(pageCount);
  return range;
}

const CELL = cx(
  "grid size-8 cursor-pointer place-items-center rounded-md text-sm tabular-nums",
  "transition-colors duration-(--k-dur-1) ease-swift",
  "hover:bg-surface-sunken",
  "disabled:pointer-events-none disabled:opacity-40",
);

/**
 * Navigation entre pages.
 *
 * Entièrement contrôlée : le composant ne connaît ni les données ni le
 * chargement, il émet une intention. C'est ce qui lui permet de fonctionner
 * aussi bien sur une pagination serveur que sur un tableau en mémoire.
 */
export function Pagination({
  page,
  pageCount,
  onChange,
  siblings = 1,
  disabled = false,
  className,
  ...rest
}: PaginationProps) {
  if (pageCount <= 1) return null;

  const range = buildRange(page, pageCount, siblings);

  return (
    <nav {...rest} aria-label="Pagination" className={cx("flex items-center gap-1", className)}>
      <button
        type="button"
        aria-label="Page précédente"
        disabled={disabled || page <= 1}
        onClick={() => onChange(page - 1)}
        className={cx(CELL, "text-ink-muted")}
      >
        <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M10 3.5L5.5 8L10 12.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {range.map((item, index) =>
        item === "gap" ? (
          <span key={`gap-${index}`} className="grid size-8 place-items-center text-ink-subtle">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            aria-label={`Page ${item}`}
            aria-current={item === page ? "page" : undefined}
            disabled={disabled}
            onClick={() => onChange(item)}
            className={cx(
              CELL,
              item === page
                ? "bg-accent font-medium text-on-accent hover:bg-accent"
                : "text-ink-muted",
            )}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        aria-label="Page suivante"
        disabled={disabled || page >= pageCount}
        onClick={() => onChange(page + 1)}
        className={cx(CELL, "text-ink-muted")}
      >
        <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M6 3.5L10.5 8L6 12.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </nav>
  );
}

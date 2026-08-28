import { Fragment } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../utils/cx";

export interface Crumb {
  label: ReactNode;
  href?: string;
  onClick?: () => void;
}

export interface BreadcrumbProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  items: Crumb[];
  /**
   * Au-delà de ce nombre, les éléments du milieu sont repliés derrière une
   * ellipse. `0` désactive la troncature.
   */
  maxItems?: number;
  separator?: ReactNode;
  /** Nom de la navigation. À personnaliser si la page en contient plusieurs. */
  "aria-label"?: string;
}

const CHEVRON = (
  <svg viewBox="0 0 16 16" className="size-3.5 shrink-0 text-ink-subtle" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <path d="M6 3.5L10.5 8L6 12.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LINK = cx(
  "rounded-xs text-ink-muted no-underline",
  "transition-colors duration-(--k-dur-1) ease-swift hover:text-ink",
);

/**
 * Fil d'Ariane.
 *
 * **La troncature se fait au milieu, pas à la fin.** Le premier élément (la
 * racine) et le dernier (la page courante) sont les deux plus utiles : ce sont
 * ceux du milieu qu'on replie. Beaucoup d'implémentations coupent la fin, ce
 * qui supprime justement le repère le plus important.
 *
 * Le dernier élément porte `aria-current="page"` et n'est pas un lien — on ne
 * navigue pas vers la page où l'on se trouve.
 */
export function Breadcrumb({
  items,
  maxItems = 4,
  separator = CHEVRON,
  "aria-label": ariaLabel = "Fil d'Ariane",
  className,
  ...rest
}: BreadcrumbProps) {
  const truncated = maxItems > 0 && items.length > maxItems;
  const shown: Array<Crumb | "ellipsis"> = truncated
    ? [items[0]!, "ellipsis", ...items.slice(-(maxItems - 2))]
    : items;

  return (
    <nav {...rest} aria-label={ariaLabel} className={cx("min-w-0", className)}>
      <ol className="flex flex-wrap items-center gap-1.5 text-body-sm">
        {shown.map((item, index) => {
          const last = index === shown.length - 1;

          return (
            <Fragment key={index}>
              <li className="flex min-w-0 items-center">
                {item === "ellipsis" ? (
                  <span className="px-0.5 text-ink-subtle" aria-label="Éléments masqués">
                    …
                  </span>
                ) : last ? (
                  <span aria-current="page" className="truncate font-medium text-ink">
                    {item.label}
                  </span>
                ) : item.href !== undefined ? (
                  <a href={item.href} className={cx(LINK, "truncate")}>
                    {item.label}
                  </a>
                ) : (
                  <button type="button" onClick={item.onClick} className={cx(LINK, "cursor-pointer truncate")}>
                    {item.label}
                  </button>
                )}
              </li>
              {!last && <li aria-hidden="true" className="flex items-center">{separator}</li>}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

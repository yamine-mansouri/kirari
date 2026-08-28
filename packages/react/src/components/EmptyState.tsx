import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../utils/cx";

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title: ReactNode;
  description?: ReactNode;
  /** Illustration ou icône. Rendue au-dessus du titre. */
  icon?: ReactNode;
  /** Action principale, et éventuellement secondaire. */
  action?: ReactNode;
  /** Variante compacte, pour un état vide à l'intérieur d'une carte. */
  compact?: boolean;
}

/**
 * État vide.
 *
 * Sous-estimé, alors que c'est souvent le **premier** écran qu'un utilisateur
 * voit : une liste sans contenu, une recherche sans résultat, un projet qui
 * démarre. Un état vide qui se contente d'un « Aucun élément » rate l'occasion
 * d'expliquer quoi faire.
 *
 * D'où la structure imposée : une raison (`title`), un contexte
 * (`description`), et une sortie (`action`).
 */
export function EmptyState({
  title,
  description,
  icon,
  action,
  compact = false,
  className,
  ...rest
}: EmptyStateProps) {
  return (
    <div
      {...rest}
      className={cx(
        "flex flex-col items-center justify-center text-center",
        compact ? "gap-2 px-4 py-8" : "gap-3 px-6 py-16",
        className,
      )}
    >
      {icon !== undefined && (
        <div
          className={cx(
            "grid place-items-center rounded-full bg-surface-sunken text-ink-subtle",
            compact ? "size-10" : "size-14",
          )}
        >
          {icon}
        </div>
      )}

      <div className="flex flex-col gap-1">
        <p className={cx("font-medium text-ink", compact ? "text-sm" : "text-base")}>{title}</p>
        {description !== undefined && (
          <p className="max-w-[42ch] text-sm text-ink-muted">{description}</p>
        )}
      </div>

      {action !== undefined && <div className="mt-2 flex items-center gap-2">{action}</div>}
    </div>
  );
}

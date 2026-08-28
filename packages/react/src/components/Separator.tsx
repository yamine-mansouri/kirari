import { Separator as Base } from "@base-ui/react/separator";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cx } from "../utils/cx";

export interface SeparatorProps
  extends Omit<ComponentPropsWithoutRef<typeof Base>, "render" | "children"> {
  /** Texte centré sur le trait. Le séparateur devient alors décoratif. */
  label?: ReactNode;
}

/**
 * Trait de séparation.
 *
 * Trivial en apparence, mais il porte le bon rôle ARIA — un `<hr>` stylé à la
 * main, ou pire un `<div>` avec une bordure, n'annonce rien. Avec un label, le
 * séparateur devient purement décoratif : le texte suffit alors à marquer la
 * rupture pour un lecteur d'écran.
 */
export function Separator({ label, orientation = "horizontal", className, ...rest }: SeparatorProps) {
  if (label !== undefined) {
    return (
      <div className={cx("flex items-center gap-3", className)} role="presentation">
        <span className="h-px flex-1 bg-line" />
        <span className="text-xs font-medium text-ink-subtle">{label}</span>
        <span className="h-px flex-1 bg-line" />
      </div>
    );
  }

  return (
    <Base
      {...rest}
      orientation={orientation}
      className={cx(
        "shrink-0 bg-line",
        orientation === "vertical" ? "h-full w-px" : "h-px w-full",
        className,
      )}
    />
  );
}

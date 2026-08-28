import { Avatar as Base } from "@base-ui/react/avatar";
import { tv, type VariantProps } from "tailwind-variants";
import type { ReactNode } from "react";
import { cx } from "../utils/cx";

const avatar = tv({
  base: "relative inline-flex shrink-0 items-center justify-center overflow-hidden bg-accent-subtle font-medium text-accent-text select-none",
  variants: {
    size: {
      xs: "size-6 text-[0.625rem]",
      sm: "size-8 text-xs",
      md: "size-10 text-sm",
      lg: "size-14 text-base",
      xl: "size-20 text-xl",
    },
    shape: { circle: "rounded-full", squircle: "rounded-squircle" },
  },
  defaultVariants: { size: "md", shape: "circle" },
});

type AvatarVariants = VariantProps<typeof avatar>;
export type AvatarSize = NonNullable<AvatarVariants["size"]>;

export interface AvatarProps extends AvatarVariants {
  src?: string;
  /** Texte alternatif. Obligatoire dès qu'une image est fournie. */
  alt?: string;
  /** Repli affiché tant que l'image charge, ou si elle échoue. */
  fallback?: ReactNode;
  /** Génère les initiales à partir d'un nom, si `fallback` est absent. */
  name?: string;
  className?: string;
}

/** Deux initiales au maximum : au-delà, ça ne se lit plus dans un cercle. */
function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * Portrait, avec repli.
 *
 * Le repli n'est pas un détail : une image d'avatar échoue plus souvent qu'on
 * ne le croit — lien expiré, hors-ligne, utilisateur sans photo. Base UI ne
 * l'affiche qu'après échec ou pendant le chargement, ce qui évite le
 * clignotement initiales → photo sur une image déjà en cache.
 */
export function Avatar({ src, alt, fallback, name, size, shape, className }: AvatarProps) {
  return (
    <Base.Root className={cx(avatar({ size, shape }), className)}>
      {src !== undefined && (
        <Base.Image src={src} alt={alt} className="size-full object-cover" />
      )}
      <Base.Fallback className="flex size-full items-center justify-center">
        {fallback ?? (name !== undefined ? initials(name) : null)}
      </Base.Fallback>
    </Base.Root>
  );
}

export interface AvatarGroupProps {
  children: ReactNode;
  /** Décalage négatif entre les portraits. */
  overlap?: "sm" | "md";
  className?: string;
}

/** Portraits empilés. Le premier est devant : l'ordre de lecture est préservé. */
export function AvatarGroup({ children, overlap = "md", className }: AvatarGroupProps) {
  return (
    <div
      className={cx(
        "flex items-center",
        overlap === "sm" ? "-space-x-1.5" : "-space-x-2.5",
        "[&>*]:ring-2 [&>*]:ring-bg",
        className,
      )}
    >
      {children}
    </div>
  );
}

export const AvatarParts = Base;

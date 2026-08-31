import { forwardRef } from "react";
import type { CSSProperties, HTMLAttributes } from "react";
import type { VariantProps } from "tailwind-variants";
import { tv } from "../styles/tv";
import { cx } from "../utils/cx";

/**
 * L'éclat qui traverse est un dégradé animé en `background-position` —
 * moins coûteux qu'un pseudo-élément qui se déplace, et sans reflow.
 *
 * `motion-reduce:` coupe l'animation ET le dégradé : un skeleton figé mais
 * dégradé se lit comme une erreur de rendu.
 */
const skeleton = tv({
  base: [
    "block bg-surface-sunken bg-no-repeat [background-size:220%_100%]",
    "bg-[linear-gradient(90deg,transparent_0%,color-mix(in_oklab,var(--k-surface)_70%,var(--k-text)_8%)_50%,transparent_100%)]",
    "animate-shimmer",
    "motion-reduce:animate-none motion-reduce:bg-none",
  ],
  variants: {
    shape: {
      block: "rounded-sm",
      text: "my-[0.2em] h-[0.8em] rounded-full",
      circle: "aspect-square rounded-full",
    },
  },
  defaultVariants: { shape: "block" },
});

type SkeletonVariants = VariantProps<typeof skeleton>;

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement>, SkeletonVariants {
  width?: number | string;
  height?: number | string;
  /** Nombre de lignes, uniquement pour `shape="text"`. */
  lines?: number;
}

function size(value: number | string | undefined): string | undefined {
  if (value === undefined) return undefined;
  return typeof value === "number" ? `${value}px` : value;
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { shape = "block", width, height, lines = 1, className, style, ...rest },
  ref,
) {
  const box: CSSProperties = { width: size(width), height: size(height), ...style };
  const classes = cx(skeleton({ shape }), className);

  if (shape === "text" && lines > 1) {
    return (
      <div {...rest} ref={ref} role="status" aria-busy="true" aria-live="polite">
        {Array.from({ length: lines }, (_, index) => (
          <div
            key={index}
            className={classes}
            // La dernière ligne est raccourcie : un bloc de lignes toutes
            // égales ne ressemble pas à du texte.
            style={{ ...box, width: index === lines - 1 ? "62%" : box.width }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      {...rest}
      ref={ref}
      role="status"
      aria-busy="true"
      aria-live="polite"
      className={classes}
      style={box}
    />
  );
});

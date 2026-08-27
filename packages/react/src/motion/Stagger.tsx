import { createElement, forwardRef } from "react";
import type { CSSProperties, ElementType, HTMLAttributes, Ref } from "react";
import { cx } from "../utils/cx";
import { timeValue } from "./tokens";

export interface StaggerProps extends HTMLAttributes<HTMLElement> {
  /** Décalage entre deux enfants successifs. Nombre = secondes. */
  step?: number | string;
  /** Décalage appliqué à toute la séquence, pour l'enchaîner après une autre. */
  base?: number | string;
  /** Le dernier enfant démarre en premier. */
  reverse?: boolean;
  as?: ElementType;
}

/**
 * Échelonne le `animation-delay` de ses enfants directs.
 *
 * Le calcul est fait en CSS (`nth-child` → `--k-i`), donc rien n'est
 * recalculé au rendu React et la séquence fonctionne à l'identique en HTML
 * statique.
 *
 * Limite : 24 enfants directs. Au-delà, le décalage retombe à 0 — c'est
 * volontaire, une séquence plus longue devient illisible à l'écran.
 */
export const Stagger = forwardRef<HTMLElement, StaggerProps>(function Stagger(
  { step, base, reverse = false, as = "div", className, style, ...rest },
  ref,
) {
  const vars: Record<string, string> = {};
  const stepValue = timeValue(step);
  const baseValue = timeValue(base);
  if (stepValue !== undefined) vars["--k-stagger"] = stepValue;
  if (baseValue !== undefined) vars["--k-stagger-base"] = baseValue;

  return createElement(as, {
    ...rest,
    ref: ref as Ref<HTMLElement>,
    className: cx("k-stagger", reverse && "k-stagger--reverse", className),
    style: { ...vars, ...style } as CSSProperties,
  });
});

import { createElement, forwardRef } from "react";
import type { CSSProperties, ElementType, HTMLAttributes, Ref } from "react";
import { cx } from "../utils/cx";
import {
  ANIMATION_CLASS,
  durationValue,
  easeValue,
  lengthValue,
  timeValue,
  type KirariAnimation,
  type KirariDuration,
  type KirariEase,
} from "./tokens";

export interface AnimateProps extends HTMLAttributes<HTMLElement> {
  /** Nom de l'animation, sans le préfixe `animate-`. */
  animation: KirariAnimation;
  /** Courbe. Chaque animation embarque déjà une courbe cohérente. */
  ease?: KirariEase;
  /** Token 1→6 / `ambient-*`, ou valeur CSS brute ("250ms"). */
  duration?: KirariDuration | string;
  /** Nombre = secondes. */
  delay?: number | string;
  /** Amplitude des translations. Nombre = pixels. */
  distance?: number | string;
  /** Amplitude des mises à l'échelle (facteur, sans unité). */
  scale?: number;
  /** Nombre de répétitions. `true` équivaut à `infinite`. */
  repeat?: number | true;
  /** Conserver l'animation même en `prefers-reduced-motion: reduce`. */
  motionSafe?: boolean;
  /** Élément rendu. `div` par défaut. */
  as?: ElementType;
}

/**
 * Applique une animation Kirari à un élément.
 *
 * Le nom de l'animation devient une classe Tailwind (via une table statique,
 * seule forme que son scanner sait lire) ; les réglages venus des props
 * passent en style inline, puisqu'une valeur dynamique ne peut pas générer
 * d'utilitaire.
 *
 * Aucun état React, aucun timer : l'animation reste pilotée par le
 * compositeur du navigateur.
 *
 *   <Animate animation="slide-up" delay={0.2}>…</Animate>
 */
export const Animate = forwardRef<HTMLElement, AnimateProps>(function Animate(
  {
    animation,
    ease,
    duration,
    delay,
    distance,
    scale,
    repeat,
    motionSafe = false,
    as = "div",
    className,
    style,
    ...rest
  },
  ref,
) {
  const inline: Record<string, string> = {};
  const set = (name: string, value: string | undefined) => {
    if (value !== undefined) inline[name] = value;
  };

  set("animationTimingFunction", easeValue(ease));
  set("animationDuration", durationValue(duration));
  set("animationDelay", timeValue(delay));
  set("animationIterationCount", repeat === undefined ? undefined : repeat === true ? "infinite" : String(repeat));
  // Lues par les keyframes elles-mêmes.
  set("--k-anim-distance", lengthValue(distance));
  set("--k-anim-scale", scale === undefined ? undefined : String(scale));

  return createElement(as, {
    ...rest,
    ref: ref as Ref<HTMLElement>,
    className: cx(ANIMATION_CLASS[animation], motionSafe && "k-motion-safe", className),
    style: { ...inline, ...style } as CSSProperties,
  });
});

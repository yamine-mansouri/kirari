import { createElement, useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, ElementType, HTMLAttributes } from "react";
import { cx } from "../utils/cx";
import { useIsomorphicLayoutEffect } from "../utils/useIsomorphicLayoutEffect";
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

export interface RevealProps extends HTMLAttributes<HTMLElement> {
  animation?: KirariAnimation;
  ease?: KirariEase;
  duration?: KirariDuration | string;
  delay?: number | string;
  distance?: number | string;
  /** Fraction de l'élément visible avant déclenchement (0→1). */
  threshold?: number;
  /** Marge autour du viewport, syntaxe `rootMargin`. */
  rootMargin?: string;
  /** Rejouer à chaque entrée dans le viewport plutôt qu'une seule fois. */
  repeat?: boolean;
  motionSafe?: boolean;
  as?: ElementType;
}

/**
 * Déclenche une animation Kirari à l'entrée dans le viewport.
 *
 * L'observer est déconnecté dès le premier déclenchement quand `repeat` est
 * faux. Si `IntersectionObserver` est indisponible, le contenu est révélé
 * immédiatement plutôt que laissé invisible.
 */
export function Reveal({
  animation = "slide-up",
  ease,
  duration,
  delay,
  distance,
  threshold = 0.15,
  rootMargin = "0px 0px -10% 0px",
  repeat = false,
  motionSafe = false,
  as = "div",
  className,
  style,
  ...rest
}: RevealProps) {
  const [visible, setVisible] = useState(false);
  const nodeRef = useRef<HTMLElement | null>(null);

  // Signale au CSS que JS est actif : sans cela, `.k-reveal` reste visible
  // (garde-fou pour que le contenu ne disparaisse jamais sans JS).
  //
  // Effet *de layout* et non `useEffect` : la classe doit être posée avant la
  // peinture, sinon l'élément apparaît une frame puis se masque pour être
  // animé — un scintillement visible au-dessus de la ligne de flottaison.
  useIsomorphicLayoutEffect(() => {
    document.documentElement.classList.add("k-js");
  }, []);

  const setNode = useCallback((node: HTMLElement | null) => {
    nodeRef.current = node;
  }, []);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            if (!repeat) observer.disconnect();
          } else if (repeat) {
            setVisible(false);
          }
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin, repeat]);

  const inline: Record<string, string> = {};
  const set = (name: string, value: string | undefined) => {
    if (value !== undefined) inline[name] = value;
  };
  set("animationTimingFunction", easeValue(ease));
  set("animationDuration", durationValue(duration));
  set("animationDelay", timeValue(delay));
  set("--k-anim-distance", lengthValue(distance));

  return createElement(as, {
    ...rest,
    ref: setNode,
    className: cx(
      "k-reveal",
      visible && "k-reveal--in",
      visible && ANIMATION_CLASS[animation],
      motionSafe && "k-motion-safe",
      className,
    ),
    style: { ...inline, ...style } as CSSProperties,
  });
}

/**
 * Reflet TypeScript du vocabulaire de mouvement de @kirari-ds/core.
 *
 * ── Pourquoi une table et non un template ─────────────────────────────────
 *
 * Tailwind analyse le code source en cherchant des chaînes littérales. Une
 * classe construite dynamiquement — `` `animate-${animation}` `` — n'est
 * jamais détectée, et l'utilitaire n'est tout simplement pas généré. La
 * table ci-dessous fait donc apparaître chaque nom en toutes lettres.
 *
 * C'est aussi ce qui permet à un consommateur de n'embarquer que les
 * animations qu'il utilise réellement.
 */

export type KirariEnterAnimation =
  | "fade-in"
  | "slide-up"
  | "slide-down"
  | "slide-left"
  | "slide-right"
  | "scale-in"
  | "bloom"
  | "popup"
  | "bound"
  | "fall"
  | "wipe-up"
  | "wipe-right";

export type KirariExitAnimation =
  | "fade-out"
  | "slide-up-out"
  | "slide-down-out"
  | "scale-out"
  | "curtain-out";

export type KirariAmbientAnimation = "spin-slow" | "sway" | "float" | "pulse-soft" | "shimmer";

export type KirariAnimation =
  | KirariEnterAnimation
  | KirariExitAnimation
  | KirariAmbientAnimation
  | "jump";

/** Chaque valeur est une chaîne littérale, pour que Tailwind la voie. */
export const ANIMATION_CLASS: Record<KirariAnimation, string> = {
  "fade-in": "animate-fade-in",
  "slide-up": "animate-slide-up",
  "slide-down": "animate-slide-down",
  "slide-left": "animate-slide-left",
  "slide-right": "animate-slide-right",
  "scale-in": "animate-scale-in",
  bloom: "animate-bloom",
  popup: "animate-popup",
  bound: "animate-bound",
  fall: "animate-fall",
  "wipe-up": "animate-wipe-up",
  "wipe-right": "animate-wipe-right",
  "fade-out": "animate-fade-out",
  "slide-up-out": "animate-slide-up-out",
  "slide-down-out": "animate-slide-down-out",
  "scale-out": "animate-scale-out",
  "curtain-out": "animate-curtain-out",
  jump: "animate-jump",
  "spin-slow": "animate-spin-slow",
  sway: "animate-sway",
  float: "animate-float",
  "pulse-soft": "animate-pulse-soft",
  shimmer: "animate-shimmer",
};

export type KirariEase =
  | "enter"
  | "exit"
  | "hold"
  | "brake"
  | "snap"
  | "smooth"
  | "swift"
  | "glide"
  | "bounce"
  | "spring"
  | "linear";

/** 1→6 pour l'interaction, `ambient-*` pour les boucles de fond. */
export type KirariDuration = 1 | 2 | 3 | 4 | 5 | 6 | "ambient-1" | "ambient-2" | "ambient-3";

const AMBIENT = new Set(["ambient-1", "ambient-2", "ambient-3"]);

/**
 * Résout un token de durée en `var(--k-dur-*)`, ou laisse passer une valeur
 * CSS brute. Appliqué en style inline et non en classe : une durée venue des
 * props est dynamique, donc invisible pour le scanner de Tailwind.
 */
export function durationValue(value: KirariDuration | string | undefined): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value === "number") return `var(--k-dur-${value})`;
  return AMBIENT.has(value) ? `var(--k-dur-${value})` : value;
}

/** Résout un token de courbe en `var(--k-ease-*)`. */
export function easeValue(value: KirariEase | undefined): string | undefined {
  return value === undefined ? undefined : `var(--k-ease-${value})`;
}

/** Normalise un délai : un nombre est interprété en secondes. */
export function timeValue(value: number | string | undefined): string | undefined {
  if (value === undefined) return undefined;
  return typeof value === "number" ? `${value}s` : value;
}

/** Normalise une distance : un nombre est interprété en pixels. */
export function lengthValue(value: number | string | undefined): string | undefined {
  if (value === undefined) return undefined;
  return typeof value === "number" ? `${value}px` : value;
}

/**
 * @kirari-ds/react
 *
 * Les styles ne sont pas importés ici : le projet consommateur charge Tailwind
 * puis `@kirari-ds/core` dans sa feuille de style. Ce paquet reste donc
 * `sideEffects: false`, et parfaitement tree-shakable.
 *
 *   @import "tailwindcss";
 *   @import "@kirari-ds/core";
 */

// Thème
export {
  ThemeProvider,
  useTheme,
  themeScript,
  DEFAULT_STORAGE_KEY,
  type ThemePreference,
  type ResolvedTheme,
  type ThemeContextValue,
  type ThemeProviderProps,
} from "./theme/ThemeProvider";

// Mouvement
export { Animate, type AnimateProps } from "./motion/Animate";
export { Stagger, type StaggerProps } from "./motion/Stagger";
export { Reveal, type RevealProps } from "./motion/Reveal";
export { useReducedMotion } from "./motion/useReducedMotion";
export { ANIMATION_CLASS } from "./motion/tokens";
export type {
  KirariEase,
  KirariDuration,
  KirariAnimation,
  KirariEnterAnimation,
  KirariExitAnimation,
  KirariAmbientAnimation,
} from "./motion/tokens";

// Composants
export { Button, type ButtonProps, type ButtonVariant, type ButtonSize } from "./components/Button";
export { Card, type CardProps, type CardVariant } from "./components/Card";
export { Field, type FieldProps } from "./components/Field";
export { Badge, type BadgeProps, type BadgeTone } from "./components/Badge";
export { Skeleton, type SkeletonProps } from "./components/Skeleton";
export { Dialog, type DialogProps } from "./components/Dialog";

// Utilitaire
export { cx } from "./utils/cx";

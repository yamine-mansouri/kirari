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

// Composants — socle
export { Button, type ButtonProps, type ButtonVariant, type ButtonSize } from "./components/Button";
export { Card, type CardProps, type CardVariant } from "./components/Card";
export { Field, type FieldProps } from "./components/Field";
export { Badge, type BadgeProps, type BadgeTone } from "./components/Badge";
export { Skeleton, type SkeletonProps } from "./components/Skeleton";
export { Dialog, type DialogProps } from "./components/Dialog";

// Composants — ancrés. Tous bâtis sur le même socle de positionnement.
export {
  Popover,
  PopoverParts,
  type PopoverProps,
  type PopoverSide,
  type PopoverAlign,
} from "./components/Popover";
export { Tooltip, TooltipProvider, TooltipParts, type TooltipProps } from "./components/Tooltip";
export {
  Menu,
  MenuItem,
  MenuSeparator,
  MenuLabel,
  Submenu,
  ContextMenu,
  MenuParts,
  ContextMenuParts,
  type MenuProps,
  type MenuItemProps,
  type SubmenuProps,
  type ContextMenuProps,
} from "./components/Menu";
export { Select, SelectParts, type SelectProps, type SelectOption } from "./components/Select";
export {
  Combobox,
  ComboboxParts,
  type ComboboxProps,
  type ComboboxOption,
} from "./components/Combobox";

// Composants — contrôles de formulaire
export { Switch, type SwitchProps, type SwitchSize } from "./components/Switch";
export { Checkbox, CheckboxGroup, CheckboxParts, type CheckboxProps } from "./components/Checkbox";
export { Radio, RadioGroup, RadioParts, type RadioProps } from "./components/Radio";
export { Slider, SliderParts, type SliderProps } from "./components/Slider";
export { NumberField, NumberFieldParts, type NumberFieldProps } from "./components/NumberField";
export { OtpField, OtpFieldParts, type OtpFieldProps } from "./components/OtpField";
export {
  ToggleGroup,
  Toggle,
  type ToggleGroupProps,
  type ToggleOption,
} from "./components/ToggleGroup";

// Composants — navigation et divulgation
export { Tabs, TabsParts, type TabsProps, type TabItem } from "./components/Tabs";
export {
  Accordion,
  Collapsible,
  AccordionParts,
  CollapsibleParts,
  type AccordionProps,
  type AccordionItem,
  type CollapsibleProps,
} from "./components/Accordion";
export { Drawer, DrawerParts, type DrawerProps, type DrawerSide } from "./components/Drawer";
export { Separator, type SeparatorProps } from "./components/Separator";
export { Breadcrumb, type BreadcrumbProps, type Crumb } from "./components/Breadcrumb";

// Composants — retour et affichage
export {
  ToastProvider,
  ToastParts,
  useToast,
  type ToastProviderProps,
  type ToastTone,
} from "./components/Toast";
export { Alert, type AlertProps, type AlertTone } from "./components/Alert";
export {
  Avatar,
  AvatarGroup,
  AvatarParts,
  type AvatarProps,
  type AvatarSize,
  type AvatarGroupProps,
} from "./components/Avatar";
export { Progress, ProgressParts, type ProgressProps } from "./components/Progress";
export { EmptyState, type EmptyStateProps } from "./components/EmptyState";
export { Stat, type StatProps, type StatTrend } from "./components/Stat";
export { Stepper, type StepperProps, type Step } from "./components/Stepper";
export { Kbd, type KbdProps } from "./components/Kbd";
export { Table, type TableProps, type Column, type SortDirection } from "./components/Table";
export { Pagination, type PaginationProps } from "./components/Pagination";

// Couche expressive — décorative, jamais posée par défaut par un composant.
export { Sparkle, type SparkleProps } from "./components/Sparkle";

// Styles partagés — pour construire un composant ancré hors de Kirari.
export { POPUP_SURFACE, POPUP_BOUNDS, POPUP_ITEM, POPUP_ARROW } from "./styles/popup";

// Utilitaire
export { cx } from "./utils/cx";

import type { HTMLAttributes } from "react";
import { cx } from "../utils/cx";

export interface KbdProps extends HTMLAttributes<HTMLElement> {
  /** Raccourci sous forme de chaîne : "Cmd+K" devient deux touches. */
  keys?: string;
}

/** Les symboles usuels, pour ne pas écrire « Cmd » en toutes lettres. */
const SYMBOL: Record<string, string> = {
  cmd: "⌘", meta: "⌘", ctrl: "⌃", control: "⌃",
  alt: "⌥", option: "⌥", shift: "⇧", enter: "↵", return: "↵",
  esc: "Esc", escape: "Esc", tab: "⇥", backspace: "⌫", delete: "⌦",
  up: "↑", down: "↓", left: "←", right: "→", space: "␣",
};

const KEY = cx(
  "inline-flex min-w-[1.5em] items-center justify-center rounded-xs px-1.5 py-0.5",
  "border border-line-strong border-b-2 bg-surface",
  "font-mono text-[0.6875rem] leading-none font-medium text-ink-muted",
);

/**
 * Touche de clavier.
 *
 * Dix lignes de CSS qui changent la perception de finition d'une
 * documentation. La bordure basse plus épaisse suffit à évoquer le relief —
 * une ombre portée ferait flotter la touche au lieu de l'enfoncer.
 */
export function Kbd({ keys, className, children, ...rest }: KbdProps) {
  if (keys === undefined) {
    return <kbd {...rest} className={cx(KEY, className)}>{children}</kbd>;
  }

  const parts = keys.split("+").map((k) => k.trim());

  return (
    <span {...rest} className={cx("inline-flex items-center gap-1", className)}>
      {parts.map((part, index) => (
        <kbd key={`${part}-${index}`} className={KEY}>
          {SYMBOL[part.toLowerCase()] ?? part}
        </kbd>
      ))}
    </span>
  );
}

import { tv, type VariantProps } from "tailwind-variants";
import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../utils/cx";

const alert = tv({
  slots: {
    root: "flex gap-3 rounded-lg border p-4 text-sm",
    icon: "mt-px size-4 shrink-0",
    title: "font-medium",
    body: "text-ink-muted",
  },
  variants: {
    tone: {
      info: { root: "border-accent/25 bg-accent-subtle", icon: "text-accent", title: "text-accent-text" },
      success: { root: "border-success/25 bg-success-subtle", icon: "text-success-text", title: "text-success-text" },
      warning: { root: "border-warning/25 bg-warning-subtle", icon: "text-warning-text", title: "text-warning-text" },
      danger: { root: "border-danger/25 bg-danger-subtle", icon: "text-danger-text", title: "text-danger-text" },
    },
  },
  defaultVariants: { tone: "info" },
});

type AlertVariants = VariantProps<typeof alert>;
export type AlertTone = NonNullable<AlertVariants["tone"]>;

/** Une icône par tonalité, en chemins statiques — Tailwind ne lit que du littéral. */
const ICON: Record<AlertTone, ReactNode> = {
  info: <path d="M8 7.5v4M8 4.6v.1" strokeLinecap="round" />,
  success: <path d="M4.5 8.5L7 11l4.5-5" strokeLinecap="round" strokeLinejoin="round" />,
  warning: <path d="M8 5v4M8 11.4v.1" strokeLinecap="round" />,
  danger: <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" strokeLinecap="round" />,
};

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "title">, AlertVariants {
  title?: ReactNode;
  /** Action à droite — un bouton, un lien. */
  action?: ReactNode;
}

/**
 * Message contextuel, dans le flux de la page.
 *
 * **Alert ou Toast ?** Une Alert décrit un état persistant et reste lisible
 * tant qu'il dure. Un Toast annonce qu'une action vient d'aboutir, puis
 * disparaît. Un message qu'on doit pouvoir relire n'est jamais un Toast.
 *
 * `role="alert"` est réservé aux tonalités `warning` et `danger` : il
 * interrompt le lecteur d'écran, ce qui ne se justifie pas pour une
 * information neutre.
 */
export function Alert({ tone = "info", title, action, className, children, ...rest }: AlertProps) {
  const styles = alert({ tone });
  const urgent = tone === "warning" || tone === "danger";

  return (
    <div
      {...rest}
      role={urgent ? "alert" : "status"}
      className={cx(styles.root(), className)}
    >
      <svg viewBox="0 0 16 16" className={styles.icon()} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <circle cx="8" cy="8" r="6.4" opacity="0.35" />
        {ICON[tone]}
      </svg>

      <div className="min-w-0 flex-1">
        {title !== undefined && <div className={styles.title()}>{title}</div>}
        {children !== undefined && <div className={styles.body()}>{children}</div>}
      </div>

      {action !== undefined && <div className="shrink-0">{action}</div>}
    </div>
  );
}

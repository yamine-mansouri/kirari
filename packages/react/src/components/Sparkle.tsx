import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { cx } from "../utils/cx";

/**
 * Constellation fixe, et non tirée au hasard.
 *
 * Un `Math.random()` au rendu produirait des positions différentes sur le
 * serveur et sur le client : React signalerait une divergence d'hydratation, et
 * les étincelles sauteraient au premier rendu. Une constellation figée règle le
 * problème et donne en prime une composition contrôlée plutôt que des points
 * qui se chevauchent parfois.
 *
 * Les valeurs sont en pourcentage de la boîte, avec un décalage temporel pour
 * que les éclats ne battent pas à l'unisson.
 */
const CONSTELLATION = [
  { top: "-6%", left: "12%", size: 10, delay: "0s" },
  { top: "18%", left: "96%", size: 7, delay: "0.45s" },
  { top: "78%", left: "-4%", size: 8, delay: "0.9s" },
  { top: "96%", left: "72%", size: 6, delay: "1.3s" },
  { top: "-2%", left: "82%", size: 5, delay: "0.65s" },
  { top: "52%", left: "102%", size: 6, delay: "1.6s" },
] as const;

export interface SparkleProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  /** Nombre d'éclats, de 1 à 6. */
  count?: number;
  /** Couleur des éclats. Par défaut l'accent du thème. */
  color?: string;
  /** Suspend les éclats tant que le parent n'est pas survolé. */
  onHoverOnly?: boolean;
}

/**
 * Enveloppe décorative : de petits éclats scintillent autour du contenu.
 *
 * À réserver aux moments qui méritent d'être fêtés — une réussite, une
 * nouveauté, l'élément d'un écran qu'on veut faire remarquer. En mettre
 * partout annule l'effet : c'est la rareté qui le fait fonctionner.
 *
 * Purement décoratif : `aria-hidden`, aucun contenu annoncé, et neutralisé
 * sous `prefers-reduced-motion` par la règle globale du système.
 */
export function Sparkle({
  children,
  count = 4,
  color,
  onHoverOnly = false,
  className,
  ...rest
}: SparkleProps) {
  return (
    <span {...rest} className={cx("group/sparkle relative inline-flex", className)}>
      {children}

      {CONSTELLATION.slice(0, Math.min(Math.max(count, 1), CONSTELLATION.length)).map(
        (star, index) => (
          <span
            key={index}
            aria-hidden="true"
            className={cx(
              "pointer-events-none absolute -translate-x-1/2 -translate-y-1/2",
              onHoverOnly
                ? "opacity-0 group-hover/sparkle:animate-twinkle"
                : "animate-twinkle",
            )}
            style={
              {
                top: star.top,
                left: star.left,
                width: star.size,
                height: star.size,
                animationDelay: star.delay,
                color: color ?? "var(--k-accent)",
              } as CSSProperties
            }
          >
            {/* Une étoile à quatre branches aux flancs concaves : c'est la
                courbure qui lit « éclat » plutôt que « croix ». */}
            <svg viewBox="0 0 24 24" className="size-full" fill="currentColor">
              <path d="M12 0c.6 6.4 5 10.8 12 12-7 1.2-11.4 5.6-12 12-.6-6.4-5-10.8-12-12C7 10.8 11.4 6.4 12 0z" />
            </svg>
          </span>
        ),
      )}
    </span>
  );
}

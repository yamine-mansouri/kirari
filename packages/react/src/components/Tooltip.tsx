import { Tooltip as Base } from "@base-ui/react/tooltip";
import type { ReactNode } from "react";
import { cx } from "../utils/cx";
import { POPUP_ARROW } from "../styles/popup";

export interface TooltipProps {
  /** L'élément survolé. Rendu tel quel. */
  children: ReactNode;
  content: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  arrow?: boolean;
  /**
   * Délai avant ouverture, en millisecondes.
   *
   * Porté par le déclencheur et non par la racine : à l'intérieur d'un
   * `TooltipProvider`, c'est le délai partagé du groupe qui prend le relais
   * après la première ouverture.
   */
  delay?: number;
  /**
   * Délai avant fermeture, en millisecondes. Utile quand l'infobulle contient
   * un lien : il laisse le temps d'y amener le pointeur.
   */
  closeDelay?: number;
  className?: string;
}

/**
 * Infobulle au survol et au focus clavier.
 *
 * **Le composant, c'est le timing, pas l'animation.**
 *
 * Le délai par défaut est de 300 ms, contre 600 chez Base UI et 700 chez
 * Radix. Ces défauts-là viennent des infobulles de bureau, verbeuses, qui
 * *complétaient* un contrôle déjà nommé : mieux valait attendre que faire du
 * bruit.
 *
 * L'usage dominant aujourd'hui est inverse — un bouton à icône seule, dont
 * l'infobulle porte le **nom** du contrôle. L'utilisateur ne subit pas
 * l'infobulle, il la demande : « c'est quoi, ce bouton ? ». Le faire attendre
 * une demi-seconde donne l'impression que l'interface retient l'information.
 *
 * 300 ms suffit à filtrer un pointeur qui ne fait que passer — un survol
 * intentionnel dure plus longtemps que ça — sans se faire sentir. Dans une
 * barre d'outils, envelopper le groupe dans `TooltipProvider` : la première
 * infobulle attend, les suivantes s'ouvrent instantanément.
 *
 * **Jamais pour une information indispensable.** Une infobulle est invisible
 * au tactile et à la lecture d'écran séquentielle. Ce qui doit être compris
 * appartient au label.
 */
export function Tooltip({
  children,
  content,
  side = "top",
  align = "center",
  sideOffset = 6,
  arrow = false,
  delay = 300,
  closeDelay,
  className,
}: TooltipProps) {
  return (
    <Base.Root>
      <Base.Trigger delay={delay} closeDelay={closeDelay} render={<span className="inline-flex" />}>
        {children}
      </Base.Trigger>
      <Base.Portal>
        <Base.Positioner side={side} align={align} sideOffset={sideOffset}>
          <Base.Popup
            className={cx(
              "max-w-64 rounded-md bg-ink px-2.5 py-1.5 text-xs text-bg shadow-md",
              "origin-(--transform-origin)",
              "data-open:animate-popup-in data-closed:animate-popup-out",
              className,
            )}
          >
            {arrow && <Base.Arrow className={cx(POPUP_ARROW, "border-ink bg-ink")} />}
            {content}
          </Base.Popup>
        </Base.Positioner>
      </Base.Portal>
    </Base.Root>
  );
}

/**
 * Partage le délai de grâce entre plusieurs infobulles.
 *
 * À l'intérieur, passer d'une cible à l'autre ouvre la suivante sans attendre
 * — le comportement attendu dans une barre d'outils.
 */
export const TooltipProvider = Base.Provider;

/** Les parties brutes. */
export const TooltipParts = Base;

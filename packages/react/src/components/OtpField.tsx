import { OTPField as Base } from "@base-ui/react/otp-field";
import type { ComponentPropsWithoutRef } from "react";
import { cx } from "../utils/cx";

export interface OtpFieldProps
  extends Omit<ComponentPropsWithoutRef<typeof Base.Root>, "render" | "children" | "length"> {
  /** Nombre de cases. */
  length?: number;
  /** Insère un séparateur au milieu. Facilite la lecture d'un code long. */
  grouped?: boolean;
  className?: string;
}

/**
 * Saisie d'un code à usage unique.
 *
 * Pénible à écrire soi-même, et Base UI le fournit : le collage se répartit
 * sur toutes les cases, la touche Retour recule d'une case, les flèches
 * naviguent, et l'autocomplétion SMS du navigateur fonctionne.
 *
 * Chaque case remplie répond par une micro-réaction — l'anneau d'accent
 * apparaît en `ease-swift` sur 0.2 s. C'est court exprès : sur une saisie
 * rapide, une animation plus longue s'accumulerait en bouillie visuelle.
 */
export function OtpField({ length = 6, grouped = false, className, ...rest }: OtpFieldProps) {
  const middle = Math.floor(length / 2);

  return (
    <Base.Root {...rest} length={length} className={cx("flex items-center gap-2", className)}>
      {Array.from({ length }, (_, index) => (
        <span key={index} className="contents">
          {grouped && index === middle && (
            <Base.Separator className="mx-1 h-px w-2.5 bg-line-strong" />
          )}
          {/* Pas de prop `index` : Base UI déduit la position de chaque case
              de son ordre de rendu. */}
          <Base.Input
            className={cx(
              "size-11 rounded-md border border-line bg-surface text-center text-lg font-medium text-ink tabular-nums",
              "outline-none transition-[border-color,box-shadow] duration-(--k-dur-1) ease-swift",
              "ring-0 ring-accent/25",
              "data-filled:border-accent data-filled:ring-4",
              "focus:border-accent focus:ring-4",
              "data-disabled:bg-surface-sunken data-disabled:opacity-55",
            )}
          />
        </span>
      ))}
    </Base.Root>
  );
}

export const OtpFieldParts = Base;

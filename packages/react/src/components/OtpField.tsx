import { OTPField as Base } from "@base-ui/react/otp-field";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { useId } from "react";
import { cx } from "../utils/cx";

export interface OtpFieldProps
  extends Omit<ComponentPropsWithoutRef<typeof Base.Root>, "render" | "children" | "length"> {
  /** Nombre de cases. */
  length?: number;
  /** Insère un séparateur au milieu. Facilite la lecture d'un code long. */
  grouped?: boolean;
  /**
   * Libellé du champ, obligatoire pour l'accessibilité.
   *
   * Chaque case est un `<input>` : sans nom accessible, un lecteur d'écran
   * annonce six champs anonymes. Base UI relie l'ensemble au libellé via
   * `inputAriaLabelledBy`.
   */
  label?: ReactNode;
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
export function OtpField({ length = 6, grouped = false, label, className, ...rest }: OtpFieldProps) {
  const middle = Math.floor(length / 2);
  const generatedId = useId();
  const labelId = `k-otp-${generatedId}`;

  return (
    <div className="flex flex-col gap-2">
      {label !== undefined && (
        <span id={labelId} className="text-label-md text-ink">
          {label}
        </span>
      )}
      <Base.Root
        {...rest}
        length={length}
        role="group"
        aria-labelledby={label !== undefined ? labelId : undefined}
        className={cx("flex items-center gap-2", className)}
      >
      {Array.from({ length }, (_, index) => (
        <span key={index} className="contents">
          {grouped && index === middle && (
            <Base.Separator className="mx-1 h-px w-2.5 bg-line-strong" />
          )}
          {/* Pas de prop `index` : Base UI déduit la position de chaque case
              de son ordre de rendu.

              Chaque case est nommée individuellement plutôt que par un libellé
              partagé : un lecteur d'écran annonce alors « Chiffre 3 sur 6 »
              au lieu de six champs indiscernables. */}
          <Base.Input
            aria-label={`Chiffre ${index + 1} sur ${length}`}
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
    </div>
  );
}

export const OtpFieldParts = Base;

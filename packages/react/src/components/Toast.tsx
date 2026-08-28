import { Toast as Base } from "@base-ui/react/toast";
import type { ReactNode } from "react";
import { cx } from "../utils/cx";

export type ToastTone = "neutral" | "success" | "warning" | "danger";

const TONE_BAR: Record<ToastTone, string> = {
  neutral: "bg-accent",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};

/**
 * Rend la pile de toasts. Séparé du Provider pour vivre dans le portail, où
 * `useToastManager` a accès au contexte.
 *
 * ── Pourquoi des transitions et non des animations ────────────────────────
 *
 * Une pile de toasts bouge en permanence : un toast arrive pendant qu'un autre
 * part, la pile se déplie au survol, un geste de balayage peut s'interrompre.
 * Une animation se rejoue depuis le début à chaque changement ; une transition
 * s'interrompt et repart de la position courante. C'est la seule des deux qui
 * tient sur un empilement vivant — et c'est ce que Base UI attend.
 *
 * La règle des deux courbes est préservée autrement : la transition par défaut
 * utilise `ease-enter`, et `data-ending-style` bascule sur `ease-exit`, plus
 * court.
 *
 * ── L'empilement ──────────────────────────────────────────────────────────
 *
 * `--toast-index` est le rang dans la pile (0 = devant). Replié, chaque toast
 * recule de 22 % de sa hauteur et se réduit de 8 % par rang. Déplié — au
 * survol ou au focus — `--toast-offset-y` donne le décalage réel, et les
 * toasts reprennent leur taille.
 */
function ToastList() {
  const { toasts } = Base.useToastManager();

  return toasts.map((toast) => {
    const tone = ((toast.data as { tone?: ToastTone } | undefined)?.tone ??
      "neutral") as ToastTone;

    return (
      <Base.Root
        key={toast.id}
        toast={toast}
        className={cx(
          "absolute right-0 bottom-0 left-auto w-full",
          // Le toast de devant passe au-dessus des suivants.
          "[z-index:calc(1000-var(--toast-index))]",
          // Tous prennent la hauteur du toast de devant : la pile est nette.
          "[height:var(--toast-frontmost-height,var(--toast-height))]",
          // Pile repliée.
          "[transform:scale(calc(max(0,1-(var(--toast-index)*0.08))))_translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)+(var(--toast-index)*-22%)))]",
          // Pile dépliée : taille réelle, décalage mesuré.
          "data-expanded:[transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)+var(--toast-offset-y)))]",
          "transition-[transform,opacity] duration-(--k-dur-4) ease-enter",
          // Entrée : depuis le bord bas.
          "data-starting-style:translate-y-full data-starting-style:opacity-0",
          // Sortie : glisse de côté, plus vite, sur l'autre courbe.
          "data-ending-style:translate-x-[60%] data-ending-style:opacity-0",
          "data-ending-style:duration-(--k-dur-2) data-ending-style:ease-exit",
          // Pendant un balayage, le toast suit le doigt sans latence.
          "data-swiping:transition-none",
        )}
      >
        <Base.Content
          className={cx(
            "relative flex items-start gap-3 overflow-hidden rounded-lg border border-line",
            "bg-surface-raised py-3 pr-3 pl-5 shadow-lg",
            // Replié, seul le contenu de devant est lisible : les suivants
            // ne sont qu'une épaisseur de pile.
            "opacity-100 transition-opacity duration-(--k-dur-3) ease-enter",
            "data-behind:opacity-0 data-expanded:opacity-100",
          )}
        >
          {/* Bandeau de tonalité : la couleur accélère la lecture, le texte
              la porte — elle n'est jamais le seul signal. */}
          <span
            aria-hidden="true"
            className={cx("absolute inset-y-0 left-0 w-1", TONE_BAR[tone])}
          />

          <div className="min-w-0 flex-1">
            <Base.Title className="text-sm font-medium text-ink" />
            <Base.Description className="mt-0.5 text-sm text-ink-muted" />
          </div>

          <Base.Close
            aria-label="Fermer"
            className={cx(
              "-mt-0.5 -mr-0.5 shrink-0 cursor-pointer rounded-sm p-1 text-ink-subtle",
              "transition-colors duration-(--k-dur-1) ease-swift hover:text-ink",
            )}
          >
            <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
            </svg>
          </Base.Close>
        </Base.Content>
      </Base.Root>
    );
  });
}

export interface ToastProviderProps {
  children: ReactNode;
  /** Nombre de toasts visibles simultanément. Au-delà, ils s'empilent dessous. */
  limit?: number;
  /** Durée avant disparition, en millisecondes. `0` désactive l'expiration. */
  timeout?: number;
}

/**
 * À poser une fois, à la racine de l'application.
 *
 * Le survol ou le focus de la pile suspend l'expiration de tous les toasts et
 * les déplie — sans quoi un message disparaîtrait pendant qu'on le lit.
 */
export function ToastProvider({ children, limit = 3, timeout = 5000 }: ToastProviderProps) {
  return (
    <Base.Provider limit={limit} timeout={timeout}>
      {children}
      <Base.Portal>
        <Base.Viewport
          className={cx(
            "fixed right-4 bottom-4 z-700 flex w-[min(22rem,calc(100vw-2rem))] items-end",
            // La zone garde la hauteur du toast de devant : la pile ne fait
            // pas sauter la mise en page quand elle grandit.
            "h-(--toast-frontmost-height)",
            "transition-[height] duration-(--k-dur-3) ease-enter",
          )}
        >
          <ToastList />
        </Base.Viewport>
      </Base.Portal>
    </Base.Provider>
  );
}

/**
 * Ouvre un toast depuis n'importe quel composant sous le Provider.
 *
 *   const toast = useToast();
 *   toast.add({ title: "Enregistré", data: { tone: "success" } });
 */
export const useToast = Base.useToastManager;

/** Les parties brutes, pour une mise en scène que l'API par défaut ne couvre pas. */
export const ToastParts = Base;

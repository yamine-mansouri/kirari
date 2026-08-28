import { createContext, useContext, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { cx } from "../utils/cx";

/**
 * Outillage des pages « Fantaisie ».
 *
 * Interne aux stories — non exporté par le paquet, et absent du bundle
 * puisque tsup ne construit que ce qui part de `index.ts`.
 */

/* ── Ralenti ────────────────────────────────────────────────────────────
 *
 * Tout le système lit ses durées dans `--k-dur-*`. Il suffit donc de
 * redéfinir ces variables sur un conteneur pour ralentir *tout* ce qu'il
 * contient — animations, transitions, séquençage — sans toucher à une seule
 * ligne de composant.
 *
 * C'est aussi la meilleure démonstration de l'intérêt des tokens : une
 * fonctionnalité de vitrine qu'on n'a pas eu à construire.
 */
const BASE_DURATIONS: Record<string, number> = {
  "--k-dur-1": 0.2,
  "--k-dur-2": 0.3,
  "--k-dur-3": 0.4,
  "--k-dur-4": 0.6,
  "--k-dur-5": 0.8,
  "--k-dur-6": 1,
  "--k-dur-ambient-1": 2,
  "--k-dur-ambient-2": 4,
  "--k-dur-ambient-3": 7,
  "--k-stagger": 0.08,
};

function slowdown(factor: number): CSSProperties {
  if (factor === 1) return {};
  return Object.fromEntries(
    Object.entries(BASE_DURATIONS).map(([name, seconds]) => [name, `${seconds * factor}s`]),
  ) as CSSProperties;
}

const RunContext = createContext(0);

/** Rejoue la page entière. Utile après avoir changé la vitesse. */
export function useRun(): number {
  return useContext(RunContext);
}

/* ── Spécimen ───────────────────────────────────────────────────────── */

const REPLAY_ICON = (
  <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.7">
    <path d="M13 8a5 5 0 11-1.6-3.7" strokeLinecap="round" />
    <path d="M13.2 2.6v2.6h-2.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export interface SpecimenProps {
  title: string;
  note: string;
  code: string;
  /**
   * Contenu du spécimen. En recevant le compteur de lectures, il peut
   * s'en servir comme `key` : remonter l'élément est ce qui redéclenche une
   * animation CSS, sans manipuler le moindre style.
   */
  children: ReactNode | ((run: number) => ReactNode);
  /**
   * Ajoute un bouton « rejouer ». À poser sur les spécimens dont l'effet se
   * joue à l'apparition — ceux déclenchés au survol ou au clic se rejouent
   * déjà tout seuls.
   */
  replayable?: boolean;
}

export function Specimen({ title, note, code, children, replayable = false }: SpecimenProps) {
  const pageRun = useRun();
  const [localRun, setLocalRun] = useState(0);
  const run = pageRun * 1000 + localRun;

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-line bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-bold tracking-tight text-ink">{title}</h3>
          <p className="mt-0.5 text-xs text-ink-muted">{note}</p>
        </div>

        {replayable && (
          <button
            type="button"
            onClick={() => setLocalRun((n) => n + 1)}
            aria-label={`Rejouer « ${title} »`}
            className={cx(
              "flex shrink-0 cursor-pointer items-center gap-1 rounded-md border border-line px-2 py-1",
              "text-[0.68rem] font-medium text-ink-muted",
              "transition-colors duration-(--k-dur-1) ease-swift",
              "hover:border-line-strong hover:text-ink",
            )}
          >
            {REPLAY_ICON}
            Rejouer
          </button>
        )}
      </div>

      {/* `min-w-0` sur la scène et `max-w-full` sur son contenu : sans cela,
          `place-items-center` laisse l'enfant prendre sa largeur intrinsèque,
          et un tableau large déborde de la carte au lieu de défiler dans son
          propre conteneur. */}
      <div className="grid min-h-24 min-w-0 place-items-center rounded-md bg-surface-sunken p-6 [&>*]:max-w-full [&>*]:min-w-0">
        {typeof children === "function" ? children(run) : children}
      </div>

      {/* `tabIndex={0}` : un bloc qui défile horizontalement doit être
          atteignable au clavier, sinon la fin d'une ligne longue est
          inaccessible sans souris. */}
      <pre tabIndex={0} className="overflow-x-auto rounded-sm bg-surface-sunken px-3 py-2 font-mono text-[0.68rem] leading-relaxed text-ink-muted">
        {code}
      </pre>
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────────────── */

const SPEEDS: Array<{ label: string; factor: number }> = [
  { label: "1×", factor: 1 },
  { label: "¼×", factor: 4 },
  { label: "⅒×", factor: 10 },
];

export interface FantaisiePageProps {
  children: ReactNode;
  /** Le paragraphe d'introduction, propre à chaque composant. */
  intro: ReactNode;
}

/**
 * Chapeau d'une page Fantaisie : le rappel de ce qu'elle est, la barre de
 * vitesse et le bouton « tout rejouer ».
 */
export function FantaisiePage({ children, intro }: FantaisiePageProps) {
  const [factor, setFactor] = useState(1);
  const [run, setRun] = useState(0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 border-l-2 border-accent pl-4">
        <p className="max-w-[64ch] text-sm text-ink-muted">{intro}</p>
        <p className="max-w-[64ch] text-xs text-ink-subtle">
          Aucun de ces états n'est un défaut du composant. Ce sont des pistes à
          convoquer sur le seul élément d'un écran qui mérite d'être remarqué —
          appliquée partout, la fantaisie devient du bruit.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-line bg-surface px-4 py-2.5">
        <span className="text-xs font-medium text-ink-subtle">Vitesse</span>
        <div className="flex gap-1">
          {SPEEDS.map((speed) => (
            <button
              key={speed.label}
              type="button"
              onClick={() => {
                setFactor(speed.factor);
                setRun((n) => n + 1);
              }}
              className={cx(
                "cursor-pointer rounded-md px-2.5 py-1 text-xs font-medium tabular-nums",
                "transition-colors duration-(--k-dur-1) ease-swift",
                factor === speed.factor
                  ? "bg-accent text-on-accent"
                  : "text-ink-muted hover:bg-surface-sunken hover:text-ink",
              )}
            >
              {speed.label}
            </button>
          ))}
        </div>

        <span className="ml-auto text-xs text-ink-subtle">
          Le ralenti redéfinit simplement les tokens <code>--k-dur-*</code> sur
          cette zone.
        </span>

        <button
          type="button"
          onClick={() => setRun((n) => n + 1)}
          className={cx(
            "flex cursor-pointer items-center gap-1.5 rounded-md border border-line px-2.5 py-1",
            "text-xs font-medium text-ink-muted",
            "transition-colors duration-(--k-dur-1) ease-swift",
            "hover:border-line-strong hover:text-ink",
          )}
        >
          {REPLAY_ICON}
          Tout rejouer
        </button>
      </div>

      <RunContext.Provider value={run}>
        <div style={slowdown(factor)}>{children}</div>
      </RunContext.Provider>
    </div>
  );
}

/**
 * Grille des spécimens.
 *
 * `wide` élargit les colonnes pour les composants qui ont besoin de place —
 * un tableau ou un parcours d'étapes ne se lit pas dans 19 rem.
 */
export function SpecimenGrid({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return (
    <div
      className={cx(
        "grid gap-4",
        wide
          ? "grid-cols-[repeat(auto-fill,minmax(32rem,1fr))]"
          : "grid-cols-[repeat(auto-fill,minmax(19rem,1fr))]",
      )}
    >
      {children}
    </div>
  );
}

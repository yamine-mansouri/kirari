import type { Meta, StoryObj } from "@storybook/react-vite";
import { ToastProvider, useToast, type ToastTone } from "./Toast";
import { Button } from "./Button";
import { FantaisiePage, Specimen, SpecimenGrid } from "./fantaisie-specimen";

const meta = {
  title: "Composants/Toast",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "Notification transitoire, empilée en bas à droite.",
          "",
          "**Toast ou Alert ?** Un Toast est transitoire et flotte au-dessus de",
          "la page — il annonce qu'une action a abouti. Une Alert reste dans le",
          "flux et décrit un état persistant. Un message qu'on doit pouvoir",
          "relire n'est pas un Toast.",
          "",
          "L'empilement repose sur les variables que Base UI calcule par toast :",
          "`--toast-index` (rang dans la pile) et `--toast-offset-y` (décalage",
          "cumulé). Kirari les combine en accordéon — le toast de devant est à",
          "pleine taille, ceux de derrière reculent et se réduisent.",
          "",
          "Survoler la pile suspend l'expiration de tous les toasts, et les",
          "déplie. Sans cela, un message disparaîtrait pendant qu'on le lit.",
        ].join("\n"),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const TONES: Array<{ tone: ToastTone; label: string; title: string; description: string }> = [
  { tone: "neutral", label: "Neutre", title: "Brouillon enregistré", description: "Vos modifications sont sauvegardées." },
  { tone: "success", label: "Succès", title: "Document publié", description: "Il est désormais visible par votre équipe." },
  { tone: "warning", label: "Avertissement", title: "Quota bientôt atteint", description: "Il vous reste 12 % d'espace disponible." },
  { tone: "danger", label: "Erreur", title: "Échec de l'envoi", description: "Vérifiez votre connexion, puis réessayez." },
];

function Demo({ timeout }: { timeout?: number }) {
  const toast = useToast();

  return (
    <div className="flex flex-col gap-6">
      <p className="max-w-[62ch] text-sm text-ink-muted">
        En ouvrir plusieurs d'affilée pour voir la pile se former, puis la
        survoler : l'expiration se suspend et les toasts se déplient.
      </p>
      <div className="flex flex-wrap gap-3">
        {TONES.map((t) => (
          <Button
            key={t.tone}
            size="sm"
            variant={t.tone === "neutral" ? "solid" : "outline"}
            onClick={() =>
              toast.add({
                title: t.title,
                description: t.description,
                timeout,
                data: { tone: t.tone },
              })
            }
          >
            {t.label}
          </Button>
        ))}
        <Button
          size="sm"
          variant="ghost"
          onClick={() =>
            TONES.forEach((t, i) =>
              setTimeout(
                () => toast.add({ title: t.title, description: t.description, data: { tone: t.tone } }),
                i * 220,
              ),
            )
          }
        >
          En envoyer quatre
        </Button>
      </div>
    </div>
  );
}

/** Ouvre un toast unique — hôte des spécimens Fantaisie. */
function ToastButton({
  label,
  toast,
}: {
  label: string;
  toast: { title: string; description?: string; data?: { tone?: ToastTone } };
}) {
  const manager = useToast();
  return (
    <Button size="sm" variant="outline" onClick={() => manager.add(toast)}>
      {label}
    </Button>
  );
}

/** Empile quatre toasts d'affilée, pour observer la pile se former. */
function ToastBurst() {
  const manager = useToast();
  return (
    <Button
      size="sm"
      onClick={() =>
        TONES.forEach((t, i) =>
          setTimeout(
            () => manager.add({ title: t.title, description: t.description, data: { tone: t.tone } }),
            i * 220,
          ),
        )
      }
    >
      En envoyer quatre
    </Button>
  );
}

export const Playground: Story = {
  render: () => (
    <ToastProvider>
      <Demo />
    </ToastProvider>
  ),
};

/** Les quatre tonalités. Le bandeau accélère la lecture, le texte la porte. */
export const Tonalites: Story = {
  name: "Tonalités",
  render: () => (
    <ToastProvider timeout={0}>
      <Demo timeout={0} />
      <p className="mt-6 max-w-[62ch] text-xs text-ink-subtle">
        Ici <code>timeout=0</code> : les toasts ne disparaissent pas, pour
        pouvoir les comparer. En usage réel, le défaut est de 5 secondes.
      </p>
    </ToastProvider>
  ),
};

/**
 * L'entrée dépasse en `ease-bounce` depuis le bas ; la sortie glisse vers la
 * droite en `ease-exit`. Deux gestes distincts — dans une pile qui bouge,
 * l'arrivée et le départ ne doivent pas se confondre.
 */
export const Mouvement: Story = {
  render: () => (
    <ToastProvider timeout={2200}>
      <Demo timeout={2200} />
    </ToastProvider>
  ),
};

export const Fantaisie: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <FantaisiePage intro={<>Le toast est déjà le composant le plus animé du système. La fantaisie y consiste donc surtout à changer sa forme et sa tonalité — le mouvement, lui, est déjà chargé.</>}>
      <SpecimenGrid>
        <Specimen
          title="Toast en galet"
          note="Rayon plein, sans ombre. Le message devient une pastille posée plutôt qu'une fenêtre système."
          code={'<Toast className="rounded-full" />'}
        >
          <ToastProvider>
            <ToastButton
              label="Pastille"
              toast={{ title: "Enregistré", data: { tone: "success" } }}
            />
          </ToastProvider>
        </Specimen>

        <Specimen
          title="Réussite fêtée"
          note="Le cas d'usage le plus évident des étincelles : le toast qui annonce une réussite."
          code={'<Sparkle count={5}><Toast /></Sparkle>'}
        >
          <ToastProvider>
            <ToastButton
              label="Célébrer"
              toast={{
                title: "Objectif atteint",
                description: "Toutes vos tâches sont terminées.",
                data: { tone: "success" },
              }}
            />
          </ToastProvider>
        </Specimen>

        <Specimen
          title="Erreur qui tremble"
          note="Un tremblement à l'arrivée d'un toast d'erreur. Une seule fois, jamais en boucle."
          code={'<Toast className="animate-shake" />'}
        >
          <ToastProvider>
            <ToastButton
              label="Échouer"
              toast={{
                title: "Échec de l'envoi",
                description: "Vérifiez votre connexion.",
                data: { tone: "danger" },
              }}
            />
          </ToastProvider>
        </Specimen>

        <Specimen
          title="Pile à observer"
          note="Quatre toasts d'affilée, puis survoler la pile : elle se déplie. C'est le moment le plus riche du système — à regarder au ralenti."
          code={'toast.add(…) ×4'}
        >
          <ToastProvider timeout={0}>
            <ToastBurst />
          </ToastProvider>
        </Specimen>
      </SpecimenGrid>
    </FantaisiePage>
  ),
};

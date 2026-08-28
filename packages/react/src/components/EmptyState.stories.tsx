import type { Meta, StoryObj } from "@storybook/react-vite";
import { EmptyState } from "./EmptyState";
import { Button } from "./Button";
import { Card } from "./Card";
import { Sparkle } from "./Sparkle";
import { FantaisiePage, Specimen, SpecimenGrid } from "./fantaisie-specimen";

const ICON = (
  <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M4 7.5A1.5 1.5 0 015.5 6h4l2 2.5h7A1.5 1.5 0 0120 10v7.5a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 014 17.5z" strokeLinejoin="round" />
  </svg>
);

const meta = {
  title: "Composants/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "État vide.",
          "",
          "Sous-estimé, alors que c'est souvent le **premier** écran qu'un",
          "utilisateur voit : une liste sans contenu, une recherche sans",
          "résultat, un projet qui démarre. Un état vide qui se contente d'un",
          "« Aucun élément » rate l'occasion d'expliquer quoi faire.",
          "",
          "D'où la structure imposée : une raison (`title`), un contexte",
          "(`description`), et une sortie (`action`).",
        ].join("\n"),
      },
    },
  },
  argTypes: { compact: { control: "boolean" } },
  args: {
    title: "Aucun projet pour l'instant",
    description: "Créez votre premier projet pour commencer à travailler.",
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Card variant="sunken" className="p-0">
      <EmptyState {...args} icon={ICON} action={<Button size="sm">Créer un projet</Button>} />
    </Card>
  ),
};

export const Galerie: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-6">
      <Card variant="sunken" className="p-0">
        <EmptyState
          icon={ICON}
          title="Aucun projet pour l'instant"
          description="Créez votre premier projet pour commencer à travailler."
          action={
            <>
              <Button size="sm">Créer un projet</Button>
              <Button size="sm" variant="ghost">Importer</Button>
            </>
          }
        />
      </Card>

      <Card variant="sunken" className="p-0">
        <EmptyState
          title="Aucun résultat"
          description="Essayez d'élargir votre recherche ou de retirer un filtre."
          action={<Button size="sm" variant="outline">Réinitialiser les filtres</Button>}
        />
      </Card>

      <Card variant="sunken" className="p-0">
        <EmptyState compact icon={ICON} title="Rien à afficher" />
      </Card>
    </div>
  ),
};

/**
 * L'état vide est la page la plus vide de l'application — donc celle où un
 * décor a le plus de place, et le moins de risque de gêner.
 */
export const Fantaisie: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <FantaisiePage
      intro={
        <>
          C'est l'endroit le plus légitime pour de la fantaisie : par définition,
                  rien d'autre n'occupe l'écran. C'est aussi souvent le premier écran
                  qu'un utilisateur voit — un vide accueillant vaut mieux qu'un vide
                  administratif.
        </>
      }
    >
      <SpecimenGrid>
        <Specimen
          title="Icône flottante"
          note="L'icône dérive lentement au lieu d'être posée. Suffit à ce que la page ne paraisse pas figée."
          code={`<span className="animate-float">…</span>`}
        >
          <EmptyState
            compact
            icon={<span className="block animate-float text-2xl">🌙</span>}
            title="Rien pour l'instant"
          />
        </Specimen>

        <Specimen
          title="Personnage qui se balance"
          note="Un pivot au bord bas transforme une oscillation en balancement — l'objet est posé, il ne flotte pas."
          code={`<span className="origin-bottom\n  animate-sway">…</span>`}
        >
          <EmptyState
            compact
            icon={<span className="block origin-bottom animate-sway text-2xl">🐕</span>}
            title="Personne ici"
            description="Invitez quelqu'un à vous rejoindre."
          />
        </Specimen>

        <Specimen
          title="Ciel à la dérive"
          note="Deux halos qui bougent très lentement en fond. Le vide devient une atmosphère plutôt qu'une absence."
          code={`<span className="animate-drift\n  blur-3xl bg-accent-subtle" />`}
        >
          <Card variant="sunken" className="relative w-full overflow-hidden p-0">
            <span aria-hidden="true" className="absolute -top-10 left-4 size-28 animate-drift rounded-full bg-accent-subtle blur-3xl" />
            <span aria-hidden="true" className="absolute -bottom-12 right-2 size-24 animate-drift rounded-full bg-accent-2-subtle blur-3xl [animation-delay:3s]" />
            <EmptyState compact title="Boîte vide" description="Un vide qui respire." />
          </Card>
        </Specimen>

        <Specimen
          title="Arrivée en cascade"
          note="L'icône, le titre puis l'action arrivent l'un après l'autre. La page se compose sous les yeux au lieu d'apparaître d'un bloc."
          code={`<div className="k-stagger">\n  <span className="animate-pop-in" />\n</div>`}
          replayable
        >
          {(run) => (
            <div key={run} className="k-stagger flex flex-col items-center gap-2">
              <span className="origin-bottom animate-pop-in text-2xl">📮</span>
              <span className="animate-slide-up text-sm font-medium text-ink">Aucun message</span>
              <span className="animate-slide-up text-xs text-ink-muted">
                Votre boîte est à jour.
              </span>
              <Button size="sm" className="origin-bottom animate-pop-in">
                Écrire
              </Button>
            </div>
          )}
        </Specimen>

        <Specimen
          title="Vide célébré"
          note="Le contrepied : une boîte vide n'est pas toujours un échec. Zéro tâche en retard mérite des étincelles."
          code={`<Sparkle count={6}>…</Sparkle>`}
        >
          <Sparkle count={6}>
            <EmptyState compact icon={<span className="text-2xl">✅</span>} title="Rien en retard" />
          </Sparkle>
        </Specimen>
      </SpecimenGrid>
    </FantaisiePage>
  ),
};

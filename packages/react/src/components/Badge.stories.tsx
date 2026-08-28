import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./Badge";
import { Sparkle } from "./Sparkle";
import { FantaisiePage, Specimen, SpecimenGrid } from "./fantaisie-specimen";

const meta = {
  title: "Composants/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "Pastille de statut, compacte et non interactive. Pour une action,",
          "utiliser un `<Button size=\"sm\">`.",
          "",
          "**Accessibilité :** la couleur ne doit jamais être le seul véhicule",
          "de l'information — le texte du badge doit suffire à comprendre le",
          "statut sans le voir.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    tone: { control: "select", options: ["accent", "neutral", "success", "warning", "danger"] },
    dot: { control: "boolean" },
    live: { control: "boolean" },
    children: { control: "text" },
  },
  args: { children: "Statut", tone: "accent" },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Galerie: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-bold tracking-tight">Tonalités</h3>
        <div className="flex flex-wrap items-center gap-3">
          <Badge>accent</Badge>
          <Badge tone="neutral">neutral</Badge>
          <Badge tone="success">success</Badge>
          <Badge tone="warning">warning</Badge>
          <Badge tone="danger">danger</Badge>
        </div>
      </section>
      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-bold tracking-tight">Avec point</h3>
        <div className="flex flex-wrap items-center gap-3">
          <Badge dot>statique</Badge>
          <Badge tone="success" live>en direct</Badge>
          <Badge tone="danger" live>incident</Badge>
        </div>
        <p className="text-xs text-ink-subtle">
          <code>live</code> fait pulser le point en <code>animate-pulse-soft</code>,
          une boucle d'ambiance de 2s — jamais liée à une interaction.
        </p>
      </section>
    </div>
  ),
};

/** Le badge est petit et déjà rond : c'est le composant le plus naturellement joueur. */
export const Fantaisie: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <FantaisiePage
      intro={
        <>
          Petit, déjà rond, sans fonction cliquable : le badge est l'endroit où la
                  fantaisie coûte le moins cher. C'est aussi celui où elle se remarque le
                  plus, parce qu'un badge est fait pour attirer l'œil.
        </>
      }
    >
      <SpecimenGrid>
        <Specimen
          title="Surgissement"
          note="Le badge apparaît depuis rien avec dépassement. Pour une pastille qui arrive après coup — un compteur de notifications."
          code={`<Badge className="animate-pop-in" />`}
          replayable
        >
          {(run) => (
            <Badge key={run} className="animate-pop-in">
              Nouveau
            </Badge>
          )}
        </Specimen>

        <Specimen
          title="Épinglé de travers"
          note="Posé à 4°, comme une étiquette collée à la main. Statique : rien ne bouge, l'effet vient de l'angle seul."
          code={`<Badge className="rotate-4" />`}
        >
          <div className="relative">
            <Badge tone="warning" className="rotate-4">Édition limitée</Badge>
          </div>
        </Specimen>

        <Specimen
          title="Hochement au survol"
          note="Le badge acquiesce quand on le survole. Suffisant pour signaler qu'il porte une information au survol."
          code={`<Badge className="hover:animate-tick" />`}
        >
          <Badge tone="success" className="hover:animate-tick">Vérifié</Badge>
        </Specimen>

        <Specimen
          title="Gelée à l'apparition"
          note="Une oscillation qui donne de la matière. À réserver au badge qui annonce quelque chose de rare."
          code={`<Badge className="animate-jelly" />`}
          replayable
        >
          {(run) => (
            <Badge key={run} className="animate-jelly">
              Niveau supérieur
            </Badge>
          )}
        </Specimen>

        <Specimen
          title="Étincelant"
          note="Le cas d'usage le plus évident des étincelles : une distinction, un succès."
          code={`<Sparkle count={4}><Badge /></Sparkle>`}
        >
          <Sparkle count={4}>
            <Badge tone="success">Record battu</Badge>
          </Sparkle>
        </Specimen>

        <Specimen
          title="Chapelet séquencé"
          note="Une série d'étiquettes qui arrivent en cascade. Le séquençage du système, avec une animation expressive."
          code={`<span className="k-stagger">\n  <Badge className="animate-pop-in" />\n</span>`}
          replayable
        >
          {(run) => (
            <span key={run} className="k-stagger flex flex-wrap justify-center gap-2">
              {["CSS", "Motion", "React", "Tailwind"].map((t) => (
                <Badge key={t} tone="neutral" className="animate-pop-in">
                  {t}
                </Badge>
              ))}
            </span>
          )}
        </Specimen>
      </SpecimenGrid>
    </FantaisiePage>
  ),
};

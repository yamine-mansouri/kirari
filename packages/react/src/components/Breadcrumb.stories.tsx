import type { Meta, StoryObj } from "@storybook/react-vite";
import { Breadcrumb } from "./Breadcrumb";
import { FantaisiePage, Specimen, SpecimenGrid } from "./fantaisie-specimen";

const LONG = [
  { label: "Accueil", href: "#" },
  { label: "Projets", href: "#" },
  { label: "Kirari", href: "#" },
  { label: "Composants", href: "#" },
  { label: "Navigation", href: "#" },
  { label: "Breadcrumb" },
];

const meta = {
  title: "Composants/Breadcrumb",
  component: Breadcrumb,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "Fil d'Ariane.",
          "",
          "**La troncature se fait au milieu, pas à la fin.** Le premier",
          "élément (la racine) et le dernier (la page courante) sont les deux",
          "plus utiles : ce sont ceux du milieu qu'on replie. Beaucoup",
          "d'implémentations coupent la fin, ce qui supprime justement le",
          "repère le plus important.",
          "",
          "Le dernier élément porte `aria-current=\"page\"` et **n'est pas un",
          "lien** — on ne navigue pas vers la page où l'on se trouve.",
        ].join("\n"),
      },
    },
  },
  argTypes: { maxItems: { control: { type: "number", min: 0, max: 8 } } },
  args: { items: LONG, maxItems: 4 },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Galerie: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-bold tracking-tight">Court</h3>
        <Breadcrumb items={LONG.slice(0, 3)} />
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-bold tracking-tight">Tronqué au milieu</h3>
        <p className="text-xs text-ink-subtle">
          Six éléments, <code>maxItems=4</code> : la racine et la fin restent.
        </p>
        <Breadcrumb items={LONG} maxItems={4} />
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-bold tracking-tight">Sans troncature</h3>
        <Breadcrumb items={LONG} maxItems={0} />
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-bold tracking-tight">Séparateur personnalisé</h3>
        <Breadcrumb
          items={LONG.slice(0, 4)}
          maxItems={0}
          separator={<span className="text-ink-subtle">/</span>}
        />
      </section>
    </div>
  ),
};

export const Fantaisie: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <FantaisiePage intro={<>Un fil d'Ariane est une trace. La fantaisie consiste à lui donner l'air d'un chemin parcouru plutôt que d'une suite de liens.</>}>
      <SpecimenGrid>
        <Specimen
          title="Chemin qui se trace"
          note="Les segments apparaissent l'un après l'autre, de la racine à la page courante. Le parcours se rejoue sous les yeux."
          code={'<Breadcrumb className="k-stagger [&_li]:animate-slide-right" />'}
          replayable
        >
          {(run) => (
            <Breadcrumb
              key={run}
              items={LONG.slice(0, 4)}
              maxItems={0}
              className="k-stagger [&_li]:animate-slide-right"
            />
          )}
        </Specimen>

        <Specimen
          title="Cailloux"
          note="Chaque segment devient une pastille. Le fil d'Ariane redevient littéralement une suite de cailloux."
          code={'<Breadcrumb className="[&_a]:rounded-full [&_a]:bg-surface-sunken [&_a]:px-2.5" />'}
        >
          <Breadcrumb
            items={LONG.slice(0, 4)}
            maxItems={0}
            className="[&_a]:rounded-full [&_a]:bg-surface-sunken [&_a]:px-2.5 [&_a]:py-1 [&_span[aria-current]]:rounded-full [&_span[aria-current]]:bg-accent-subtle [&_span[aria-current]]:px-2.5 [&_span[aria-current]]:py-1 [&_span[aria-current]]:text-accent-text"
          />
        </Specimen>

        <Specimen
          title="Segments qui hochent"
          note="Chaque maillon acquiesce au survol. Sur un fil court, ça rend la navigation vivante sans la ralentir."
          code={'<Breadcrumb className="[&_a]:hover:animate-tick" />'}
        >
          <Breadcrumb items={LONG.slice(0, 4)} maxItems={0} className="[&_a]:hover:animate-tick" />
        </Specimen>

        <Specimen
          title="Chemin de travers"
          note="Chaque segment à un angle légèrement différent, comme une trace laissée à la main."
          code={'<Breadcrumb className="[&_li:nth-child(3)]:-rotate-2" />'}
        >
          <Breadcrumb
            items={LONG.slice(0, 4)}
            maxItems={0}
            className="[&_li:nth-child(1)]:-rotate-2 [&_li:nth-child(3)]:rotate-1 [&_li:nth-child(5)]:-rotate-1 [&_li:nth-child(7)]:rotate-2"
          />
        </Specimen>
      </SpecimenGrid>
    </FantaisiePage>
  ),
};

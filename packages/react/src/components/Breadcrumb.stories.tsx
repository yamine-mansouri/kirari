import type { Meta, StoryObj } from "@storybook/react-vite";
import { Breadcrumb } from "./Breadcrumb";

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

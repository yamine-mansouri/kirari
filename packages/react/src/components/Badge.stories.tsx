import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./Badge";

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

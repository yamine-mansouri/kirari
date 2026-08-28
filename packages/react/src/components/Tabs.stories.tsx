import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tabs } from "./Tabs";
import { Card } from "./Card";

const ITEMS = [
  { value: "apercu", label: "Aperçu", content: <p className="text-sm text-ink-muted">Le résumé de l'activité récente.</p> },
  { value: "analyse", label: "Analyse", content: <p className="text-sm text-ink-muted">Les mesures détaillées, période par période.</p> },
  { value: "reglages", label: "Réglages", content: <p className="text-sm text-ink-muted">La configuration du projet.</p> },
  { value: "archive", label: "Archive", content: <p className="text-sm text-ink-muted">Indisponible.</p>, disabled: true },
];

const meta = {
  title: "Composants/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "Onglets.",
          "",
          "**L'indicateur qui glisse est le geste le plus reconnaissable d'un",
          "design system** — et le plus souvent bâclé, parce qu'il demande de",
          "mesurer l'onglet actif à chaque changement.",
          "",
          "Base UI expose cette mesure en variables CSS (`--active-tab-left`,",
          "`--active-tab-width`…) : la transition se fait donc en CSS pur, sans",
          "ResizeObserver ni recalcul au rendu. Redimensionner la fenêtre :",
          "l'indicateur suit sans une ligne de JavaScript.",
          "",
          "**Tabs ou ToggleGroup ?** Un Tabs change ce qui est affiché en",
          "dessous. Un ToggleGroup change un réglage.",
        ].join("\n"),
      },
    },
  },
  argTypes: { orientation: { control: "radio", options: ["horizontal", "vertical"] } },
  args: { items: ITEMS },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Galerie: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-bold tracking-tight">Horizontal</h3>
        <Tabs items={ITEMS} />
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-bold tracking-tight">Vertical</h3>
        <Tabs items={ITEMS} orientation="vertical" />
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-bold tracking-tight">Dans une carte</h3>
        <Card className="p-0">
          <div className="p-5">
            <Tabs items={ITEMS.slice(0, 3)} />
          </div>
        </Card>
      </section>
    </div>
  ),
};

/**
 * Passer d'un onglet à l'autre, y compris en sautant du premier au dernier :
 * l'indicateur glisse en `ease-glide`, la seule courbe du système pensée pour
 * un déplacement long et régulier.
 */
export const Mouvement: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-4">
      <p className="max-w-[62ch] text-sm text-ink-muted">
        Les libellés ont volontairement des largeurs très différentes : c'est là
        que se voit si l'indicateur est mesuré ou approximé.
      </p>
      <Tabs
        items={[
          { value: "a", label: "Un" },
          { value: "b", label: "Un onglet nettement plus large" },
          { value: "c", label: "Moyen" },
          { value: "d", label: "Court" },
        ]}
      />
    </div>
  ),
};

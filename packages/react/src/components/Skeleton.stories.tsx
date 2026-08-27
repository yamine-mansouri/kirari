import type { Meta, StoryObj } from "@storybook/react-vite";
import { Skeleton } from "./Skeleton";
import { Card } from "./Card";

const meta = {
  title: "Composants/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "L'éclat qui traverse est un dégradé animé en `background-position` —",
          "moins coûteux qu'un pseudo-élément qui se déplace, et sans reflow.",
          "",
          "En `prefers-reduced-motion`, l'animation **et** le dégradé sont",
          "coupés : un skeleton figé mais dégradé se lit comme une erreur de",
          "rendu, pas comme un chargement.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    shape: { control: "radio", options: ["block", "text", "circle"] },
    lines: { control: { type: "number", min: 1, max: 6 } },
  },
  args: { shape: "block", width: 240, height: 80 },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Galerie: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-bold tracking-tight">Formes</h3>
        <div className="flex items-start gap-6">
          <Skeleton width={200} height={80} />
          <Skeleton shape="circle" width={64} />
          <div className="w-56">
            <Skeleton shape="text" lines={4} />
          </div>
        </div>
        <p className="text-xs text-ink-subtle">
          En mode texte, la dernière ligne est raccourcie à 62 % : un bloc de
          lignes toutes égales ne ressemble pas à du texte.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-bold tracking-tight">En situation</h3>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(17rem,1fr))] gap-4">
          <Card variant="sunken" title="Chargement">
            <Skeleton shape="text" lines={3} />
          </Card>
          <Card variant="sunken">
            <div className="flex items-center gap-3">
              <Skeleton shape="circle" width={40} />
              <div className="flex-1">
                <Skeleton shape="text" lines={2} />
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  ),
};

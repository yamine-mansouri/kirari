import type { Meta, StoryObj } from "@storybook/react-vite";
import { Separator } from "./Separator";
import { Button } from "./Button";

const meta = {
  title: "Composants/Separator",
  component: Separator,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "Trait de séparation.",
          "",
          "Trivial en apparence, mais il porte le bon rôle ARIA — un `<hr>`",
          "stylé à la main, ou pire un `<div>` avec une bordure, n'annonce",
          "rien.",
          "",
          "Avec un `label`, le séparateur devient **décoratif** : le texte",
          "suffit alors à marquer la rupture pour un lecteur d'écran, et le",
          "rôle serait redondant.",
        ].join("\n"),
      },
    },
  },
  argTypes: { orientation: { control: "radio", options: ["horizontal", "vertical"] } },
  args: {},
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="max-w-md">
      <p className="pb-4 text-sm text-ink-muted">Au-dessus</p>
      <Separator {...args} />
      <p className="pt-4 text-sm text-ink-muted">En dessous</p>
    </div>
  ),
};

export const Galerie: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-8">
      <section className="flex max-w-md flex-col gap-3">
        <h3 className="text-sm font-bold tracking-tight">Horizontal</h3>
        <Separator />
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-bold tracking-tight">Vertical</h3>
        <div className="flex h-8 items-center gap-4">
          <span className="text-sm text-ink-muted">Modifier</span>
          <Separator orientation="vertical" />
          <span className="text-sm text-ink-muted">Dupliquer</span>
          <Separator orientation="vertical" />
          <span className="text-sm text-ink-muted">Supprimer</span>
        </div>
      </section>

      <section className="flex max-w-md flex-col gap-3">
        <h3 className="text-sm font-bold tracking-tight">Avec libellé</h3>
        <div className="flex flex-col gap-4">
          <Button variant="outline" block>Continuer avec un compte</Button>
          <Separator label="ou" />
          <Button block>Créer un compte</Button>
        </div>
      </section>
    </div>
  ),
};

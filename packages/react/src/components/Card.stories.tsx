import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card } from "./Card";
import { Button } from "./Button";
import { Skeleton } from "./Skeleton";

const meta = {
  title: "Composants/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "L'ombre reste volontairement discrète : dans Kirari, la hiérarchie",
          "passe d'abord par le mouvement, pas par la profondeur.",
          "",
          "**Quelle variante ?** `raised` par défaut. `flat` quand la carte est",
          "déjà posée sur une surface distincte. `sunken` pour un contenu en",
          "attente ou secondaire. Ajouter `interactive` **uniquement** si la",
          "carte entière est cliquable — sinon le survol ment sur l'affordance.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    variant: { control: "radio", options: ["raised", "flat", "sunken"] },
    interactive: { control: "boolean" },
    title: { control: "text" },
  },
  args: {
    title: "Titre de la carte",
    children: "Le corps de la carte, en texte atténué pour laisser le titre porter.",
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Galerie: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(17rem,1fr))] gap-4">
      <Card title="Raised" footer={<Button size="sm" variant="soft">Action</Button>}>
        La variante par défaut, avec une ombre légère.
      </Card>
      <Card variant="flat" title="Flat">
        Sans ombre — pour une carte déjà posée sur une surface distincte.
      </Card>
      <Card variant="sunken" title="Sunken">
        Enfoncée dans la page, pour un contenu secondaire ou en attente.
      </Card>
      <Card interactive title="Interactive">
        Survoler : la carte se soulève et un liseré d'accent remonte du bas.
      </Card>
      <Card variant="sunken" title="En chargement">
        <Skeleton shape="text" lines={3} />
      </Card>
      <Card title="Sans corps" footer={<span className="text-xs text-ink-subtle">footer seul</span>} />
    </div>
  ),
};

export const Mouvement: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-6">
      <p className="max-w-[62ch] text-sm text-ink-muted">
        Survoler puis quitter. Le liseré entre par la gauche en{" "}
        <code>ease-enter</code>, se retire par la droite en <code>ease-exit</code>.
        L'élévation et l'ombre suivent la même courbe que le liseré, pour que
        les trois mouvements se lisent comme un seul geste.
      </p>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(17rem,1fr))] gap-4">
        <Card interactive title="Survoler ici">Puis quitter, et observer le retrait.</Card>
        <Card interactive title="Et ici">Les deux sens n'ont pas la même courbe.</Card>
      </div>
    </div>
  ),
};

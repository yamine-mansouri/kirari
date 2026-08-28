import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tooltip, TooltipProvider } from "./Tooltip";
import { Button } from "./Button";

const meta = {
  title: "Composants/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "**Le composant, c'est le timing, pas l'animation.** Sans délai",
          "d'ouverture, une infobulle saute au visage à chaque passage de",
          "souris. Le délai de grâce, lui, évite qu'elle clignote quand on",
          "longe une barre d'outils.",
          "",
          "**Jamais pour une information indispensable.** Une infobulle est",
          "invisible au tactile et à la lecture d'écran séquentielle. Ce qui",
          "doit être compris appartient au label.",
          "",
          "**Sur le délai par défaut :** 300 ms, contre 600 chez Base UI et 700",
          "chez Radix. Ces valeurs viennent des infobulles de bureau, qui",
          "*complétaient* un contrôle déjà nommé. L'usage dominant est",
          "aujourd'hui l'inverse — un bouton à icône dont l'infobulle porte le",
          "nom du contrôle. L'utilisateur la demande, il ne la subit pas.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    side: { control: "radio", options: ["top", "right", "bottom", "left"] },
    delay: { control: { type: "number", min: 0, max: 1500, step: 100 } },
    arrow: { control: "boolean" },
  },
  // `children` est requis : le poser ici évite de le répéter dans chaque story.
  args: {
    content: "Ceci est une infobulle.",
    side: "top",
    delay: 300,
    children: <Button variant="outline">Survoler</Button>,
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="grid min-h-48 place-items-center">
      <Tooltip {...args}>
        <Button variant="outline">Survoler</Button>
      </Tooltip>
    </div>
  ),
};

export const Galerie: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="grid min-h-64 grid-cols-2 place-items-center gap-8">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <Tooltip key={side} side={side} arrow content={`Ouverture ${side}`}>
          <Button variant="outline" size="sm">side=&quot;{side}&quot;</Button>
        </Tooltip>
      ))}
    </div>
  ),
};

/**
 * À l'intérieur d'un `TooltipProvider`, passer d'une cible à l'autre ouvre la
 * suivante sans réattendre le délai. C'est le comportement attendu dans une
 * barre d'outils — sans lui, longer six boutons produit six attentes.
 */
export const Groupe: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <p className="mb-3 text-sm text-ink-muted">Avec Provider — délai partagé :</p>
        <TooltipProvider delay={500}>
          <div className="inline-flex gap-1 rounded-md border border-line bg-surface p-1">
            {["Gras", "Italique", "Souligné", "Barré"].map((label) => (
              <Tooltip key={label} content={label}>
                <Button variant="ghost" size="sm">{label[0]}</Button>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      </div>

      <div>
        <p className="mb-3 text-sm text-ink-muted">Sans Provider — chaque cible réattend :</p>
        <div className="inline-flex gap-1 rounded-md border border-line bg-surface p-1">
          {["Gras", "Italique", "Souligné", "Barré"].map((label) => (
            <Tooltip key={label} content={label} delay={500}>
              <Button variant="ghost" size="sm">{label[0]}</Button>
            </Tooltip>
          ))}
        </div>
      </div>
    </div>
  ),
};

/** Le délai est le réglage qui compte. Comparer les trois. */
export const Mouvement: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-center gap-6">
      {[0, 300, 600, 1000].map((delay) => (
        <Tooltip key={delay} delay={delay} arrow content={`delay = ${delay} ms`}>
          <Button variant={delay === 300 ? "solid" : "outline"}>
            {delay === 0 ? "Immédiat" : `${delay} ms`}
          </Button>
        </Tooltip>
      ))}
    </div>
  ),
};

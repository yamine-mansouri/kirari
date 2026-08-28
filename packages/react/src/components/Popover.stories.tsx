import type { Meta, StoryObj } from "@storybook/react-vite";
import { Popover } from "./Popover";
import { Button } from "./Button";
import { Field } from "./Field";

const meta = {
  title: "Composants/Popover",
  component: Popover,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "La clé de voûte du système : Tooltip, Menu, Select et Combobox",
          "reposent sur le même socle de positionnement anti-collision et",
          "partagent sa surface.",
          "",
          "Le comportement vient de Base UI — ancrage, portail, piégeage du",
          "focus, restitution au déclencheur à la fermeture. Kirari n'apporte",
          "que la surface et le mouvement.",
          "",
          "**Le détail qui compte :** l'ouverture part de",
          "`--transform-origin`, que Base UI calcule selon le côté où le popup",
          "a *réellement* pu s'ouvrir. Ouvrir un popover près du bas de la",
          "fenêtre le fait basculer vers le haut — et le mouvement bascule avec",
          "lui. Sans cela, l'animation mentirait sur l'ancrage.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    side: { control: "radio", options: ["top", "right", "bottom", "left"] },
    align: { control: "radio", options: ["start", "center", "end"] },
    sideOffset: { control: { type: "number", min: 0, max: 32 } },
    arrow: { control: "boolean" },
  },
  args: {
    trigger: <Button variant="outline">Ouvrir le popover</Button>,
    title: "Partager ce document",
    description: "Toute personne disposant du lien pourra le consulter.",
    side: "bottom",
    align: "center",
  },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="grid min-h-72 place-items-center">
      <Popover {...args} />
    </div>
  ),
};

/** Les quatre côtés, avec leur flèche. Chacun s'ouvre depuis son ancre. */
export const Galerie: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="grid min-h-96 grid-cols-2 place-items-center gap-8">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <Popover
          key={side}
          side={side}
          arrow
          trigger={<Button variant="outline" size="sm">side=&quot;{side}&quot;</Button>}
          title={`Ouverture ${side}`}
          description="La flèche et l'origine de l'animation suivent le côté."
        />
      ))}
    </div>
  ),
};

/**
 * Le test qui compte : ouvrir celui du bas. Base UI le fait basculer vers le
 * haut faute de place, et l'animation part alors du bas.
 */
export const Mouvement: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-4">
      <p className="max-w-[62ch] text-sm text-ink-muted">
        Ouvrir puis fermer. L'entrée se dépose en <code>ease-enter</code> sur
        0.3s, la sortie claque en <code>ease-exit</code> sur 0.2s — une sortie
        n'est pas une entrée à l'envers.
      </p>
      <div className="grid h-[70vh] items-end justify-items-center">
        <Popover
          arrow
          trigger={<Button>Près du bas de la fenêtre</Button>}
          title="Basculement automatique"
          description="Faute de place en dessous, le popup s'ouvre au-dessus — et l'animation part du bas."
        />
      </div>
    </div>
  ),
};

/** Contenu libre : l'API composée accepte n'importe quels enfants. */
export const AvecFormulaire: Story = {
  name: "Avec formulaire",
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="grid min-h-72 place-items-center">
      <Popover
        trigger={<Button variant="soft">Inviter</Button>}
        title="Inviter quelqu'un"
      >
        <div className="flex flex-col gap-3">
          <Field label="Adresse e-mail" type="email" placeholder="vous@exemple.fr" />
          <Button size="sm" block>Envoyer l'invitation</Button>
        </div>
      </Popover>
    </div>
  ),
};

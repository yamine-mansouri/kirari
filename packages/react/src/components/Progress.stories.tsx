import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Progress } from "./Progress";

const meta = {
  title: "Composants/Progress",
  component: Progress,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "Barre de progression, déterminée ou indéterminée.",
          "",
          "Passer `value={null}` bascule en indéterminé : la barre balaie en",
          "boucle, pour dire « ça travaille » sans mentir sur l'avancement.",
          "",
          "**Le seul composant du système où l'animation porte du sens.** Elle",
          "est donc marquée `.k-motion-safe` : `prefers-reduced-motion` la",
          "conserve, contrairement à tout le reste de Kirari. Supprimer ce",
          "mouvement-là supprimerait l'information.",
        ].join("\n"),
      },
    },
  },
  argTypes: { value: { control: { type: "range", min: 0, max: 100 } } },
  args: { label: "Téléversement", value: 45, showValue: true },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="max-w-sm">
      <Progress {...args} />
    </div>
  ),
};

export const Galerie: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex max-w-sm flex-col gap-8">
      <Progress label="Au repos" value={0} showValue />
      <Progress label="En cours" value={45} showValue />
      <Progress label="Terminé" value={100} showValue />
      <Progress label="Sans valeur affichée" value={70} />
      <Progress label="Indéterminé" value={null} />
      <Progress value={30} />
    </div>
  ),
};

/** Une progression réelle, pour voir la transition en `ease-glide`. */
export const Mouvement: Story = {
  parameters: { controls: { disable: true } },
  render: function Mouvement() {
    const [value, setValue] = useState(0);

    useEffect(() => {
      const id = setInterval(() => {
        setValue((v) => (v >= 100 ? 0 : v + Math.round(Math.random() * 18)));
      }, 900);
      return () => clearInterval(id);
    }, []);

    return (
      <div className="flex max-w-sm flex-col gap-8">
        <Progress label="Téléversement" value={Math.min(value, 100)} showValue />
        <Progress label="Traitement (indéterminé)" value={null} />
      </div>
    );
  },
};

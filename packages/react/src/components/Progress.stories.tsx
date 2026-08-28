import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Progress } from "./Progress";
import { Sparkle } from "./Sparkle";
import { FantaisiePage, Specimen, SpecimenGrid } from "./fantaisie-specimen";

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

export const Fantaisie: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <FantaisiePage intro={<>C'est le seul composant dont l'animation porte l'information. Toute fantaisie ajoutée doit rester derrière elle, jamais devant.</>}>
      <SpecimenGrid>
        <Specimen
          title="Piste en galet"
          note="Barre épaisse et entièrement ronde. La progression devient une jauge de jeu."
          code={'<Progress className="[&_[role=progressbar]]:h-3" />'}
        >
          <Progress
            value={62}
            showValue
            label="Téléversement"
            className="w-full [&>span:last-child]:h-3"
          />
        </Specimen>

        <Specimen
          title="Achèvement fêté"
          note="Des étincelles à 100 %. Le retour positif d'une tâche terminée."
          code={'<Sparkle count={6}><Progress value={100} /></Sparkle>'}
        >
          <Sparkle count={6} className="w-full">
            <Progress value={100} showValue label="Terminé" className="w-full" />
          </Sparkle>
        </Specimen>

        <Specimen
          title="Barre penchée"
          note="La jauge à −2°. Elle sort du tableau de bord et entre dans une interface de jeu."
          code={'<Progress className="-rotate-2" />'}
        >
          <Progress value={45} label="Expérience" showValue className="w-full -rotate-2" />
        </Specimen>

        <Specimen
          title="Libellé qui hoche"
          note="Le libellé acquiesce à chaque palier franchi. Discret, et ça attire l'œil au bon moment."
          code={'<Progress className="[&_span:first-child]:animate-tick" />'}
          replayable
        >
          {(run) => (
            <Progress
              key={run}
              value={80}
              showValue
              label="Presque fini"
              className="w-full [&_span:first-child]:animate-tick"
            />
          )}
        </Specimen>
      </SpecimenGrid>
    </FantaisiePage>
  ),
};

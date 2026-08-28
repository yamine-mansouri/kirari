import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stepper } from "./Stepper";
import { Button } from "./Button";

const STEPS = [
  { label: "Compte", description: "Adresse e-mail et mot de passe" },
  { label: "Profil", description: "Nom et photo" },
  { label: "Équipe", description: "Inviter des collaborateurs" },
  { label: "Terminé", description: "Tout est prêt" },
];

const meta = {
  title: "Composants/Stepper",
  component: Stepper,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "Progression en étapes.",
          "",
          "**Le trait entre deux étapes se remplit à mesure qu'on avance** :",
          "c'est le mouvement qui porte l'information, pas la pastille. Il",
          "utilise `ease-glide`, la seule courbe du système pensée pour un",
          "déplacement long et régulier.",
          "",
          "L'étape courante porte `aria-current=\"step\"`, et la progression est",
          "annoncée en toutes lettres dans le `aria-label` de la navigation :",
          "une pastille colorée ne dit rien à qui ne la voit pas.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    current: { control: { type: "number", min: 0, max: 3 } },
    orientation: { control: "radio", options: ["horizontal", "vertical"] },
  },
  args: { steps: STEPS, current: 1 },
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Galerie: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-12">
      <section className="flex flex-col gap-4">
        <h3 className="text-sm font-bold tracking-tight">Horizontal</h3>
        {[0, 1, 3].map((current) => (
          <Stepper key={current} steps={STEPS} current={current} />
        ))}
      </section>

      <section className="flex flex-col gap-4">
        <h3 className="text-sm font-bold tracking-tight">Vertical</h3>
        <Stepper steps={STEPS} current={2} orientation="vertical" />
      </section>
    </div>
  ),
};

/** Avancer d'une étape : le trait se remplit, la pastille se coche. */
export const Mouvement: Story = {
  parameters: { controls: { disable: true } },
  render: function Mouvement() {
    const [current, setCurrent] = useState(0);

    return (
      <div className="flex flex-col gap-6">
        <Stepper steps={STEPS} current={current} />
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={current === 0}
            onClick={() => setCurrent((c) => c - 1)}
          >
            Précédent
          </Button>
          <Button
            size="sm"
            disabled={current >= STEPS.length - 1}
            onClick={() => setCurrent((c) => c + 1)}
          >
            Suivant
          </Button>
        </div>
      </div>
    );
  },
};

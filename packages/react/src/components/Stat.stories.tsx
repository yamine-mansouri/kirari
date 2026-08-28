import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stat } from "./Stat";
import { Card } from "./Card";
import { Reveal } from "../motion/Reveal";

const meta = {
  title: "Composants/Stat",
  component: Stat,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "Chiffre clé.",
          "",
          "Le décompte à l'apparition n'est pas un gadget : il attire l'œil sur",
          "la valeur au moment où elle entre dans le champ, ce qu'un chiffre",
          "statique ne fait pas. À coupler avec `<Reveal>` pour le déclencher",
          "au défilement.",
          "",
          "**`tabular-nums` est indispensable ici** — sans lui, la largeur du",
          "chiffre change à chaque image et le compteur tremble.",
          "",
          "Le décompte respecte `prefers-reduced-motion` : il affiche alors la",
          "valeur finale immédiatement, sans figer un chiffre à mi-course.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    trend: { control: "radio", options: ["up", "down", "flat", undefined] },
    countUp: { control: "boolean" },
  },
  args: {
    label: "Revenu mensuel",
    value: 48250,
    trend: "up",
    delta: "+12,4 %",
    hint: "Comparé au mois précédent",
    countUp: true,
  },
} satisfies Meta<typeof Stat>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Card className="max-w-64">
      <Stat {...args} />
    </Card>
  ),
};

export const Galerie: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(15rem,1fr))] gap-4">
      <Card>
        <Stat label="Revenu mensuel" value={48250} trend="up" delta="+12,4 %" countUp
          format={(n) => `${Math.round(n).toLocaleString("fr-FR")} €`} />
      </Card>
      <Card>
        <Stat label="Taux de rebond" value={38} trend="down" delta="-4,1 pts" countUp
          format={(n) => `${Math.round(n)} %`} />
      </Card>
      <Card>
        <Stat label="Utilisateurs actifs" value={1284} trend="flat" delta="stable" countUp />
      </Card>
      <Card>
        <Stat label="Statut" value="Opérationnel" hint="Aucun incident en cours" />
      </Card>
    </div>
  ),
};

/** Faire défiler : le décompte se déclenche à l'entrée dans le viewport. */
export const Mouvement: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-6">
      <p className="max-w-[62ch] text-sm text-ink-muted">
        Chaque carte compte de zéro à sa valeur quand elle entre dans le champ.
        La décélération est cubique : le chiffre se pose au lieu de s'arrêter net.
      </p>
      <div className="grid h-[60vh] place-items-center text-sm text-ink-subtle">
        ↓ continuer à défiler
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(15rem,1fr))] gap-4">
        {[
          { label: "Vues", value: 128_400 },
          { label: "Inscriptions", value: 3_182 },
          { label: "Conversions", value: 947 },
        ].map((s) => (
          <Reveal key={s.label}>
            <Card>
              <Stat label={s.label} value={s.value} countUp countDuration={1200} />
            </Card>
          </Reveal>
        ))}
      </div>
      <div className="grid h-[30vh] place-items-center text-sm text-ink-subtle">fin</div>
    </div>
  ),
};

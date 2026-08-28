import type { Meta, StoryObj } from "@storybook/react-vite";
import { Slider } from "./Slider";
import { Sparkle } from "./Sparkle";
import { FantaisiePage, Specimen, SpecimenGrid } from "./fantaisie-specimen";

const meta = {
  title: "Composants/Slider",
  component: Slider,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "Curseur de valeur, unique ou en plage.",
          "",
          "**La règle du drag :** aucune transition sur la poignée ni sur le",
          "remplissage. Une transition, même de 100 ms, fait traîner le curseur",
          "derrière le doigt — le composant paraît alors cassé plutôt que",
          "fluide. Seul l'anneau de survol est animé, parce qu'il ne suit pas",
          "le geste.",
          "",
          "Passer un tableau à `defaultValue` crée une plage à deux poignées.",
          "Le formatage se règle par `format`, qui prend des options",
          "`Intl.NumberFormat` — devise, pourcentage, unités.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
    disabled: { control: "boolean" },
  },
  args: { label: "Volume", showValue: true, defaultValue: 60 },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="max-w-sm">
      <Slider {...args} />
    </div>
  ),
};

export const Galerie: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex max-w-sm flex-col gap-8">
      <Slider label="Simple" defaultValue={40} showValue />
      <Slider label="Par pas de 10" defaultValue={50} step={10} showValue />
      <Slider
        label="Plage"
        defaultValue={[25, 75]}
        showValue
      />
      <Slider
        label="Pourcentage"
        defaultValue={0.62}
        min={0}
        max={1}
        step={0.01}
        format={{ style: "percent" }}
        showValue
      />
      <Slider
        label="Prix"
        defaultValue={1200}
        min={0}
        max={5000}
        step={50}
        format={{ style: "currency", currency: "EUR", maximumFractionDigits: 0 }}
        showValue
      />
      <Slider label="Désactivé" defaultValue={30} disabled showValue />
    </div>
  ),
};

/**
 * Attraper la poignée et la déplacer : elle colle au doigt. Seul l'anneau
 * grandit, en `ease-swift` sur 0.2 s.
 */
export const Mouvement: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex max-w-sm flex-col gap-8">
      <Slider label="Survoler, puis attraper" defaultValue={45} showValue />
      <Slider label="Plage à deux poignées" defaultValue={[20, 80]} showValue />
    </div>
  ),
};

export const Fantaisie: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <FantaisiePage intro={<>La poignée ne doit jamais s'animer pendant le glissement — elle suit le doigt. Toute la fantaisie se joue donc autour : la piste, la prise en main, l'arrivée au bout.</>}>
      <SpecimenGrid>
        <Specimen
          title="Piste en galet"
          note="Piste épaisse et poignée surdimensionnée : le curseur devient un objet à manipuler plutôt qu'un trait à ajuster."
          code={'<Slider className="[&_[role=slider]]:size-7" />'}
        >
          <Slider
            defaultValue={55}
            className="w-full [&_[role=slider]]:size-7 [&_[role=slider]]:border-4"
          />
        </Specimen>

        <Specimen
          title="Prise en main"
          note="Une gelée au moment de la saisie, jamais pendant. L'objet réagit à la prise, puis se tait pour suivre le doigt."
          code={'<Slider className="[&_[role=slider]]:active:animate-jelly" />'}
        >
          <Slider defaultValue={40} className="w-full [&_[role=slider]]:active:animate-jelly" />
        </Specimen>

        <Specimen
          title="Arrivée au maximum"
          note="Des étincelles autour du curseur quand la valeur atteint le bout. Le retour positif d'un objectif atteint."
          code={'<Sparkle count={5}><Slider /></Sparkle>'}
        >
          <Sparkle count={5} className="w-full">
            <Slider defaultValue={100} className="w-full" />
          </Sparkle>
        </Specimen>

        <Specimen
          title="Penché"
          note="La piste posée à −2°. Le réglage n'est plus un instrument de mesure, c'est un objet posé sur une table."
          code={'<Slider className="-rotate-2" />'}
        >
          <Slider defaultValue={65} className="w-full -rotate-2" />
        </Specimen>
      </SpecimenGrid>
    </FantaisiePage>
  ),
};

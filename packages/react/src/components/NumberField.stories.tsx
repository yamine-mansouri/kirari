import type { Meta, StoryObj } from "@storybook/react-vite";
import { NumberField } from "./NumberField";
import { Sparkle } from "./Sparkle";
import { FantaisiePage, Specimen, SpecimenGrid } from "./fantaisie-specimen";

const meta = {
  title: "Composants/NumberField",
  component: NumberField,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "Champ numérique avec incrément.",
          "",
          "Maintenir un bouton accélère la répétition — indispensable dès que",
          "la plage dépasse la dizaine.",
          "",
          "Le label est aussi une zone de **scrub** : glisser horizontalement",
          "dessus fait varier la valeur, un raccourci d'outil de design que",
          "Base UI fournit gratuitement. Essayer sur le libellé ci-dessous.",
          "",
          "`format` accepte les options d'`Intl.NumberFormat` : devise,",
          "pourcentage, unités, séparateurs locaux.",
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
  args: { label: "Quantité", defaultValue: 3, min: 0 },
} satisfies Meta<typeof NumberField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="max-w-48">
      <NumberField {...args} />
    </div>
  ),
};

export const Galerie: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="grid max-w-2xl grid-cols-2 gap-6">
      <NumberField label="Entier" defaultValue={12} min={0} />
      <NumberField label="Par pas de 5" defaultValue={25} step={5} />
      <NumberField label="Décimal" defaultValue={1.5} step={0.1} />
      <NumberField
        label="Devise"
        defaultValue={1290}
        step={10}
        format={{ style: "currency", currency: "EUR" }}
      />
      <NumberField
        label="Pourcentage"
        defaultValue={0.15}
        step={0.01}
        format={{ style: "percent" }}
      />
      <NumberField label="Désactivé" defaultValue={7} disabled />
    </div>
  ),
};

export const Fantaisie: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <FantaisiePage intro={<>Un champ numérique est fait de deux boutons qu'on martèle. C'est exactement le cas où l'écrasement se justifie : la répétition rend la matière perceptible.</>}>
      <SpecimenGrid>
        <Specimen
          title="Boutons qui s'enfoncent"
          note="Chaque incrément écrase le bouton sur sa base. En maintenant appuyé, la répétition devient un rythme."
          code={'<NumberField className="[&_button]:origin-bottom\n  [&_button]:active:animate-squish" />'}
        >
          <NumberField
            label="Quantité"
            defaultValue={3}
            className="max-w-40 [&_button]:origin-bottom [&_button]:active:animate-squish"
          />
        </Specimen>

        <Specimen
          title="Galet"
          note="Groupe entièrement arrondi, boutons ronds aux extrémités. Le champ devient un contrôle de jouet."
          code={'<NumberField className="[&>div]:rounded-full" />'}
        >
          <NumberField label="Quantité" defaultValue={7} className="max-w-40 [&>div]:rounded-full" />
        </Specimen>

        <Specimen
          title="Penché"
          note="Le champ posé à −3°, dans une carte droite. Suffit à sortir de la grille."
          code={'<NumberField className="-rotate-3" />'}
        >
          <NumberField label="Quantité" defaultValue={12} className="max-w-40 -rotate-3" />
        </Specimen>

        <Specimen
          title="Quantité fêtée"
          note="Pour un panier : la quantité choisie mérite une réaction."
          code={'<Sparkle count={4}><NumberField /></Sparkle>'}
        >
          <Sparkle count={4}>
            <NumberField label="Quantité" defaultValue={2} className="max-w-40" />
          </Sparkle>
        </Specimen>
      </SpecimenGrid>
    </FantaisiePage>
  ),
};

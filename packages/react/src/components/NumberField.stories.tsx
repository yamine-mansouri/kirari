import type { Meta, StoryObj } from "@storybook/react-vite";
import { NumberField } from "./NumberField";

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
    <div className="grid max-w-2xl grid-cols-3 gap-6">
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

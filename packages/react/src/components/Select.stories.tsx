import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Select } from "./Select";

const PAYS = [
  { value: "fr", label: "France" },
  { value: "jp", label: "Japon" },
  { value: "pt", label: "Portugal" },
  { value: "is", label: "Islande" },
  { value: "kr", label: "Corée du Sud" },
  { value: "mx", label: "Mexique", disabled: true },
];

const meta = {
  title: "Composants/Select",
  component: Select,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "Liste déroulante à valeur unique.",
          "",
          "Ce que le `<select>` natif ne sait pas faire : se styler, afficher",
          "du contenu riche dans les options, rester cohérent d'un système à",
          "l'autre. Tout le reste — navigation clavier, typeahead, retour au",
          "déclencheur à la fermeture — vient de Base UI.",
          "",
          "**Au-delà d'une dizaine d'options, préférer `Combobox`.** Sans champ",
          "de recherche, une longue liste devient impraticable. C'est le seul",
          "critère de choix entre les deux.",
        ].join("\n"),
      },
    },
  },
  argTypes: { disabled: { control: "boolean" }, placeholder: { control: "text" } },
  args: { items: PAYS, placeholder: "Choisir un pays…" },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="max-w-xs">
      <Select {...args} />
    </div>
  ),
};

export const Galerie: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="grid max-w-2xl grid-cols-2 gap-6">
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-ink">Vide</span>
        <Select items={PAYS} placeholder="Choisir un pays…" />
      </label>
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-ink">Avec valeur</span>
        <Select items={PAYS} defaultValue="jp" />
      </label>
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-ink">Désactivé</span>
        <Select items={PAYS} defaultValue="fr" disabled />
      </label>
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-ink">Option désactivée</span>
        <Select items={PAYS} placeholder="Le Mexique est indisponible" />
      </label>
    </div>
  ),
};

/**
 * Ouvrir puis fermer. La liste s'échelonne depuis l'ancre en `ease-enter`, et
 * la chevron pivote — c'est un état, pas une décoration.
 */
export const Mouvement: Story = {
  parameters: { controls: { disable: true } },
  render: function Mouvement() {
    const [value, setValue] = useState<string | null>("fr");
    return (
      <div className="flex max-w-xs flex-col gap-3">
        <Select items={PAYS} value={value} onValueChange={setValue} />
        <span className="font-mono text-xs text-ink-muted">value = {String(value)}</span>
      </div>
    );
  },
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import { ToggleGroup } from "./ToggleGroup";

const ALIGN = [
  { value: "left", label: "Gauche" },
  { value: "center", label: "Centre" },
  { value: "right", label: "Droite" },
];

const FORMAT = [
  { value: "bold", label: <span className="font-bold">B</span>, ariaLabel: "Gras" },
  { value: "italic", label: <span className="italic">I</span>, ariaLabel: "Italique" },
  { value: "underline", label: <span className="underline">U</span>, ariaLabel: "Souligné" },
];

const meta = {
  title: "Composants/ToggleGroup",
  component: ToggleGroup,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "Groupe de bascules — sélecteur de vue, filtre de segment, barre de",
          "mise en forme.",
          "",
          "**Ce n'est pas un Tabs.** Un Tabs change ce qui est affiché en",
          "dessous ; un ToggleGroup change un réglage. Utiliser l'un pour",
          "l'autre casse les attentes de navigation au clavier — dans un Tabs",
          "les flèches changent de panneau, ici elles parcourent une barre",
          "d'outils.",
          "",
          "Quand le libellé est une icône seule, `ariaLabel` est obligatoire.",
        ].join("\n"),
      },
    },
  },
  argTypes: { multiple: { control: "boolean" }, disabled: { control: "boolean" } },
  args: { items: ALIGN, defaultValue: ["center"] },
} satisfies Meta<typeof ToggleGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Galerie: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-bold tracking-tight">Choix unique</h3>
        <ToggleGroup items={ALIGN} defaultValue={["center"]} />
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-bold tracking-tight">Choix multiple</h3>
        <p className="text-xs text-ink-subtle">Une barre de mise en forme cumule les états.</p>
        <ToggleGroup items={FORMAT} multiple defaultValue={["bold"]} />
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-bold tracking-tight">Désactivé</h3>
        <div className="flex gap-4">
          <ToggleGroup items={ALIGN} defaultValue={["left"]} disabled />
          <ToggleGroup
            items={[...ALIGN.slice(0, 2), { value: "right", label: "Droite", disabled: true }]}
            defaultValue={["left"]}
          />
        </div>
      </section>
    </div>
  ),
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import { ToggleGroup } from "./ToggleGroup";
import { FantaisiePage, Specimen, SpecimenGrid } from "./fantaisie-specimen";

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

export const Fantaisie: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <FantaisiePage intro={<>Une barre de bascules est une rangée d'objets côte à côte : c'est le terrain idéal pour un décalage, un pivot, une pastille qui déborde.</>}>
      <SpecimenGrid>
        <Specimen
          title="Pastille en gelée"
          note="L'élément qui devient actif déborde brièvement. La sélection se voit sans regarder la couleur."
          code={'<ToggleGroup className="[&_button]:active:animate-jelly" />'}
        >
          <ToggleGroup
            items={ALIGN}
            defaultValue={["center"]}
            className="[&_button]:active:animate-jelly"
          />
        </Specimen>

        <Specimen
          title="Galet"
          note="Groupe et pastilles entièrement ronds. Le sélecteur devient une rangée de pastilles."
          code={'<ToggleGroup className="rounded-full\n  [&_button]:rounded-full" />'}
        >
          <ToggleGroup
            items={ALIGN}
            defaultValue={["left"]}
            className="rounded-full [&_button]:rounded-full"
          />
        </Specimen>

        <Specimen
          title="De travers"
          note="La barre posée à 2°, qui se redresse au survol. Un détail qui suffit à casser l'alignement parfait."
          code={'<ToggleGroup className="rotate-2\n  hover:rotate-0" />'}
        >
          <ToggleGroup
            items={ALIGN}
            defaultValue={["right"]}
            className="rotate-2 transition-transform duration-(--k-dur-3) ease-bounce hover:rotate-0"
          />
        </Specimen>

        <Specimen
          title="Apparition séquencée"
          note="Les bascules arrivent une à une. Utile quand la barre n'apparaît qu'après une sélection."
          code={'<ToggleGroup className="k-stagger\n  [&_button]:animate-pop-in" />'}
          replayable
        >
          {(run) => (
            <ToggleGroup
              key={run}
              items={FORMAT}
              multiple
              defaultValue={["bold"]}
              className="k-stagger [&_button]:animate-pop-in"
            />
          )}
        </Specimen>
      </SpecimenGrid>
    </FantaisiePage>
  ),
};

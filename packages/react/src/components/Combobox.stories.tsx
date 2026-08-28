import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Combobox } from "./Combobox";
import { FantaisiePage, Specimen, SpecimenGrid } from "./fantaisie-specimen";

const VILLES = [
  "Tokyo", "Kyoto", "Osaka", "Sapporo", "Fukuoka", "Nagoya", "Kobe",
  "Hiroshima", "Sendai", "Yokohama", "Nara", "Kanazawa", "Nagasaki", "Matsumoto",
].map((v) => ({ value: v.toLowerCase(), label: v }));

const meta = {
  title: "Composants/Combobox",
  component: Combobox,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "Champ de saisie avec suggestions filtrées.",
          "",
          "Le filtrage passe par `useFilter` de Base UI, qui s'appuie sur",
          "`Intl.Collator` : taper « nagazaki » sans accent trouve « Nagasaki »,",
          "et la casse n'a aucune importance. Un `includes()` maison échoue sur",
          "les deux — c'est la raison de ne pas l'écrire soi-même.",
          "",
          "**Select ou Combobox ?** Au-delà d'une dizaine d'options, il faut",
          "pouvoir taper. C'est le seul critère.",
        ].join("\n"),
      },
    },
  },
  argTypes: { disabled: { control: "boolean" }, placeholder: { control: "text" } },
  args: { items: VILLES, placeholder: "Rechercher une ville…" },
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="max-w-xs">
      <Combobox {...args} />
    </div>
  ),
};

export const Galerie: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="grid max-w-2xl grid-cols-2 gap-6">
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-ink">Vide</span>
        <Combobox items={VILLES} />
      </label>
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-ink">Avec valeur</span>
        <Combobox items={VILLES} defaultValue="kyoto" />
      </label>
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-ink">Désactivé</span>
        <Combobox items={VILLES} defaultValue="osaka" disabled />
      </label>
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-ink">Message vide personnalisé</span>
        <Combobox items={VILLES} emptyMessage="Aucune ville ne correspond." />
      </label>
    </div>
  ),
};

/** Taper « nagazaki », sans accent ni majuscule : la ville est trouvée. */
export const Insensibilite: Story = {
  name: "Insensibilité aux accents",
  parameters: { controls: { disable: true } },
  render: function Insensibilite() {
    const [value, setValue] = useState<string | null>(null);
    return (
      <div className="flex max-w-xs flex-col gap-3">
        <Combobox items={VILLES} value={value} onValueChange={setValue} />
        <span className="font-mono text-xs text-ink-muted">value = {String(value)}</span>
      </div>
    );
  },
};

export const Fantaisie: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <FantaisiePage intro={<>Une recherche est une attente. Tout ce qui la fait paraître vivante compte — mais rien ne doit ralentir l'apparition des résultats, qui sont l'information demandée.</>}>
      <SpecimenGrid>
        <Specimen
          title="Champ en galet"
          note="Barre de recherche entièrement ronde, liste assortie. Le registre passe d'outil à objet."
          code={'<Combobox className="rounded-full" />'}
        >
          <div className="w-full max-w-xs">
            <Combobox items={VILLES} className="rounded-full [&_input]:px-5" />
          </div>
        </Specimen>

        <Specimen
          title="Résultats en cascade"
          note="Les résultats s'installent l'un après l'autre. Le décalage doit rester très court — c'est de l'information attendue, pas un spectacle."
          code={'<Combobox popupClassName="k-stagger" style={{ "--k-stagger": ".03s" }} />'}
        >
          <div className="w-full max-w-xs">
            <Combobox items={VILLES.slice(0, 5)} />
          </div>
        </Specimen>

        <Specimen
          title="Champ qui refuse"
          note="Un tremblement quand la recherche ne donne rien. Le refus se ressent avant d'être lu."
          code={'<div className="animate-shake"><Combobox /></div>'}
          replayable
        >
          {(run) => (
            <div key={run} className="w-full max-w-xs animate-shake">
              <Combobox items={[]} emptyMessage="Aucun résultat." />
            </div>
          )}
        </Specimen>

        <Specimen
          title="Penché"
          note="La barre posée à −2°, qui se redresse au focus. Elle s'aligne quand on s'en sert."
          code={'<Combobox className="-rotate-2\n  focus-within:rotate-0" />'}
        >
          <div className="w-full max-w-xs">
            <Combobox
              items={VILLES}
              className="-rotate-2 transition-transform duration-(--k-dur-3) ease-bounce focus-within:rotate-0"
            />
          </div>
        </Specimen>
      </SpecimenGrid>
    </FantaisiePage>
  ),
};

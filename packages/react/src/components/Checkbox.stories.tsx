import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox, CheckboxGroup } from "./Checkbox";
import { Sparkle } from "./Sparkle";
import { FantaisiePage, Specimen, SpecimenGrid } from "./fantaisie-specimen";

const meta = {
  title: "Composants/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "Case à cocher, avec état indéterminé.",
          "",
          "**Checkbox ou Switch ?** Une Checkbox dit « ce sera fait à l'envoi »,",
          "un Switch dit « c'est fait ». Dans un formulaire qui se valide, c'est",
          "toujours une Checkbox.",
          "",
          "La coche se **dessine** plutôt qu'elle n'apparaît : le tracé est animé",
          "en `stroke-dashoffset` sur 0.3 s. Sur un contrôle manipulé cent fois",
          "par jour, c'est le genre de détail qui distingue un système fini d'un",
          "système fonctionnel.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    label: { control: "text" },
    description: { control: "text" },
    disabled: { control: "boolean" },
    indeterminate: { control: "boolean" },
  },
  args: { label: "Accepter les conditions" },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Galerie: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-bold tracking-tight">États</h3>
        <div className="flex flex-col gap-3">
          <Checkbox label="Décochée" />
          <Checkbox label="Cochée" defaultChecked />
          <Checkbox label="Indéterminée" indeterminate />
          <Checkbox label="Désactivée" disabled />
          <Checkbox label="Désactivée et cochée" disabled defaultChecked />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-bold tracking-tight">Avec description</h3>
        <Checkbox
          label="Recevoir la lettre d'information"
          description="Un résumé mensuel, sans publicité. Désinscription en un clic."
          defaultChecked
        />
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-bold tracking-tight">Sans libellé</h3>
        <p className="text-xs text-ink-subtle">
          Pour une cellule de tableau. Un <code>aria-label</code> reste obligatoire.
        </p>
        <Checkbox aria-label="Sélectionner la ligne" />
      </section>
    </div>
  ),
};

/**
 * La case parente calcule seule son état indéterminé à partir d'`allValues` —
 * sans quoi il faut le dériver à la main, ce que tout le monde rate une fois.
 */
export const Groupe: Story = {
  parameters: { controls: { disable: true } },
  render: function Groupe() {
    const all = ["lecture", "ecriture", "suppression"];
    const [value, setValue] = useState<string[]>(["lecture"]);

    return (
      <CheckboxGroup
        allValues={all}
        value={value}
        onValueChange={setValue}
        className="flex flex-col gap-3"
      >
        <Checkbox parent label="Toutes les permissions" />
        <div className="flex flex-col gap-3 pl-7">
          <Checkbox name="lecture" label="Lecture" />
          <Checkbox name="ecriture" label="Écriture" />
          <Checkbox name="suppression" label="Suppression" />
        </div>
      </CheckboxGroup>
    );
  },
};

export const Fantaisie: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <FantaisiePage intro={<>La coche se dessine déjà par défaut. La fantaisie consiste ici à appuyer ce tracé, ou à célébrer le moment où la case bascule — un contrôle qu'on manipule cent fois par jour supporte mal davantage.</>}>
      <SpecimenGrid>
        <Specimen
          title="Case ronde"
          note="Sa grammaire de forme : le carré arrondi devient un galet. Change complètement le registre sans toucher au comportement."
          code={'<Checkbox className="rounded-full" />'}
        >
          <div className="flex flex-col gap-3">
            <Checkbox className="rounded-full" label="Toute ronde" defaultChecked />
            <Checkbox className="rounded-full" label="Décochée" />
          </div>
        </Specimen>

        <Specimen
          title="Tracé au ralenti"
          note="Le même dessin de coche, étiré sur une durée plus longue. Sur une case unique et importante, le geste devient lisible."
          code={'<Checkbox className="[&_path]:[animation-duration:0.9s]" />'}
          replayable
        >
          {(run) => (
            <Checkbox key={run} className="[&_path]:[animation-duration:0.9s]" label="Je comprends" defaultChecked />
          )}
        </Specimen>

        <Specimen
          title="Case qui s'écrase"
          note="Un pivot au bord bas plus un écrasement au clic : la case s'enfonce au lieu de simplement changer de couleur."
          code={'<Checkbox className="origin-bottom\n  active:animate-squish" />'}
        >
          <Checkbox className="origin-bottom active:animate-squish" label="Cliquer plusieurs fois" />
        </Specimen>

        <Specimen
          title="Validation fêtée"
          note="Des étincelles sur la case d'acceptation finale — celle qui débloque un parcours."
          code={'<Sparkle count={4}><Checkbox /></Sparkle>'}
        >
          <Sparkle count={4}>
            <Checkbox label="J'accepte les conditions" defaultChecked />
          </Sparkle>
        </Specimen>

        <Specimen
          title="Liste en cascade"
          note="Les options d'un groupe arrivent l'une après l'autre. Le séquençage du système, avec une animation expressive."
          code={'<div className="k-stagger">\n  <Checkbox className="animate-pop-in" />\n</div>'}
          replayable
        >
          {(run) => (
            <div key={run} className="k-stagger flex flex-col gap-3">
              {["Lecture", "Écriture", "Suppression"].map((t) => (
                <Checkbox key={t} className="animate-pop-in" label={t} />
              ))}
            </div>
          )}
        </Specimen>
      </SpecimenGrid>
    </FantaisiePage>
  ),
};

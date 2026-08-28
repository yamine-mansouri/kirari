import type { Meta, StoryObj } from "@storybook/react-vite";
import { Radio, RadioGroup } from "./Radio";
import { Sparkle } from "./Sparkle";
import { FantaisiePage, Specimen, SpecimenGrid } from "./fantaisie-specimen";

const meta = {
  title: "Composants/Radio",
  component: Radio,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "Bouton radio.",
          "",
          "**À utiliser dans un `RadioGroup`, jamais seul** : un radio isolé ne",
          "peut pas être décoché, ce qui piège l'utilisateur. Pour un choix",
          "binaire réversible, c'est une Checkbox ou un Switch.",
          "",
          "Au sein d'un groupe, les flèches naviguent **et** sélectionnent :",
          "c'est le comportement natif, et Base UI le respecte. Ne pas le",
          "contrarier avec un `onKeyDown` maison.",
        ].join("\n"),
      },
    },
  },
  args: { label: "Option", value: "a" },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <RadioGroup defaultValue="a" className="flex flex-col gap-3">
      <Radio {...args} />
    </RadioGroup>
  ),
};

export const Galerie: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-bold tracking-tight">Groupe simple</h3>
        <RadioGroup defaultValue="mensuel" className="flex flex-col gap-3">
          <Radio value="mensuel" label="Mensuel" />
          <Radio value="annuel" label="Annuel" />
          <Radio value="perso" label="Sur mesure" disabled />
        </RadioGroup>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-bold tracking-tight">Avec descriptions</h3>
        <RadioGroup defaultValue="equipe" className="flex flex-col gap-4">
          <Radio
            value="solo"
            label="Individuel"
            description="Un seul utilisateur, projets illimités."
          />
          <Radio
            value="equipe"
            label="Équipe"
            description="Jusqu'à dix utilisateurs, avec espace partagé."
          />
          <Radio
            value="entreprise"
            label="Entreprise"
            description="Sur devis, avec authentification unique."
          />
        </RadioGroup>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-bold tracking-tight">Horizontal</h3>
        <RadioGroup defaultValue="m" className="flex gap-6">
          {["S", "M", "L", "XL"].map((size) => (
            <Radio key={size} value={size.toLowerCase()} label={size} />
          ))}
        </RadioGroup>
      </section>
    </div>
  ),
};

/** Le point grandit depuis rien en `ease-bounce` — un clic sec, pas un fondu. */
export const Mouvement: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-4">
      <p className="max-w-[62ch] text-sm text-ink-muted">
        Cliquer d'une option à l'autre, ou naviguer aux flèches après avoir
        cliqué une fois.
      </p>
      <RadioGroup defaultValue="a" className="flex gap-8">
        {["a", "b", "c"].map((v) => (
          <Radio key={v} value={v} label={v.toUpperCase()} />
        ))}
      </RadioGroup>
    </div>
  ),
};

export const Fantaisie: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <FantaisiePage intro={<>Le point central est déjà une petite mécanique. L'accentuer donne la sensation d'un vrai bouton poussoir, ce que le Radio prétend imiter depuis toujours.</>}>
      <SpecimenGrid>
        <Specimen
          title="Point en gelée"
          note="Le point ne grandit plus, il déborde puis se rétracte. Sur trois options, la sélection devient physique."
          code={'<Radio className="[&>span]:animate-jelly" />'}
        >
          <RadioGroup defaultValue="a" className="flex gap-6">
            {["a", "b", "c"].map((v) => (
              <Radio key={v} value={v} label={v.toUpperCase()} className="[&>span]:animate-jelly" />
            ))}
          </RadioGroup>
        </Specimen>

        <Specimen
          title="Cible qui s'enfonce"
          note="Un écrasement au clic, pivoté sur le bord bas. La cible réagit avant même que la sélection change."
          code={'<Radio className="origin-bottom\n  active:animate-squish" />'}
        >
          <RadioGroup defaultValue="1" className="flex gap-6">
            {["1", "2", "3"].map((v) => (
              <Radio key={v} value={v} label={v} className="origin-bottom active:animate-squish" />
            ))}
          </RadioGroup>
        </Specimen>

        <Specimen
          title="Choix fêté"
          note="Sur une offre mise en avant, l'option recommandée scintille en permanence."
          code={'<Sparkle count={5}><Radio /></Sparkle>'}
        >
          <RadioGroup defaultValue="pro" className="flex flex-col gap-3">
            <Radio value="base" label="Essentiel" />
            <Sparkle count={5}>
              <Radio value="pro" label="Pro — recommandé" />
            </Sparkle>
          </RadioGroup>
        </Specimen>

        <Specimen
          title="Groupe en cascade"
          note="Les options apparaissent l'une après l'autre quand le groupe entre à l'écran."
          code={'<RadioGroup className="k-stagger">\n  <Radio className="animate-pop-in" />\n</RadioGroup>'}
          replayable
        >
          {(run) => (
            <RadioGroup key={run} defaultValue="m" className="k-stagger flex flex-col gap-3">
              {["Mensuel", "Annuel", "À vie"].map((t) => (
                <Radio key={t} value={t.toLowerCase()} label={t} className="animate-pop-in" />
              ))}
            </RadioGroup>
          )}
        </Specimen>
      </SpecimenGrid>
    </FantaisiePage>
  ),
};

import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Switch } from "./Switch";
import { Sparkle } from "./Sparkle";
import { FantaisiePage, Specimen, SpecimenGrid } from "./fantaisie-specimen";

const meta = {
  title: "Composants/Switch",
  component: Switch,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "Bascule booléenne **à effet immédiat**.",
          "",
          "**Switch ou Checkbox ?** Un Switch dit « c'est fait » — l'effet est",
          "appliqué à l'instant du clic. Une Checkbox dit « ce sera fait à",
          "l'envoi ». Mettre un Switch dans un formulaire qui se valide est le",
          "contresens le plus fréquent sur ce composant.",
          "",
          "La course du pouce est le composant : c'est l'un des rares endroits",
          "où `ease-spring` se justifie. Le léger dépassement à l'arrivée donne",
          "la sensation d'un interrupteur, pas d'un rectangle qui change de",
          "couleur.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    size: { control: "radio", options: ["sm", "md", "lg"] },
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: { size: "md", label: "Notifications par e-mail" },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Galerie: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-bold tracking-tight">Tailles</h3>
        <div className="flex items-center gap-6">
          {(["sm", "md", "lg"] as const).map((size) => (
            <label key={size} className="flex items-center gap-2 text-sm text-ink-muted">
              <Switch size={size} defaultChecked />
              {size}
            </label>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-bold tracking-tight">États</h3>
        <div className="flex items-center gap-6 text-sm text-ink-muted">
          <label className="flex items-center gap-2"><Switch /> éteint</label>
          <label className="flex items-center gap-2"><Switch defaultChecked /> allumé</label>
          <label className="flex items-center gap-2"><Switch disabled /> désactivé</label>
          <label className="flex items-center gap-2"><Switch disabled defaultChecked /> désactivé allumé</label>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-bold tracking-tight">En situation</h3>
        <div className="flex max-w-md flex-col gap-1 rounded-lg border border-line bg-surface p-4">
          {[
            ["Notifications par e-mail", "Un résumé quotidien de votre activité.", true],
            ["Mode compact", "Réduit les espacements dans les listes.", false],
            ["Suivi analytique", "Indisponible sur votre offre actuelle.", false],
          ].map(([title, desc, on], i) => (
            <label
              key={title as string}
              className="flex cursor-pointer items-start justify-between gap-6 py-3 not-last:border-b not-last:border-line"
            >
              <span className="min-w-0">
                <span className="block text-sm font-medium text-ink">{title}</span>
                <span className="block text-xs text-ink-muted">{desc}</span>
              </span>
              <Switch defaultChecked={on as boolean} disabled={i === 2} />
            </label>
          ))}
        </div>
      </section>
    </div>
  ),
};

/** Contrôlé : l'état vit chez le parent. */
export const Controle: Story = {
  name: "Contrôlé",
  parameters: { controls: { disable: true } },
  render: function Controle() {
    const [on, setOn] = useState(false);
    return (
      <div className="flex items-center gap-4">
        <Switch checked={on} onCheckedChange={setOn} size="lg" label="Mode nuit" />
        <span className="font-mono text-sm text-ink-muted">
          checked = {String(on)}
        </span>
      </div>
    );
  },
};

/** Un interrupteur, c'est déjà un objet physique : c'est là que « jouet » se justifie le mieux. */
export const Fantaisie: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <FantaisiePage
      intro={
        <>
          Le Switch imite déjà un objet du monde réel. Renforcer sa matière n'est
                  donc pas un ornement : c'est rendre plus lisible ce qu'il prétend être.
                  C'est le contrôle où la fantaisie se justifie le plus facilement.
        </>
      }
    >
      <SpecimenGrid>
        <Specimen
          title="Bascule qui s'écrase"
          note="Le rail s'aplatit brièvement au clic, comme un vrai interrupteur qu'on enfonce."
          code={`<Switch className="origin-center\n  active:animate-squish" />`}
        >
          <Switch size="lg" aria-label="Exemple" className="active:animate-squish" defaultChecked />
        </Specimen>

        <Specimen
          title="Rail en gelée"
          note="Plus appuyé : l'objet tremble à l'activation. À réserver à un réglage marquant, pas à une liste de préférences."
          code={`<Switch className="active:animate-jelly" />`}
        >
          <Switch size="lg" aria-label="Exemple" className="active:animate-jelly" />
        </Specimen>

        <Specimen
          title="Célébration à l'allumage"
          note="Des étincelles quand le réglage passe à l'actif. Le retour positif que mérite une activation importante."
          code={`<Sparkle count={4}><Switch /></Sparkle>`}
        >
          <Sparkle count={4}>
            <Switch size="lg" aria-label="Exemple" defaultChecked />
          </Sparkle>
        </Specimen>

        <Specimen
          title="Penché"
          note="Le rail posé à −4°, dans une carte elle-même droite. Un détail minuscule qui suffit à casser la rigidité."
          code={`<Switch className="-rotate-4" />`}
        >
          <label className="flex items-center gap-3 text-sm text-ink-muted">
            Mode nuit
            <Switch size="lg" aria-label="Exemple" className="-rotate-4" defaultChecked />
          </label>
        </Specimen>
      </SpecimenGrid>
    </FantaisiePage>
  ),
};

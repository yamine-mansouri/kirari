import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Field } from "./Field";
import { FantaisiePage, Specimen, SpecimenGrid } from "./fantaisie-specimen";

const meta = {
  title: "Composants/Field",
  component: Field,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "Champ complet : label, contrôle, aide et erreur. Les liaisons ARIA",
          "sont câblées automatiquement — `aria-describedby` pointe vers l'aide",
          "ou vers l'erreur selon l'état, `aria-invalid` suit `error`, et le",
          "message d'erreur porte `role=\"alert\"`.",
          "",
          "Le soulignement d'accent se déploie depuis le centre au focus. Il est",
          "posé sur un conteneur en `focus-within` et non sur l'input, car un",
          "pseudo-élément ne peut pas être enfant d'un `<input>`.",
          "",
          "**La présence de `error` suffit** à basculer le champ en état",
          "invalide : ne pas gérer un booléen séparé.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    label: { control: "text" },
    hint: { control: "text" },
    error: { control: "text" },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
  },
  args: {
    label: "Adresse e-mail",
    placeholder: "vous@exemple.fr",
    hint: "Le soulignement se déploie depuis le centre au focus.",
  },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="max-w-sm">
      <Field {...args} />
    </div>
  ),
};

export const Galerie: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="grid max-w-3xl grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-6">
      <Field label="Par défaut" placeholder="Saisir…" />
      <Field label="Avec aide" placeholder="Saisir…" hint="Un texte d'accompagnement." />
      <Field
        label="En erreur"
        defaultValue="pas-un-email"
        error="Adresse e-mail invalide."
        hint="Cette aide est masquée tant qu'une erreur est affichée."
      />
      <Field label="Désactivé" placeholder="Indisponible" disabled />
      <Field label="Mot de passe" type="password" defaultValue="motdepasse" />
      <Field label="Nombre" type="number" defaultValue={42} />
    </div>
  ),
};

/** La validation est portée par le parent : `error` est une prop, pas un état interne. */
export const Validation: Story = {
  parameters: { controls: { disable: true } },
  render: function Validation() {
    const [email, setEmail] = useState("");
    const error =
      email.length > 0 && !email.includes("@") ? "Adresse e-mail invalide." : undefined;

    return (
      <div className="max-w-sm">
        <Field
          label="Adresse e-mail"
          type="email"
          placeholder="vous@exemple.fr"
          hint="Saisir un texte sans arobase pour déclencher l'erreur."
          value={email}
          error={error}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
    );
  },
};

export const Fantaisie: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <FantaisiePage intro={<>Un champ passe l'essentiel de son temps au repos. La fantaisie s'y joue aux deux moments qui comptent : la prise de focus, et le refus.</>}>
      <SpecimenGrid>
        <Specimen
          title="Refus"
          note="Le champ tremble à l'erreur. C'est le seul usage légitime du tremblement — jamais du décor, toujours un refus."
          code={'<Field className="animate-shake" error="…" />'}
          replayable
        >
          {(run) => (
            <div key={run} className="w-full max-w-xs">
              <Field
                label="Adresse e-mail"
                defaultValue="pas-un-email"
                error="Adresse invalide."
                containerClassName="animate-shake"
              />
            </div>
          )}
        </Specimen>

        <Specimen
          title="Champ en galet"
          note="Rayon plein sur le contrôle. Le formulaire perd son air administratif."
          code={'<Field className="rounded-full px-5" />'}
        >
          <div className="w-full max-w-xs">
            <Field label="Rechercher" placeholder="Un mot…" className="rounded-full px-5" />
          </div>
        </Specimen>

        <Specimen
          title="Label qui hoche"
          note="Le libellé acquiesce à la prise de focus. Discret, mais il désigne le champ actif sans couleur supplémentaire."
          code={'<Field containerClassName="focus-within:[&>label]:animate-tick" />'}
        >
          <div className="w-full max-w-xs">
            <Field
              label="Cliquer ici"
              placeholder="Le libellé réagit"
              containerClassName="focus-within:[&>label]:animate-tick"
            />
          </div>
        </Specimen>

        <Specimen
          title="Formulaire en cascade"
          note="Les champs arrivent l'un après l'autre. Une inscription se compose sous les yeux au lieu d'apparaître d'un bloc."
          code={'<form className="k-stagger">\n  <Field containerClassName="animate-slide-up" />\n</form>'}
          replayable
        >
          {(run) => (
            <div key={run} className="k-stagger flex w-full max-w-xs flex-col gap-4">
              {["Nom", "Adresse e-mail", "Mot de passe"].map((l) => (
                <Field key={l} label={l} containerClassName="animate-slide-up" />
              ))}
            </div>
          )}
        </Specimen>
      </SpecimenGrid>
    </FantaisiePage>
  ),
};

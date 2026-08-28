import type { Meta, StoryObj } from "@storybook/react-vite";
import { Separator } from "./Separator";
import { FantaisiePage, Specimen, SpecimenGrid } from "./fantaisie-specimen";
import { Button } from "./Button";

const meta = {
  title: "Composants/Separator",
  component: Separator,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "Trait de séparation.",
          "",
          "Trivial en apparence, mais il porte le bon rôle ARIA — un `<hr>`",
          "stylé à la main, ou pire un `<div>` avec une bordure, n'annonce",
          "rien.",
          "",
          "Avec un `label`, le séparateur devient **décoratif** : le texte",
          "suffit alors à marquer la rupture pour un lecteur d'écran, et le",
          "rôle serait redondant.",
        ].join("\n"),
      },
    },
  },
  argTypes: { orientation: { control: "radio", options: ["horizontal", "vertical"] } },
  args: {},
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="max-w-md">
      <p className="pb-4 text-sm text-ink-muted">Au-dessus</p>
      <Separator {...args} />
      <p className="pt-4 text-sm text-ink-muted">En dessous</p>
    </div>
  ),
};

export const Galerie: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-8">
      <section className="flex max-w-md flex-col gap-3">
        <h3 className="text-sm font-bold tracking-tight">Horizontal</h3>
        <Separator />
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-bold tracking-tight">Vertical</h3>
        <div className="flex h-8 items-center gap-4">
          <span className="text-sm text-ink-muted">Modifier</span>
          <Separator orientation="vertical" />
          <span className="text-sm text-ink-muted">Dupliquer</span>
          <Separator orientation="vertical" />
          <span className="text-sm text-ink-muted">Supprimer</span>
        </div>
      </section>

      <section className="flex max-w-md flex-col gap-3">
        <h3 className="text-sm font-bold tracking-tight">Avec libellé</h3>
        <div className="flex flex-col gap-4">
          <Button variant="outline" block>Continuer avec un compte</Button>
          <Separator label="ou" />
          <Button block>Créer un compte</Button>
        </div>
      </section>
    </div>
  ),
};

export const Fantaisie: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <FantaisiePage intro={<>Un trait n'a presque rien à offrir — c'est justement l'intérêt : il montre jusqu'où le vocabulaire peut aller sur l'élément le plus pauvre du système.</>}>
      <SpecimenGrid>
        <Specimen
          title="Tracé progressif"
          note="Le trait se dessine de gauche à droite au lieu d'être là. Une révélation par masque, pas une apparition."
          code={'<Separator className="animate-wipe-right" />'}
          replayable
        >
          {(run) => (
            <div key={run} className="w-full">
              <Separator className="animate-wipe-right" />
            </div>
          )}
        </Specimen>

        <Specimen
          title="Trait d'accent épais"
          note="Court, rond et coloré : la séparation devient un ornement plutôt qu'une frontière."
          code={'<Separator className="h-1 w-16 rounded-full\n  bg-accent mx-auto" />'}
        >
          <Separator className="mx-auto h-1 w-16 rounded-full bg-accent" />
        </Specimen>

        <Specimen
          title="Libellé qui pivote"
          note="Le mot posé de travers sur le trait, comme une étiquette collée."
          code={'<Separator label={<span className="-rotate-6" />} />'}
        >
          <div className="w-full">
            <Separator label={<span className="inline-block -rotate-6">ou</span>} />
          </div>
        </Specimen>

        <Specimen
          title="Ligne pointillée qui dérive"
          note="Un séparateur décoratif qui vit très lentement. À réserver à une page vide ou un pied de page."
          code={'<span className="animate-drift border-dashed" />'}
        >
          <span
            aria-hidden="true"
            className="block h-px w-full animate-drift border-t-2 border-dashed border-line-strong"
          />
        </Specimen>
      </SpecimenGrid>
    </FantaisiePage>
  ),
};

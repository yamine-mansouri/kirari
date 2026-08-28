import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card } from "./Card";
import { Button } from "./Button";
import { Skeleton } from "./Skeleton";
import { Sparkle } from "./Sparkle";
import { FantaisiePage, Specimen, SpecimenGrid } from "./fantaisie-specimen";

const meta = {
  title: "Composants/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "L'ombre reste volontairement discrète : dans Kirari, la hiérarchie",
          "passe d'abord par le mouvement, pas par la profondeur.",
          "",
          "**Quelle variante ?** `raised` par défaut. `flat` quand la carte est",
          "déjà posée sur une surface distincte. `sunken` pour un contenu en",
          "attente ou secondaire. Ajouter `interactive` **uniquement** si la",
          "carte entière est cliquable — sinon le survol ment sur l'affordance.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    variant: { control: "radio", options: ["raised", "flat", "sunken"] },
    interactive: { control: "boolean" },
    title: { control: "text" },
  },
  args: {
    title: "Titre de la carte",
    children: "Le corps de la carte, en texte atténué pour laisser le titre porter.",
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Galerie: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(17rem,1fr))] gap-4">
      <Card title="Raised" footer={<Button size="sm" variant="soft">Action</Button>}>
        La variante par défaut, avec une ombre légère.
      </Card>
      <Card variant="flat" title="Flat">
        Sans ombre — pour une carte déjà posée sur une surface distincte.
      </Card>
      <Card variant="sunken" title="Sunken">
        Enfoncée dans la page, pour un contenu secondaire ou en attente.
      </Card>
      <Card interactive title="Interactive">
        Survoler : la carte se soulève et un liseré d'accent remonte du bas.
      </Card>
      <Card variant="sunken" title="En chargement">
        <Skeleton shape="text" lines={3} />
      </Card>
      <Card title="Sans corps" footer={<span className="text-xs text-ink-subtle">footer seul</span>} />
    </div>
  ),
};

export const Mouvement: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-6">
      <p className="max-w-[62ch] text-sm text-ink-muted">
        Survoler puis quitter. Le liseré entre par la gauche en{" "}
        <code>ease-enter</code>, se retire par la droite en <code>ease-exit</code>.
        L'élévation et l'ombre suivent la même courbe que le liseré, pour que
        les trois mouvements se lisent comme un seul geste.
      </p>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(17rem,1fr))] gap-4">
        <Card interactive title="Survoler ici">Puis quitter, et observer le retrait.</Card>
        <Card interactive title="Et ici">Les deux sens n'ont pas la même courbe.</Card>
      </div>
    </div>
  ),
};

/** La carte est une grande surface : elle supporte des gestes plus amples. */
export const Fantaisie: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <FantaisiePage
      intro={
        <>
          Une carte occupe assez d'espace pour porter un geste ample sans devenir
                  fatigante. C'est aussi le meilleur endroit pour un décor de fond qui vit
                  lentement, puisqu'il reste loin du texte.
        </>
      }
    >
      <SpecimenGrid>
        <Specimen
          title="Charnière"
          note="Le pivot au bord haut donne l'impression d'une carte accrochée qui se soulève, plutôt que d'une carte qui grossit."
          code={`<Card className="origin-top\n  transition-transform ease-bounce\n  hover:scale-[1.03]" />`}
        >
          <Card
            title="Suspendue"
            className="origin-top transition-transform duration-(--k-dur-3) ease-bounce hover:scale-[1.03]"
          >
            Survoler pour la soulever.
          </Card>
        </Specimen>

        <Specimen
          title="Pile de travers"
          note="Deux cartes décalées de quelques degrés, qui se redressent au survol. L'empilement se lit avant même de lire le texte."
          code={`<Card className="-rotate-2 hover:rotate-0" />\n<Card className="rotate-1 hover:rotate-0" />`}
        >
          <div className="grid">
            <Card
              variant="flat"
              className="col-start-1 row-start-1 -rotate-3 transition-transform duration-(--k-dur-3) ease-bounce hover:rotate-0"
            >
              Dessous
            </Card>
            <Card
              className="col-start-1 row-start-1 translate-x-3 translate-y-3 rotate-2 transition-transform duration-(--k-dur-3) ease-bounce hover:rotate-0"
            >
              Dessus
            </Card>
          </div>
        </Specimen>

        <Specimen
          title="Décor à la dérive"
          note="Des formes qui bougent très lentement en fond. Elles n'attirent pas l'œil, elles empêchent la surface d'être morte."
          code={`<span className="animate-drift\n  bg-accent-subtle blur-2xl" />`}
        >
          <Card className="relative overflow-hidden">
            <span
              aria-hidden="true"
              className="absolute -top-8 -right-6 size-24 animate-drift rounded-full bg-accent-subtle blur-2xl"
            />
            <span
              aria-hidden="true"
              className="absolute -bottom-10 -left-4 size-20 animate-drift rounded-full bg-accent-2-subtle blur-2xl [animation-delay:2s]"
            />
            <span className="relative text-sm">Un fond qui respire.</span>
          </Card>
        </Specimen>

        <Specimen
          title="Galet"
          note="Rayon très large, aucune ombre, bordure plus douce. Sa grammaire de forme appliquée à une surface."
          code={`<Card className="rounded-[2rem]\n  shadow-none" />`}
        >
          <Card title="Tout doux" className="rounded-[2rem] shadow-none">
            La profondeur vient de la forme.
          </Card>
        </Specimen>

        <Specimen
          title="Carte fêtée"
          note="Étincelles permanentes : à ne faire que sur une carte unique dans un écran, jamais dans une liste."
          code={`<Sparkle count={6}><Card /></Sparkle>`}
        >
          <Sparkle count={6} className="w-full">
            <Card title="Offre spéciale" className="w-full">
              Ce qui mérite d'être remarqué.
            </Card>
          </Sparkle>
        </Specimen>

        <Specimen
          title="Arrivée séquencée"
          note="Trois cartes qui surgissent l'une après l'autre depuis leur base. Le séquençage existe déjà dans le système — il suffit de changer l'animation."
          code={`<Stagger step={0.09}>\n  <Card className="animate-pop-in\n    origin-bottom" />\n</Stagger>`}
          replayable
        >
          {(run) => (
            <div key={run} className="k-stagger flex w-full flex-col gap-2">
              {["Un", "Deux", "Trois"].map((t) => (
                <Card key={t} variant="sunken" className="origin-bottom animate-pop-in py-2">
                  {t}
                </Card>
              ))}
            </div>
          )}
        </Specimen>
      </SpecimenGrid>
    </FantaisiePage>
  ),
};

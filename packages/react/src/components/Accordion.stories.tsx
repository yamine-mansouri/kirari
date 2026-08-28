import type { Meta, StoryObj } from "@storybook/react-vite";
import { Accordion, Collapsible } from "./Accordion";
import { FantaisiePage, Specimen, SpecimenGrid } from "./fantaisie-specimen";

const ITEMS = [
  {
    value: "livraison",
    title: "Quels sont les délais de livraison ?",
    content: "Entre deux et quatre jours ouvrés en France métropolitaine. Un numéro de suivi vous est envoyé dès l'expédition.",
  },
  {
    value: "retour",
    title: "Puis-je retourner un article ?",
    content: "Oui, sous trente jours et dans son emballage d'origine. Les frais de retour sont à notre charge.",
  },
  {
    value: "garantie",
    title: "Comment fonctionne la garantie ?",
    content: "Deux ans à compter de la date d'achat, pièces et main-d'œuvre comprises. Elle ne couvre pas l'usure normale ni les dommages accidentels. Ce panneau est volontairement plus long que les autres, pour vérifier que l'animation de hauteur s'adapte au contenu réel.",
  },
];

const meta = {
  title: "Composants/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "Panneaux repliables.",
          "",
          "**L'animation de hauteur est le piège classique.** Le navigateur ne",
          "sait pas interpoler vers `height: auto` : la plupart des",
          "implémentations tombent donc dans un `max-height` arbitraire, qui",
          "saccade quand le contenu est plus court, et tronque quand il est",
          "plus long.",
          "",
          "Base UI mesure le panneau et expose `--accordion-panel-height`. Les",
          "keyframes Kirari partent de cette valeur : le dépliage est exact,",
          "quel que soit le contenu.",
          "",
          "La fermeture est **plus rapide** que l'ouverture (0.3 s contre 0.4 s)",
          "— on attend un dépliage, on n'attend pas un repliage.",
        ].join("\n"),
      },
    },
  },
  argTypes: { multiple: { control: "boolean" } },
  args: { items: ITEMS },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Galerie: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-bold tracking-tight">Un seul panneau ouvert</h3>
        <Accordion items={ITEMS} defaultValue={["livraison"]} />
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-bold tracking-tight">Plusieurs panneaux</h3>
        <Accordion items={ITEMS} multiple defaultValue={["livraison", "retour"]} />
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-bold tracking-tight">Avec un panneau désactivé</h3>
        <Accordion
          items={[...ITEMS.slice(0, 2), { ...ITEMS[2]!, disabled: true }]}
        />
      </section>
    </div>
  ),
};

/**
 * La primitive de repli, seule — un « voir plus » isolé, sans le chrome de
 * l'Accordion. Même mécanique de hauteur mesurée.
 */
export const Repli: Story = {
  name: "Collapsible",
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex max-w-lg flex-col gap-4">
      <p className="text-sm text-ink-muted">
        Un texte d'introduction, toujours visible.
      </p>
      <Collapsible trigger="Voir les détails techniques">
        <p className="text-sm text-ink-muted">
          Le panneau est mesuré à l'ouverture, donc l'animation reste exacte même
          si son contenu change entre deux dépliages — un cas que les
          implémentations à <code>max-height</code> gèrent toujours mal.
        </p>
      </Collapsible>
    </div>
  ),
};

/** Ouvrir le troisième panneau, nettement plus long : la hauteur est exacte. */
export const Mouvement: Story = {
  parameters: { controls: { disable: true } },
  render: () => <Accordion items={ITEMS} multiple />,
};

export const Fantaisie: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <FantaisiePage intro={<>Le dépliage est déjà une mécanique. Ce qu'on peut ajouter, c'est la sensation que le panneau est articulé sur son en-tête plutôt que d'être une boîte qui grandit.</>}>
      <SpecimenGrid>
        <Specimen
          title="Chevron qui hoche"
          note="Le chevron acquiesce au survol, avant même l'ouverture. Il annonce qu'il est actionnable."
          code={'<Accordion className="[&_svg]:hover:animate-tick" />'}
        >
          <Accordion items={ITEMS.slice(0, 2)} className="w-full [&_button:hover_svg]:animate-tick" />
        </Specimen>

        <Specimen
          title="Panneaux en galet"
          note="Chaque élément devient une pastille séparée plutôt qu'une liste soudée."
          code={'<Accordion className="border-0 gap-2 bg-transparent\n  [&>div]:rounded-2xl [&>div]:border" />'}
        >
          <Accordion
            items={ITEMS.slice(0, 3)}
            className="w-full gap-2 border-0 bg-transparent [&>div]:rounded-2xl [&>div]:border [&>div]:border-line [&>div]:bg-surface"
          />
        </Specimen>

        <Specimen
          title="Contenu en cascade"
          note="Le panneau s'ouvre, puis son contenu s'installe. Deux temps, ce qui rend la hauteur plus lisible."
          code={'<div className="k-stagger">\n  <p className="animate-slide-up" />\n</div>'}
        >
          <Accordion
            className="w-full"
            defaultValue={["a"]}
            items={[
              {
                value: "a",
                title: "Trois points à retenir",
                content: (
                  <div className="k-stagger flex flex-col gap-2">
                    {["Le premier point", "Le deuxième", "Et le dernier"].map((t) => (
                      <span key={t} className="animate-slide-up">{t}</span>
                    ))}
                  </div>
                ),
              },
            ]}
          />
        </Specimen>

        <Specimen
          title="Repli suspendu"
          note="Sur le Collapsible isolé : le déclencheur se balance depuis son bord haut au survol."
          code={'<Collapsible className="[&>button]:origin-top\n  [&>button]:hover:animate-swing" />'}
        >
          <Collapsible
            trigger="Voir plus"
            className="w-full [&>button]:origin-top [&>button]:hover:animate-swing"
          >
            <p className="text-sm text-ink-muted">Le contenu déplié.</p>
          </Collapsible>
        </Specimen>
      </SpecimenGrid>
    </FantaisiePage>
  ),
};

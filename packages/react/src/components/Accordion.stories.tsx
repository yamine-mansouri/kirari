import type { Meta, StoryObj } from "@storybook/react-vite";
import { Accordion, Collapsible } from "./Accordion";

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

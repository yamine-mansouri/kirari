import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tabs } from "./Tabs";
import { FantaisiePage, Specimen, SpecimenGrid } from "./fantaisie-specimen";
import { Card } from "./Card";

const ITEMS = [
  { value: "apercu", label: "Aperçu", content: <p className="text-sm text-ink-muted">Le résumé de l'activité récente.</p> },
  { value: "analyse", label: "Analyse", content: <p className="text-sm text-ink-muted">Les mesures détaillées, période par période.</p> },
  { value: "reglages", label: "Réglages", content: <p className="text-sm text-ink-muted">La configuration du projet.</p> },
  { value: "archive", label: "Archive", content: <p className="text-sm text-ink-muted">Indisponible.</p>, disabled: true },
];

const meta = {
  title: "Composants/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "Onglets.",
          "",
          "**L'indicateur qui glisse est le geste le plus reconnaissable d'un",
          "design system** — et le plus souvent bâclé, parce qu'il demande de",
          "mesurer l'onglet actif à chaque changement.",
          "",
          "Base UI expose cette mesure en variables CSS (`--active-tab-left`,",
          "`--active-tab-width`…) : la transition se fait donc en CSS pur, sans",
          "ResizeObserver ni recalcul au rendu. Redimensionner la fenêtre :",
          "l'indicateur suit sans une ligne de JavaScript.",
          "",
          "**Tabs ou ToggleGroup ?** Un Tabs change ce qui est affiché en",
          "dessous. Un ToggleGroup change un réglage.",
        ].join("\n"),
      },
    },
  },
  argTypes: { orientation: { control: "radio", options: ["horizontal", "vertical"] } },
  args: { items: ITEMS },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Galerie: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-bold tracking-tight">Horizontal</h3>
        <Tabs items={ITEMS} />
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-bold tracking-tight">Vertical</h3>
        <Tabs items={ITEMS} orientation="vertical" />
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-bold tracking-tight">Dans une carte</h3>
        <Card className="p-0">
          <div className="p-5">
            <Tabs items={ITEMS.slice(0, 3)} />
          </div>
        </Card>
      </section>
    </div>
  ),
};

/**
 * Passer d'un onglet à l'autre, y compris en sautant du premier au dernier :
 * l'indicateur glisse en `ease-glide`, la seule courbe du système pensée pour
 * un déplacement long et régulier.
 */
export const Mouvement: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-4">
      <p className="max-w-[62ch] text-sm text-ink-muted">
        Les libellés ont volontairement des largeurs très différentes : c'est là
        que se voit si l'indicateur est mesuré ou approximé.
      </p>
      <Tabs
        items={[
          { value: "a", label: "Un" },
          { value: "b", label: "Un onglet nettement plus large" },
          { value: "c", label: "Moyen" },
          { value: "d", label: "Court" },
        ]}
      />
    </div>
  ),
};

export const Fantaisie: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <FantaisiePage intro={<>L'indicateur glissant est déjà le geste signature du composant. La fantaisie consiste à le rendre plus matériel, ou à animer ce qu'il révèle.</>}>
      <SpecimenGrid wide>
        <Specimen
          title="Indicateur en pastille"
          note="Le trait devient un fond arrondi qui coulisse derrière l'onglet actif. Même mécanique, tout autre registre."
          code={'<Tabs className="[&_[role=tablist]>span]:h-full\n  [&_[role=tablist]>span]:rounded-full" />'}
        >
          <Tabs
            items={ITEMS.slice(0, 3)}
            className="[&_[role=tablist]]:border-0 [&_[role=tablist]]:rounded-full [&_[role=tablist]]:bg-surface-sunken [&_[role=tablist]]:p-1 [&_[role=tablist]>span]:bottom-0 [&_[role=tablist]>span]:h-full [&_[role=tablist]>span]:rounded-full [&_[role=tablist]>span]:bg-accent-subtle"
          />
        </Specimen>

        <Specimen
          title="Onglets qui hochent"
          note="Chaque onglet acquiesce au survol, avant même d'être sélectionné."
          code={'<Tabs className="[&_[role=tab]]:hover:animate-tick" />'}
        >
          <Tabs items={ITEMS.slice(0, 3)} className="[&_[role=tab]]:hover:animate-tick" />
        </Specimen>

        <Specimen
          title="Panneau révélé"
          note="Le contenu se dévoile par un masque au lieu d'apparaître. L'onglet ne change pas de page, il lève un rideau."
          code={'<Tabs className="[&_[role=tabpanel]]:animate-wipe-up" />'}
          replayable
        >
          {(run) => (
            <Tabs
              key={run}
              items={ITEMS.slice(0, 3)}
              className="[&_[role=tabpanel]]:animate-wipe-up"
            />
          )}
        </Specimen>

        <Specimen
          title="Barre penchée"
          note="La rangée d'onglets à −1,5°. Presque imperceptible, et pourtant l'écran ne ressemble plus à un tableur."
          code={'<Tabs className="[&_[role=tablist]]:-rotate-[1.5deg]" />'}
        >
          <Tabs items={ITEMS.slice(0, 3)} className="[&_[role=tablist]]:-rotate-[1.5deg]" />
        </Specimen>
      </SpecimenGrid>
    </FantaisiePage>
  ),
};

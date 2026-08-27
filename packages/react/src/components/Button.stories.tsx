import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./Button";

const meta = {
  title: "Composants/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "Le survol n'est pas un changement de couleur : un calque se déploie",
          "derrière le label, entre par la gauche et se retire par la droite —",
          "avec une courbe différente dans chaque sens. C'est la règle",
          "fondatrice de Kirari appliquée au plus petit composant du système.",
          "",
          "**Quelle variante ?** `solid` pour l'action principale d'un écran,",
          "une seule à la fois. `soft` pour une action secondaire qui doit",
          "rester visible. `outline` quand l'action est neutre. `ghost` pour",
          "les actions de service (annuler, fermer). `danger` uniquement pour",
          "une action destructrice et irréversible.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    variant: { control: "select", options: ["solid", "soft", "outline", "ghost", "danger"] },
    size: { control: "radio", options: ["sm", "md", "lg"] },
    block: { control: "boolean" },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
    children: { control: "text" },
  },
  args: { children: "Enregistrer", variant: "solid", size: "md" },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Une instance, tous les contrôles. */
export const Playground: Story = {};

/**
 * Toutes les variantes, tailles et états en une vue. C'est cette page qui sert
 * de référence quand on conçoit un écran — un playground montre une instance,
 * une galerie montre le système.
 */
export const Galerie: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-bold tracking-tight">Variantes</h3>
        <div className="flex flex-wrap items-center gap-3">
          <Button>Solid</Button>
          <Button variant="soft">Soft</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-bold tracking-tight">Tailles</h3>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Petit</Button>
          <Button size="md">Moyen</Button>
          <Button size="lg">Grand</Button>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-bold tracking-tight">États</h3>
        <div className="flex flex-wrap items-center gap-3">
          <Button>Normal</Button>
          <Button loading>Chargement</Button>
          <Button disabled>Désactivé</Button>
          <Button variant="soft" loading>Soft en charge</Button>
          <Button variant="outline" disabled>Outline désactivé</Button>
        </div>
        <p className="text-xs text-ink-subtle">
          En chargement, le label est masqué visuellement mais annoncé aux lecteurs
          d'écran via <code>aria-busy</code>. Le spinner repart de la couleur de la
          variante : <code>currentColor</code> est transparent à cet endroit.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-bold tracking-tight">Pleine largeur</h3>
        <div className="max-w-sm">
          <Button block>Bloc</Button>
        </div>
      </section>
    </div>
  ),
};

/**
 * Le mouvement ne se voit pas sur une grille figée. Survoler, puis quitter :
 * l'entrée du calque et son retrait n'ont pas la même courbe ni la même origine.
 */
export const Mouvement: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-6">
      <p className="max-w-[62ch] text-sm text-ink-muted">
        Survoler puis quitter chaque bouton. Le calque entre par la gauche en{" "}
        <code>ease-enter</code> et se retire vers la droite en <code>ease-exit</code>.
        Le clic ajoute un <code>scale(0.97)</code> en <code>ease-swift</code>.
      </p>
      <div className="flex flex-wrap items-center gap-6">
        <Button size="lg">Solid</Button>
        <Button size="lg" variant="soft">Soft</Button>
        <Button size="lg" variant="outline">Outline</Button>
      </div>
    </div>
  ),
};

/**
 * Le `className` passé par le consommateur est fusionné avec `tailwind-merge` :
 * il remplace réellement l'utilitaire d'origine, au lieu de dépendre de l'ordre
 * dans la feuille de style.
 */
export const Surcharge: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Par défaut</Button>
      <Button className="rounded-full px-8">rounded-full px-8</Button>
      <Button className="bg-accent-2">bg-accent-2</Button>
    </div>
  ),
};

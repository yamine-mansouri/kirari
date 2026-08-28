import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pagination } from "./Pagination";

const meta = {
  title: "Composants/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "Navigation entre pages.",
          "",
          "**Entièrement contrôlée** : le composant ne connaît ni les données",
          "ni le chargement, il émet une intention. C'est ce qui lui permet de",
          "fonctionner aussi bien sur une pagination serveur que sur un tableau",
          "en mémoire.",
          "",
          "La première et la dernière page restent **toujours** visibles : ce",
          "sont les deux destinations les plus demandées. On ne replie que le",
          "milieu.",
          "",
          "Le composant ne rend rien si `pageCount <= 1` — inutile de le",
          "conditionner côté appelant.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    pageCount: { control: { type: "number", min: 1, max: 100 } },
    siblings: { control: { type: "number", min: 0, max: 3 } },
    disabled: { control: "boolean" },
  },
  // `onChange` est requis : le poser ici évite de le répéter dans chaque story.
  args: { page: 1, pageCount: 20, siblings: 1, onChange: () => {} },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: function Playground(args) {
    const [page, setPage] = useState(args.page);
    return <Pagination {...args} page={page} onChange={setPage} />;
  },
};

export const Galerie: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-8">
      {[
        { title: "Peu de pages — tout est affiché", page: 2, pageCount: 5 },
        { title: "Début d'une longue série", page: 2, pageCount: 40 },
        { title: "Milieu — deux ellipses", page: 20, pageCount: 40 },
        { title: "Fin", page: 39, pageCount: 40 },
        { title: "Plus de voisins (siblings=2)", page: 20, pageCount: 40, siblings: 2 },
        { title: "Désactivé pendant un chargement", page: 5, pageCount: 20, disabled: true },
      ].map((c) => (
        <section key={c.title} className="flex flex-col gap-2">
          <h3 className="text-sm font-bold tracking-tight">{c.title}</h3>
          <Pagination
            page={c.page}
            pageCount={c.pageCount}
            siblings={c.siblings}
            disabled={c.disabled}
            onChange={() => {}}
          />
        </section>
      ))}

      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-bold tracking-tight">Une seule page</h3>
        <p className="text-xs text-ink-subtle">Le composant ne rend rien.</p>
        <Pagination page={1} pageCount={1} onChange={() => {}} />
      </section>
    </div>
  ),
};

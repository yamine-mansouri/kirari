import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pagination } from "./Pagination";
import { FantaisiePage, Specimen, SpecimenGrid } from "./fantaisie-specimen";

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
            aria-label={c.title}
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

export const Fantaisie: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <FantaisiePage intro={<>Une pagination est une rangée de petites cibles rondes : c'est déjà presque un jouet. Il suffit d'assumer.</>}>
      <SpecimenGrid>
        <Specimen
          title="Pastilles"
          note="Cellules entièrement rondes. La rangée devient un chapelet plutôt qu'une barre d'outils."
          code={'<Pagination aria-label="Exemple 1" className="[&_button]:rounded-full" />'}
        >
          <Pagination aria-label="Exemple 2" page={3} pageCount={12} onChange={() => {}} className="[&_button]:rounded-full" />
        </Specimen>

        <Specimen
          title="Cellules qui s'enfoncent"
          note="Écrasement pivoté sur la base au clic. Chaque changement de page est un appui."
          code={'<Pagination aria-label="Exemple 3" className="[&_button]:origin-bottom\n  [&_button]:active:animate-squish" />'}
        >
          <Pagination aria-label="Exemple 4"
            page={3}
            pageCount={12}
            onChange={() => {}}
            className="[&_button]:origin-bottom [&_button]:active:animate-squish"
          />
        </Specimen>

        <Specimen
          title="Rangée en cascade"
          note="Les numéros s'installent un à un. Utile quand la pagination apparaît après un chargement."
          code={'<Pagination aria-label="Exemple 5" className="k-stagger [&_button]:animate-pop-in" />'}
          replayable
        >
          {(run) => (
            <Pagination aria-label="Exemple 6"
              key={run}
              page={3}
              pageCount={9}
              onChange={() => {}}
              className="k-stagger [&_button]:animate-pop-in"
            />
          )}
        </Specimen>

        <Specimen
          title="Page active qui hoche"
          note="La cellule courante acquiesce au survol : elle confirme qu'on y est déjà."
          code={'<Pagination aria-label="Exemple 7" className="[&_[aria-current]]:hover:animate-tick" />'}
        >
          <Pagination aria-label="Exemple 8"
            page={4}
            pageCount={12}
            onChange={() => {}}
            className="[&_[aria-current]]:hover:animate-tick"
          />
        </Specimen>
      </SpecimenGrid>
    </FantaisiePage>
  ),
};

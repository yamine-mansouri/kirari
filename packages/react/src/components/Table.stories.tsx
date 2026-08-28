import { useMemo, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Table, type Column, type SortDirection } from "./Table";
import { Sparkle } from "./Sparkle";
import { FantaisiePage, Specimen, SpecimenGrid } from "./fantaisie-specimen";
import { Badge } from "./Badge";
import { Avatar } from "./Avatar";
import { EmptyState } from "./EmptyState";
import { Button } from "./Button";
import { Pagination } from "./Pagination";

interface Membre {
  id: string;
  nom: string;
  role: string;
  statut: "actif" | "invité" | "suspendu";
  projets: number;
}

const MEMBRES: Membre[] = [
  { id: "1", nom: "Yamine Mansouri", role: "Propriétaire", statut: "actif", projets: 12 },
  { id: "2", nom: "Ai Ko", role: "Développeuse", statut: "actif", projets: 8 },
  { id: "3", nom: "Ren Sato", role: "Designer", statut: "invité", projets: 0 },
  { id: "4", nom: "Mei Tanaka", role: "Développeuse", statut: "actif", projets: 23 },
  { id: "5", nom: "Kaito Abe", role: "Lecture seule", statut: "suspendu", projets: 3 },
];

const TONE = { actif: "success", invité: "neutral", suspendu: "danger" } as const;

const COLUMNS: Array<Column<Membre>> = [
  {
    key: "nom",
    header: "Membre",
    sortable: true,
    cell: (row) => (
      <div className="flex items-center gap-2.5">
        <Avatar size="sm" name={row.nom} />
        <span className="font-medium">{row.nom}</span>
      </div>
    ),
  },
  { key: "role", header: "Rôle", sortable: true, cell: (row) => row.role },
  {
    key: "statut",
    header: "Statut",
    cell: (row) => <Badge tone={TONE[row.statut]}>{row.statut}</Badge>,
  },
  { key: "projets", header: "Projets", numeric: true, sortable: true, cell: (row) => row.projets },
];

const meta = {
  title: "Composants/Table",
  component: Table,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "Tableau de données.",
          "",
          "**Le tri est contrôlé, pas interne.** Une table qui trie elle-même",
          "ne sait pas trier côté serveur, ni conserver l'ordre au changement",
          "de page. Le composant affiche l'état et signale l'intention ; c'est",
          "au parent de réordonner.",
          "",
          "Le conteneur porte `overflow-x-auto` : une table large défile dans",
          "sa propre boîte au lieu de faire déborder la page — la faute la plus",
          "fréquente sur ce composant.",
          "",
          "`numeric` active `tabular-nums` **et** l'alignement à droite : sans",
          "cela, les chiffres ne s'alignent pas en colonne et la comparaison",
          "visuelle devient impossible.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    stickyHeader: { control: "boolean" },
    density: { control: "radio", options: ["comfortable", "compact"] },
  },
  args: {
    columns: COLUMNS as Array<Column<unknown>>,
    rows: MEMBRES,
    rowKey: (row: unknown) => (row as Membre).id,
    density: "comfortable",
  },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Galerie: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-bold tracking-tight">Confortable</h3>
        <Table columns={COLUMNS} rows={MEMBRES} rowKey={(r) => r.id} />
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-bold tracking-tight">Compact et cliquable</h3>
        <Table
          columns={COLUMNS}
          rows={MEMBRES}
          rowKey={(r) => r.id}
          density="compact"
          onRowClick={() => {}}
        />
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-bold tracking-tight">Vide</h3>
        <Table
          columns={COLUMNS}
          rows={[]}
          rowKey={(r) => r.id}
          empty={
            <EmptyState
              compact
              title="Aucun membre"
              description="Invitez quelqu'un pour commencer."
              action={<Button size="sm">Inviter</Button>}
            />
          }
        />
      </section>
    </div>
  ),
};

/**
 * Cliquer un en-tête triable. La flèche pivote au lieu d'être remplacée : le
 * changement de sens se lit comme un mouvement, pas comme un saut.
 */
export const Tri: Story = {
  parameters: { controls: { disable: true } },
  render: function Tri() {
    const [sort, setSort] = useState<{ key: string; direction: SortDirection }>({
      key: "projets",
      direction: "desc",
    });

    const rows = useMemo(() => {
      const copy = [...MEMBRES];
      copy.sort((a, b) => {
        const av = a[sort.key as keyof Membre];
        const bv = b[sort.key as keyof Membre];
        const cmp = typeof av === "number" && typeof bv === "number"
          ? av - bv
          : String(av).localeCompare(String(bv), "fr");
        return sort.direction === "asc" ? cmp : -cmp;
      });
      return copy;
    }, [sort]);

    return (
      <Table
        columns={COLUMNS}
        rows={rows}
        rowKey={(r) => r.id}
        sort={sort}
        onSortChange={(key, direction) => setSort({ key, direction })}
      />
    );
  },
};

/** Table et Pagination se composent : les deux sont contrôlés par le parent. */
export const AvecPagination: Story = {
  name: "Avec pagination",
  parameters: { controls: { disable: true } },
  render: function AvecPagination() {
    const [page, setPage] = useState(1);
    const perPage = 2;
    const pageCount = Math.ceil(MEMBRES.length / perPage);
    const rows = MEMBRES.slice((page - 1) * perPage, page * perPage);

    return (
      <div className="flex flex-col gap-4">
        <Table columns={COLUMNS} rows={rows} rowKey={(r) => r.id} />
        <div className="flex justify-end">
          <Pagination page={page} pageCount={pageCount} onChange={setPage} />
        </div>
      </div>
    );
  },
};

export const Fantaisie: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <FantaisiePage intro={<>Un tableau est la surface la plus austère du système. Un peu de matière y change beaucoup — à condition de ne jamais gêner la lecture des données, qui est sa seule raison d'être.</>}>
      <SpecimenGrid wide>
        <Specimen
          title="Lignes en cascade"
          note="Les lignes s'installent une à une après un chargement. Le tableau se remplit au lieu d'apparaître."
          code={'<Table className="k-stagger [&_tbody_tr]:animate-slide-up" />'}
          replayable
        >
          {(run) => (
            <Table
              key={run}
              columns={COLUMNS}
              rows={MEMBRES}
              rowKey={(r) => r.id}
              className="k-stagger [&_tbody_tr]:animate-slide-up"
            />
          )}
        </Specimen>

        <Specimen
          title="Tableau en galet"
          note="Coins très arrondis et lignes séparées. Le tableau devient une liste de fiches."
          code={'<Table className="rounded-[1.5rem] border-0\n  [&_tbody_tr]:rounded-xl" />'}
        >
          <Table
            columns={COLUMNS.slice(0, 3)}
            rows={MEMBRES.slice(0, 3)}
            rowKey={(r) => r.id}
            className="rounded-[1.5rem]"
          />
        </Specimen>

        <Specimen
          title="Flèche de tri vivante"
          note="La flèche de l'en-tête trié hoche à chaque changement de sens. Le tri se ressent."
          code={'<Table className="[&_th_svg]:animate-tick" />'}
          replayable
        >
          {(run) => (
            <Table
              key={run}
              columns={COLUMNS}
              rows={MEMBRES}
              rowKey={(r) => r.id}
              sort={{ key: "projets", direction: "desc" }}
              onSortChange={() => {}}
              className="[&_th_svg]:animate-tick"
            />
          )}
        </Specimen>

        <Specimen
          title="Ligne mise à l'honneur"
          note="Des étincelles sur une seule ligne — le premier du classement, la nouveauté du jour."
          code={'<Table className="[&_tbody_tr:first-child]:bg-accent-subtle" />'}
        >
          <Sparkle count={4} className="w-full">
            <Table
              columns={COLUMNS.slice(0, 3)}
              rows={MEMBRES.slice(0, 3)}
              rowKey={(r) => r.id}
              className="w-full [&_tbody_tr:first-child]:bg-accent-subtle"
            />
          </Sparkle>
        </Specimen>
      </SpecimenGrid>
    </FantaisiePage>
  ),
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import { ContextMenu, Menu, MenuItem, MenuLabel, MenuSeparator, Submenu } from "./Menu";
import { Button } from "./Button";
import { FantaisiePage, Specimen, SpecimenGrid } from "./fantaisie-specimen";
import { Card } from "./Card";

const meta = {
  title: "Composants/Menu",
  component: Menu,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "Menu d'actions.",
          "",
          "Un menu contient des **actions**, pas de la sélection de valeur —",
          "pour cela, `Select`. Et jamais de formulaire : un menu se ferme au",
          "premier clic.",
          "",
          "Base UI apporte la navigation par flèches, le typeahead, et le",
          "« triangle de sécurité » qui permet de traverser un item en",
          "diagonale pour atteindre un sous-menu sans le refermer au passage —",
          "le détail qui sépare un menu agréable d'un menu frustrant.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    side: { control: "radio", options: ["top", "right", "bottom", "left"] },
    align: { control: "radio", options: ["start", "center", "end"] },
  },
  // `trigger` et `children` sont requis : les poser ici évite de les répéter.
  args: {
    side: "bottom",
    align: "start",
    trigger: <Button variant="outline">Ouvrir le menu</Button>,
    children: <MenuItem>Action</MenuItem>,
  },
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="grid min-h-64 place-items-center">
      <Menu {...args} trigger={<Button variant="outline">Ouvrir le menu</Button>}>
        <MenuItem shortcut="⌘N">Nouveau document</MenuItem>
        <MenuItem shortcut="⌘O">Ouvrir…</MenuItem>
        <MenuSeparator />
        <MenuItem shortcut="⌘S">Enregistrer</MenuItem>
        <MenuItem disabled>Enregistrer sous…</MenuItem>
        <MenuSeparator />
        <MenuItem danger shortcut="⌫">Supprimer</MenuItem>
      </Menu>
    </div>
  ),
};

export const Galerie: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="grid min-h-96 grid-cols-2 place-items-start gap-8">
      <Menu trigger={<Button variant="outline" size="sm">Simple</Button>}>
        <MenuItem>Dupliquer</MenuItem>
        <MenuItem>Renommer</MenuItem>
        <MenuItem danger>Supprimer</MenuItem>
      </Menu>

      <Menu trigger={<Button variant="outline" size="sm">Avec groupes</Button>}>
        <MenuLabel>Édition</MenuLabel>
        <MenuItem shortcut="⌘Z">Annuler</MenuItem>
        <MenuItem shortcut="⇧⌘Z">Rétablir</MenuItem>
        <MenuSeparator />
        <MenuLabel>Presse-papiers</MenuLabel>
        <MenuItem shortcut="⌘X">Couper</MenuItem>
        <MenuItem shortcut="⌘C">Copier</MenuItem>
      </Menu>

      <Menu trigger={<Button variant="outline" size="sm">Avec sous-menu</Button>}>
        <MenuItem>Partager</MenuItem>
        <Submenu label="Exporter">
          <MenuItem>PDF</MenuItem>
          <MenuItem>Markdown</MenuItem>
          <Submenu label="Image">
            <MenuItem>PNG</MenuItem>
            <MenuItem>SVG</MenuItem>
          </Submenu>
        </Submenu>
        <MenuSeparator />
        <MenuItem danger>Supprimer</MenuItem>
      </Menu>

      <Menu trigger={<Button variant="outline" size="sm">Aligné à droite</Button>} align="end">
        <MenuItem inset>Item décalé</MenuItem>
        <MenuItem inset>Aligné sur ceux à icône</MenuItem>
      </Menu>
    </div>
  ),
};

/** Clic droit, ou appui long sur tactile. */
export const Contextuel: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <ContextMenu
      items={
        <>
          <MenuItem shortcut="⌘C">Copier</MenuItem>
          <MenuItem shortcut="⌘D">Dupliquer</MenuItem>
          <MenuSeparator />
          <MenuItem danger>Supprimer</MenuItem>
        </>
      }
    >
      <Card variant="sunken" className="border-dashed">
        <p className="py-8 text-center text-sm text-ink-muted">
          Clic droit n'importe où dans cette zone
        </p>
      </Card>
    </ContextMenu>
  ),
};

export const Fantaisie: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <FantaisiePage intro={<>Un menu est une liste qui apparaît. Deux leviers : la façon dont le panneau se déplie, et celle dont ses items s'y installent.</>}>
      <SpecimenGrid>
        <Specimen
          title="Items en cascade"
          note="Le panneau s'ouvre, puis les items tombent l'un après l'autre. Le décalage part après l'ouverture."
          code={'<Menu className="k-stagger [&_[role=menuitem]]:animate-slide-up" />'}
        >
          <Menu
            trigger={<Button variant="outline" size="sm">Cascade</Button>}
            className="k-stagger [&_[role=menuitem]]:animate-slide-up"
          >
            <MenuItem>Dupliquer</MenuItem>
            <MenuItem>Renommer</MenuItem>
            <MenuItem>Déplacer</MenuItem>
            <MenuItem danger>Supprimer</MenuItem>
          </Menu>
        </Specimen>

        <Specimen
          title="Menu en galet"
          note="Panneau et items entièrement ronds. Le menu devient une grappe de pastilles."
          code={'<Menu className="rounded-3xl [&_[role=menuitem]]:rounded-full" />'}
        >
          <Menu
            trigger={<Button variant="soft" size="sm">Tout rond</Button>}
            className="rounded-3xl p-2 [&_[role=menuitem]]:rounded-full"
          >
            <MenuItem>Partager</MenuItem>
            <MenuItem>Exporter</MenuItem>
            <MenuItem>Archiver</MenuItem>
          </Menu>
        </Specimen>

        <Specimen
          title="Dépliage en gelée"
          note="Le panneau déborde à l'ouverture. Sur un menu court, l'effet reste lisible."
          code={'<Menu className="data-open:animate-jelly" />'}
        >
          <Menu
            trigger={<Button variant="outline" size="sm">Gelée</Button>}
            className="data-open:animate-jelly"
          >
            <MenuItem>Une action</MenuItem>
            <MenuItem>Une autre</MenuItem>
          </Menu>
        </Specimen>

        <Specimen
          title="Items qui hochent"
          note="Chaque item acquiesce au survol. À la limite du supportable sur une longue liste — parfait sur trois entrées."
          code={'<MenuItem className="hover:animate-tick" />'}
        >
          <Menu trigger={<Button size="sm">Hochements</Button>}>
            {["Oui", "Peut-être", "Non"].map((t) => (
              <MenuItem key={t} className="hover:animate-tick">{t}</MenuItem>
            ))}
          </Menu>
        </Specimen>
      </SpecimenGrid>
    </FantaisiePage>
  ),
};

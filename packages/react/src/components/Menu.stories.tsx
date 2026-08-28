import type { Meta, StoryObj } from "@storybook/react-vite";
import { ContextMenu, Menu, MenuItem, MenuLabel, MenuSeparator, Submenu } from "./Menu";
import { Button } from "./Button";
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

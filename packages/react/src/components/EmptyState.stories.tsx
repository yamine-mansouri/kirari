import type { Meta, StoryObj } from "@storybook/react-vite";
import { EmptyState } from "./EmptyState";
import { Button } from "./Button";
import { Card } from "./Card";

const ICON = (
  <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M4 7.5A1.5 1.5 0 015.5 6h4l2 2.5h7A1.5 1.5 0 0120 10v7.5a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 014 17.5z" strokeLinejoin="round" />
  </svg>
);

const meta = {
  title: "Composants/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "État vide.",
          "",
          "Sous-estimé, alors que c'est souvent le **premier** écran qu'un",
          "utilisateur voit : une liste sans contenu, une recherche sans",
          "résultat, un projet qui démarre. Un état vide qui se contente d'un",
          "« Aucun élément » rate l'occasion d'expliquer quoi faire.",
          "",
          "D'où la structure imposée : une raison (`title`), un contexte",
          "(`description`), et une sortie (`action`).",
        ].join("\n"),
      },
    },
  },
  argTypes: { compact: { control: "boolean" } },
  args: {
    title: "Aucun projet pour l'instant",
    description: "Créez votre premier projet pour commencer à travailler.",
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Card variant="sunken" className="p-0">
      <EmptyState {...args} icon={ICON} action={<Button size="sm">Créer un projet</Button>} />
    </Card>
  ),
};

export const Galerie: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-6">
      <Card variant="sunken" className="p-0">
        <EmptyState
          icon={ICON}
          title="Aucun projet pour l'instant"
          description="Créez votre premier projet pour commencer à travailler."
          action={
            <>
              <Button size="sm">Créer un projet</Button>
              <Button size="sm" variant="ghost">Importer</Button>
            </>
          }
        />
      </Card>

      <Card variant="sunken" className="p-0">
        <EmptyState
          title="Aucun résultat"
          description="Essayez d'élargir votre recherche ou de retirer un filtre."
          action={<Button size="sm" variant="outline">Réinitialiser les filtres</Button>}
        />
      </Card>

      <Card variant="sunken" className="p-0">
        <EmptyState compact icon={ICON} title="Rien à afficher" />
      </Card>
    </div>
  ),
};

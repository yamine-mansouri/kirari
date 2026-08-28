import type { Meta, StoryObj } from "@storybook/react-vite";
import { Alert } from "./Alert";
import { Button } from "./Button";

const meta = {
  title: "Composants/Alert",
  component: Alert,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "Message contextuel, dans le flux de la page.",
          "",
          "**Alert ou Toast ?** Une Alert décrit un état persistant et reste",
          "lisible tant qu'il dure. Un Toast annonce qu'une action vient",
          "d'aboutir, puis disparaît. Un message qu'on doit pouvoir relire",
          "n'est jamais un Toast.",
          "",
          "`role=\"alert\"` est réservé aux tonalités `warning` et `danger` : il",
          "**interrompt** le lecteur d'écran, ce qui ne se justifie pas pour",
          "une information neutre — les autres portent `role=\"status\"`.",
          "",
          "La couleur n'est jamais le seul signal : le texte doit suffire à",
          "comprendre la nature du message.",
        ].join("\n"),
      },
    },
  },
  argTypes: { tone: { control: "select", options: ["info", "success", "warning", "danger"] } },
  args: {
    tone: "info",
    title: "Version bêta",
    children: "Certaines fonctionnalités peuvent encore évoluer.",
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="max-w-xl">
      <Alert {...args} />
    </div>
  ),
};

export const Galerie: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex max-w-xl flex-col gap-4">
      <Alert tone="info" title="Version bêta">
        Certaines fonctionnalités peuvent encore évoluer.
      </Alert>
      <Alert tone="success" title="Sauvegarde terminée">
        Vos données ont été enregistrées sur le serveur.
      </Alert>
      <Alert tone="warning" title="Quota bientôt atteint">
        Il vous reste 12 % d'espace disponible.
      </Alert>
      <Alert tone="danger" title="Échec du déploiement">
        La compilation a échoué. Consultez le journal pour le détail.
      </Alert>

      <Alert tone="info">Sans titre : le message seul, pour une note brève.</Alert>

      <Alert
        tone="warning"
        title="Abonnement expiré"
        action={<Button size="sm" variant="outline">Renouveler</Button>}
      >
        L'accès aux projets partagés est suspendu.
      </Alert>
    </div>
  ),
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import { Alert } from "./Alert";
import { Sparkle } from "./Sparkle";
import { FantaisiePage, Specimen, SpecimenGrid } from "./fantaisie-specimen";
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

export const Fantaisie: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <FantaisiePage intro={<>Une alerte informe, elle n'amuse pas. Sauf l'alerte positive — c'est la seule du lot qui gagne à être chaleureuse.</>}>
      <SpecimenGrid>
        <Specimen
          title="Arrivée qui déborde"
          note="L'alerte dépasse légèrement en apparaissant, pivotée sur son bord haut. Elle se pose au lieu d'apparaître."
          code={'<Alert className="origin-top animate-pop-in" />'}
          replayable
        >
          {(run) => (
            <Alert key={run} tone="success" title="Sauvegardé" className="origin-top animate-pop-in">
              Vos modifications sont enregistrées.
            </Alert>
          )}
        </Specimen>

        <Specimen
          title="Refus"
          note="Un tremblement à l'apparition d'une erreur. Le refus se ressent avant d'être lu — et une seule fois, jamais en boucle."
          code={'<Alert tone="danger" className="animate-shake" />'}
          replayable
        >
          {(run) => (
            <Alert key={run} tone="danger" title="Échec du déploiement" className="animate-shake">
              La compilation a échoué.
            </Alert>
          )}
        </Specimen>

        <Specimen
          title="Alerte en galet"
          note="Rayon large et icône ronde. L'avertissement devient un conseil plutôt qu'une sanction."
          code={'<Alert className="rounded-[1.5rem]" />'}
        >
          <Alert tone="info" title="Astuce" className="rounded-[1.5rem]">
            On peut adoucir le ton sans perdre la clarté.
          </Alert>
        </Specimen>

        <Specimen
          title="Bonne nouvelle"
          note="Le seul cas où une alerte mérite des étincelles : une réussite, pas une information."
          code={'<Sparkle count={5}><Alert /></Sparkle>'}
        >
          <Sparkle count={5} className="w-full">
            <Alert tone="success" title="Objectif atteint" className="w-full">
              Vous avez terminé toutes vos tâches.
            </Alert>
          </Sparkle>
        </Specimen>
      </SpecimenGrid>
    </FantaisiePage>
  ),
};

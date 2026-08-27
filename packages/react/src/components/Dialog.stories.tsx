import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Dialog } from "./Dialog";
import { Button } from "./Button";
import { Field } from "./Field";

const meta = {
  title: "Composants/Dialog",
  component: Dialog,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "Bâtie sur l'élément `<dialog>` natif : le piégeage du focus, sa",
          "restitution à la fermeture, la touche Échap et l'inertie du reste de",
          "la page sont gérés par le navigateur. Kirari n'ajoute que la mise en",
          "scène — **ne pas réimplémenter** ces comportements.",
          "",
          "L'animation de sortie utilise `starting:` et `transition-discrete`",
          "(les utilitaires Tailwind pour `@starting-style` et",
          "`transition-behavior: allow-discrete`), ce qui permet d'animer un",
          "élément qui passe par `display: none` sans JS de transition.",
          "",
          "**Support :** Chrome 117+, Safari 17.4+, Firefox 129+. En dessous la",
          "modale fonctionne, elle apparaît simplement sans transition.",
        ].join("\n"),
      },
    },
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { open: false, onClose: () => {}, title: "Titre" },
  render: function Playground(args) {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Ouvrir
        </Button>
        <Dialog
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          footer={
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>Annuler</Button>
              <Button onClick={() => setOpen(false)}>Confirmer</Button>
            </>
          }
        >
          Ouvrir puis fermer, et observer les deux sens : l'entrée se dépose en{" "}
          <code>ease-enter</code> sur 0.6s, la sortie claque en{" "}
          <code>ease-exit</code> sur 0.3s.
        </Dialog>
      </>
    );
  },
};

/** Confirmation destructrice — le seul cas légitime du bouton `danger`. */
export const Destructive: Story = {
  args: { open: false, onClose: () => {} },
  parameters: { controls: { disable: true } },
  render: function Destructive() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="danger" onClick={() => setOpen(true)}>
          Supprimer le compte
        </Button>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          title="Supprimer le compte ?"
          footer={
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>Annuler</Button>
              <Button variant="danger" onClick={() => setOpen(false)}>Supprimer</Button>
            </>
          }
        >
          Cette action est irréversible. Toutes les données associées seront
          définitivement perdues.
        </Dialog>
      </>
    );
  },
};

/** Avec un formulaire : le focus est piégé dans la boîte par le navigateur. */
export const AvecFormulaire: Story = {
  args: { open: false, onClose: () => {} },
  parameters: { controls: { disable: true } },
  render: function AvecFormulaire() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Inviter quelqu'un</Button>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          title="Inviter quelqu'un"
          closeOnBackdrop={false}
          footer={
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>Annuler</Button>
              <Button onClick={() => setOpen(false)}>Envoyer</Button>
            </>
          }
        >
          <div className="flex flex-col gap-4 pb-2">
            <p>
              Tabuler pour vérifier : le focus ne sort pas de la boîte.
              Le clic sur le fond est désactivé ici, un formulaire en cours ne
              devant pas se fermer par accident.
            </p>
            <Field label="Adresse e-mail" type="email" placeholder="vous@exemple.fr" />
          </div>
        </Dialog>
      </>
    );
  },
};

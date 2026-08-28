import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Dialog } from "./Dialog";
import { Sparkle } from "./Sparkle";
import { FantaisiePage, Specimen, SpecimenGrid } from "./fantaisie-specimen";
import { Button } from "./Button";
import { Field } from "./Field";

/** Petit hôte réutilisable pour les spécimens : un bouton et sa modale. */
function DialogDemo({
  label,
  body,
  dialogClassName,
}: {
  label: string;
  body?: ReactNode;
  dialogClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        {label}
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={label}
        className={dialogClassName}
        footer={<Button size="sm" onClick={() => setOpen(false)}>Fermer</Button>}
      >
        {body ?? <p>Le contenu de la boîte.</p>}
      </Dialog>
    </>
  );
}

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

export const Fantaisie: Story = {
  args: { open: false, onClose: () => {} },
  parameters: { controls: { disable: true } },
  render: () => (
    <FantaisiePage intro={<>Une modale interrompt. C'est le composant où la fantaisie doit être la plus mesurée — sauf quand elle annonce précisément une bonne nouvelle.</>}>
      <SpecimenGrid>
        <Specimen
          title="Modale en galet"
          note="Rayon très large, sans ombre. La boîte devient un objet posé plutôt qu'une fenêtre système."
          code={'<Dialog className="rounded-[2rem] shadow-none" />'}
        >
          <DialogDemo label="Tout doux" dialogClassName="rounded-[2rem] shadow-none border-2" />
        </Specimen>

        <Specimen
          title="Arrivée qui déborde"
          note="La boîte dépasse légèrement avant de se poser. Suffisant pour la rendre matérielle."
          code={'<Dialog className="open:ease-bounce" />'}
        >
          <DialogDemo label="Dépassement" dialogClassName="open:ease-bounce" />
        </Specimen>

        <Specimen
          title="Contenu en cascade"
          note="La boîte s'ouvre, puis son contenu s'installe. Le décalage démarre après l'ouverture."
          code={'<div className="k-stagger" style={{ "--k-stagger-base": ".2s" }}>'}
        >
          <DialogDemo
            label="Cascade"
            body={
              <div className="k-stagger flex flex-col gap-2" style={{ "--k-stagger-base": "0.2s" } as CSSProperties}>
                {["Un premier point", "Un deuxième", "Un troisième"].map((t) => (
                  <span key={t} className="animate-slide-up">{t}</span>
                ))}
              </div>
            }
          />
        </Specimen>

        <Specimen
          title="Bonne nouvelle"
          note="Le seul cas où une modale mérite des étincelles : elle annonce une réussite, pas une décision."
          code={'<Sparkle count={6}>…</Sparkle>'}
        >
          <DialogDemo
            label="Félicitations"
            body={
              <Sparkle count={6} className="w-full justify-center py-4">
                <span className="text-2xl">🎉</span>
              </Sparkle>
            }
          />
        </Specimen>
      </SpecimenGrid>
    </FantaisiePage>
  ),
};

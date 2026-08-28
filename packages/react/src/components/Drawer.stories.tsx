import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Drawer, type DrawerSide } from "./Drawer";
import { Button } from "./Button";
import { Field } from "./Field";

const meta = {
  title: "Composants/Drawer",
  component: Drawer,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "Panneau glissant depuis un bord.",
          "",
          "**Drawer ou Dialog ?** Sur mobile, une modale centrée est presque",
          "toujours un mauvais choix : elle est loin des pouces, et le clavier",
          "virtuel la pousse hors de l'écran. Un tiroir bas règle les deux.",
          "",
          "On utilise ici des **transitions** et non des animations :",
          "contrairement à une animation, une transition s'interrompt et",
          "s'inverse proprement en cours de route. Sur un panneau qu'on peut",
          "refermer d'un geste avant la fin de l'ouverture, c'est la différence",
          "entre un mouvement fluide et un à-coup.",
          "",
          "Le panneau **suit le doigt** pendant un glissement, via",
          "`--drawer-swipe-movement-*`. À essayer sur un écran tactile, ou en",
          "simulant le tactile dans les outils de développement.",
        ].join("\n"),
      },
    },
  },
  argTypes: { side: { control: "radio", options: ["left", "right", "top", "bottom"] } },
  args: { side: "right", title: "Réglages", description: "Ces changements s'appliquent immédiatement." },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: function Playground(args) {
    const [open, setOpen] = useState(false);
    return (
      <Drawer
        {...args}
        open={open}
        onOpenChange={setOpen}
        trigger={<Button variant="outline">Ouvrir le tiroir</Button>}
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>Annuler</Button>
            <Button onClick={() => setOpen(false)}>Enregistrer</Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Field label="Nom du projet" defaultValue="Kirari" />
          <Field label="Description" placeholder="Une phrase suffit." />
        </div>
      </Drawer>
    );
  },
};

/** Les quatre bords. Le sens du glissement de fermeture suit le bord d'ouverture. */
export const Galerie: Story = {
  parameters: { controls: { disable: true } },
  render: function Galerie() {
    const [side, setSide] = useState<DrawerSide | null>(null);

    return (
      <div className="flex flex-wrap gap-3">
        {(["left", "right", "top", "bottom"] as const).map((s) => (
          <Button key={s} variant="outline" onClick={() => setSide(s)}>
            side=&quot;{s}&quot;
          </Button>
        ))}

        <Drawer
          side={side ?? "right"}
          open={side !== null}
          onOpenChange={(open) => !open && setSide(null)}
          title={`Tiroir « ${side} »`}
          description="Glisser vers le bord d'origine pour fermer."
          footer={<Button onClick={() => setSide(null)}>Fermer</Button>}
        >
          <p>
            Une poignée apparaît sur les tiroirs haut et bas : c'est le signal
            visuel que le panneau se glisse.
          </p>
        </Drawer>
      </div>
    );
  },
};

/** Le cas mobile : un tiroir bas, avec sa poignée. */
export const Mouvement: Story = {
  parameters: { controls: { disable: true } },
  render: function Mouvement() {
    const [open, setOpen] = useState(false);
    return (
      <div className="flex flex-col gap-4">
        <p className="max-w-[62ch] text-sm text-ink-muted">
          Ouvrir, puis refermer d'un glissement vers le bas avant la fin de
          l'animation d'entrée : la transition s'inverse au lieu de sauter.
        </p>
        <Drawer
          side="bottom"
          open={open}
          onOpenChange={setOpen}
          trigger={<Button>Ouvrir en bas</Button>}
          title="Feuille inférieure"
          footer={<Button block onClick={() => setOpen(false)}>Fermer</Button>}
        >
          <p>Le format à privilégier sur mobile.</p>
        </Drawer>
      </div>
    );
  },
};

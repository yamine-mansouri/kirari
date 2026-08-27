import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Animate, type KirariAnimation } from "@kirari-ds/react";

const ENTRANCES: KirariAnimation[] = [
  "fade-in", "slide-up", "slide-down", "slide-left", "slide-right",
  "scale-in", "popup", "bound", "fall", "wipe-up", "wipe-right", "bloom",
];
const EXITS: KirariAnimation[] = [
  "fade-out", "slide-up-out", "slide-down-out", "scale-out", "curtain-out",
];
const AMBIENTS: KirariAnimation[] = ["spin-slow", "sway", "float", "pulse-soft"];

/** Incrémenter la clé remonte l'élément, ce qui redéclenche l'animation CSS. */
function Tile({ animation, ambient = false }: { animation: KirariAnimation; ambient?: boolean }) {
  const [run, setRun] = useState(0);

  return (
    <button
      type="button"
      onClick={() => setRun((n) => n + 1)}
      className="flex cursor-pointer flex-col gap-2 rounded-md border border-line bg-surface p-3 text-left transition-colors duration-(--k-dur-2) ease-smooth hover:border-line-strong"
    >
      <span className="grid h-18 place-items-center overflow-hidden rounded-sm bg-surface-sunken">
        <Animate
          key={run}
          as="span"
          animation={animation}
          duration={ambient ? undefined : 5}
          className="size-[34px] rounded-squircle bg-accent"
        />
      </span>
      <span className="font-mono text-xs text-ink-muted">animate-{animation}</span>
    </button>
  );
}

function Grid({ items, ambient }: { items: KirariAnimation[]; ambient?: boolean }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] gap-3">
      {items.map((a) => (
        <Tile key={a} animation={a} ambient={ambient} />
      ))}
    </div>
  );
}

const meta = {
  title: "Fondations/Animations",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "Cliquer une tuile pour rejouer. Chaque utilitaire embarque déjà sa",
          "durée et sa courbe — `animate-slide-up` suffit, et respecte la règle",
          "entrée/sortie sans qu'on ait à y penser.",
          "",
          "**Piège Tailwind :** un nom de classe construit dynamiquement",
          "(`` `animate-${x}` ``) n'est jamais généré. Les primitives Kirari",
          "passent par une table statique, `ANIMATION_CLASS`.",
        ].join("\n"),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Entrees: Story = { name: "Entrées", render: () => <Grid items={ENTRANCES} /> };

export const Sorties: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <p className="max-w-[62ch] text-sm text-ink-muted">
        Toutes forcent <code>ease-exit</code> : elles retiennent puis claquent.
        Comparer avec les entrées, qui démarrent net et se déposent.
      </p>
      <Grid items={EXITS} />
    </div>
  ),
};

export const Ambiance: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <p className="max-w-[62ch] text-sm text-ink-muted">
        Boucles longues (2s à 7s), jamais liées à une interaction utilisateur.
      </p>
      <Grid items={AMBIENTS} ambient />
    </div>
  ),
};

/** Les amplitudes se règlent par custom property, sans écrire de CSS. */
export const Amplitudes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <p className="max-w-[62ch] text-sm text-ink-muted">
        Même animation, trois amplitudes. <code>--k-anim-distance</code> est lue
        par les keyframes elles-mêmes ; la prop <code>distance</code> la pose en
        style inline, puisqu'une valeur dynamique ne peut pas générer
        d'utilitaire Tailwind.
      </p>
      <div className="grid grid-cols-3 gap-3">
        {[8, 24, 72].map((d) => (
          <div key={d} className="flex flex-col gap-2">
            <span className="font-mono text-xs text-ink-muted">distance={d}</span>
            <span className="grid h-32 place-items-end overflow-hidden rounded-sm bg-surface-sunken p-4">
              <Animate
                as="span"
                animation="slide-up"
                distance={d}
                duration={5}
                repeat
                className="size-8 rounded-squircle bg-accent"
              />
            </span>
          </div>
        ))}
      </div>
    </div>
  ),
};

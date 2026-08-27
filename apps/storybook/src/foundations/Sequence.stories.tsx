import { useState } from "react";
import type { ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Animate, Button, Reveal, Stagger } from "@kirari-ds/react";

const ITEMS = ["Tokens", "Thèmes", "Motion", "Composants", "Séquence", "Révélation"];

const meta = {
  title: "Fondations/Séquence",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "Aucune orchestration en JS : seulement des `animation-delay`",
          "échelonnés, calculés par `nth-child`.",
          "",
          "C'est la seule partie du système que Tailwind ne sait pas exprimer.",
          "Elle reste en CSS, et **hors `@layer`** : les utilitaires `animate-*`",
          "posent la propriété raccourcie `animation`, qui remet",
          "`animation-delay` à zéro. En CSS, le non-layé prime sur le layé —",
          "c'est ce qui fait fonctionner le décalage.",
          "",
          "**Limite : 24 enfants directs.** Au-delà le décalage retombe à zéro,",
          "délibérément : une séquence plus longue devient illisible.",
        ].join("\n"),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const Item = ({ children }: { children: ReactNode }) => (
  <div className="rounded-md bg-accent-subtle p-3 text-sm font-medium text-accent-text">
    {children}
  </div>
);

export const Sequence: Story = {
  name: "Séquence",
  render: function Sequence() {
    const [run, setRun] = useState(0);
    const [step, setStep] = useState(0.09);

    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm" onClick={() => setRun((n) => n + 1)}>Rejouer</Button>
          {[0.04, 0.09, 0.18].map((s) => (
            <Button
              key={s}
              size="sm"
              variant={step === s ? "solid" : "outline"}
              onClick={() => { setStep(s); setRun((n) => n + 1); }}
            >
              step={s}
            </Button>
          ))}
        </div>
        <Stagger
          key={`${run}-${step}`}
          step={step}
          className="grid grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] gap-3"
        >
          {ITEMS.map((item) => (
            <Animate key={item} animation="slide-up">
              <Item>{item}</Item>
            </Animate>
          ))}
        </Stagger>
      </div>
    );
  },
};

/** Le dernier élément part en premier — utile pour une sortie. */
export const Inversee: Story = {
  name: "Inversée",
  render: function Inversee() {
    const [run, setRun] = useState(0);
    return (
      <div className="flex flex-col gap-4">
        <Button size="sm" onClick={() => setRun((n) => n + 1)}>Rejouer</Button>
        <Stagger
          key={run}
          reverse
          step={0.09}
          className="grid grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] gap-3"
        >
          {ITEMS.map((item) => (
            <Animate key={item} animation="slide-up">
              <Item>{item}</Item>
            </Animate>
          ))}
        </Stagger>
      </div>
    );
  },
};

/** L'observer se déconnecte après le premier déclenchement. */
export const RevelationAuDefilement: Story = {
  name: "Révélation au défilement",
  render: () => (
    <div className="flex flex-col gap-4">
      <p className="max-w-[62ch] text-sm text-ink-muted">
        Faire défiler. Sans JS, le contenu reste visible — le masquage n'est
        appliqué que si la classe <code>k-js</code> est posée sur{" "}
        <code>&lt;html&gt;</code>.
      </p>
      <div className="grid h-[60vh] place-items-center text-sm text-ink-subtle">
        ↓ continuer à défiler
      </div>
      <Stagger step={0.12} className="grid grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] gap-3">
        {["Un", "Deux", "Trois", "Quatre"].map((item) => (
          <Reveal key={item} animation="slide-up">
            <Item>{item}</Item>
          </Reveal>
        ))}
      </Stagger>
      <div className="grid h-[40vh] place-items-center text-sm text-ink-subtle">fin</div>
    </div>
  ),
};

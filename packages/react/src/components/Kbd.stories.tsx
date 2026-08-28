import type { Meta, StoryObj } from "@storybook/react-vite";
import { Kbd } from "./Kbd";
import { Sparkle } from "./Sparkle";
import { FantaisiePage, Specimen, SpecimenGrid } from "./fantaisie-specimen";

const meta = {
  title: "Composants/Kbd",
  component: Kbd,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "Touche de clavier.",
          "",
          "Dix lignes de CSS qui changent la perception de finition d'une",
          "documentation. La bordure basse plus épaisse suffit à évoquer le",
          "relief — une ombre portée ferait *flotter* la touche au lieu de",
          "l'enfoncer.",
          "",
          "`keys` accepte une chaîne comme `\"Cmd+K\"` et la découpe, en",
          "remplaçant les modificateurs connus par leur symbole.",
        ].join("\n"),
      },
    },
  },
  argTypes: { keys: { control: "text" } },
  args: { keys: "Cmd+K" },
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Galerie: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-bold tracking-tight">Symboles reconnus</h3>
        <div className="flex flex-wrap items-center gap-4">
          {["Cmd", "Ctrl", "Alt", "Shift", "Enter", "Esc", "Tab", "Backspace", "Up", "Space"].map(
            (k) => <Kbd key={k} keys={k} />,
          )}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-bold tracking-tight">Combinaisons</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Kbd keys="Cmd+K" />
          <Kbd keys="Shift+Cmd+P" />
          <Kbd keys="Ctrl+Alt+Delete" />
          <Kbd keys="Cmd+Shift+Z" />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-bold tracking-tight">Dans une phrase</h3>
        <p className="max-w-[62ch] text-sm text-ink-muted">
          Appuyer sur <Kbd keys="Cmd+K" /> pour ouvrir la recherche, puis{" "}
          <Kbd keys="Enter" /> pour valider. <Kbd keys="Esc" /> referme.
        </p>
      </section>
    </div>
  ),
};

export const Fantaisie: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <FantaisiePage intro={<>Une touche est déjà la représentation d'un objet physique. C'est le composant où l'enfoncement n'est pas une métaphore mais une imitation.</>}>
      <SpecimenGrid>
        <Specimen
          title="Touche qu'on enfonce"
          note="Écrasement pivoté au bord bas au survol. La touche s'enfonce comme sur un vrai clavier."
          code={'<Kbd className="origin-bottom\n  hover:animate-squish" />'}
        >
          <Kbd keys="Cmd+K" className="[&_kbd]:origin-bottom [&_kbd]:hover:animate-squish" />
        </Specimen>

        <Specimen
          title="Frappe séquencée"
          note="Les touches d'un raccourci apparaissent dans l'ordre où on les presse. Une démonstration, pas une décoration."
          code={'<span className="k-stagger">\n  <Kbd className="animate-pop-in" />\n</span>'}
          replayable
        >
          {(run) => (
            <span key={run} className="k-stagger [&_kbd]:animate-pop-in">
              <Kbd keys="Shift+Cmd+P" />
            </span>
          )}
        </Specimen>

        <Specimen
          title="Touches de travers"
          note="Chaque touche à un angle légèrement différent, comme posées à la main."
          code={'<Kbd className="[&_kbd:nth-child(2)]:rotate-3" />'}
        >
          <Kbd
            keys="Ctrl+Alt+Delete"
            className="[&_kbd:nth-child(1)]:-rotate-3 [&_kbd:nth-child(2)]:rotate-2 [&_kbd:nth-child(3)]:-rotate-1"
          />
        </Specimen>

        <Specimen
          title="Raccourci mis en avant"
          note="Pour une page d'aide : la combinaison à retenir scintille."
          code={'<Sparkle count={4}><Kbd /></Sparkle>'}
        >
          <Sparkle count={4}>
            <Kbd keys="Cmd+K" />
          </Sparkle>
        </Specimen>
      </SpecimenGrid>
    </FantaisiePage>
  ),
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import { Kbd } from "./Kbd";

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

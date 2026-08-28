import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Switch } from "./Switch";

const meta = {
  title: "Composants/Switch",
  component: Switch,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "Bascule booléenne **à effet immédiat**.",
          "",
          "**Switch ou Checkbox ?** Un Switch dit « c'est fait » — l'effet est",
          "appliqué à l'instant du clic. Une Checkbox dit « ce sera fait à",
          "l'envoi ». Mettre un Switch dans un formulaire qui se valide est le",
          "contresens le plus fréquent sur ce composant.",
          "",
          "La course du pouce est le composant : c'est l'un des rares endroits",
          "où `ease-spring` se justifie. Le léger dépassement à l'arrivée donne",
          "la sensation d'un interrupteur, pas d'un rectangle qui change de",
          "couleur.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    size: { control: "radio", options: ["sm", "md", "lg"] },
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: { size: "md" },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Galerie: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-bold tracking-tight">Tailles</h3>
        <div className="flex items-center gap-6">
          {(["sm", "md", "lg"] as const).map((size) => (
            <label key={size} className="flex items-center gap-2 text-sm text-ink-muted">
              <Switch size={size} defaultChecked />
              {size}
            </label>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-bold tracking-tight">États</h3>
        <div className="flex items-center gap-6 text-sm text-ink-muted">
          <label className="flex items-center gap-2"><Switch /> éteint</label>
          <label className="flex items-center gap-2"><Switch defaultChecked /> allumé</label>
          <label className="flex items-center gap-2"><Switch disabled /> désactivé</label>
          <label className="flex items-center gap-2"><Switch disabled defaultChecked /> désactivé allumé</label>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-bold tracking-tight">En situation</h3>
        <div className="flex max-w-md flex-col gap-1 rounded-lg border border-line bg-surface p-4">
          {[
            ["Notifications par e-mail", "Un résumé quotidien de votre activité.", true],
            ["Mode compact", "Réduit les espacements dans les listes.", false],
            ["Suivi analytique", "Indisponible sur votre offre actuelle.", false],
          ].map(([title, desc, on], i) => (
            <label
              key={title as string}
              className="flex cursor-pointer items-start justify-between gap-6 py-3 not-last:border-b not-last:border-line"
            >
              <span className="min-w-0">
                <span className="block text-sm font-medium text-ink">{title}</span>
                <span className="block text-xs text-ink-muted">{desc}</span>
              </span>
              <Switch defaultChecked={on as boolean} disabled={i === 2} />
            </label>
          ))}
        </div>
      </section>
    </div>
  ),
};

/** Contrôlé : l'état vit chez le parent. */
export const Controle: Story = {
  name: "Contrôlé",
  parameters: { controls: { disable: true } },
  render: function Controle() {
    const [on, setOn] = useState(false);
    return (
      <div className="flex items-center gap-4">
        <Switch checked={on} onCheckedChange={setOn} size="lg" />
        <span className="font-mono text-sm text-ink-muted">
          checked = {String(on)}
        </span>
      </div>
    );
  },
};

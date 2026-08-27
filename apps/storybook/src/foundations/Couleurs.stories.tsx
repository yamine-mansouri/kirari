import type { Meta, StoryObj } from "@storybook/react-vite";

const GROUPS: Array<{ title: string; note: string; tokens: Array<[string, string]> }> = [
  {
    title: "Surfaces",
    note: "Du fond du document à la surface la plus enfoncée.",
    tokens: [
      ["bg-bg", "--k-bg"],
      ["bg-surface", "--k-surface"],
      ["bg-surface-raised", "--k-surface-raised"],
      ["bg-surface-sunken", "--k-surface-sunken"],
    ],
  },
  {
    title: "Texte",
    note: "Nommé `ink` et non `text` : `text-text-muted` serait illisible.",
    tokens: [
      ["text-ink", "--k-text"],
      ["text-ink-muted", "--k-text-muted"],
      ["text-ink-subtle", "--k-text-subtle"],
      ["text-on-accent", "--k-text-on-accent"],
    ],
  },
  {
    title: "Bordures",
    note: "Nommé `line` pour donner `border-line`.",
    tokens: [
      ["border-line", "--k-border"],
      ["border-line-strong", "--k-border-strong"],
    ],
  },
  {
    title: "Accent",
    note: "Dérivé de l'échelle de marque. Basculer la marque dans la barre d'outils.",
    tokens: [
      ["bg-accent", "--k-accent"],
      ["bg-accent-hover", "--k-accent-hover"],
      ["bg-accent-active", "--k-accent-active"],
      ["bg-accent-subtle", "--k-accent-subtle"],
      ["text-accent-text", "--k-accent-text"],
      ["bg-accent-2", "--k-accent-2"],
      ["bg-accent-2-subtle", "--k-accent-2-subtle"],
    ],
  },
  {
    title: "États",
    note: "Sémantiquement figés : un rouge d'erreur reste un rouge d'erreur.",
    tokens: [
      ["bg-success", "--k-success"],
      ["bg-success-subtle", "--k-success-subtle"],
      ["bg-warning", "--k-warning"],
      ["bg-warning-subtle", "--k-warning-subtle"],
      ["bg-danger", "--k-danger"],
      ["bg-danger-subtle", "--k-danger-subtle"],
    ],
  },
];

const meta = {
  title: "Fondations/Couleurs",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "Les 25 tokens sémantiques. **Aucun n'a de suffixe numérique** — c'est",
          "le signe qu'on est sur un token qui suivra le thème et le rebranding.",
          "",
          "Les couleurs par défaut de Tailwind (`bg-blue-500`…) contournent le",
          "système : elles ne suivront ni le mode sombre ni un changement de",
          "marque. Ne pas les utiliser.",
          "",
          "Basculer le thème **et** la marque dans la barre d'outils : tout doit",
          "rester lisible dans les six combinaisons.",
        ].join("\n"),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Couleurs: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {GROUPS.map((group) => (
        <section key={group.title} className="flex flex-col gap-3">
          <div>
            <h3 className="text-sm font-bold tracking-tight">{group.title}</h3>
            <p className="text-xs text-ink-subtle">{group.note}</p>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(13rem,1fr))] gap-3">
            {group.tokens.map(([utility, variable]) => (
              <div
                key={utility}
                className="flex items-center gap-3 rounded-md border border-line p-2"
              >
                <span
                  className="size-10 shrink-0 rounded-sm border border-line"
                  style={{ backgroundColor: `var(${variable})` }}
                />
                <span className="min-w-0 font-mono text-xs">
                  <span className="block truncate text-ink">{utility}</span>
                  <span className="block truncate text-ink-subtle">{variable}</span>
                </span>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  ),
};

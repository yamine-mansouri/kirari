import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge, Button, Card, Field } from "@kirari-ds/react";

const STEPS = ["100", "200", "300", "400", "500", "600", "700"];

const MAPPING: Array<[string, string, string]> = [
  ["--k-accent", "--k-brand-500", "--k-brand-400"],
  ["--k-accent-hover", "--k-brand-600", "--k-brand-300"],
  ["--k-accent-active", "--k-brand-700", "--k-brand-200"],
  ["--k-accent-text", "--k-brand-700", "--k-brand-300"],
  ["--k-accent-subtle", "--k-brand-100", "teinte de la surface"],
];

const meta = {
  title: "Fondations/Marque",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "Un fichier de thème ne déclare **qu'une échelle de marque** de sept",
          "nuances, plus deux couleurs de texte. Le mapping vers les tokens",
          "sémantiques — différent en clair et en sombre — reste le travail de",
          "Kirari. Conséquence : un thème s'écrit une seule fois, pas deux.",
          "",
          "Basculer la marque **et** le thème dans la barre d'outils. Rien n'est",
          "recompilé : seules les variables CSS changent.",
          "",
          "`--k-text-on-accent` est le seul token que le CSS ne peut pas",
          "déduire. Le thème Matcha le démontre : sur un vert clair, un texte",
          "blanc tomberait à ~2.4:1, très en dessous du 4.5:1 exigé par WCAG AA.",
        ].join("\n"),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Echelle: Story = {
  name: "Échelle",
  render: () => (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-bold tracking-tight">Les sept nuances</h3>
        <div className="flex flex-wrap gap-2">
          {STEPS.map((step) => (
            <div key={step} className="flex flex-col items-center gap-1">
              <span
                className="size-16 rounded-md border border-line"
                style={{ backgroundColor: `var(--k-brand-${step})` }}
              />
              <span className="font-mono text-[0.68rem] text-ink-subtle">{step}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-bold tracking-tight">Comment Kirari les mappe</h3>
        <div className="overflow-x-auto">
          <table className="min-w-md text-left font-mono text-xs">
            <thead className="text-ink-subtle">
              <tr className="border-b border-line">
                <th className="py-2 pr-6 font-medium">Token sémantique</th>
                <th className="py-2 pr-6 font-medium">Clair</th>
                <th className="py-2 font-medium">Sombre</th>
              </tr>
            </thead>
            <tbody>
              {MAPPING.map(([token, light, dark]) => (
                <tr key={token} className="border-b border-line/50">
                  <td className="py-2 pr-6 text-ink">{token}</td>
                  <td className="py-2 pr-6 text-ink-muted">{light}</td>
                  <td className="py-2 text-ink-muted">{dark}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="max-w-[62ch] text-xs text-ink-subtle">
          En sombre l'accent monte d'un cran vers le clair : la nuance 500
          s'enfonce sur un fond noir.
        </p>
      </section>
    </div>
  ),
};

/** Le test qui compte : un rebranding tient-il sur tous les composants ? */
export const Echantillon: Story = {
  name: "Échantillon",
  render: () => (
    <div className="flex flex-col gap-6">
      <p className="max-w-[62ch] text-sm text-ink-muted">
        Basculer la marque et le thème dans la barre d'outils, puis vérifier les
        six combinaisons. Une régression de contraste ne se voit que sur un
        rebranding — c'est ici qu'on la trouve.
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <Button>Solid</Button>
        <Button variant="soft">Soft</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Badge>accent</Badge>
        <Badge tone="neutral">neutral</Badge>
        <Badge tone="success">success</Badge>
        <Badge tone="warning">warning</Badge>
        <Badge tone="danger">danger</Badge>
        <Badge tone="success" live>en direct</Badge>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(17rem,1fr))] gap-4">
        <Card interactive title="Carte interactive" footer={<Button size="sm" variant="soft">Action</Button>}>
          Le liseré d'accent et l'état de survol suivent la marque.
        </Card>
        <Card variant="sunken" title="Champ">
          <div className="pt-2">
            <Field label="Adresse e-mail" placeholder="vous@exemple.fr" hint="Le soulignement suit la marque." />
          </div>
        </Card>
      </div>
    </div>
  ),
};

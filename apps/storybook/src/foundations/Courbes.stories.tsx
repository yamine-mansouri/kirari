import type { Meta, StoryObj } from "@storybook/react-vite";

/** Les béziers du système, avec le rôle de chacune. */
const EASINGS = [
  { name: "enter", cls: "ease-enter", bezier: "0.01, 0.24, 0, 1", usage: "Toute entrée. Défaut." },
  { name: "exit", cls: "ease-exit", bezier: "0.87, -0.01, 1, 1", usage: "Toute sortie." },
  { name: "hold", cls: "ease-hold", bezier: "1, 0.01, 1, 0.99", usage: "Tenue longue puis rattrapage." },
  { name: "brake", cls: "ease-brake", bezier: "0.01, 0, 1, 0.26", usage: "Entrée sèche, freinage dur." },
  { name: "snap", cls: "ease-snap", bezier: "1, 0, 0, 1", usage: "Claquement. Le plus dramatique." },
  { name: "smooth", cls: "ease-smooth", bezier: "0.16, 0.46, 0.18, 1.01", usage: "Confort, changement d'état." },
  { name: "swift", cls: "ease-swift", bezier: "0.76, -0.01, 0.25, 1", usage: "Micro-interaction." },
  { name: "glide", cls: "ease-glide", bezier: "0.64, 0.04, 0.13, 1", usage: "Glissade longue." },
  { name: "bounce", cls: "ease-bounce", bezier: "0.34, 1.63, 0.61, 0.3", usage: "Rebond. Avec parcimonie." },
  { name: "spring", cls: "ease-spring", bezier: "0.39, 2, 0.41, 0.39", usage: "Ressort. Une par écran au max." },
];

const meta = {
  title: "Fondations/Courbes",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "**La règle du système : une entrée et une sortie n'ont jamais la même",
          "courbe.** Une entrée démarre instantanément et se dépose longuement.",
          "Une sortie retient puis claque. Un `ease-in-out` symétrique annule ce",
          "qui fait la signature de Kirari.",
          "",
          "Les durées n'ont pas de namespace en Tailwind v4 : elles s'écrivent",
          "`duration-(--k-dur-3)`.",
        ].join("\n"),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Courbes: Story = {
  render: () => (
    <div className="flex flex-col gap-1">
      {EASINGS.map((e) => (
        <div key={e.name} className="grid grid-cols-[11rem_1fr_10rem] items-center gap-4 py-2">
          <div className="font-mono text-xs">
            <div className="text-ink">ease-{e.name}</div>
            <div className="text-ink-subtle">{e.usage}</div>
          </div>
          <div className="relative h-2.5 rounded-full bg-surface-sunken">
            <span
              className={`absolute top-1/2 left-0 -mt-[9px] size-[18px] rounded-full bg-accent animate-docs-travel ${e.cls}`}
            />
          </div>
          <div className="text-right font-mono text-[0.68rem] text-ink-subtle">
            {e.bezier}
          </div>
        </div>
      ))}
    </div>
  ),
};

/** Le même mouvement, entrée contre sortie, pour rendre la règle évidente. */
export const EntreeContreSortie: Story = {
  name: "Entrée contre sortie",
  render: () => (
    <div className="flex flex-col gap-6">
      <p className="max-w-[62ch] text-sm text-ink-muted">
        Deux billes, même distance, même durée. Celle du haut utilise la courbe
        d'entrée, celle du bas la courbe de sortie. C'est la seule différence.
      </p>
      {[
        { label: "ease-enter", cls: "ease-enter" },
        { label: "ease-exit", cls: "ease-exit" },
      ].map((e) => (
        <div key={e.label} className="grid grid-cols-[8rem_1fr] items-center gap-4">
          <span className="font-mono text-xs">{e.label}</span>
          <div className="relative h-3 rounded-full bg-surface-sunken">
            <span
              className={`absolute top-1/2 left-0 -mt-3 size-6 rounded-full bg-accent animate-docs-travel ${e.cls}`}
            />
          </div>
        </div>
      ))}
    </div>
  ),
};

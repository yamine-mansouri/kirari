import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar, AvatarGroup } from "./Avatar";
import { Sparkle } from "./Sparkle";
import { FantaisiePage, Specimen, SpecimenGrid } from "./fantaisie-specimen";

/** Une image qui existe, et une qui échoue volontairement. */
const OK = "https://i.pravatar.cc/160?img=47";
const KO = "https://exemple.invalide/introuvable.jpg";

const meta = {
  title: "Composants/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "Portrait, avec repli.",
          "",
          "**Le repli n'est pas un détail :** une image d'avatar échoue plus",
          "souvent qu'on ne le croit — lien expiré, hors-ligne, utilisateur",
          "sans photo. Base UI ne l'affiche qu'après échec ou pendant le",
          "chargement, ce qui évite le clignotement initiales → photo sur une",
          "image déjà en cache.",
          "",
          "Sans `fallback` explicite, `name` génère les initiales — deux au",
          "maximum, au-delà ça ne se lit plus dans un cercle.",
          "",
          "Note : les images distantes sont bloquées dans un artefact publié.",
          "Ici, en Storybook local, elles chargent.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    shape: { control: "radio", options: ["circle", "squircle"] },
  },
  args: { name: "Yamine Mansouri", size: "md" },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Galerie: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-bold tracking-tight">Tailles</h3>
        <div className="flex items-end gap-4">
          {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
            <Avatar key={size} size={size} name="Yamine Mansouri" />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-bold tracking-tight">Formes</h3>
        <div className="flex items-center gap-4">
          <Avatar size="lg" name="Ai Ko" shape="circle" />
          <Avatar size="lg" name="Ai Ko" shape="squircle" />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-bold tracking-tight">Image, repli, échec</h3>
        <div className="flex items-center gap-4">
          <Avatar size="lg" src={OK} alt="Portrait" name="Yamine Mansouri" />
          <Avatar size="lg" src={KO} alt="Portrait" name="Yamine Mansouri" />
          <Avatar size="lg" name="Yamine Mansouri" />
          <Avatar size="lg" fallback={<span className="text-lg">🌸</span>} />
        </div>
        <p className="text-xs text-ink-subtle">
          Le deuxième pointe vers une URL invalide : le repli prend le relais.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-bold tracking-tight">Groupe</h3>
        <AvatarGroup>
          {["Yamine Mansouri", "Ai Ko", "Ren Sato", "Mei Tanaka"].map((name) => (
            <Avatar key={name} name={name} />
          ))}
          <Avatar fallback="+3" />
        </AvatarGroup>
      </section>
    </div>
  ),
};

export const Fantaisie: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <FantaisiePage intro={<>Un portrait représente une personne : c'est l'endroit le plus légitime pour un peu de chaleur, et le plus risqué pour un excès.</>}>
      <SpecimenGrid>
        <Specimen
          title="Groupe en cascade"
          note="Les membres apparaissent l'un après l'autre. Une équipe se constitue sous les yeux."
          code={'<AvatarGroup className="k-stagger [&>*]:animate-pop-in" />'}
          replayable
        >
          {(run) => (
            <AvatarGroup key={run} className="k-stagger [&>*]:animate-pop-in">
              {["Yamine Mansouri", "Ai Ko", "Ren Sato", "Mei Tanaka"].map((n) => (
                <Avatar key={n} name={n} />
              ))}
            </AvatarGroup>
          )}
        </Specimen>

        <Specimen
          title="Portrait suspendu"
          note="Un pivot au bord haut plus un balancement au survol : le portrait pend comme une médaille."
          code={'<Avatar className="origin-top hover:animate-swing" />'}
        >
          <Avatar size="xl" name="Ai Ko" className="origin-top hover:animate-swing" />
        </Specimen>

        <Specimen
          title="Galerie de travers"
          note="Chaque portrait à un angle différent, comme des photos posées sur une table."
          code={'<Avatar className="rotate-3" shape="squircle" />'}
        >
          <div className="flex gap-3">
            {[
              ["Yamine Mansouri", "-rotate-6"],
              ["Ai Ko", "rotate-3"],
              ["Ren Sato", "-rotate-2"],
            ].map(([n, r]) => (
              <Avatar key={n} size="lg" shape="squircle" name={n} className={r} />
            ))}
          </div>
        </Specimen>

        <Specimen
          title="Membre à l'honneur"
          note="Des étincelles autour d'un seul portrait — l'auteur du mois, le nouveau venu."
          code={'<Sparkle count={5}><Avatar /></Sparkle>'}
        >
          <Sparkle count={5}>
            <Avatar size="lg" name="Mei Tanaka" />
          </Sparkle>
        </Specimen>
      </SpecimenGrid>
    </FantaisiePage>
  ),
};

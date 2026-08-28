import type { Meta, StoryObj } from "@storybook/react-vite";
import { OtpField } from "./OtpField";

const meta = {
  title: "Composants/OtpField",
  component: OtpField,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "Saisie d'un code à usage unique.",
          "",
          "Pénible à écrire soi-même, et Base UI le fournit : **coller un code",
          "le répartit sur toutes les cases**, la touche Retour recule d'une",
          "case, les flèches naviguent, et l'autocomplétion SMS du navigateur",
          "fonctionne. Essayer de coller `123456` ci-dessous.",
          "",
          "Chaque case remplie répond par une micro-réaction — l'anneau",
          "d'accent apparaît en `ease-swift` sur 0.2 s. C'est court exprès :",
          "sur une saisie rapide, une animation plus longue s'accumulerait en",
          "bouillie visuelle.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    length: { control: { type: "number", min: 4, max: 8 } },
    grouped: { control: "boolean" },
    mask: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: { length: 6 },
} satisfies Meta<typeof OtpField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Galerie: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-bold tracking-tight">Longueurs</h3>
        <div className="flex flex-col gap-4">
          <OtpField length={4} />
          <OtpField length={6} />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-bold tracking-tight">Groupé</h3>
        <p className="text-xs text-ink-subtle">
          Un séparateur au milieu : un code de six chiffres se lit mieux en deux
          groupes de trois.
        </p>
        <OtpField length={6} grouped />
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-bold tracking-tight">Masqué et désactivé</h3>
        <div className="flex flex-col gap-4">
          <OtpField length={6} mask defaultValue="123456" />
          <OtpField length={6} disabled defaultValue="42" />
        </div>
      </section>
    </div>
  ),
};

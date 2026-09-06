import { Code } from "@/stories/components/system/Code";
import type { Meta } from "@storybook/react-vite";
import { TitleSection } from ".";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof TitleSection> = {
  title: "Design System/Molecules/Title Section",
  component: TitleSection,
  tags: ["autodocs"],
  argTypes: {
    header: { control: "text", defaultValue: "h3" },
    text: {
      control: "text",
      defaultValue:
        "Lorem fistrum ahorarr de la pradera no te digo trigo por no llamarte Rodrigor",
    },
    mods: {
      control: "text",
      defaultValue: "text-3xl uppercase text-primary-500 font-medium",
    },
  },
};

export default meta;

export const Default = {
  args: {
    header: "h3",
    mods: "text-3xl uppercase text-primary-500 font-medium",
    subtext:
      "A gramenawer la caidita caballo blanco caballo negroorl la caidita te va a hasé pupitaa de la pradera por la gloria de mi madre.",
    iconsData: [{ name: "CSS3Icon", width: "120px", height: "120px" }],
  },
};

export const SourceCode = {
  parameters: {
    layout: "fullscreen",
    controls: {
      disable: true,
    },
    actions: {
      disable: true,
    },
  },
  render: () => (
    <>
      <Code directoryPath="src/stories/components/molecules/TitleSection/" />
    </>
  ),
};

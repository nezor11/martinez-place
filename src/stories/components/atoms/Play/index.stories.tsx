import { Code } from "@/stories/components/system/Code";
import type { Meta } from "@storybook/react-vite";
import Play from ".";

const meta: Meta<typeof Play> = {
  title: "Design System/Atoms/Play",
  component: Play,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "",
      },
    },
  },
  argTypes: {},
};

export default meta;

export const Default = {
  args: {},
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
      <Code directoryPath="src/stories/components/atoms/Loader/" />
    </>
  ),
};

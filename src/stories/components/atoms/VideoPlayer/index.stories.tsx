import { Code } from "@/stories/components/system/Code";
import type { Meta } from "@storybook/react";
import { VideoPlayer } from ".";

const meta: Meta<typeof VideoPlayer> = {
  title: "Design System/Atoms/Video Player",
  component: VideoPlayer,
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
  args: {
    videoUrl: "https://www.youtube.com/watch?v=nAEvmGK5KRs",
    onReady: () => {},
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
      <Code directoryPath="src/stories/components/atoms/VideoPlayer/" />
    </>
  ),
};

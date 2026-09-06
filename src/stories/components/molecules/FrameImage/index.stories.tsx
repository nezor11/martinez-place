import bgImage from "@/assets/images/jorge-martinez-bn.jpeg";
import maskImage from "@/assets/images/mask-photo.png";
import { Code } from "@/stories/components/system/Code";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FrameImage } from ".";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof FrameImage> = {
  title: "Design System/Molecules/Frame Image",
  component: FrameImage,
  tags: ["autodocs"],
  argTypes: {},
};

export default meta;

// create a “template” of how args map to rendering (from SB)
type Story = StoryObj<typeof FrameImage>;

export const Default: Story = {
  args: {
    mask: maskImage,
    image: bgImage,
  },
};

export const SourceCode: Story = {
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
      <Code directoryPath="src/stories/components/molecules/FrameImage/" />
    </>
  ),
};

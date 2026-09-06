import { Code } from "@/stories/components/system/Code";
import type { Meta, StoryObj } from "@storybook/react";
import { IconGallery } from ".";

const meta: Meta<typeof IconGallery> = {
  title: "Design System/Molecules/IconGallery",
  component: IconGallery,
  tags: ["autodocs"],
  argTypes: {
    iconsData: {
      control: "object",
      defaultValue: [],
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Selected: Story = {
  args: {
    iconsData: [
      { name: "CSS3Icon", width: "120px", height: "120px" },
      { name: "ViteIcon", width: "120px", height: "120px" },
      { name: "JavaScriptIcon", width: "100px", height: "100px" },
      { name: "ReactIcon", width: "40px", height: "40px" },
    ],
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
      <Code directoryPath="src/stories/components/molecules/IconGallery/" />
    </>
  ),
};

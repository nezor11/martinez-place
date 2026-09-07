import { Code } from "@/stories/components/system/Code";
import type { Meta, StoryObj } from "@storybook/react-vite";
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

/** With `onIconClick` every icon is a button; `activeIcon` marks the current filter. */
export const Clickable: Story = {
  args: {
    iconsData: [
      { name: "ReactIcon", width: "40px", height: "40px" },
      { name: "VueIcon", width: "40px", height: "40px" },
      { name: "TypeScriptIcon", width: "40px", height: "40px" },
    ],
    activeIcon: "ReactIcon",
    onIconClick: (name) => console.log("filter by", name),
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

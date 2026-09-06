import { Code } from "@/stories/components/system/Code";
import type { Meta, StoryObj } from "@storybook/react";
import { TitleCopy } from ".";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof TitleCopy> = {
  title: "Design System/Atoms/Title Copy",
  component: TitleCopy,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "TitleCopy is a component that renders a title with customizable tag, text, and styles. It is used to display a title in a page or section. It is a wrapper around the HTML heading tags (h1, h2, h3, h4, h5, h6). It accepts the following props: `as`, `text`, `align`, `italic`, `underline`, and `mods`.",
      },
    },
  },
  argTypes: {
    as: {
      options: ["h1", "h2", "h3", "h4", "h5", "h6"],
      control: { type: "select" },
      description: "The tag of the title element. By default, it is set to h1.",
      table: {
        defaultValue: { summary: "h1" },
      },
    },
    mods: {
      control: "text",
      description:
        "The mods property is optional and can be a string with Tailwind CSS classes. By default, it is set to text-6xl.",
      table: {
        defaultValue: { summary: "text-6xl" },
      },
    },
    text: {
      control: "text",
      type: "string",
      description:
        "The text of the title element. By default, it is set to Rodrigor.",
      table: {
        defaultValue: { summary: "Rodrigor" },
      },
    },
    align: {
      options: ["left", "center", "right"],
      control: { type: "radio" },
      type: "string",
      description:
        "The alignment of the title element. By default, it is set to left.",
      table: {
        defaultValue: { summary: "left" },
      },
    },
    italic: {
      control: { type: "boolean" },
      type: "boolean",
      description:
        "The italic property is optional and can be a boolean. By default, it is set to false.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    underline: {
      control: { type: "boolean" },
      type: "boolean",
      description:
        "The underline property is optional and can be a boolean. By default, it is set to false.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {
  args: {
    as: "h1",
    mods: "text-6xl",
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
      <Code directoryPath="src/stories/components/atoms/TitleCopy/" />
    </>
  ),
};

import { Code } from "@/stories/components/system/Code";
import type { Meta, StoryObj } from "@storybook/react";
import { SubtitleCopy } from ".";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof SubtitleCopy> = {
  title: "Design System/Atoms/Subtitle Copy",
  component: SubtitleCopy,
  parameters: {
    docs: {
      description: {
        component:
          "SubtitleCopy is a component that renders a subtitle with customizable tag, text, and styles. It is used to display a subtitle in a page or section. It is a wrapper around the HTML heading tags (h1, h2, h3, h4, h5, h6). It accepts the following props: `subtitle`, `text`, `mods`, and `styles`.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    subtitle: {
      description:
        "The subtitle property is optional and can be an AllowedTagValues ('h1', 'h2', 'h3', 'h4', 'h5', 'h6'). By default, it is set to 'h2'.",
      options: ["h1", "h2", "h3", "h4", "h5", "h6"],
      control: { type: "select" },
      defaultValue: "h2",
    },
    text: {
      description:
        "The text property is optional and can be a string. By default, it is set to 'Papaar papaar'.",
      control: "text",
      value: "Papaar papaar",
      type: "string",
    },
    mods: {
      description:
        "The mods property is optional and can be a string with tailwind or css classes. By default, it is set to 'text-3xl uppercase'.",
      control: "text",
      value: "text-3xl uppercase",
      type: "string",
    },
    styles: {
      description:
        "The styles property is optional and can be a CSSProperties object. By default, it is set to an empty object.",
      control: "object",
      value: {},
      type: "string",
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    subtitle: "h2",
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
      <Code directoryPath="src/stories/components/atoms/SubtitleCopy/" />
    </>
  ),
};

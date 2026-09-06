// index.stories.ts
import { Code } from "@/stories/components/system/Code";
import type { Meta, StoryObj } from "@storybook/react";
import { BodyCopy } from ".";

const meta: Meta<typeof BodyCopy> = {
  title: "Design System/Atoms/Body Copy",
  component: BodyCopy,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "BodyCopy is a component that renders a text element. It is used to display text in a page or section. It accepts the following props: `tag`, `text`, `size`, `weight`, `align`, `emphasis`, `italic`, `underline`, and `mods`.",
      },
    },
  },
  argTypes: {
    tag: {
      options: ["div", "span", "p"],
      control: { type: "select" },
      table: {
        defaultValue: { summary: "p" },
      },
      description: "The tag of the text element. By default, it is set to p.",
    },
    mods: {
      control: "text",
      description:
        "The mods property is optional and can be a string with Tailwind CSS classes. By default, it is set to text-base dark:text-white.",
      table: {
        defaultValue: {
          summary: "text-base dark:text-white",
        },
      },
    },
    text: {
      control: "text",
      description:
        "The text of the text element. By default, it is set to empty string.",
      type: "string",
      table: {
        defaultValue: {
          summary:
            "Lorem fistrum ahorarr de la pradera no te digo trigo por no llamarte Rodrigor",
        },
      },
    },
    size: {
      options: ["sm", "base", "lg", "xl", "2xl", "3xl"],
      control: { type: "select" },
      type: "string",
      description:
        "The size of the text element. By default, it is set to base. The options are sm, base, lg, xl, 2xl, and 3xl.",
      table: {
        defaultValue: {
          summary: "base",
        },
      },
    },
    weight: {
      options: ["thin", "normal", "medium", "semibold", "bold", "black"],
      control: { type: "select" },
      description:
        "The weight of the text element. By default, it is set to normal. The options are thin, normal, medium, semibold, bold, and black.",
      type: "string",
      table: {
        defaultValue: {
          summary: "normal",
        },
      },
    },
    align: {
      options: ["left", "center", "right"],
      control: { type: "radio" },
      type: "string",
      description:
        "The alignment of the text element. By default, it is set to left. The options are left, center, and right.",
      table: {
        defaultValue: {
          summary: "left",
        },
      },
    },
    emphasis: {
      options: ["none", "low", "high"],
      control: { type: "radio" },
      defaultValue: "none",
      description:
        "The emphasis of the text element. By default, it is set to none. The options are none, low, and high.",
      type: "string",
      table: {
        defaultValue: {
          summary: "none",
        },
      },
    },
    italic: {
      control: { type: "boolean" },
      description:
        "The italic property is optional and can be a boolean. By default, it is set to false.",
      type: "boolean",
      table: {
        defaultValue: {
          summary: "false",
        },
      },
    },
    underline: {
      control: { type: "boolean" },
      description:
        "The underline property is optional and can be a boolean. By default, it is set to false.",
      type: "boolean",
      table: {
        defaultValue: {
          summary: "false",
        },
      },
    },
  },
};

export default meta;

// create a “template” of how args map to rendering (from SB)
type Story = StoryObj<typeof BodyCopy>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Paragraph: Story = {
  args: {
    tag: "p",
    mods: "text-base dark:text-white",
  },
};

export const StrongParagraph = {
  args: {
    tag: "strong",
    weight: "bold",
    mods: "text-base dark:text-white",
    text: "Lorem fistrum ahorarr de la pradera no te digo trigo por no llamarte Rodrigor",
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
      <Code directoryPath="src/stories/components/atoms/BodyCopy/" />
    </>
  ),
};

import { Code } from "@/stories/components/system/Code";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ButtonTailwind } from ".";

const meta: Meta<typeof ButtonTailwind> = {
  title: "Design System/Atoms/Button Tailwind",
  component: ButtonTailwind,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Button is a component that renders a button with customizable text, size, and styles. It is used to trigger an action when clicked. It accepts the following props: `variant`, `children`, `onClick`.",
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["solid", "outline", "ghost"],
      type: "string",
      description: "The variant of the button. By default, it is set to solid.",
      table: {
        defaultValue: { summary: "solid" },
      },
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
      type: "string",
      description: "The size of the button. By default, it is set to md.",
      table: {
        defaultValue: { summary: "md" },
      },
    },
    children: {
      control: "text",
      type: "string",
      description: "The text of the button. By default, it is set to Button.",
      table: {
        defaultValue: { summary: "Button" },
      },
    },
    onClick: {
      type: "function",
      description: "The onClick event of the button.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Solid: Story = {
  args: {
    variant: "solid",
    children: "Button",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Button",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "Button",
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
      <Code directoryPath="src/stories/components/atoms/ButtonTailwind/" />
    </>
  ),
};

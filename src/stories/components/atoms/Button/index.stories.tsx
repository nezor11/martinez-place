import { Code } from "@/stories/components/system/Code";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from ".";

const meta: Meta<typeof Button> = {
  title: "Design System/Atoms/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Button is a component that renders a button with customizable text, size, and styles. It is used to trigger an action when clicked. It accepts the following props: `primary`, `backgroundColor`, `size`, `label`, and `onClick`.",
      },
    },
  },
  argTypes: {
    primary: {
      control: "boolean",
      description:
        "The primary property is optional and can be a boolean. By default, it is set to false.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    backgroundColor: {
      control: "color",
      type: "string",
      description: "The background color of the button.",
      table: { defaultValue: { summary: "transparent" } },
    },
    size: {
      control: { type: "radio" },
      options: ["small", "medium", "large"],
      type: "string",
      description: "The size of the button. By default, it is set to medium.",
      table: {
        defaultValue: { summary: "medium" },
      },
    },
    label: {
      control: "text",
      description: "The text of the button. By default, it is set to Button.",
      table: {
        defaultValue: { summary: "Button" },
      },
    },
    radius: {
      control: "number",
      description: "The border radius of the button.",
      type: "number",
      table: {
        defaultValue: { summary: "0" },
      },
    },
  },
};

export default meta;

//create a “template” of how args map to rendering (from SB)
type Story = StoryObj<typeof Button>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary: Story = {
  args: {
    primary: true,
    label: "Button",
  },
};

export const Secondary = {
  args: {
    label: "Button",
  },
};

export const Large = {
  args: {
    size: "large",
    label: "Button",
  },
};

export const Small = {
  args: {
    size: "small",
    label: "Button",
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
      <Code directoryPath="src/stories/components/atoms/Button/" />
    </>
  ),
};

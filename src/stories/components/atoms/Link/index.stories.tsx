import { Code } from "@/stories/components/system/Code";
import type { Meta, StoryObj } from "@storybook/react";
import { Link } from ".";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof Link> = {
  title: "Design System/Atoms/Link",
  component: Link,
  parameters: {
    docs: {
      description: {
        component:
          "A link component that can be styled with tailwind classes. It accepts the following props: `link_text`, `mods`, `href`, `target`, `rel`.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    link_text: {
      control: "text",
      description:
        "The text of the link element. By default, it is set to 'Link text'.",
      table: {
        defaultValue: { summary: "Link text" },
      },
    },
    mods: {
      control: "text",
      description:
        "The mods property is optional and can be a string with Tailwind CSS classes. By default, it is set to 'visited:text-purple-600'.",
      table: {
        defaultValue: { summary: "visited:text-purple-600" },
      },
    },
    href: {
      control: "text",
      description:
        "The URL of the link element. By default, it is set to 'https://carbon.sage.com'.",
      table: {
        defaultValue: { summary: "https://carbon.sage.com" },
      },
    },
    target: {
      control: "text",
      description:
        "The target of the link element. By default, it is set to '_blank'.",
      table: {
        defaultValue: { summary: "_blank" },
      },
    },
    rel: {
      control: "text",
      description:
        "The rel of the link element. By default, it is set to 'noreferrer noopener'.",
      table: {
        defaultValue: { summary: "noreferrer noopener" },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    mods: "visited:text-purple-600",
    link_text: "Link text",
    href: "https://carbon.sage.com",
    target: "_blank",
    rel: "noreferrer noopener",
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
      <Code directoryPath="src/stories/components/atoms/Link/" />
    </>
  ),
};

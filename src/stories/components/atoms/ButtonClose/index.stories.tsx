import type { Meta, StoryObj } from "@storybook/react-vite";
import ButtonClose from ".";

const meta: Meta<typeof ButtonClose> = {
  title: "Design System/Atoms/ButtonClose",
  component: ButtonClose,
  tags: ["autodocs"],
  argTypes: {
    tone: {
      control: "radio",
      options: [undefined, "onLight", "onDark"],
      description:
        "Background the button sits on: dark pill over light media, light pill over dark media. Without it, the legacy white square.",
    },
    onClick: { action: "close" },
  },
  decorators: [
    (Story, { args }) => (
      <div
        className="relative h-24 w-48 rounded-sm"
        style={{
          background:
            args.tone === "onDark"
              ? "#3D0A25"
              : args.tone === "onLight"
                ? "#FFE600"
                : "#e5e7eb",
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

/** Default look, as used by the modal stories. */
export const Default: Story = {
  args: {},
};

/** Over a light background the pill is dark. */
export const OnLight: Story = {
  args: { tone: "onLight" },
};

/** Over a dark background the pill is light. */
export const OnDark: Story = {
  args: { tone: "onDark" },
};

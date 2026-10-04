import type { Meta, StoryObj } from "@storybook/react-vite";
import { ConsentBanner } from ".";

const meta: Meta<typeof ConsentBanner> = {
  title: "Design System/Molecules/ConsentBanner",
  component: ConsentBanner,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Asks once whether Google Analytics may load. Accept and Reject look the same on purpose. On the site it only shows on builds with a GTM container and until a choice is stored; the story forces it open and reports the choice instead of storing it.",
      },
      story: { inline: false, iframeHeight: 240 },
    },
  },
  args: { forceOpen: true },
  argTypes: { onChoice: { action: "choice" } },
};

export default meta;

type Story = StoryObj<typeof meta>;

/** As shown on a first visit. */
export const Default: Story = {};

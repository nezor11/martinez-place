import type { Meta, StoryObj } from "@storybook/react-vite";
import { SuspenseIconGallery } from ".";

const meta: Meta<typeof SuspenseIconGallery> = {
  title: "Design System/Molecules/SuspenseIconGallery",
  component: SuspenseIconGallery,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "IconGallery that renders only after mount. Cards, modals and the filter use it so the prerendered HTML carries no icon SVGs and hydration has nothing to reconcile; the icons then load on demand through the registry.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/** The tech icons of a project card. */
export const ProjectIcons: Story = {
  args: {
    iconsData: [
      { name: "WordpressIcon", width: "32px", height: "32px" },
      { name: "PhpIcon", width: "32px", height: "32px" },
      { name: "TailwindIcon", width: "32px", height: "32px" },
      { name: "ReactNativeIcon", width: "32px", height: "32px" },
      { name: "ExpoIcon", width: "32px", height: "32px" },
    ],
  },
};

/** With `onIconClick` every icon is a filter button; `activeIcon` marks the current one. */
export const Clickable: Story = {
  args: {
    iconsData: [
      { name: "ReactIcon", width: "28px", height: "28px" },
      { name: "TypeScriptIcon", width: "28px", height: "28px" },
      { name: "NextJSIcon", width: "28px", height: "28px" },
    ],
    activeIcon: "ReactIcon",
    onIconClick: (name: string) => console.log("filter by", name),
  },
};

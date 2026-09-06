// preview.tsx
import { Preview } from "@storybook/react-vite";
import React from "react";
import { useDarkMode } from "storybook-dark-mode";
import "../src/styles/index.css";

const withDarkMode = (StoryFn) => {
  const darkMode = useDarkMode();
  document.documentElement.classList.toggle("dark", darkMode);
  return <StoryFn />;
};

const MY_VIEWPORTS = {
  FHDTV: {
    name: "1080p Full HD Television",
    styles: {
      width: "1920px",
      height: "1080px",
    },
    type: "desktop",
  },
  LaptopHiDPI: {
    name: "Laptop with HiDPI screen",
    styles: {
      width: "1440px",
      height: "900px",
    },
    type: "desktop",
  },
  LaptopMDPI: {
    name: "Laptop with MDPI screen",
    styles: {
      width: "1280px",
      height: "800px",
    },
    type: "desktop",
  },
  iPhone6Plus: {
    name: "iPhone 6/7/8 Plus",
    styles: {
      width: "414px",
      height: "736px",
    },
    type: "mobile",
  },
  iPad: {
    name: "iPad iPadOS 14.7.1",
    styles: {
      width: "810px",
      height: "1080px",
    },
    type: "tablet",
  },
  iPhone6iOS11: {
    name: "iPhone 6/7/8 iOS11",
    styles: {
      width: "375px",
      height: "667px",
    },
    type: "mobile",
  },
};

const preview: Preview = {
  decorators: [withDarkMode],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    viewport: {
      options: MY_VIEWPORTS,
    },
    options: {
      storySort: {
        includeNames: true,
        order: [
          "Design System",
          [
            "Atoms",
            ["Title Copy", "Subtitle Copy", "Body Copy", "Link", "*"],
            "Molecules",
            ["Title Section", "Info Item", "*", "Card Slide"],
            "Organisms",
            ["Header", "Info Section", "Slider Section", "Footer", "*"],
            "Templates",
            "Pages",
          ],
        ],
      },
    },
  },

  tags: ["autodocs"],
};

export default preview;

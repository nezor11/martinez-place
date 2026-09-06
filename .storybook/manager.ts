import { addons } from "@storybook/manager-api";
import { create, themes } from "@storybook/theming";

addons.setConfig({
  theme: create({
    base: "light",
    brandTitle: "martinez.place",
    brandUrl: "/",
    brandImage: "./nezor.svg",
    brandTarget: "_self",
    colorSecondary: "rgba(225, 29, 72, 1)",
    appBg: "#f0f0f0",
    appBorderColor: "rgba(0,0,0,0.1)",
    textColor: "#333",
    barTextColor: "#999",
  }),
  sidebar: {
    showRoots: false,
  },
  darkTheme: themes.dark,
});

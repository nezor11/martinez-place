import type { StorybookConfig } from "@storybook/react-vite";
import path from "node:path";
import tsconfigPaths from "vite-tsconfig-paths";

const config: StorybookConfig = {
  stories: ["../src/**/*.@(mdx|stories.@(js|jsx|mjs|ts|tsx))"],
  staticDirs: ["../public"],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-docs",
    "storybook-dark-mode",
    "@chromatic-com/storybook",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
  typescript: {
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      // Filtra props que provengan de node_modules
      propFilter: (prop) =>
        prop.parent ? !/node_modules/.test(prop.parent.fileName) : true,
    },
  },
  docs: {},
  viteFinal: async (config) => {
    config.plugins = config.plugins || [];
    config.plugins.push(
      tsconfigPaths({
        projects: [path.resolve(path.dirname(__dirname), "tsconfig.json")],
      })
    );

    // Excluimos "vue" de la optimización de dependencias
    config.optimizeDeps = config.optimizeDeps || {};
    config.optimizeDeps.exclude = [
      ...(config.optimizeDeps.exclude || []),
      "vue",
    ];

    // Marcamos "vue" como externo en Rollup
    config.build = config.build || {};
    config.build.rollupOptions = config.build.rollupOptions || {};
    config.build.rollupOptions.external = [
      ...((config.build.rollupOptions.external as string[]) || []),
      "vue",
    ] as const;

    return config;
  },
};

export default config;

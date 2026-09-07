import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/react-vite";
import path, { dirname } from "node:path";
import tsconfigPaths from "vite-tsconfig-paths";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config: StorybookConfig = {
  stories: ["../src/**/*.@(mdx|stories.@(js|jsx|mjs|ts|tsx))"],
  staticDirs: ["../public"],
  addons: [
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
    // react-docgen-typescript depends on the TypeScript JS API, which the
    // native TypeScript 7 compiler no longer provides; react-docgen parses
    // the components with Babel instead.
    reactDocgen: "react-docgen",
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

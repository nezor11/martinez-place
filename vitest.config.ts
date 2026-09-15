import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Unit tests for the pure helpers (src/utils, scripts). Kept apart from
// vite.config.js so the site plugins (image optimizer, critical icons,
// per-locale data) are not loaded; browser behaviour lives in tests/e2e.
// The "@/" alias is declared here because tsconfig excludes *.test.ts.
export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    include: ["src/**/*.test.ts", "scripts/**/*.test.mjs"],
    environment: "node",
  },
});

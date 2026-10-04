import { defineConfig, devices } from "@playwright/test";

const baseURL = "http://localhost:4173";

/**
 * End-to-end checks against the production build served by `vite preview`.
 * Run `yarn build` first (CI does), then `yarn test:e2e`.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: {
    baseURL,
    trace: "retain-on-failure",
    // Builds with a GTM container show a consent banner on the first visit.
    // Tests start with the choice already made (denied) so the banner never
    // covers what they click; consent.spec.ts starts without it.
    storageState: {
      cookies: [],
      origins: [
        {
          origin: baseURL,
          localStorage: [{ name: "analytics-consent", value: "denied" }],
        },
      ],
    },
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "yarn vite preview --port 4173 --strictPort",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});

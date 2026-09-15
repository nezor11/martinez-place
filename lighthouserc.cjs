/** Lighthouse CI: audits the production build served from dist/. */
module.exports = {
  ci: {
    collect: {
      staticDistDir: "./dist",
      url: ["http://localhost/index.html", "http://localhost/es/index.html"],
      numberOfRuns: 3,
      settings: {
        // Mobile emulation with simulated throttling is Lighthouse's default
        // and the stricter of the two; scores below are for that profile.
        chromeFlags: "--no-sandbox --headless=new",
      },
    },
    assert: {
      // Judge the median of the runs, not the best or worst one.
      aggregationMethod: "median-run",
      assertions: {
        // Mobile performance sits at 95 locally since rich text and icons
        // moved out of the bundle (2026-09); 0.85 leaves room for slower CI
        // runners while still catching real regressions.
        "categories:performance": ["error", { minScore: 0.85 }],
        "categories:accessibility": ["error", { minScore: 0.95 }],
        "categories:best-practices": ["error", { minScore: 0.95 }],
        "categories:seo": ["error", { minScore: 0.95 }],
      },
    },
    upload: {
      target: "filesystem",
      outputDir: ".lighthouseci",
    },
  },
};

import { expect, test } from "@playwright/test";
import {
  collectErrors,
  enforceCsp,
  openCard,
  reportCspViolations,
  slideTitlesWithVideo,
} from "./helpers";

const ignore = [
  // youtube-video-element logs the YouTube player's onError event as
  // `{target: X, data: 150}`. YouTube refuses embedded playback from GitHub
  // Actions runners (codes 150/153); the embed itself still loads under the
  // CSP, which is what this test checks.
  /^\{target: .*, data: 1[05]\d\}$/,
];

test("loads, opens a project and plays videos under the production CSP", async ({ page, baseURL }) => {
  const errors = collectErrors(page, ignore);
  await enforceCsp(page, baseURL as string);
  await reportCspViolations(page);
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  expect(await openCard(page)).toBe(true);
  await page.locator(".popup-content button").first().click({ force: true }).catch(() => {});
  await page.waitForTimeout(500);

  for (const [pattern, kind] of [
    [/youtube/, "youtube"],
    [/\.(mp4|webm)(\?|$)/, "file"],
  ] as const) {
    const [title] = slideTitlesWithVideo(pattern);
    if (!title) continue;
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    expect(await openCard(page, title), `card for ${kind} slide "${title}"`).toBe(true);
    const play = page.locator(".popup-content button[class*=play], .popup-content .play").first();
    if (await play.count()) await play.click({ force: true });
    await page.waitForTimeout(3000);
    // react-player 3 renders each provider as a custom element whose iframe
    // or <video> lives in a shadow root, so walk shadow trees too.
    const media = await page.evaluate(() => {
      const iframes: string[] = [];
      const videos: string[] = [];
      const walk = (root: Document | ShadowRoot) => {
        for (const el of root.querySelectorAll("*")) {
          if (el instanceof HTMLIFrameElement) iframes.push(el.src);
          if (el instanceof HTMLVideoElement) videos.push(el.currentSrc || el.src);
          if (el.shadowRoot) walk(el.shadowRoot);
        }
      };
      walk(document);
      return { iframes, videos };
    });
    if (kind === "youtube") expect(media.iframes.some((s) => /youtube/.test(s))).toBe(true);
    else expect(media.videos.length).toBeGreaterThan(0);
  }

  expect(errors.filter((e) => e.startsWith("CSP violation"))).toEqual([]);
  expect(errors).toEqual([]);
});

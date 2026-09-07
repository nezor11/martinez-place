import { expect, test } from "@playwright/test";
import {
  collectErrors,
  enforceCsp,
  openCard,
  reportCspViolations,
  slideTitlesWithVideo,
} from "./helpers";

const ignore = [/Swiper Loop Warning/];

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
    const media = await page.evaluate(() => ({
      iframes: [...document.querySelectorAll("iframe")].map((f) => f.src),
      videos: [...document.querySelectorAll("video")].map((v) => v.currentSrc || v.src),
    }));
    if (kind === "youtube") expect(media.iframes.some((s) => /youtube/.test(s))).toBe(true);
    else expect(media.videos.length).toBeGreaterThan(0);
  }

  expect(errors.filter((e) => e.startsWith("CSP violation"))).toEqual([]);
  expect(errors).toEqual([]);
});

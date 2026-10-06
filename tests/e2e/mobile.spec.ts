import { devices, expect, test } from "@playwright/test";

/**
 * Phone layout of the portfolio slider: the active card is centred, its
 * neighbours peek in evenly and level (no desktop stagger), and the card
 * plus the filter above it fit on one screen.
 */
// The device descriptor asks for WebKit; CI only installs Chromium.
test.use({ ...devices["iPhone 13"], browserName: "chromium" });

const rect = (page: import("@playwright/test").Page, selector: string) =>
  page.evaluate((sel) => {
    const r = document.querySelector(sel)?.getBoundingClientRect();
    return r ? { left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width, height: r.height } : null;
  }, selector);

test("the active card is centred with level neighbours on a phone", async ({ page }) => {
  await page.goto("/");
  const section = page.locator(".slider-section").first();
  await section.evaluate((el) => el.scrollIntoView({ block: "start" }));
  await page.waitForTimeout(500);

  const viewport = page.viewportSize() as { width: number; height: number };
  const card = (await rect(page, ".swiper-slide-active .card-slide")) as { left: number; right: number; bottom: number; width: number };
  expect(card.width).toBeLessThan(300);
  expect(Math.abs(card.left - (viewport.width - card.right))).toBeLessThanOrEqual(1);
  expect(card.left).toBeGreaterThan(24);

  const transforms = await page.evaluate(() =>
    [".swiper-slide-prev", ".swiper-slide-active", ".swiper-slide-next"].map(
      (s) => getComputedStyle(document.querySelector(`${s} .portfolio__slide-content`) as Element).transform
    )
  );
  expect(transforms).toEqual(["none", "none", "none"]);

  // Title, filter and the whole card are on screen together.
  expect(card.bottom).toBeLessThanOrEqual(viewport.height);
  const filter = (await rect(page, ".portfolio-filter")) as { top: number };
  expect(filter.top).toBeGreaterThanOrEqual(0);
});

test("the neighbouring cards peek in from both sides on a phone", async ({ page }) => {
  await page.goto("/");
  await page.locator(".slider-section").first().evaluate((el) => el.scrollIntoView({ block: "start" }));
  await page.waitForTimeout(500);
  const viewport = page.viewportSize() as { width: number };
  const prev = (await rect(page, ".swiper-slide-prev")) as { right: number };
  const next = (await rect(page, ".swiper-slide-next")) as { left: number };
  expect(prev.right).toBeGreaterThan(20);
  expect(viewport.width - next.left).toBeGreaterThan(20);
});

test("tapping a card opens its popup on a phone", async ({ page }) => {
  await page.goto("/");
  const open = page.locator(".swiper-slide-active .card-slide__open");
  await open.scrollIntoViewIfNeeded();
  await open.tap();
  await expect(page.locator(".popup-content")).toBeVisible();
});

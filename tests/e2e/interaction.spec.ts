import { expect, test } from "@playwright/test";
import { openCard } from "./helpers";

test("a horizontal wheel gesture moves the slider and a vertical one scrolls the page", async ({ page }) => {
  await page.goto("/");
  const slider = page.locator(".swiper").first();
  await slider.scrollIntoViewIfNeeded();
  const box = (await slider.boundingBox()) as { x: number; y: number; width: number; height: number };
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);

  const before = await page.evaluate(() => (document.querySelector(".swiper") as HTMLElement & { swiper: { realIndex: number } }).swiper.realIndex);
  await page.mouse.wheel(400, 0);
  await page.waitForTimeout(800);
  const after = await page.evaluate(() => (document.querySelector(".swiper") as HTMLElement & { swiper: { realIndex: number } }).swiper.realIndex);
  expect(after).not.toBe(before);

  const scrollBefore = await page.evaluate(() => window.scrollY);
  await page.mouse.wheel(0, 300);
  await page.waitForTimeout(300);
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(scrollBefore);
});

test("buttons show a pointer cursor, including the popup close button", async ({ page }) => {
  await page.goto("/");
  const toggle = page.locator("button.button-light, button.button-dark").first();
  expect(await toggle.evaluate((el) => getComputedStyle(el).cursor)).toBe("pointer");
  expect(await openCard(page)).toBe(true);
  const close = page.locator(".popup-content button").first();
  expect(await close.evaluate((el) => getComputedStyle(el).cursor)).toBe("pointer");
});

import { expect, test } from "@playwright/test";

test("printing hides the controls, expands the lists and stacks the portfolio", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  // Dark theme on screen must not reach the paper.
  await page.evaluate(() => {
    localStorage.setItem("theme", "dark");
    document.documentElement.classList.add("dark");
  });
  const profileItemsBefore = await page.locator(".info-section, section").first().locator("h4, h3").count();

  await page.emulateMedia({ media: "print" });
  await page.evaluate(() => window.dispatchEvent(new Event("beforeprint")));
  await page.waitForTimeout(300);

  await expect(page.locator(".site-controls")).toBeHidden();
  await expect(page.locator(".portfolio-filter")).toBeHidden();
  expect(await page.evaluate(() => document.documentElement.classList.contains("dark"))).toBe(false);
  expect(await page.evaluate(() => getComputedStyle(document.querySelector(".portfolio__slider .swiper-wrapper") as Element).display)).toBe("block");
  expect(await page.getByRole("button", { name: /load more/i }).count()).toBe(0);
  expect(await page.locator(".info-section, section").first().locator("h4, h3").count()).toBeGreaterThanOrEqual(profileItemsBefore);

  await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
  await page.emulateMedia({ media: "screen" });
  await expect(page.locator(".site-controls")).toBeVisible();
});

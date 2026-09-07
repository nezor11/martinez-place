import { expect, test } from "@playwright/test";
import { collectErrors } from "./helpers";

const ignore = [/Swiper Loop Warning/];

for (const scheme of ["light", "dark"] as const) {
  test(`hydrates without errors and keeps the ${scheme} theme`, async ({ page }) => {
    const errors = collectErrors(page, ignore);
    await page.addInitScript((value) => localStorage.setItem("theme", value), scheme);
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(500);

    const html = page.locator("html");
    if (scheme === "dark") {
      await expect(html).toHaveClass(/dark/);
      await expect(page.locator("button.button-dark")).toBeVisible();
    } else {
      await expect(html).not.toHaveClass(/dark/);
      await expect(page.locator("button.button-light")).toBeVisible();
    }
    expect(errors).toEqual([]);
  });
}

test("the Spanish page hydrates without errors", async ({ page }) => {
  const errors = collectErrors(page, ignore);
  await page.goto("/es/");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(500);
  await expect(page.locator("button.button-light")).toBeVisible();
  expect(errors).toEqual([]);
});

test("theme toggle switches and persists the preference", async ({ page }) => {
  await page.goto("/");
  await page.locator("button.button-light").click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  expect(await page.evaluate(() => localStorage.getItem("theme"))).toBe("dark");
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark/);
});

test("the slider loops through all cards", async ({ page }) => {
  await page.goto("/");
  await page.locator(".swiper").waitFor();
  const state = await page.evaluate(async () => {
    const swiper = (document.querySelector(".swiper") as HTMLElement & { swiper: { params: { loop: boolean }; slides: unknown[]; realIndex: number; slideNext: (speed: number) => void } }).swiper;
    const total = swiper.slides.length;
    for (let i = 0; i < total; i++) swiper.slideNext(0);
    await new Promise((resolve) => setTimeout(resolve, 200));
    return { loop: swiper.params.loop, total, realIndex: swiper.realIndex };
  });
  expect(state.loop).toBe(true);
  expect(state.total).toBeGreaterThan(1);
  expect(state.realIndex).toBe(0);
});

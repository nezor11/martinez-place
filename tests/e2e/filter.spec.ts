import { expect, test } from "@playwright/test";

test("typing in the portfolio search dims the cards that do not match", async ({ page }) => {
  await page.goto("/");
  const input = page.getByRole("searchbox");
  const cards = page.locator(".card-slide");
  const dimmed = page.locator(".card-slide[data-dimmed]");
  const total = await cards.count();
  expect(total).toBeGreaterThan(1);
  await expect(dimmed).toHaveCount(0);

  await input.fill("zzzz-nothing-matches");
  await expect(dimmed).toHaveCount(total);
  await expect(page.locator(".portfolio__search [aria-live]")).toHaveText(`0 of ${total} projects`);

  await input.fill("wordpress");
  const remaining = await dimmed.count();
  expect(remaining).toBeGreaterThan(0);
  expect(remaining).toBeLessThan(total);

  await page.getByRole("button", { name: "Clear search" }).click();
  await expect(input).toHaveValue("");
  await expect(dimmed).toHaveCount(0);
});

test("clicking a tech icon on a card applies and toggles the same filter", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  // Cards sit in a horizontal slider, so the first icon may be off-screen;
  // click it through the DOM like a keyboard user reaching it would.
  const icon = page.locator('.card-slide button[aria-label="Filter by WordPress"]').first();
  await icon.waitFor();
  await icon.evaluate((el) => (el as HTMLElement).click());
  const input = page.getByRole("searchbox");
  await expect(input).toHaveValue("WordPress");
  await expect(icon).toHaveAttribute("aria-pressed", "true");
  expect(await page.locator(".card-slide[data-dimmed]").count()).toBeGreaterThan(0);
  // Every card that shows the WordPress icon stays active.
  const withIcon = page.locator('.card-slide:has(button[aria-label="Filter by WordPress"])');
  expect(await withIcon.count()).toBeGreaterThan(0);
  await expect(withIcon.locator("[data-dimmed]")).toHaveCount(0);

  await icon.evaluate((el) => (el as HTMLElement).click());
  await expect(input).toHaveValue("");
  await expect(page.locator(".card-slide[data-dimmed]")).toHaveCount(0);
});

test("the search ignores accents and case", async ({ page }) => {
  await page.goto("/es/");
  const input = page.getByRole("searchbox");
  await input.fill("DISENO");
  const dimmedPlain = await page.locator(".card-slide[data-dimmed]").count();
  await input.fill("diseño");
  expect(await page.locator(".card-slide[data-dimmed]").count()).toBe(dimmedPlain);
  const total = await page.locator(".card-slide").count();
  expect(dimmedPlain).toBeLessThan(total);
});

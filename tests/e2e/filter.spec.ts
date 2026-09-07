import { expect, test } from "@playwright/test";

type Page = import("@playwright/test").Page;
const dimmed = (page: Page) => page.locator(".card-slide[data-dimmed]");
// The box is display:none until the magnifier opens it, so role queries
// (which skip hidden elements) cannot address it; use the class instead.
const searchInput = (page: Page) => page.locator(".portfolio-filter__input");
const searchToggle = (page: Page) =>
  page.locator(".portfolio-filter__search-toggle");

test("the magnifier unfolds the search and typing dims the cards that do not match", async ({
  page,
}) => {
  await page.goto("/");
  const input = searchInput(page);
  const total = await page.locator(".card-slide").count();
  expect(total).toBeGreaterThan(1);
  await expect(input).toBeHidden();

  const toggle = searchToggle(page);
  await expect(toggle).toHaveAccessibleName("Search projects");
  await toggle.click();
  await expect(toggle).toHaveAccessibleName("Hide search");
  await expect(input).toBeVisible();
  await expect(input).toBeFocused();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");

  await input.fill("zzzz-nothing-matches");
  await expect(dimmed(page)).toHaveCount(total);
  await expect(page.locator(".portfolio-filter__status")).toHaveText(
    `0 of ${total} projects`,
  );

  await input.fill("wordpress");
  const remaining = await dimmed(page).count();
  expect(remaining).toBeGreaterThan(0);
  expect(remaining).toBeLessThan(total);

  await input.press("Escape");
  await expect(input).toBeHidden();
  await expect(dimmed(page)).toHaveCount(0);
});

test("the technology bar filters, shows counts and dims technologies with no matches", async ({
  page,
}) => {
  await page.goto("/");
  const bar = page.locator(".portfolio-filter__techs");
  const buttons = bar.getByRole("button");
  expect(await buttons.count()).toBeGreaterThan(5);
  // Most used first.
  const first = await buttons.first().getAttribute("aria-label");
  expect(first).toMatch(/^Filter by .+, \d+ projects$/);

  const wordpress = bar.getByRole("button", { name: /^Filter by WordPress/ });
  await wordpress.click();
  await expect(wordpress).toHaveAttribute("aria-pressed", "true");
  await expect(searchInput(page)).toHaveValue("WordPress");
  expect(await dimmed(page).count()).toBeGreaterThan(0);
  expect(
    await bar.locator(".portfolio-filter__tech--dimmed").count(),
  ).toBeGreaterThan(0);
  await expect(page.locator(".portfolio-filter__status")).toContainText(
    /^\d+ of \d+ projects$/,
  );

  await wordpress.click();
  await expect(wordpress).toHaveAttribute("aria-pressed", "false");
  await expect(dimmed(page)).toHaveCount(0);
});

test("clicking a tech icon on a card applies and toggles the same filter", async ({
  page,
}) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  // Cards sit in a horizontal slider, so the first icon may be off-screen;
  // click it through the DOM like a keyboard user reaching it would.
  const icon = page
    .locator('.card-slide button[aria-label="Filter by WordPress"]')
    .first();
  await icon.waitFor();
  await icon.evaluate((el) => (el as HTMLElement).click());
  await expect(searchInput(page)).toHaveValue("WordPress");
  await expect(icon).toHaveAttribute("aria-pressed", "true");
  expect(await dimmed(page).count()).toBeGreaterThan(0);
  const withIcon = page.locator(
    '.card-slide:has(button[aria-label="Filter by WordPress"])',
  );
  expect(await withIcon.count()).toBeGreaterThan(0);
  await expect(withIcon.locator("[data-dimmed]")).toHaveCount(0);

  await icon.evaluate((el) => (el as HTMLElement).click());
  await expect(searchInput(page)).toHaveValue("");
  await expect(dimmed(page)).toHaveCount(0);
});

test("the search matches whole words or prefixes, not substrings", async ({
  page,
}) => {
  await page.goto("/es/");
  await page.getByRole("button", { name: "Buscar proyectos" }).click();
  await page.getByRole("searchbox").fill("vue");
  // "devuelve" appears in this description; it must not count as Vue.
  await expect(
    page.locator(".card-slide", { hasText: "Grünenthal Campus" }),
  ).toHaveAttribute("data-dimmed", "true");
  await expect(
    page.locator(".card-slide", { hasText: "Vinduet" }),
  ).not.toHaveAttribute("data-dimmed", /.*/);
});

test("the search ignores accents and case", async ({ page }) => {
  await page.goto("/es/");
  await page.getByRole("button", { name: "Buscar proyectos" }).click();
  const input = page.getByRole("searchbox");
  await input.fill("DISENO");
  const dimmedPlain = await dimmed(page).count();
  await input.fill("diseño");
  expect(await dimmed(page).count()).toBe(dimmedPlain);
  expect(dimmedPlain).toBeLessThan(await page.locator(".card-slide").count());
});

import { expect, test } from "@playwright/test";
import { openCard } from "./helpers";

test.use({ permissions: ["clipboard-read", "clipboard-write"] });

test("opening a project sets a shareable hash that reopens it", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  expect(await openCard(page)).toBe(true);

  const title = (await page.locator(".popup-content h2, .popup-content h1").first().textContent())?.trim();
  const hash = await page.evaluate(() => window.location.hash);
  expect(hash).toMatch(/^#project-[a-z0-9-]+$/);

  await page.locator(".popup-content button[aria-label]").first().click();
  await expect(page.locator(".popup-content")).toHaveCount(0);
  expect(await page.evaluate(() => window.location.hash)).toBe("");

  await page.goto(`/${hash}`);
  await page.locator(".popup-content").waitFor({ timeout: 10_000 });
  expect((await page.locator(".popup-content h2, .popup-content h1").first().textContent())?.trim()).toBe(title);

  const share = page.locator(".popup__share");
  await expect(share).toHaveText("Copy link");
  await share.click();
  await expect(share).toHaveText("Link copied");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(`http://localhost:4173/${hash}`);
});

test("the Spanish page deep-links with translated copy", async ({ page }) => {
  await page.goto("/es/");
  await page.waitForLoadState("networkidle");
  expect(await openCard(page)).toBe(true);
  await expect(page.locator(".popup__share")).toHaveText("Copiar enlace");
  expect(await page.evaluate(() => window.location.hash)).toMatch(/^#project-/);
});

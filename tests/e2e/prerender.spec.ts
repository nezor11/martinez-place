import { expect, test } from "@playwright/test";

test.describe("prerendered HTML", () => {
  test.use({ javaScriptEnabled: false });

  test("shows the full resume without JavaScript", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator("h1").first()).not.toBeEmpty();
    expect(await page.locator("main section").count()).toBeGreaterThanOrEqual(3);
    expect(await page.locator(".card-slide").count()).toBeGreaterThan(0);
    expect(await page.locator("header svg").count()).toBeGreaterThan(0);
    await expect(page.locator("footer")).toContainText(/last updated/i);
  });

  test("monochrome header icons are visible in light mode", async ({ page }) => {
    await page.goto("/");
    const fill = await page
      .locator("header svg.GitBranch path")
      .first()
      .evaluate((el) => getComputedStyle(el).fill);
    expect(fill).not.toBe("none");
  });
});

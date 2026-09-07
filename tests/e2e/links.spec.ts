import { expect, test } from "@playwright/test";

test("links inside rich text open safely in a new tab", async ({ page }) => {
  await page.goto("/");
  const links = page.locator(".text a");
  const count = await links.count();
  expect(count).toBeGreaterThan(0);
  for (let i = 0; i < count; i++) {
    const link = links.nth(i);
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", /noopener/);
  }
});

test("the PDF resume link points to a PDF", async ({ page }) => {
  await page.goto("/");
  const pdf = page.locator("footer a", { hasText: /pdf/i }).first();
  await expect(pdf).toHaveAttribute("href", /\.pdf$/);
  await expect(pdf).toHaveAttribute("rel", /noopener/);
});

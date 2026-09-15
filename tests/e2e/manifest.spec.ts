import { expect, test } from "@playwright/test";

test("the web manifest is linked, served as JSON and its icons exist", async ({ page, request }) => {
  await page.goto("/");
  const href = await page.locator('link[rel="manifest"]').getAttribute("href");
  expect(href).toBe("/site.webmanifest");
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute("href", "/apple-touch-icon.png");

  const manifest = await request.get("/site.webmanifest");
  expect(manifest.ok()).toBe(true);
  const body = await manifest.json();
  expect(body.name).toContain("Jorge Martínez");
  expect(body.icons.length).toBeGreaterThanOrEqual(3);
  for (const icon of body.icons) {
    const res = await request.get(icon.src);
    expect(res.ok(), icon.src).toBe(true);
  }
  expect((await request.get("/apple-touch-icon.png")).ok()).toBe(true);
});

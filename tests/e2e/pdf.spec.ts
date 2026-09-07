import { expect, test } from "@playwright/test";

test("the generated PDF resume is served and looks like a PDF", async ({ page, request }) => {
  const response = await request.get("/resume.pdf");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("application/pdf");
  const body = await response.body();
  expect(body.subarray(0, 5).toString()).toBe("%PDF-");
  expect(body.length).toBeGreaterThan(20_000);

  await page.goto("/");
  await expect(page.locator("footer a", { hasText: /pdf/i }).first()).toHaveAttribute("href", "/resume.pdf");
});

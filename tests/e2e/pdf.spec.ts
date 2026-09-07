import { expect, test } from "@playwright/test";
import { locales } from "./helpers";

for (const { locale, path, pdf } of locales) {
  test(`the generated ${locale} PDF resume is served and looks like a PDF`, async ({ page, request }) => {
    const response = await request.get(pdf);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/pdf");
    const body = await response.body();
    expect(body.subarray(0, 5).toString()).toBe("%PDF-");
    expect(body.length).toBeGreaterThan(20_000);

    await page.goto(path);
    await expect(page.locator("footer a", { hasText: /pdf/i }).first()).toHaveAttribute("href", pdf);
  });
}

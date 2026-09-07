import { expect, test } from "@playwright/test";
import { locales } from "./helpers";

for (const { locale, path, og } of locales) {
  test(`the ${locale} social card is a 1200x630 PNG referenced by the meta tags`, async ({ page, request }) => {
    const response = await request.get(og);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/png");
    const body = await response.body();
    // PNG signature, then the IHDR chunk carries width and height as big-endian ints.
    expect(body.subarray(1, 4).toString()).toBe("PNG");
    expect(body.readUInt32BE(16)).toBe(1200);
    expect(body.readUInt32BE(20)).toBe(630);

    await page.goto(path);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", `https://martinez.place${og}`);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
  });
}

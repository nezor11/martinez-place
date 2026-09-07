import { expect, test } from "@playwright/test";
import { locales } from "./helpers";

const site = "https://martinez.place";

for (const { locale, path } of locales) {
  test(`the ${locale} page declares its language and links every alternate`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `${site}${path}`);
    for (const other of locales) {
      await expect(page.locator(`link[rel="alternate"][hreflang="${other.locale}"]`)).toHaveAttribute("href", `${site}${other.path}`);
    }
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute("href", `${site}/`);
    const jsonLd = await page.locator('script[type="application/ld+json"]').textContent();
    expect(JSON.parse(jsonLd ?? "{}").url).toBe(`${site}${path}`);
  });
}

test("the language switcher moves between the two pages", async ({ page }) => {
  await page.goto("/");
  const toSpanish = page.locator("nav.language-switcher a[hreflang=es]");
  await expect(toSpanish).toHaveAttribute("href", "/es/");
  await toSpanish.click();
  await expect(page).toHaveURL(/\/es\/$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  await expect(page.locator("footer")).toContainText(/última actualización/i);

  const toEnglish = page.locator("nav.language-switcher a[hreflang=en]");
  await expect(toEnglish).toHaveAttribute("href", "/");
  await toEnglish.click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("the sitemap lists both pages with their alternates", async ({ request }) => {
  const response = await request.get("/sitemap.xml");
  expect(response.status()).toBe(200);
  const xml = await response.text();
  for (const { locale, path } of locales) {
    expect(xml).toContain(`<loc>${site}${path}</loc>`);
    expect(xml).toContain(`hreflang="${locale}" href="${site}${path}"`);
  }
});

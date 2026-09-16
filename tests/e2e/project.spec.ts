import { expect, test } from "@playwright/test";
import { collectErrors, locales, resumeData } from "./helpers";

/** First project of the default language: its slug is shared by every language. */
const firstProject = () => {
  const resume = resumeData("en");
  for (const section of resume.pageBuilder) {
    const slide = section.sliderDetails?.slides?.[0]?.slideDetails;
    if (slide) return slide;
  }
  throw new Error("the resume has no projects");
};

const slugOf = (name: string) =>
  name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

for (const { locale, path, project: projectPrefix } of locales) {
  test(`the ${locale} project page is prerendered with its own head and hydrates`, async ({ page }) => {
    const errors = collectErrors(page);
    const slide = firstProject();
    const slug = slugOf(slide.slugSource || slide.name);
    const url = `${projectPrefix}${slug}/`;
    const localised = resumeData(locale);
    const localisedSlide = localised.pageBuilder
      .flatMap((s: { sliderDetails?: { slides: { slideDetails: { _id: string } }[] } }) => s.sliderDetails?.slides ?? [])
      .map((s: { slideDetails: { _id: string; slideTitle: string; name: string } }) => s.slideDetails)
      .find((s: { _id: string }) => s._id === slide._id);

    const response = await page.goto(url);
    expect(response?.status()).toBe(200);
    await page.waitForLoadState("networkidle");

    await expect(page.locator(".project-page h2").first()).toHaveText(localisedSlide.slideTitle);
    await expect(page).toHaveTitle(new RegExp(localisedSlide.name));
    expect(await page.locator('link[rel="canonical"]').getAttribute("href")).toBe(`https://martinez.place${url}`);
    expect(await page.locator('meta[property="og:image"]').getAttribute("content")).toMatch(/^https:\/\//);
    expect(await page.locator('meta[name="description"]').getAttribute("content")).toBeTruthy();
    for (const other of locales) {
      await expect(page.locator(`link[rel="alternate"][hreflang="${other.locale}"]`)).toHaveAttribute(
        "href",
        `https://martinez.place${other.project}${slug}/`,
      );
    }
    expect(await page.locator('script[type="application/ld+json"]').last().textContent()).toContain('"CreativeWork"');

    // Header, back link and tech icons are in the HTML and survive hydration.
    await expect(page.locator("header").first()).toBeVisible();
    const media = page.locator(".project-page img, .project-page button").first();
    if (await media.count()) {
      await expect(media).toBeVisible();
      if ((await media.evaluate((el) => el.tagName)) === "IMG") {
        await expect.poll(() => media.evaluate((img) => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
      }
    }
    await expect(page.locator(`a[href="${path}#project-${slug}"]`)).toBeVisible();
    const iconCount = (localisedSlide.icons ?? []).length;
    if (iconCount) expect(await page.locator(".project-page svg").count()).toBeGreaterThanOrEqual(iconCount);
    expect(errors).toEqual([]);
  });
}

test("the sitemap lists every project page in both languages", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  const slide = firstProject();
  const slug = slugOf(slide.slugSource || slide.name);
  expect(xml).toContain(`<loc>https://martinez.place/project/${slug}/</loc>`);
  expect(xml).toContain(`<loc>https://martinez.place/es/proyecto/${slug}/</loc>`);
  const projects = resumeData("en").pageBuilder.flatMap(
    (s: { sliderDetails?: { slides: unknown[] } }) => s.sliderDetails?.slides ?? [],
  ).length;
  expect((xml.match(/<loc>/g) ?? []).length).toBe(2 + projects * 2);
});

test("the language switcher on a project page keeps the project", async ({ page }) => {
  const slide = firstProject();
  const slug = slugOf(slide.slugSource || slide.name);
  await page.goto(`/project/${slug}/`);
  await expect(page.locator(".language-switcher a").first()).toHaveAttribute("href", `/es/proyecto/${slug}/`);
});

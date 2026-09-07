import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Page } from "@playwright/test";

const root = resolve(import.meta.dirname, "../..");

/** Content-Security-Policy that vercel.json applies to the production host. */
export const productionCsp = (): string => {
  const vercel = JSON.parse(readFileSync(resolve(root, "vercel.json"), "utf8"));
  const rule = vercel.headers.find((h: { headers: { key: string }[] }) =>
    h.headers.some((x) => x.key === "Content-Security-Policy")
  );
  return rule.headers.find(
    (x: { key: string }) => x.key === "Content-Security-Policy"
  ).value;
};

/** The resume fetched at build time (src/data/resume.json). */
export const resumeData = () =>
  JSON.parse(readFileSync(resolve(root, "src/data/resume.json"), "utf8"));

/** Slide titles that carry a video URL matching the pattern. */
export const slideTitlesWithVideo = (pattern: RegExp): string[] => {
  const titles: string[] = [];
  for (const section of resumeData().pageBuilder) {
    for (const slide of section.sliderDetails?.slides ?? []) {
      const d = slide.slideDetails;
      if (d?.videoUrl && pattern.test(d.videoUrl) && d.slideTitle) {
        titles.push(d.slideTitle);
      }
    }
  }
  return titles;
};

/** Serve the document with the production CSP so Chromium enforces it. */
export const enforceCsp = async (page: Page, baseURL: string) => {
  const csp = productionCsp();
  await page.route(`${baseURL}/`, async (route) => {
    const response = await route.fetch();
    await route.fulfill({
      response,
      headers: { ...response.headers(), "content-security-policy": csp },
    });
  });
};

/** Collects console errors and page errors, ignoring known noise. */
export const collectErrors = (page: Page, ignore: RegExp[] = []) => {
  const errors: string[] = [];
  const keep = (text: string) => !ignore.some((re) => re.test(text));
  page.on("console", (message) => {
    if (message.type() === "error" && keep(message.text())) {
      errors.push(message.text());
    }
  });
  page.on("pageerror", (error) => {
    if (keep(error.message)) errors.push(`pageerror: ${error.message}`);
  });
  return errors;
};

/** Registers a listener that logs CSP violations as console errors. */
export const reportCspViolations = (page: Page) =>
  page.addInitScript(() => {
    document.addEventListener("securitypolicyviolation", (event) => {
      console.error(
        `CSP violation: ${event.violatedDirective} blocked ${event.blockedURI}`
      );
    });
  });

/** Opens the project modal for the active slider card (or a given title). */
export const openCard = async (page: Page, title?: string) => {
  const opened = await page.evaluate((wanted) => {
    const cards = [...document.querySelectorAll<HTMLElement>(".card-slide")];
    const card = wanted
      ? cards.find((c) => (c.getAttribute("aria-label") || "").includes(wanted))
      : document.querySelector<HTMLElement>(".swiper-slide-active .card-slide") ||
        cards[0];
    if (!card) return false;
    card.scrollIntoView({ block: "center" });
    card.click();
    return true;
  }, title ?? null);
  if (opened) await page.locator(".popup-content").waitFor({ timeout: 10_000 });
  return opened;
};

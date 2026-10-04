import { expect, test } from "@playwright/test";
import { collectErrors, enforceCsp, reportCspViolations } from "./helpers";

// Needs a build made with a GTM container id (CI sets GTM_ID); a build
// without one has no banner and nothing to test.
test.skip(!process.env.GTM_ID, "built without GTM_ID");

// The other specs start with the choice already stored; these start fresh.
test.use({ storageState: { cookies: [], origins: [] } });

const GTM = "https://www.googletagmanager.com/**";

/** Answers the GTM request locally and records it. */
const stubGtm = async (page: import("@playwright/test").Page) => {
  const requests: string[] = [];
  await page.route(GTM, async (route) => {
    requests.push(route.request().url());
    await route.fulfill({ contentType: "application/javascript", body: "" });
  });
  return requests;
};

const events = (page: import("@playwright/test").Page) =>
  page.evaluate(() =>
    (window.dataLayer ?? [])
      .filter((entry): entry is Record<string, unknown> => !!entry && typeof entry === "object" && "event" in entry)
      .map((entry) => entry.event as string),
  );

test("nothing is requested from Google until the visitor accepts", async ({ page, baseURL }) => {
  const errors = collectErrors(page);
  const requests = await stubGtm(page);
  await enforceCsp(page, baseURL as string);
  await reportCspViolations(page);
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const banner = page.locator(".consent-banner");
  await expect(banner).toBeVisible();
  expect(requests).toEqual([]);
  expect(await page.evaluate(() => window.dataLayer)).toBeUndefined();

  // Interactions before the choice are not recorded either.
  await page.locator(".site-controls button").click();
  expect(await page.evaluate(() => window.dataLayer)).toBeUndefined();

  await banner.getByRole("button", { name: "Accept" }).click();
  await expect(banner).toBeHidden();
  await expect.poll(() => requests.length).toBe(1);
  expect(requests[0]).toContain(`gtm.js?id=${process.env.GTM_ID}`);
  expect(await page.evaluate(() => localStorage.getItem("analytics-consent"))).toBe("granted");

  await page.locator(".site-controls button").click();
  expect(await events(page)).toContain("theme_toggle");
  expect(errors).toEqual([]);
});

test("rejecting keeps Google out and the choice is remembered", async ({ page }) => {
  const requests = await stubGtm(page);
  await page.goto("/es/");
  const banner = page.locator(".consent-banner");
  await banner.getByRole("button", { name: "Rechazar" }).click();
  await expect(banner).toBeHidden();

  await page.locator(".site-controls button").click();
  await page.reload();
  await page.waitForLoadState("networkidle");
  await expect(banner).toBeHidden();
  expect(requests).toEqual([]);
  expect(await page.evaluate(() => window.dataLayer)).toBeUndefined();
});

test("a returning visitor who accepted is tracked, and can withdraw from the footer", async ({ page }) => {
  const requests = await stubGtm(page);
  await page.addInitScript(() => {
    if (!sessionStorage.getItem("seeded")) {
      localStorage.setItem("analytics-consent", "granted");
      sessionStorage.setItem("seeded", "1");
    }
  });
  await page.goto("/#project-fetroapp");
  await page.waitForLoadState("networkidle");
  await expect(page.locator(".consent-banner")).toBeHidden();
  expect(requests.length).toBe(1);

  // The deep link is the first event, after the consent defaults.
  expect(await events(page)).toEqual(expect.arrayContaining(["gtm.js", "project_open"]));
  const first = await page.evaluate(() => {
    const entry = window.dataLayer?.[0] as ArrayLike<unknown> | undefined;
    return entry ? [entry[0], entry[1]] : null;
  });
  expect(first).toEqual(["consent", "default"]);

  await page.keyboard.press("Escape");
  await page.locator(".footer__cookies").click();
  const banner = page.locator(".consent-banner");
  await expect(banner).toBeVisible();
  await banner.getByRole("button", { name: "Reject" }).click();
  expect(await page.evaluate(() => localStorage.getItem("analytics-consent"))).toBe("denied");

  const before = (await events(page)).length;
  await page.locator(".site-controls button").click();
  expect((await events(page)).length).toBe(before);
});

test("clicks on contact, CV and outbound links are reported without personal data", async ({ page }) => {
  await stubGtm(page);
  await page.addInitScript(() => localStorage.setItem("analytics-consent", "granted"));
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  // Keep the page where it is: the test only needs the click to be seen.
  // The outbound link is added here so the test does not depend on content.
  await page.evaluate(() => {
    document.addEventListener("click", (event) => event.preventDefault());
    const link = document.createElement("a");
    link.href = "https://www.example.org/some/page?utm_source=test";
    link.textContent = "outbound";
    link.id = "outbound-probe";
    document.querySelector("footer")?.append(link);
  });

  await page.locator("footer a[data-contact='email']").click();
  await page.locator("footer a[data-contact='map']").click();
  await page.locator("footer a[href$='.pdf']").click();
  await page.locator("#outbound-probe").click();

  const pushed = await page.evaluate(() =>
    (window.dataLayer ?? []).filter(
      (entry): entry is Record<string, unknown> => !!entry && typeof entry === "object" && "event" in entry,
    ),
  );
  expect(pushed).toEqual(
    expect.arrayContaining([
      { event: "contact_click", method: "email" },
      { event: "contact_click", method: "map" },
      { event: "cv_download", file: "/resume.pdf" },
      {
        event: "outbound_click",
        link_domain: "example.org",
        link_url: "https://www.example.org/some/page",
      },
    ]),
  );
  expect(JSON.stringify(pushed)).not.toMatch(/@|\+34/);
});

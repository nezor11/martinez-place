import { expect, test } from "@playwright/test";

const focused = (page: import("@playwright/test").Page) =>
  page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null;
    return el ? `${el.tagName.toLowerCase()}:${el.getAttribute("aria-label") ?? el.className}` : "none";
  });

test("the first Tab lands on a skip link that jumps to the content", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.locator(".skip-link");
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await page.keyboard.press("Enter");
  await expect(page.locator("main#main")).toBeFocused();
});

test("a project opened with the keyboard traps focus, closes with Escape and restores focus", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  const opener = page.locator(".swiper-slide-active .card-slide__open").first();
  await opener.focus();
  await page.keyboard.press("Enter");
  const dialog = page.locator(".popup-content");
  await expect(dialog).toBeVisible();
  await expect(dialog).toBeFocused();

  // Tab stays inside the dialog and wraps around.
  const seen = new Set<string>();
  for (let i = 0; i < 40; i++) {
    await page.keyboard.press("Tab");
    const inside = await page.evaluate(() => document.querySelector(".popup-content")?.contains(document.activeElement));
    expect(inside, `Tab ${i + 1} left the dialog`).toBe(true);
    seen.add(await focused(page));
  }
  expect(seen.size).toBeGreaterThan(1);
  await page.keyboard.press("Shift+Tab");
  expect(await page.evaluate(() => document.querySelector(".popup-content")?.contains(document.activeElement))).toBe(true);

  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(opener).toBeFocused();
});

test("header controls and the Load more button show a focus ring and are 24px targets", async ({ page }) => {
  await page.goto("/");
  for (const selector of [".site-controls a", ".site-controls button"]) {
    const box = await page.locator(selector).first().boundingBox();
    expect(box?.width, selector).toBeGreaterThanOrEqual(24);
    expect(box?.height, selector).toBeGreaterThanOrEqual(24);
  }
  // Reach "Load more" with real Tab presses so :focus-visible applies.
  let reached = false;
  for (let i = 0; i < 40 && !reached; i++) {
    await page.keyboard.press("Tab");
    reached = await page.evaluate(() => /load more/i.test(document.activeElement?.textContent ?? ""));
  }
  expect(reached).toBe(true);
  const ring = await page.evaluate(() => {
    const el = document.activeElement as HTMLElement;
    const cs = getComputedStyle(el);
    return { visible: el.matches(":focus-visible"), style: cs.outlineStyle, width: cs.outlineWidth, color: cs.outlineColor };
  });
  expect(ring.visible).toBe(true);
  expect(ring.style).not.toBe("none");
  expect(ring.width).not.toBe("0px");
  expect(ring.color).not.toMatch(/rgba\(\d+, \d+, \d+, 0\)/);
});

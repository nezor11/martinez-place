import { AxeBuilder } from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { openCard } from "./helpers";

const tags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"];

const audit = async (page: Parameters<typeof AxeBuilder>[0]["page"]) => {
  const results = await new AxeBuilder({ page }).withTags(tags).analyze();
  return results.violations.map((v) => ({
    id: v.id,
    impact: v.impact,
    nodes: v.nodes.map((n) => n.html.slice(0, 120)),
  }));
};

for (const scheme of ["light", "dark"] as const) {
  test(`the page has no accessibility violations in ${scheme} mode`, async ({ page }) => {
    await page.addInitScript((value) => localStorage.setItem("theme", value), scheme);
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    expect(await audit(page)).toEqual([]);
  });
}

test("an open project modal has no accessibility violations", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  expect(await openCard(page)).toBe(true);
  await page.waitForTimeout(500);
  expect(await audit(page)).toEqual([]);
});

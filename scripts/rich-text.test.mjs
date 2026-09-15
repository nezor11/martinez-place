import { describe, expect, it } from "vitest";
import { blocksToSafeHtml, renderRichText } from "./rich-text.mjs";

const block = (children, markDefs = []) => ({
  _type: "block",
  _key: "b1",
  style: "normal",
  markDefs,
  children: children.map((c, i) => ({ _type: "span", _key: `s${i}`, marks: [], ...c })),
});

describe("blocksToSafeHtml", () => {
  it("renders paragraphs with marks and external links", () => {
    const html = blocksToSafeHtml([
      block([{ text: "Built with " }, { text: "Umbraco", marks: ["strong"] }, { text: " on " }, { text: "Vercel", marks: ["l1"] }], [
        { _key: "l1", _type: "link", href: "https://vercel.com" },
      ]),
    ]);
    expect(html).toContain("<p>Built with <strong>Umbraco</strong> on ");
    expect(html).toContain('href="https://vercel.com"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noreferrer noopener"');
  });

  it("strips scripts and event handlers", () => {
    const html = blocksToSafeHtml([
      block([{ text: "safe" }, { text: "x", marks: ["l1"] }], [
        { _key: "l1", _type: "link", href: "javascript:alert(1)" },
      ]),
    ]);
    expect(html).not.toContain("javascript:");
    expect(html).toContain("safe");
  });

  it("returns an empty string for missing content", () => {
    expect(blocksToSafeHtml(undefined)).toBe("");
    expect(blocksToSafeHtml([])).toBe("");
  });
});

describe("renderRichText", () => {
  it("replaces jobDesc and slideDesc in place and counts them", () => {
    const resume = {
      pageBuilder: [
        { sections: [{ jobDesc: [block([{ text: "Job" }])] }, { jobDesc: "already html" }] },
        { sliderDetails: { slides: [{ slideDetails: { slideDesc: [block([{ text: "Slide" }])] } }] } },
      ],
    };
    expect(renderRichText(resume)).toBe(2);
    expect(resume.pageBuilder[0].sections[0].jobDesc).toBe("<p>Job</p>");
    expect(resume.pageBuilder[0].sections[1].jobDesc).toBe("already html");
    expect(resume.pageBuilder[1].sliderDetails.slides[0].slideDetails.slideDesc).toBe("<p>Slide</p>");
  });
});

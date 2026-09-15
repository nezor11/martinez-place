import { messages, workDoneLabel } from "@/i18n";
import type { SlideData } from "@/stories/components/organisms/SliderSection";
import { describe, expect, it } from "vitest";
import { normalizeText, slideMatches, slideSearchTokens } from "./portfolioSearch";

const slide: SlideData = {
  title: "Power Planet Online",
  summary: "Diseño de tienda online",
  description: "<p>Built with <strong>Umbraco</strong> and Next.js for e-commerce.</p>",
  company: "novicell",
  year: "2024",
  workType: "fresh",
  workDone: ["front_end"],
  iconsData: [{ name: "ReactIcon", width: "1em", height: "1em" }],
  images: [],
};

describe("normalizeText", () => {
  it("lower-cases and removes accents", () => {
    expect(normalizeText("DISEÑO Gráfico")).toBe("diseno grafico");
  });
});

describe("slideSearchTokens", () => {
  const tokens = slideSearchTokens(slide, "en", messages.en);

  it("indexes title, summary, stripped description, company and year", () => {
    expect(tokens).toEqual(expect.arrayContaining(["power", "planet", "online", "diseno", "tienda", "umbraco", "next.js", "e-commerce", "novicell", "2024"]));
    expect(tokens).not.toContain("<p>");
    expect(tokens).not.toContain("strong");
  });

  it("indexes the translated work type, work done and icon labels", () => {
    const expected = [
      ...messages.en.project("fresh").toLowerCase().split(/\W+/).filter(Boolean),
      ...workDoneLabel("en", "front_end").toLowerCase().split(/\W+/).filter(Boolean),
      "react",
    ];
    expect(tokens).toEqual(expect.arrayContaining(expected));
  });

  it("uses the page language for the labels", () => {
    const es = slideSearchTokens(slide, "es", messages.es);
    const label = workDoneLabel("es", "front_end").toLowerCase().split(/\W+/).filter(Boolean)[0];
    expect(es).toContain(normalizeText(label));
  });
});

describe("slideMatches", () => {
  const tokens = slideSearchTokens(slide, "en", messages.en);

  it("matches whole words and word prefixes, ignoring case and accents", () => {
    expect(slideMatches(tokens, "react")).toBe(true);
    expect(slideMatches(tokens, "Diseñ")).toBe(true);
    expect(slideMatches(tokens, "umbraco next")).toBe(true);
  });

  it("requires every query word to match and rejects substrings", () => {
    expect(slideMatches(tokens, "react vue")).toBe(false);
    expect(slideMatches(tokens, "eact")).toBe(false);
    expect(slideMatches(tokens, "")).toBe(true);
  });
});

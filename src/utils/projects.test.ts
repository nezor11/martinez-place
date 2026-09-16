import type { Resume } from "@/utils/types/resume";
import { describe, expect, it } from "vitest";
import { projectIconNames, projectPath, projectSlugFromPath, projectsFrom } from "./projects";

const slide = (name: string, extra: Record<string, unknown> = {}) => ({
  slideDetails: { _id: name, name, slideTitle: `${name} title`, type: "fresh", workDate: "2026-01-01", ...extra },
});

const resume = {
  _id: "r",
  title: "Resume",
  _updatedAt: "",
  pdfResumeUrl: "",
  slug: "",
  pageBuilder: [
    { _type: "header", _key: "h" },
    {
      _type: "sliderSection",
      _key: "s",
      sliderDetails: {
        name: "Portfolio",
        slides: [
          slide("Easy Xtream Football App"),
          slide("Fatro Ibérica", { slugSource: "Fatro Ibérica", icons: [{ icon: { name: "PhpIcon" } }, { icon: {} }] }),
          slide("Revlon"),
          slide("Revlon"),
        ],
      },
    },
  ],
} as unknown as Resume;

describe("projectsFrom", () => {
  it("slugs every slide in slider order, suffixing duplicates", () => {
    expect(projectsFrom(resume).map((p) => p.slug)).toEqual([
      "easy-xtream-football-app",
      "fatro-iberica",
      "revlon",
      "revlon-2",
    ]);
  });

  it("prefers the English slug source over the localised name", () => {
    const localised = JSON.parse(JSON.stringify(resume)) as Resume;
    const details = localised.pageBuilder[1].sliderDetails?.slides[1].slideDetails;
    if (details) details.name = "Fatro Ibérica (ES)";
    expect(projectsFrom(localised)[1].slug).toBe("fatro-iberica");
  });
});

describe("projectPath / projectSlugFromPath", () => {
  it("builds and parses project URLs per language", () => {
    expect(projectPath("en", "revlon")).toBe("/project/revlon/");
    expect(projectPath("es", "revlon")).toBe("/es/project/revlon/");
    expect(projectSlugFromPath("/project/revlon/", "en")).toBe("revlon");
    expect(projectSlugFromPath("/es/project/fatro-iberica", "es")).toBe("fatro-iberica");
  });

  it("returns null for the home page and foreign paths", () => {
    expect(projectSlugFromPath("/", "en")).toBeNull();
    expect(projectSlugFromPath("/es/", "es")).toBeNull();
    expect(projectSlugFromPath("/project/a/b/", "en")).toBeNull();
    expect(projectSlugFromPath("/es/project/x/", "en")).toBeNull();
  });
});

describe("projectIconNames", () => {
  it("lists the icon component names, skipping empty entries", () => {
    expect(projectIconNames(projectsFrom(resume)[1].slide)).toEqual(["PhpIcon"]);
    expect(projectIconNames(projectsFrom(resume)[0].slide)).toEqual([]);
  });
});

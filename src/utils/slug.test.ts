import { describe, expect, it } from "vitest";
import { projectHash, slugFromHash, slugify, uniqueSlugs } from "./slug";

describe("slugify", () => {
  it("lower-cases, strips accents and joins words with dashes", () => {
    expect(slugify("Fatro Ibérica")).toBe("fatro-iberica");
    expect(slugify("Arrels Fundació")).toBe("arrels-fundacio");
    expect(slugify("Easy Xtream Football Web")).toBe("easy-xtream-football-web");
  });

  it("collapses punctuation and trims leading or trailing dashes", () => {
    expect(slugify("  Nezor's Storybook!  ")).toBe("nezor-s-storybook");
    expect(slugify("HIPOTECAS.COM")).toBe("hipotecas-com");
    expect(slugify("---")).toBe("");
  });
});

describe("uniqueSlugs", () => {
  it("suffixes repeated names in order", () => {
    expect(uniqueSlugs(["Revlon", "Revlon", "Baxi", "Revlon"])).toEqual([
      "revlon",
      "revlon-2",
      "baxi",
      "revlon-3",
    ]);
  });

  it("never yields an empty slug", () => {
    expect(uniqueSlugs(["", "!!"])).toEqual(["project", "project-2"]);
  });
});

describe("projectHash / slugFromHash", () => {
  it("round-trips a slug through the location hash", () => {
    expect(projectHash("gravida")).toBe("#project-gravida");
    expect(slugFromHash(projectHash("gravida"))).toBe("gravida");
  });

  it("decodes percent-encoded hashes and ignores other fragments", () => {
    expect(slugFromHash("#project-fatro%2Diberica")).toBe("fatro-iberica");
    expect(slugFromHash("#experience")).toBeNull();
    expect(slugFromHash("")).toBeNull();
    expect(slugFromHash("#project-")).toBeNull();
  });
});

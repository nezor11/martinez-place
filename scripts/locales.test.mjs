import { describe, expect, it } from "vitest";
import { localeDist, localeFile, localePath, localesFromArgv, resumeDataFile } from "./locales.mjs";

describe("locale helpers", () => {
  it("keep the default language at the root and prefix the others", () => {
    expect(localePath("en")).toBe("/");
    expect(localePath("es")).toBe("/es/");
    expect(localeDist("en")).toBe("dist");
    expect(localeDist("es")).toBe("dist/es");
  });

  it("name per-language artefacts", () => {
    expect(localeFile("resume", "pdf", "en")).toBe("resume.pdf");
    expect(localeFile("resume", "pdf", "es")).toBe("resume.es.pdf");
    expect(resumeDataFile("es")).toBe("src/data/resume.es.json");
  });
});

describe("localesFromArgv", () => {
  it("defaults to every locale and accepts --locale", () => {
    expect(localesFromArgv(["node", "script"])).toEqual(["en", "es"]);
    expect(localesFromArgv(["node", "script", "--locale", "es"])).toEqual(["es"]);
  });

  it("rejects unknown locales", () => {
    expect(() => localesFromArgv(["--locale", "fr"])).toThrow(/Unknown locale "fr"/);
  });
});

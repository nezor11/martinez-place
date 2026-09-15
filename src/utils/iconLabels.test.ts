import { describe, expect, it } from "vitest";
import { iconLabel } from "./iconLabels";

describe("iconLabel", () => {
  it("maps component names to their brand spelling", () => {
    expect(iconLabel("NextJSIcon")).toBe("Next.js");
    expect(iconLabel("CsharpIcon")).toBe("C#");
    expect(iconLabel("JQueryIcon")).toBe("jQuery");
    expect(iconLabel("TailwindIcon")).toBe("Tailwind CSS");
  });

  it("falls back to the name without the Icon suffix", () => {
    expect(iconLabel("MoonIcon")).toBe("Moon");
    expect(iconLabel("SomethingNewIcon")).toBe("SomethingNew");
    expect(iconLabel("NoSuffix")).toBe("NoSuffix");
  });
});

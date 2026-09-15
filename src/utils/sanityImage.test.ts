import { describe, expect, it } from "vitest";
import { sanityImageUrl } from "./sanityImage";

const cdn = "https://cdn.sanity.io/images/6zr8au58/production/abc-300x350.webp";

describe("sanityImageUrl", () => {
  it("adds format negotiation and the default quality", () => {
    const url = new URL(sanityImageUrl(cdn));
    expect(url.searchParams.get("auto")).toBe("format");
    expect(url.searchParams.get("q")).toBe("80");
    expect(url.searchParams.has("w")).toBe(false);
  });

  it("caps the width without upscaling and honours a custom quality", () => {
    const url = new URL(sanityImageUrl(cdn, { width: 600, quality: 60 }));
    expect(url.searchParams.get("w")).toBe("600");
    expect(url.searchParams.get("fit")).toBe("max");
    expect(url.searchParams.get("q")).toBe("60");
    expect(url.pathname).toBe("/images/6zr8au58/production/abc-300x350.webp");
  });

  it("leaves non-Sanity and empty URLs alone", () => {
    expect(sanityImageUrl("https://example.com/a.png", { width: 100 })).toBe("https://example.com/a.png");
    expect(sanityImageUrl("")).toBe("");
  });
});

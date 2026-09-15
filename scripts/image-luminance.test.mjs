import { describe, expect, it } from "vitest";
import { averageLuminance, cornerRect, cornerSampleUrl } from "./image-luminance.mjs";

describe("cornerRect", () => {
  it("describes the top-right 15% of the image", () => {
    expect(cornerRect(1440, 900)).toBe("1224,0,216,135");
    expect(cornerRect(3, 3)).toBe("2,0,1,1");
  });
});

describe("averageLuminance", () => {
  it("is 0 for black, 1 for white and in between for mixes", () => {
    expect(averageLuminance(new Uint8Array([0, 0, 0]))).toBe(0);
    expect(averageLuminance(new Uint8Array([255, 255, 255]))).toBeCloseTo(1);
    expect(averageLuminance(new Uint8Array([0, 0, 0, 255, 255, 255, 255, 255]), 4)).toBeCloseTo(0.5);
    expect(averageLuminance(new Uint8Array([]))).toBeNull();
  });
});

describe("cornerSampleUrl", () => {
  it("asks Sanity for a tiny PNG of the corner", () => {
    const url = new URL(cornerSampleUrl("https://cdn.sanity.io/images/p/d/a-1440x900.webp", 1440, 900));
    expect(url.searchParams.get("rect")).toBe("1224,0,216,135");
    expect(url.searchParams.get("w")).toBe("8");
    expect(url.searchParams.get("fm")).toBe("png");
  });
});

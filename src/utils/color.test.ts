import { describe, expect, it } from "vitest";
import {
  isLightColor,
  parseColor,
  popupBackground,
  relativeLuminance,
} from "./color";

describe("parseColor", () => {
  it("reads short and long hex and rgb()", () => {
    expect(parseColor("#fff")).toEqual([255, 255, 255]);
    expect(parseColor("#FFE600")).toEqual([255, 230, 0]);
    expect(parseColor("rgb(2, 6, 23)")).toEqual([2, 6, 23]);
    expect(parseColor("rgba(160 20 60 / 0.5)")).toEqual([160, 20, 60]);
  });

  it("returns null for unknown formats", () => {
    expect(parseColor("hsl(1 2% 3%)")).toBeNull();
    expect(parseColor("")).toBeNull();
  });
});

describe("relativeLuminance / isLightColor", () => {
  it("ranks black, white and the brand colours", () => {
    expect(relativeLuminance("#000")).toBe(0);
    expect(relativeLuminance("#fff")).toBeCloseTo(1);
    expect(isLightColor("#FFE600")).toBe(true); // Fatro yellow
    expect(isLightColor("#3D0A25")).toBe(false); // Reed Smith plum
    expect(isLightColor("#A0143C")).toBe(false); // Gravida magenta
    expect(isLightColor("#0A0E12")).toBe(false);
  });

  it("treats unparseable colours as light", () => {
    expect(isLightColor("tomato")).toBe(true);
  });
});

describe("popupBackground", () => {
  it("prefers the slide colour and falls back by media type", () => {
    expect(popupBackground("#123456", { imageCount: 0 })).toBe("#123456");
    expect(
      popupBackground(undefined, {
        videoUrl: "https://youtu.be/x",
        imageCount: 0,
      }),
    ).toBe("#000");
    expect(popupBackground(undefined, { imageCount: 2 })).toBe("#fff");
    expect(popupBackground("", { imageCount: 0 })).toBe("#f5f5f5");
  });
});

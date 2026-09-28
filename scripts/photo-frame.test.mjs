import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { SIZE, framedPhoto } from "./photo-frame.mjs";

describe("framedPhoto", () => {
  it("returns a square PNG with the photo masked and the frame on top", async () => {
    const png = await framedPhoto();
    const image = sharp(png);
    const { width, height, format, hasAlpha } = await image.metadata();
    expect({ width, height, format, hasAlpha }).toEqual({ width: SIZE, height: SIZE, format: "png", hasAlpha: true });

    const { data } = await image.raw().toBuffer({ resolveWithObject: true });
    const alphaAt = (x, y) => data[(y * SIZE + x) * 4 + 3];
    // Outside the frame (page corner) nothing is painted...
    expect(alphaAt(2, 2)).toBe(0);
    // ...while the centre shows the photo through the frame's window.
    expect(alphaAt(SIZE / 2, SIZE / 2)).toBe(255);
  });
});

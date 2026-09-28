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
    // Outside the frame (page corner) nothing is painted, and the hidden
    // colour is white so viewers cannot bleed black into the frame's edge...
    expect(alphaAt(2, 2)).toBe(0);
    expect(Array.from(data.slice((2 * SIZE + 2) * 4, (2 * SIZE + 2) * 4 + 3))).toEqual([255, 255, 255]);
    // ...while the centre shows the photo through the frame's window.
    expect(alphaAt(SIZE / 2, SIZE / 2)).toBe(255);
  });
});

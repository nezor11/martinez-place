/**
 * Composes the header photo the way FrameImage renders it on the site: the
 * photo covers the 300x300 box, is cut with mask-photo.png (the tilted
 * rectangle) and the polaroid frame js-frame-photo-empty.png sits on top.
 * Returns a PNG buffer for the PDF (react-pdf has no mask-image).
 */
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const images = resolve(dirname(fileURLToPath(import.meta.url)), "../src/assets/images");

export const SIZE = 300;

export const framedPhoto = async ({
  photo = resolve(images, "foto-jorge-cv.jpg"),
  mask = resolve(images, "mask-photo.png"),
  frame = resolve(images, "js-frame-photo-empty.png"),
  size = SIZE,
} = {}) => {
  const fit = { width: size, height: size, fit: "cover" };
  // dest-in keeps the photo only where the mask's alpha is opaque.
  const [maskLayer, frameLayer] = await Promise.all([
    sharp(mask).resize(fit).ensureAlpha().png().toBuffer(),
    sharp(frame).resize(fit).ensureAlpha().png().toBuffer(),
  ]);
  return sharp(photo)
    .resize(fit)
    .ensureAlpha()
    .composite([
      { input: maskLayer, blend: "dest-in" },
      { input: frameLayer, blend: "over" },
    ])
    .png()
    .toBuffer();
};

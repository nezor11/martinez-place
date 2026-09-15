/**
 * Corner luminance of Sanity images, computed at build time so the project
 * popup can pick a contrasting tone for the controls drawn over its gallery
 * without touching the image in the browser (the CDN refuses cross-origin
 * canvas reads from preview hosts).
 */
import sharp from "sharp";

/** Top-right crop of an image, as Sanity's `rect` parameter: "left,top,w,h". */
export const cornerRect = (width, height, fraction = 0.15) => {
  const w = Math.max(1, Math.round(width * fraction));
  const h = Math.max(1, Math.round(height * fraction));
  return `${width - w},0,${w},${h}`;
};

const channel = (value) => {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

/** Mean WCAG relative luminance of raw RGB(A) pixels. */
export const averageLuminance = (pixels, channels = 3) => {
  let total = 0;
  let count = 0;
  for (let i = 0; i + 2 < pixels.length; i += channels) {
    total +=
      0.2126 * channel(pixels[i]) +
      0.7152 * channel(pixels[i + 1]) +
      0.0722 * channel(pixels[i + 2]);
    count += 1;
  }
  return count ? total / count : null;
};

/** Sanity image URL of the corner crop, downscaled to a few pixels. */
export const cornerSampleUrl = (src, width, height) => {
  const url = new URL(src);
  url.searchParams.set("rect", cornerRect(width, height));
  url.searchParams.set("w", "8");
  url.searchParams.set("h", "8");
  url.searchParams.set("fm", "png");
  return url.toString();
};

const cache = new Map();

/** Luminance (0..1) of the image's top-right corner, or null on any failure. */
export const cornerLuminance = async (src, width, height) => {
  if (!src || !width || !height) return null;
  if (cache.has(src)) return cache.get(src);
  const promise = (async () => {
    try {
      const response = await fetch(cornerSampleUrl(src, width, height));
      if (!response.ok) return null;
      const { data, info } = await sharp(Buffer.from(await response.arrayBuffer()))
        .raw()
        .toBuffer({ resolveWithObject: true });
      const value = averageLuminance(data, info.channels);
      return value === null ? null : Math.round(value * 1000) / 1000;
    } catch {
      return null;
    }
  })();
  cache.set(src, promise);
  return promise;
};

/** Adds `cornerLuminance` to every gallery image of every slide in place. */
export const annotateImageLuminance = async (resume) => {
  const images = [];
  const walk = (node) => {
    if (Array.isArray(node)) {
      for (const item of node) walk(item);
    } else if (node && typeof node === "object") {
      if (Array.isArray(node.images) && "slideTitle" in node) {
        images.push(...node.images.filter((image) => image?.src));
      }
      for (const value of Object.values(node)) walk(value);
    }
  };
  walk(resume);
  await Promise.all(
    images.map(async (image) => {
      const value = await cornerLuminance(image.src, image.width, image.height);
      if (value !== null) image.cornerLuminance = value;
    })
  );
  return images.length;
};

/**
 * Adds Sanity CDN transformation parameters to an image URL.
 *
 * `auto=format` serves WebP/AVIF when the browser supports it, `q` sets the
 * quality and `w` caps the width without upscaling (`fit=max`); `w` + `h`
 * crop to that box instead. URLs that do not point at the Sanity image CDN
 * are returned unchanged.
 */
export interface SanityImageOptions {
  width?: number;
  /** With `width`, crops to that box (`fit=crop`, hotspot-aware on the CDN). */
  height?: number;
  quality?: number;
}

export const sanityImageUrl = (
  url: string,
  { width, height, quality = 80 }: SanityImageOptions = {}
): string => {
  if (!url || !/^https:\/\/cdn\.sanity\.io\/images\//.test(url)) {
    return url;
  }
  const result = new URL(url);
  result.searchParams.set("auto", "format");
  result.searchParams.set("q", String(quality));
  if (width) {
    result.searchParams.set("w", String(width));
    if (height) {
      result.searchParams.set("h", String(height));
      result.searchParams.set("fit", "crop");
    } else {
      result.searchParams.set("fit", "max");
    }
  }
  return result.toString();
};

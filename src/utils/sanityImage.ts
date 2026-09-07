/**
 * Adds Sanity CDN transformation parameters to an image URL.
 *
 * `auto=format` serves WebP/AVIF when the browser supports it, `q` sets the
 * quality and `w` caps the width without upscaling (`fit=max`). URLs that
 * do not point at the Sanity image CDN are returned unchanged.
 */
export interface SanityImageOptions {
  width?: number;
  quality?: number;
}

export const sanityImageUrl = (
  url: string,
  { width, quality = 80 }: SanityImageOptions = {}
): string => {
  if (!url || !/^https:\/\/cdn\.sanity\.io\/images\//.test(url)) {
    return url;
  }
  const result = new URL(url);
  result.searchParams.set("auto", "format");
  result.searchParams.set("q", String(quality));
  if (width) {
    result.searchParams.set("w", String(width));
    result.searchParams.set("fit", "max");
  }
  return result.toString();
};

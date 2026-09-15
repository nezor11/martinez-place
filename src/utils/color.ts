/** Colour helpers for choosing UI tones over arbitrary backgrounds. */

const channel = (value: number): number => {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

/** Parses `#rgb`, `#rrggbb` or `rgb(a)(...)`; null for anything else. */
export const parseColor = (color: string): [number, number, number] | null => {
  const value = color.trim().toLowerCase();
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/.exec(value)?.[1];
  if (hex) {
    const full = hex.length === 3 ? hex.replace(/./g, (c) => c + c) : hex;
    return [0, 2, 4].map((i) => Number.parseInt(full.slice(i, i + 2), 16)) as [
      number,
      number,
      number,
    ];
  }
  const rgb = /^rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/.exec(value);
  if (rgb) return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])];
  if (value === "white") return [255, 255, 255];
  if (value === "black") return [0, 0, 0];
  return null;
};

/** WCAG relative luminance, 0 (black) to 1 (white); null if unparseable. */
export const relativeLuminance = (color: string): number | null => {
  const rgb = parseColor(color);
  if (!rgb) return null;
  const [r, g, b] = rgb.map(channel);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/**
 * True when controls drawn over `color` should be dark (the background is
 * light). Unknown colours count as light, the safer default on this site.
 */
export const isLightColor = (color: string, threshold = 0.4): boolean => {
  const luminance = relativeLuminance(color);
  return luminance === null ? true : luminance > threshold;
};

/**
 * Background the project popup paints behind its media: the slide colour
 * when Sanity has one, otherwise black for video, white for a gallery and
 * a light grey when there is nothing to show.
 */
export const popupBackground = (
  backgroundColor: string | undefined,
  media: { videoUrl?: string; imageCount: number },
): string =>
  backgroundColor ||
  (media.videoUrl ? "#000" : media.imageCount > 0 ? "#fff" : "#f5f5f5");

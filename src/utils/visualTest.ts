/**
 * True while Chromatic captures a snapshot (its browser identifies itself in
 * the user agent), so components can skip randomness and animations that
 * would make every build differ. Mirrors `chromatic/isChromatic` without
 * pulling the dev dependency into the site bundle.
 */
export const isVisualTest = (): boolean =>
  typeof navigator !== "undefined" && /Chromatic/.test(navigator.userAgent);

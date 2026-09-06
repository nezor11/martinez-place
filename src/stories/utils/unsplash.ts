/**
 * Unsplash helper for stories only.
 *
 * The access key comes from the STORYBOOK_UNSPLASH_ACCESS_KEY environment
 * variable (see .env.example). When it is missing the helper throws, and
 * every story already catches that and falls back to placeholder images,
 * so Storybook works without a key.
 */
const accessKey = import.meta.env.STORYBOOK_UNSPLASH_ACCESS_KEY;

export const hasUnsplashKey = Boolean(accessKey);

type UnsplashEndpoint = "photos/random" | "search/photos";

export const unsplashUrl = (
  endpoint: UnsplashEndpoint,
  params: Record<string, string | number>
): string => {
  if (!accessKey) {
    throw new Error(
      "STORYBOOK_UNSPLASH_ACCESS_KEY is not set; using placeholder images"
    );
  }
  const url = new URL(`https://api.unsplash.com/${endpoint}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }
  url.searchParams.set("client_id", accessKey);
  return url.toString();
};

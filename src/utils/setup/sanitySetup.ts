/**
 * Minimal Sanity query helper. The site runs a single GROQ query against the
 * public CDN endpoint, so a fetch call replaces the full @sanity/client
 * bundle (client + rxjs + get-it + buffer polyfill).
 */
const projectId = "6zr8au58";
const dataset = "production";
const apiVersion = "2022-03-07";

export const sanityConfig = { projectId, dataset };

export const fetchSanity = async <T>(query: string): Promise<T> => {
  const url = new URL(
    `https://${projectId}.apicdn.sanity.io/v${apiVersion}/data/query/${dataset}`
  );
  url.searchParams.set("query", query);
  url.searchParams.set("perspective", "published");

  const response = await fetch(url, { headers: { Accept: "application/json" } });
  if (!response.ok) {
    throw new Error(`Sanity query failed with status ${response.status}`);
  }
  const body = (await response.json()) as { result: T };
  return body.result;
};

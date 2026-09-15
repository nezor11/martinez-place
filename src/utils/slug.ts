/** URL-safe slug: lowercase ASCII, words joined by single dashes. */
export const slugify = (text: string): string =>
  text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** Slugs for a list of names, suffixing duplicates with -2, -3, ... */
export const uniqueSlugs = (names: string[]): string[] => {
  const seen = new Map<string, number>();
  return names.map((name) => {
    const base = slugify(name) || "project";
    const count = (seen.get(base) ?? 0) + 1;
    seen.set(base, count);
    return count === 1 ? base : `${base}-${count}`;
  });
};

/** Hash fragment that deep-links to a project card, e.g. `#project-fatro-iberica`. */
export const projectHash = (slug: string): string => `#project-${slug}`;

/** Slug of the project a location hash points at, if any. */
export const slugFromHash = (hash: string): string | null => {
  const match = /^#project-(.+)$/.exec(hash);
  return match ? decodeURIComponent(match[1]) : null;
};

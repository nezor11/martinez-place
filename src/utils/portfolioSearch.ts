import { type Locale, type Messages, workDoneLabel } from "@/i18n";
import type { SlideData } from "@/stories/components/organisms/SliderSection";
import { iconLabel } from "./iconLabels";

/** Lower-case, accent-free text so "Diseño" matches "diseno" and "DISEÑO". */
export const normalizeText = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

const stripHtml = (html: string): string => html.replace(/<[^>]+>/g, " ");

/** Words of a text: letters and digits, keeping "next.js", "c#" or "e-commerce". */
const tokenize = (value: string): string[] =>
  (normalizeText(value).match(/[\p{L}\p{N}][\p{L}\p{N}.#+-]*/gu) ?? []).map(
    (word) => word.replace(/[.\-]+$/, "")
  );

/** Everything a project can be found by, as words, in the page's language. */
export const slideSearchTokens = (
  slide: SlideData,
  locale: Locale,
  t: Messages
): string[] =>
  tokenize(
    [
      slide.title,
      slide.summary ?? "",
      stripHtml(slide.description ?? ""),
      (slide.company ?? "").replace(/_/g, " "),
      slide.year ?? "",
      slide.workType ? t.project(slide.workType) : "",
      ...(slide.workDone ?? []).map((key) => workDoneLabel(locale, key)),
      ...(slide.iconsData ?? []).map((icon) => iconLabel(icon.name)),
    ].join(" ")
  );

/**
 * True when every word of the query is a word of the project, or the start
 * of one: "vue" finds "Vue" and "react" finds "React", but neither matches
 * "devuelve" or "preact" the way a substring search would.
 */
export const slideMatches = (tokens: string[], query: string): boolean => {
  const words = tokenize(query);
  return words.every((word) =>
    tokens.some((token) => token === word || token.startsWith(word))
  );
};

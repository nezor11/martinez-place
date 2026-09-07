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

/** Everything a project can be found by, in the page's language. */
export const slideSearchText = (
  slide: SlideData,
  locale: Locale,
  t: Messages
): string =>
  normalizeText(
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

/** True when every word of the query appears in the searchable text. */
export const slideMatches = (searchText: string, query: string): boolean => {
  const words = normalizeText(query).split(/\s+/).filter(Boolean);
  return words.every((word) => searchText.includes(word));
};

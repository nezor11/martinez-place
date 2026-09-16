import { type Locale, localePath, projectSegment } from "@/i18n";
import type { Resume } from "@/utils/types/resume";
import type { InfoSlide, SlideDetails } from "@/utils/types/section";
import { slugify, uniqueSlugs } from "./slug";

/** A portfolio project with the slug that names its page and deep link. */
export interface Project {
  slug: string;
  slide: SlideDetails;
}

/**
 * Slugs for the slides of one slider, in slider order. Derived from the
 * English slide name (`slugSource`, added by fetch-resume) so every language
 * shares the same URL; duplicates get a numeric suffix.
 */
export const projectSlugsFor = (slides: InfoSlide[]): string[] =>
  uniqueSlugs(
    slides.map(({ slideDetails }) =>
      slugify(
        slideDetails.slugSource || slideDetails.name || slideDetails.slideTitle,
      ),
    ),
  );

/** Every project of the resume, slider by slider, with its slug. */
export const projectsFrom = (resume: Resume): Project[] =>
  resume.pageBuilder.flatMap((section) => {
    const slides = section.sliderDetails?.slides ?? [];
    const slugs = projectSlugsFor(slides);
    return slides.map((slide, index) => ({
      slug: slugs[index],
      slide: slide.slideDetails,
    }));
  });

/** URL of a project page: /project/<slug>/ or /es/proyecto/<slug>/. */
export const projectPath = (locale: Locale, slug: string): string =>
  `${localePath(locale)}${projectSegment[locale]}/${slug}/`;

/** Home page of `locale` with the deep link that opens this project's card. */
export const projectHashFor = (locale: Locale, slug: string): string =>
  `${localePath(locale)}#project-${slug}`;

/** Slug of the project page at `pathname`, or null for any other page. */
export const projectSlugFromPath = (
  pathname: string,
  locale: Locale,
): string | null => {
  const prefix = `${localePath(locale)}${projectSegment[locale]}/`;
  if (!pathname.startsWith(prefix)) return null;
  const rest = pathname.slice(prefix.length).replace(/\/+$/, "");
  return rest && !rest.includes("/") ? decodeURIComponent(rest) : null;
};

/** Component names of a project's tech icons. */
export const projectIconNames = (slide: SlideDetails): string[] =>
  (slide.icons ?? [])
    .map((entry) => entry.icon?.name)
    .filter((name): name is string => Boolean(name));

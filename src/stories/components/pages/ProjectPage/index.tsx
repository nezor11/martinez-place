/**
 * Standalone page of one portfolio project, prerendered at
 * /project/<slug>/ (and /es/proyecto/<slug>/) so every project has its own
 * URL, title, description and social image. Same data and same two columns
 * as the popup (text on the left, gallery or video on the right), laid out
 * in the flow of the page under a link back to the portfolio.
 */
import { useLocale, useMessages } from "@/i18n";
import { ContentSlider } from "@/stories/components/atoms/ContentSlider";
import {
  type Project,
  projectHashFor,
  projectIconNames,
} from "@/utils/projects";
import { sanityImageUrl } from "@/utils/sanityImage";
import type { FC } from "react";

export interface ProjectPageProps {
  project: Project;
}

export const ProjectPage: FC<ProjectPageProps> = ({ project }) => {
  const { slug, slide } = project;
  const locale = useLocale();
  const t = useMessages();

  const year = new Date(slide.workDate).getUTCFullYear().toString();
  const images = (slide.images ?? []).map((image) => ({
    ...image,
    src: sanityImageUrl(image.src, { width: 1200 }),
    alt: image.alt ?? slide.slideTitle,
  }));
  const iconsData = projectIconNames(slide).map((name) => ({
    name,
    width: "1em",
    height: "1em",
  }));

  // The negative margin takes back half of the site header's bottom margin,
  // so the back link sits closer to it.
  return (
    <article className="project-page mt-4 mb-12 lg:-mt-8 lg:mb-16">
      <nav className="mb-6">
        <a
          href={projectHashFor(locale, slug)}
          className="text-sm uppercase font-medium text-primary-600 dark:text-primary-400 hover:underline"
        >
          ← {t.allProjects}
        </a>
      </nav>

      <ContentSlider
        layout="page"
        title={slide.slideTitle}
        company={slide.company ?? ""}
        year={year}
        description={slide.slideDesc ?? ""}
        images={images}
        workDone={slide.workDone ?? []}
        workType={slide.type ?? ""}
        videoUrl={slide.videoUrl || undefined}
        link={
          slide.infoUrl
            ? {
                href: slide.infoUrl,
                link_text: slide.infoUrl,
                rel: "noreferrer noopener",
              }
            : undefined
        }
        iconsData={iconsData}
        backgroundColor={slide.backgroundColor || undefined}
      />
    </article>
  );
};

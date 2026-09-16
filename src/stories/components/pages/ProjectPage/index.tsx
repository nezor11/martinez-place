/**
 * Standalone page of one portfolio project, prerendered at
 * /project/<slug>/ (and /es/proyecto/<slug>/) so every project has its own
 * URL, title, description and social image. Same data as the popup, laid
 * out as a document: summary, description, links, work done, tech icons
 * and the gallery or video.
 */
import { useLocale, useMessages, workDoneLabel } from "@/i18n";
import { BodyCopy } from "@/stories/components/atoms/BodyCopy";
import { Link } from "@/stories/components/atoms/Link";
import Play from "@/stories/components/atoms/Play";
import { SubtitleCopy } from "@/stories/components/atoms/SubtitleCopy";
import { TitleCopy } from "@/stories/components/atoms/TitleCopy";
import { VideoPlayer } from "@/stories/components/atoms/VideoPlayer";
import { IconGallery } from "@/stories/components/molecules/IconGallery";
import { popupBackground } from "@/utils/color";
import {
  type Project,
  projectHashFor,
  projectIconNames,
} from "@/utils/projects";
import { sanityImageUrl } from "@/utils/sanityImage";
import type { FC } from "react";
import { useState } from "react";

export interface ProjectPageProps {
  project: Project;
}

export const ProjectPage: FC<ProjectPageProps> = ({ project }) => {
  const { slug, slide } = project;
  const locale = useLocale();
  const t = useMessages();
  const [playing, setPlaying] = useState(false);

  const year = new Date(slide.workDate).getUTCFullYear().toString();
  const company = (slide.company ?? "").replace(/_/g, " ");
  const images = slide.images ?? [];
  const iconsData = projectIconNames(slide).map((name) => ({ name }));
  const workDone = (slide.workDone ?? []).map((key) =>
    workDoneLabel(locale, key),
  );
  const domain = slide.infoUrl?.match(/https?:\/\/(www\.)?([^/]+)/)?.[2] ?? "";
  const mediaBackground = popupBackground(slide.backgroundColor, {
    videoUrl: slide.videoUrl,
    imageCount: images.length,
  });

  return (
    <article className="project-page mt-16 lg:mt-24">
      <nav className="mb-8">
        <a
          href={projectHashFor(locale, slug)}
          className="text-sm uppercase font-medium text-primary-600 dark:text-primary-400 hover:underline"
        >
          ← {t.allProjects}
        </a>
      </nav>

      <header className="mb-8">
        <div className="flex">
          <SubtitleCopy
            text={company}
            mods="text-base uppercase text-primary-600 dark:text-primary-400 font-medium"
            subtitle="p"
          />
          <SubtitleCopy
            text={year}
            mods="text-base uppercase text-primary-600 dark:text-primary-400 font-medium ml-2"
            subtitle="p"
          />
        </div>
        <TitleCopy
          as="h2"
          text={slide.slideTitle}
          align="left"
          mods="text-4xl md:text-5xl dark:text-white mb-2"
        />
        <SubtitleCopy
          text={slide.name}
          mods="text-xl text-gray-600 dark:text-gray-400"
          subtitle="p"
        />
      </header>

      <div className="grid gap-10 lg:grid-cols-5">
        <div className="lg:col-span-3">
          {slide.slideSummary && (
            <BodyCopy
              tag="p"
              text={slide.slideSummary}
              size="lg"
              mods="mb-6 dark:text-white"
            />
          )}
          <BodyCopy
            tag="div"
            text={slide.slideDesc ?? ""}
            mods="project-page__description dark:text-white [&_p]:mb-4 [&_a]:text-primary-600 dark:[&_a]:text-primary-400 [&_a]:underline"
          />
          {slide.infoUrl && (
            <p className="mt-4 [&_a]:text-primary-600 dark:[&_a]:text-primary-400 [&_a]:underline dark:text-white">
              <BodyCopy tag="span" text={t.moreInfoAt} />
              <Link
                href={slide.infoUrl}
                link_text={domain || slide.infoUrl}
                target="_blank"
                rel="noreferrer noopener"
              />
            </p>
          )}
        </div>

        <aside className="lg:col-span-2">
          {slide.type && (
            <BodyCopy
              tag="p"
              text={t.project(slide.type)}
              mods="text-worktype dark:text-white"
              weight="bold"
            />
          )}
          {workDone.length > 0 && (
            <ul className="mt-2 grid gap-1 text-sm dark:text-white">
              {workDone.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
          {iconsData.length > 0 && (
            <div className="mt-6 text-3xl [&_svg]:mx-1">
              <IconGallery iconsData={iconsData} />
            </div>
          )}
        </aside>
      </div>

      {(slide.videoUrl || images.length > 0) && (
        <section className="mt-12" aria-label={t.projectGallery}>
          {slide.videoUrl ? (
            <div
              className="relative aspect-video w-full overflow-hidden rounded-sm"
              style={{ backgroundColor: mediaBackground }}
            >
              {playing ? (
                <VideoPlayer
                  videoUrl={slide.videoUrl}
                  onReady={() => undefined}
                  isPlaying={true}
                  onEnded={() => setPlaying(false)}
                />
              ) : (
                <button
                  type="button"
                  className="relative flex h-full w-full cursor-pointer items-center justify-center"
                  style={{
                    backgroundImage: images[0]
                      ? `url(${sanityImageUrl(images[0].src, { width: 1440 })})`
                      : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  onClick={() => setPlaying(true)}
                >
                  <Play />
                </button>
              )}
            </div>
          ) : (
            <ul className="grid gap-6 md:grid-cols-2">
              {images.map((image, index) => (
                <li
                  key={image.src}
                  className={
                    images.length === 1 || index === 0 ? "md:col-span-2" : ""
                  }
                >
                  <img
                    src={sanityImageUrl(image.src, { width: 1440 })}
                    width={image.width}
                    height={image.height}
                    alt={image.alt ?? slide.slideTitle}
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding="async"
                    className="h-auto w-full rounded-sm"
                    style={{ backgroundColor: mediaBackground }}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </article>
  );
};

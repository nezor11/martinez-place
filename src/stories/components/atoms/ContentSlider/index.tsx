import { BodyCopy } from "@/stories/components/atoms/BodyCopy";
import { Link, type LinkProps } from "@/stories/components/atoms/Link";
import Play from "@/stories/components/atoms/Play";
import { SubtitleCopy } from "@/stories/components/atoms/SubtitleCopy";
import { TitleCopy } from "@/stories/components/atoms/TitleCopy";
import { VideoPlayer } from "@/stories/components/atoms/VideoPlayer";
import type { IconData } from "@/stories/components/molecules/CardSlide";
import type { SanityImageData } from "@/stories/components/molecules/Modal";
import { SuspenseIconGallery } from "@/stories/components/molecules/SuspenseIconGallery";
import { nanoid } from "nanoid";
import type { FC } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import "./index.css";
import SliderClip from "./SliderClip";

interface ContentSliderProps {
  title: string;
  company?: string;
  year?: string;
  description?: string;
  images?: SanityImageData[];
  workDone?: string[];
  workType?: string;
  videoUrl?: string;
  link?: LinkProps;
  iconsData?: IconData[];
  className?: string;
  backgroundColor?: string;
}

export const ContentSlider: FC<ContentSliderProps> = ({
  title,
  company = "Nezor Houze",
  year,
  description,
  images = [],
  workDone = [],
  workType = "Personal",
  link,
  iconsData,
  videoUrl,
  className,
  backgroundColor,
}) => {
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const formatCompanyName = (name: string) => name.replace(/_/g, " ");

  const nameMapping: { [key: string]: string } = {
    front_end: "Frontend Development",
    front_end_frameworks: "Frontend Frameworks",
    back_end: "Backend Development",
    back_end_frameworks: "Backend Frameworks",
    full_stack: "Full Stack Development",
    databases: "Databases",
    cms: "CMS",
    ecommerce: "E-commerce",
    mobile_app: "Mobile App Development",
    game_dev: "Game Development",
    machine_learning: "Machine Learning",
    data_science: "Data Science",
    artificial_intelligence: "Artificial Intelligence",
    cloud_computing: "Cloud Computing",
    dev_ops: "DevOps",
    blockchain: "Blockchain",
    iot: "Internet of Things",
    cybersecurity: "Cybersecurity",
    servers_hosting: "Servers & Hosting",
    testing_debugging: "Debugging",
    version_control: "Version Control",
    maintenance_updates: "Maintenance",
    performance_optimization: "Performance",
    responsive_design: "Responsive Design",
    ux_ui_design: "UX/UI Consultancy",
    seo: "SEO Support",
    analytics_metrics: "Metrics",
    security: "Security",
  };

  const mappedWorkDone = useMemo(
    () => workDone.map((item) => nameMapping[item] || item),
    [workDone]
  );

  useEffect(() => {
    if (!videoUrl) {
      const timer = setTimeout(() => {
        if (sliderRef.current) {
          new SliderClip(sliderRef.current);
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [videoUrl]);

  const handleReady = () => setLoading(false);
  const handlePlayClick = () => setIsPlaying(true);

  const domain = link?.href?.match(/https?:\/\/(www\.)?([^\/]+)/)?.[2] || "";

  const dynamicBackgroundColor =
    backgroundColor ||
    (videoUrl ? "#000" : images.length > 0 ? "#fff" : "#f5f5f5");


  return (
    <section className="intro overflow-y-scroll p-6 lg:p-0">
      <div className="left md:px-8 2xl:px-16">
        <div>
          <div className="content-wrapper">
            <div className="w-full xl:max-w-5xl xl:ml-auto">
              <div className="flex">
                <SubtitleCopy
                  text={formatCompanyName(company)}
                  mods="text-base uppercase text-primary-500 font-medium"
                  subtitle="h4"
                />
                <SubtitleCopy
                  text={year ?? ""}
                  mods="text-base uppercase text-primary-500 font-medium ml-2"
                  subtitle="h4"
                />
              </div>
              <TitleCopy
                text={title}
                align="left"
                mods="text-4xl md:text-5xl dark:text-white mb-4 lg:mb-8"
              />
              <BodyCopy
                text={description ?? ""}
                tag="div"
                mods="max-w-screen-xl dark:text-white"
              />
              {link?.href && (
                <div className="mt-4 w-full link-text [&_a]:text-primary-500 [&_a]:underline">
                  <BodyCopy
                    tag="span"
                    mods="dark:text-white"
                    text="More info at: "
                  />
                  <Link
                    href={link.href}
                    link_text={domain}
                    target="_blank"
                    rel="noreferrer noopener"
                  />
                </div>
              )}
            </div>
            {workType && (
              <BodyCopy
                tag="div"
                text={`${workType} - Project`}
                mods="col-span-full capitalize text-worktype dark:text-white mt-4"
                weight="bold"
                align="right"
              />
            )}
            {mappedWorkDone.length > 0 && (
              <div className="workdone-wrapper mt-2 text-right w-full xl:max-w-3xl xl:ml-auto">
                <ul className="text-workdone mb-2 list-arrows grid md:grid-cols-2 md:grid-rows-8 xl:grid-rows-4 md:grid-flow-col gap-1 justify-items-start rtl-grid">
                  {mappedWorkDone.map((item) => (
                    <li
                      key={nanoid()}
                      className="text-sm text-right dark:text-white"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="logos-wrapper w-full xl:max-w-5xl xl:ml-auto mt-8 mb-8 lg:mb-4 text-3xl [&_svg]:mx-1">
              <SuspenseIconGallery iconsData={iconsData} />
            </div>
          </div>
        </div>
      </div>

      <div
        className={`slider ${className || ""}`}
        ref={sliderRef}
        style={{ backgroundColor: dynamicBackgroundColor }}
      >
        {videoUrl ? (
          isPlaying ? (
            <div className="flex flex-col justify-center content-center h-full">
              <div>
                <VideoPlayer
                  videoUrl={videoUrl}
                  onReady={handleReady}
                  isPlaying={true}
                  onEnded={() => setIsPlaying(false)} // Aquí se reinicia el estado
                />
              </div>
            </div>
          ) : (
            <button
              type="button"
              className="relative flex justify-center items-center cursor-pointer w-full h-full"
              style={{
                backgroundImage: `url(${images[0]?.src})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              onClick={handlePlayClick}
              onKeyUp={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handlePlayClick();
                }
              }}
            >
              <Play />
            </button>
          )
        ) : (
          <>
            <ul className="slider-images">
              {images.map((image) => (
                <li
                  key={nanoid()}
                  style={{
                    backgroundImage: `url(${image.src})`,
                  }}
                />
              ))}
            </ul>
            <div className="center-y">
              {images.map((imageProperties) => (
                <SubtitleCopy
                  key={nanoid()}
                  text={`${imageProperties.alt}`}
                  mods="text-xs uppercase text-primary-500 font-medium -mb-4"
                  subtitle="h4"
                />
              ))}
            </div>
            <nav className={`${images.length === 1 ? "invisible" : ""}`}>
              {images.map((_, index) => (
                <a
                  key={nanoid()}
                  href={`#slide-${index + 1}`}
                  aria-label={`Slide ${index + 1}`}
                >
                  <span className="sr-only">{`Slide ${index + 1}`}</span>
                </a>
              ))}
            </nav>
          </>
        )}
      </div>
    </section>
  );
};

// SliderSection.tsx

/**
 * SliderSection is a component that displays a section with a title and a slider containing multiple slides.
 *
 * Props:
 * - slidesData: An array of SlideData objects representing the slides to be displayed in the slider.
 * - icons: An optional object containing icon properties to be displayed in the icon gallery.
 * - title: An optional title text to be displayed above the slider.
 *
 * Example usage:
 * <SliderSection
 *   slidesData={[
 *     {
 *       title: "Slide 1",
 *       description: "This is the first slide",
 *       images: [{ src: "image1.jpg", width: 800, height: 600 }],
 *     },
 *     {
 *       title: "Slide 2",
 *       description: "This is the second slide",
 *       images: [{ src: "image2.jpg", width: 800, height: 600 }],
 *     },
 *   ]}
 *   title="My Slider Section"
 * />
 */

import { useLocale, useMessages } from "@/i18n";
import type { LinkProps } from "@/stories/components/atoms/Link";
import { CardSlide } from "@/stories/components/molecules/CardSlide";
import type { IconGalleryProps } from "@/stories/components/molecules/IconGallery";
import { TitleSection } from "@/stories/components/molecules/TitleSection";
import { cn } from "@/utils";
import { iconLabel } from "@/utils/iconLabels";
import {
  normalizeText,
  slideMatches,
  slideSearchTokens,
} from "@/utils/portfolioSearch";
import type { FC } from "react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { Swiper as SwiperClass } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { A11y, Keyboard, Mousewheel } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "./index.css";

export interface SlideData {
  backgroundColor?: string;
  alt?: string;
  year?: string;
  title: string;
  description?: string;
  iconsData?: { name: string; width: string; height: string }[];
  company?: string;
  summary?: string;
  workDone?: string[];
  videoUrl?: string;
  workType?: string;
  images: { src: string; width: number; height: number; alt?: string }[];
  link?: LinkProps;
  imageDetails?: { width: number; height: number };
  cardImageAlt?: string;
  cardImageWidth?: number;
  cardImageHeight?: number;
  imageUrl?: string;
}

export interface SliderSectionProps {
  slidesData: SlideData[];
  icons?: IconGalleryProps;
  title?: string;
}

export const SliderSection: FC<SliderSectionProps> = ({
  slidesData,
  icons,
  title,
}) => {
  const locale = useLocale();
  const t = useMessages();
  const inputId = useId();
  const swiperRef = useRef<SwiperClass | null>(null);
  const [query, setQuery] = useState("");

  // Text search and the tech icons share one filter: an icon click puts the
  // technology's label in the box (or clears it when already there).
  const searchTokens = useMemo(
    () => slidesData.map((slide) => slideSearchTokens(slide, locale, t)),
    [slidesData, locale, t]
  );
  const matches = useMemo(
    () => searchTokens.map((tokens) => slideMatches(tokens, query)),
    [searchTokens, query]
  );
  const matchCount = matches.filter(Boolean).length;
  const activeIcon = useMemo(() => {
    const wanted = normalizeText(query.trim());
    if (!wanted) return undefined;
    for (const slide of slidesData) {
      const icon = slide.iconsData?.find(
        ({ name }) => normalizeText(iconLabel(name)) === wanted
      );
      if (icon) return icon.name;
    }
    return undefined;
  }, [query, slidesData]);

  const handleIconClick = (name: string) => {
    const label = iconLabel(name);
    setQuery((current) =>
      normalizeText(current.trim()) === normalizeText(label) ? "" : label
    );
  };

  // Bring the first matching card into view when the active one is dimmed.
  useEffect(() => {
    const swiper = swiperRef.current;
    if (!query || !swiper) return;
    const first = matches.indexOf(true);
    if (first >= 0 && !matches[swiper.realIndex]) {
      swiper.slideToLoop(first);
    }
  }, [query, matches]);

  if (!slidesData || slidesData.length === 0) {
    console.error("SliderSection requires slidesData prop");
    return null;
  }


  // Only affects Swiper parameters, not the markup, so it is safe to decide
  // synchronously; the prerender (SSR) simply assumes a pointer device.
  const isTouch =
    !import.meta.env.SSR &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0);

  return (
    <section className={cn("slider-section")}>
      <div className="grid grid-cols-5 gap-4">
        {title && (
          <div className="col-span-5 lg:col-span-2">
            <TitleSection
              header="h3"
              text={title}
              mods="text-2xl lg:text-3xl uppercase text-primary-500 font-medium"
              iconsData={icons?.iconsData?.map((icon) => ({
                ...icon,
                width: icon.width || "1em",
                height: icon.height || "1em",
              }))}
            />
          </div>
        )}
        <div className="portfolio__search col-span-5 lg:col-span-3 flex flex-col items-start lg:items-end gap-1">
          <div className="relative w-full lg:w-72">
            <label htmlFor={inputId} className="sr-only">
              {t.searchProjects}
            </label>
            <input
              id={inputId}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t.searchProjects}
              autoComplete="off"
              className="w-full rounded-sm border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-1.5 pr-8 text-sm dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label={t.clearSearch}
                className="absolute right-1 top-1/2 -translate-y-1/2 cursor-pointer rounded-sm px-1.5 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
              >
                ×
              </button>
            )}
          </div>
          <p
            className="text-xs text-gray-600 dark:text-gray-400 min-h-4"
            aria-live="polite"
          >
            {query ? t.resultsCount(matchCount, slidesData.length) : ""}
          </p>
        </div>
      </div>
      <div className="portfolio__slider">
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          loopAdditionalSlides={8}
          loopPreventsSliding={true}
          spaceBetween={32}
          slidesPerView={"auto"}
          slidesPerGroupSkip={2}
          direction={"horizontal"}
          keyboard={{ enabled: true, onlyInViewport: false }}
          loop={true}
          modules={[A11y, Keyboard, Mousewheel]}
          // Horizontal wheel/trackpad gestures move the slider on every
          // device; forceToAxis keeps vertical scrolling for the page.
          mousewheel={{ enabled: true, forceToAxis: true, sensitivity: 1 }}
          {...(isTouch && {
            freeMode: {
              enabled: false,
              sticky: false,
              momentum: true,
              momentumRatio: 4,
              momentumVelocityRatio: 4,
              momentumBounce: true,
              momentumBounceRatio: 1,
            },
          })}
          breakpoints={{
            0: { spaceBetween: 8 },
            769: { slidesOffsetBefore: 300, centeredSlides: true },
          }}
        >
          {slidesData.map((slide, index) => (
            // Stable keys: a fresh key on every render would remount every
            // card (and lose the slider state) on each keystroke.
            <SwiperSlide key={`${slide.title}|${slide.year}|${slide.company}`}>
              <CardSlide
                {...slide}
                cardImage={slide.imageUrl}
                cardImageAlt={slide.alt}
                cardImageHeight={slide.imageDetails?.height}
                year={slide.year || ""}
                backgroundColor={slide.backgroundColor || undefined}
                dimmed={!matches[index]}
                onIconClick={handleIconClick}
                activeIcon={activeIcon}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

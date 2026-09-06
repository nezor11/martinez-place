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

import type { LinkProps } from "@/stories/components/atoms/Link";
import { CardSlide } from "@/stories/components/molecules/CardSlide";
import type { IconGalleryProps } from "@/stories/components/molecules/IconGallery";
import { TitleSection } from "@/stories/components/molecules/TitleSection";
import { cn } from "@/utils";
import { nanoid } from "nanoid";
import type { FC } from "react";
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
  if (!slidesData || slidesData.length === 0) {
    console.error("SliderSection requires slidesData prop");
    return null;
  }


  const isTouchDevice = () => {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  };

  const isTouch = isTouchDevice();

  return (
    <section className={cn("slider-section")}>
      {title && (
        <div className="grid grid-cols-5 gap-4">
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
        </div>
      )}
      <div className="portfolio__slider">
        <Swiper
          loopAdditionalSlides={8}
          loopPreventsSliding={true}
          spaceBetween={32}
          slidesPerView={"auto"}
          slidesPerGroupSkip={2}
          direction={"horizontal"}
          keyboard={{ enabled: true, onlyInViewport: false }}
          loop={true}
          modules={[A11y, Keyboard, Mousewheel]}
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
            mousewheel: {
              enabled: true,
              releaseOnEdges: false,
              sensitivity: 4,
            },
          })}
          breakpoints={{
            0: { spaceBetween: 8 },
            769: { slidesOffsetBefore: 300, centeredSlides: true },
          }}
        >
          {slidesData.map((slide) => (
            <SwiperSlide key={nanoid()}>
              <CardSlide
                {...slide}
                cardImage={slide.imageUrl}
                cardImageAlt={slide.alt}
                cardImageHeight={slide.imageDetails?.height}
                year={slide.year || ""}
                backgroundColor={slide.backgroundColor || undefined}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

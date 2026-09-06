import { BodyCopy } from "@/stories/components/atoms/BodyCopy";
import ButtonClose from "@/stories/components/atoms/ButtonClose";
import type { LinkProps } from "@/stories/components/atoms/Link";
import { TitleCopy } from "@/stories/components/atoms/TitleCopy";
import type { SanityImageData } from "@/stories/components/molecules/Modal";
import { Popup } from "@/stories/components/molecules/Popup";
import { SuspenseIconGallery } from "@/stories/components/molecules/SuspenseIconGallery";
import type { FC, KeyboardEvent, SyntheticEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./index.css";

export interface IconData {
  name: string;
  width: string;
  height: string;
}

export interface CardSlideProps {
  year: string;
  title: string;
  cardImage?: string;
  cardImageAlt?: string;
  cardImageWidth?: number;
  cardImageHeight?: number;
  summary?: string;
  description?: string;
  company?: string;
  iconsData?: IconData[];
  workType?: string;
  link?: LinkProps;
  images?: SanityImageData[];
  workDone?: string[];
  videoUrl?: string;
  backgroundColor?: string;
  infoUrl?: string;
}

/**
 * Picks an item from a list based on a string seed. The result is stable for
 * a given title, so the prerendered HTML and the client render agree.
 */
const pickBySeed = <T,>(seed: string, items: T[]): T => {
  let hash = 0;
  for (const char of seed) {
    hash = (hash * 31 + char.charCodeAt(0)) | 0;
  }
  return items[Math.abs(hash) % items.length];
};

const getColorFor = (seed: string) =>
  pickBySeed(seed, ["#569CD6", "#9D415D", "#9D9D9D", "#C19C00", "#69C33B"]);

const getHeightFor = (seed: string) => pickBySeed(seed, [200, 250, 300, 350]);

export const CardSlide: FC<CardSlideProps> = ({
  year,
  title,
  cardImage,
  cardImageAlt,
  cardImageWidth = 300,
  cardImageHeight = 300,
  summary,
  description,
  company,
  iconsData,
  workType,
  link,
  images,
  workDone,
  videoUrl,
  backgroundColor,
}) => {
  const figcaptionRef = useRef<HTMLDivElement>(null);
  const [showModal, setShowModal] = useState(false);
  const [containerHeight, setContainerHeight] = useState(cardImageHeight);
  const borderColor = getColorFor(title);

  cardImageHeight = getHeightFor(title);

  useEffect(() => {
    if (showModal) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }

    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [showModal]);

  const handleImageLoad = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    const { naturalHeight } = e.currentTarget;
    setContainerHeight(naturalHeight);
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleKeyUp = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      openModal();
    }
  };

  return (
    <>
      <button
        type="button"
        className="card-slide portfolio__slide-content"
        onClick={openModal}
        onKeyUp={handleKeyUp}
        style={{
          border: `3px solid ${borderColor}`,
        }}
        aria-label={`Ver detalles de ${title}`}
      >
        <article>
          <img
            src={
              cardImage ||
              `https://placehold.co/300x${Math.round(cardImageHeight)}`
            }
            width={cardImageWidth}
            height={cardImageHeight}
            onLoad={handleImageLoad}
            style={{
              height: `${containerHeight}px`,
              objectFit: "cover",
            }}
            alt={cardImageAlt || "Card image"}
            onError={(e) => {
              e.currentTarget.src = "path/to/fallback/image.png";
            }}
          />
          <div className="card-meta w-80" ref={figcaptionRef}>
            <div className="card-meta__date-wrapper">
              <BodyCopy
                tag="span"
                text={year}
                size="sm"
                mods="relative bg-gray-50 text-gray-950 px-2 py-1 rounded-sm z-10 opacity-50 date-wrapper"
              />
            </div>
            <TitleCopy
              text={title}
              as="h4"
              align="center"
              mods="dark:text-white text-xl mb-0 uppercase py-4 bg:white"
            />
            <BodyCopy
              tag="p"
              text={summary ?? ""}
              mods="dark:text-white mb-4 px-8"
              align="center"
            />
            <div className="card-slide__icons-wrapper text-xl mb-0 px-12">
              <SuspenseIconGallery iconsData={iconsData} />
            </div>
          </div>
        </article>
      </button>
      {showModal &&
        createPortal(
          <Popup
            title={title}
            company={company}
            year={year}
            description={description}
            images={images}
            workType={workType}
            workDone={workDone}
            link={link}
            iconsData={iconsData}
            videoUrl={videoUrl}
            backgroundColor={backgroundColor}
            onClose={closeModal}
            ButtonCloseComponent={ButtonClose}
          />,
          document.querySelector("body") || document.createElement("div")
        )}
    </>
  );
};

import { BodyCopy } from "@/stories/components/atoms/BodyCopy";
import ButtonClose from "@/stories/components/atoms/ButtonClose";
import type { LinkProps } from "@/stories/components/atoms/Link";
import { TitleCopy } from "@/stories/components/atoms/TitleCopy";
import type { SanityImageData } from "@/stories/components/molecules/Modal";
import { Popup } from "@/stories/components/molecules/Popup";
import { SuspenseIconGallery } from "@/stories/components/molecules/SuspenseIconGallery";
import type { FC, SyntheticEvent } from "react";
import { useMessages } from "@/i18n";
import { cn } from "@/utils";
import { projectHash } from "@/utils/slug";
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
  /** Greyed out because it does not match the portfolio filter. */
  dimmed?: boolean;
  /** Makes the tech icons buttons that report their component name. */
  onIconClick?: (name: string) => void;
  /** Component name of the icon currently used as a filter, if any. */
  activeIcon?: string;
  /** URL slug of the project; enables the deep link and the "Copy link" button. */
  slug?: string;
  /** True while the location hash points at this card: opens its popup. */
  linkedOpen?: boolean;
  onOpen?: (slug: string) => void;
  onClose?: (slug: string) => void;
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
  dimmed = false,
  onIconClick,
  activeIcon,
  slug,
  linkedOpen,
  onOpen,
  onClose,
}) => {
  const figcaptionRef = useRef<HTMLDivElement>(null);
  const [showModal, setShowModal] = useState(false);
  const t = useMessages();
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

  // Deep links: the section owns the location hash and tells the card whether
  // it points here; the card reports its own open/close so the hash follows.
  useEffect(() => {
    if (slug !== undefined) setShowModal(Boolean(linkedOpen));
  }, [slug, linkedOpen]);

  const openModal = () => {
    setShowModal(true);
    if (slug !== undefined) onOpen?.(slug);
  };
  const closeModal = () => {
    setShowModal(false);
    if (slug !== undefined) onClose?.(slug);
  };
  const shareUrl =
    slug !== undefined && typeof window !== "undefined"
      ? `${window.location.origin}${window.location.pathname}${projectHash(slug)}`
      : undefined;

  // The card is a plain wrapper: the opening control and the tech icon
  // buttons are siblings, so no interactive element nests inside another.
  return (
    <>
      <div
        className={cn(
          "card-slide portfolio__slide-content",
          dimmed && "card-slide--dimmed"
        )}
        data-dimmed={dimmed || undefined}
        style={{
          border: `3px solid ${borderColor}`,
        }}
      >
        <button type="button" className="card-slide__open" onClick={openModal}>
          <article>
          <img
            src={
              cardImage ||
              `https://placehold.co/300x${Math.round(cardImageHeight)}`
            }
            width={cardImageWidth}
            height={cardImageHeight}
            loading="lazy"
            decoding="async"
            onLoad={handleImageLoad}
            style={{
              height: `${containerHeight}px`,
              objectFit: "cover",
            }}
            alt={cardImageAlt || t.cardImage}
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
            <span className="sr-only">{t.viewDetails}</span>
          </div>
          </article>
        </button>
        <div className="card-slide__icons-wrapper text-xl mb-0 px-8">
          <SuspenseIconGallery
            iconsData={iconsData}
            onIconClick={onIconClick}
            activeIcon={activeIcon}
          />
        </div>
      </div>
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
            shareUrl={shareUrl}
            onClose={closeModal}
            ButtonCloseComponent={ButtonClose}
          />,
          document.querySelector("body") || document.createElement("div")
        )}
    </>
  );
};

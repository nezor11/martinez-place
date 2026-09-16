/**
 * Popup is a component that displays a popup with various details such as title, company, year, description, images, work done, work type, video URL, link, and icons data.
 *
 * Props:
 * - onClose: A function to handle the close action of the popup.
 * - title: The title of the popup.
 * - company: The name of the company. Optional, defaults to "Nezor Houze".
 * - year: The year associated with the popup. Optional.
 * - description: The description of the popup. Optional.
 * - images: An array of image data objects. Optional.
 * - workDone: An array of work done items. Optional.
 * - workType: The type of work. Optional, defaults to "Personal".
 * - videoUrl: The URL of the video. Optional.
 * - link: An object containing link properties. Optional.
 * - iconsData: An array of icon data objects. Optional.
 * - ButtonCloseComponent: A React component for the close button.
 *
 * Example usage:
 * <Popup
 *   onClose={() => console.log("Popup closed")}
 *   title="Project Title"
 *   company="Company Name"
 *   year="2022"
 *   description="Project Description"
 *   images={[{ src: "image1.jpg", width: 100, height: 100, alt: "Image 1" }]}
 *   workDone={["front_end", "back_end"]}
 *   workType="Client"
 *   videoUrl="https://example.com/video"
 *   link={{ href: "https://example.com", text: "Example Link" }}
 *   iconsData={[{ name: "icon1", width: "24", height: "24" }]}
 *   ButtonCloseComponent={({ onClick }) => <button onClick={onClick}>Close</button>}
 * />
 */

import { ContentSlider } from "@/stories/components/atoms/ContentSlider";
import type { LinkProps } from "@/stories/components/atoms/Link";
import type { IconData } from "@/stories/components/molecules/CardSlide";
import { useMessages } from "@/i18n";
import type { ButtonTone } from "@/stories/components/atoms/ButtonClose";
import { toneClasses } from "@/stories/components/atoms/ButtonClose";
import { cn } from "@/utils";
import { isLightColor, popupBackground } from "@/utils/color";
import { isVisualTest } from "@/utils/visualTest";
import type { FC } from "react";
import { useEffect, useMemo, useState } from "react";
import "./index.css";

export interface SanityImageData {
  src?: string;
  width?: number;
  height?: number;
  alt?: string;
  /** Luminance (0..1) of the top-right corner, sampled at build time. */
  cornerLuminance?: number;
}

interface PopupProps {
  onClose: () => void;
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
  backgroundColor?: string;
  /** Absolute deep link to this project; shows a "Copy link" button when set. */
  shareUrl?: string;
  ButtonCloseComponent: FC<{ onClick: () => void; tone?: ButtonTone }>;
}

export const Popup: FC<PopupProps> = ({
  onClose,
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
  backgroundColor,
  shareUrl,
  ButtonCloseComponent,
}) => {
  const t = useMessages();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copyLink = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
    } catch {
      window.prompt(t.copyLink, shareUrl);
    }
  };

  const handleClose = () => onClose();

  // A random image opens the gallery, except under visual testing, where the
  // snapshot must be the same on every build.
  const randomizedImages = useMemo(
    () =>
      isVisualTest() ? images : [...images].sort(() => Math.random() - 0.5),
    [images],
  );

  // The controls sit over the media panel: the first gallery image when
  // there is one (its top-right corner luminance is sampled at build time by
  // scripts/image-luminance.mjs), otherwise the slide colour. Dark pills on
  // light pixels, light pills on dark ones.
  const corner = randomizedImages[0]?.cornerLuminance;
  const onLight =
    corner === undefined
      ? isLightColor(
          popupBackground(backgroundColor, {
            videoUrl,
            imageCount: images.length,
          }),
        )
      : corner > 0.4;
  const tone: ButtonTone = onLight ? "onLight" : "onDark";

  return (
    <div
      className="min-h-screen min-w-screen popup-content"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="fixed top-0 left-0 right-0 bottom-0 lg:flex lg:items-center lg:justify-center modal-wrapper z-50 bg-white dark:bg-slate-950">
        <ButtonCloseComponent onClick={handleClose} tone={tone} />
        {shareUrl && (
          <button
            type="button"
            className={cn(
              "popup__share absolute top-2 right-14 z-50 cursor-pointer rounded-full p-1 shadow-sm",
              toneClasses[tone],
            )}
            onClick={copyLink}
            aria-label={copied ? t.linkCopied : t.copyLink}
            title={t.copyLink}
            data-copied={copied || undefined}
            data-tone={tone}
          >
            {copied ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
            )}
            <span className="sr-only" aria-live="polite">
              {copied ? t.linkCopied : ""}
            </span>
          </button>
        )}
        <ContentSlider
          title={title}
          company={company}
          year={year}
          description={description}
          workType={workType}
          workDone={workDone}
          link={link}
          iconsData={iconsData}
          videoUrl={videoUrl}
          images={randomizedImages}
          backgroundColor={backgroundColor}
        />
      </div>
    </div>
  );
};

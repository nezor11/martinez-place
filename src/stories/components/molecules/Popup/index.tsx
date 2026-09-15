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
import type { FC } from "react";
import { useEffect, useMemo, useState } from "react";
import "./index.css";

export interface SanityImageData {
  src?: string;
  width?: number;
  height?: number;
  alt?: string;
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
  ButtonCloseComponent: FC<{ onClick: () => void }>;
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

  const randomizedImages = useMemo(
    () => [...images].sort(() => Math.random() - 0.5),
    [images]
  );


  return (
    <div
      className="min-h-screen min-w-screen popup-content"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="fixed top-0 left-0 right-0 bottom-0 lg:flex lg:items-center lg:justify-center modal-wrapper z-50 bg-white dark:bg-slate-950">
        <ButtonCloseComponent onClick={handleClose} />
        {shareUrl && (
          <button
            type="button"
            className="popup__share absolute top-3 right-14 z-50 rounded-sm px-2 py-1 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white cursor-pointer"
            onClick={copyLink}
            aria-live="polite"
          >
            {copied ? t.linkCopied : t.copyLink}
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

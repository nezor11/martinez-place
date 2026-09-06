/** @jsxImportSource react */
/**
 * Modal is a component that displays a modal dialog with various details such as title, company, year, description, images, work done, work type, video, link, and icons.
 *
 * Props:
 * - onClose: A function to be called when the modal is closed.
 * - title: The title of the modal.
 * - company: The name of the company associated with the modal. Default is "Nezor Houze".
 * - year: The year associated with the modal.
 * - description: A detailed description of the modal content.
 * - images: An array of image data objects.
 * - workDone: An array of work done descriptions.
 * - workType: The type of work associated with the modal. Default is "Personal".
 * - videoUrl: The URL of the video to be played in the modal.
 * - link: An object containing link properties.
 * - iconsData: An array of icon data objects.
 * - ButtonCloseComponent: A React component for the close button.
 *
 * Example usage:
 * <Modal
 *   onClose={() => console.log("Modal closed")}
 *   title="Project Title"
 *   company="Company Name"
 *   year="2021"
 *   description="This is a detailed description."
 *   images={[{ src: "https://example.com/image1.jpg", alt: "Image 1" }]}
 *   workDone={["Task 1", "Task 2"]}
 *   workType="Development"
 *   videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
 *   link={{ href: "https://example.com", text: "Learn more" }}
 *   iconsData={[{ name: "icon1", width: "24", height: "24" }]}
 *   ButtonCloseComponent={({ onClick }) => <button onClick={onClick}>Close</button>}
 * />
 */

import { BodyCopy } from "@/stories/components/atoms/BodyCopy";
import { ImageSlider } from "@/stories/components/atoms/ImageSlider";
import { Link, type LinkProps } from "@/stories/components/atoms/Link";
import { TitleCopy } from "@/stories/components/atoms/TitleCopy";
import { VideoPlayer } from "@/stories/components/atoms/VideoPlayer";
import type { IconData } from "@/stories/components/molecules/CardSlide";
import { SuspenseIconGallery } from "@/stories/components/molecules/SuspenseIconGallery";
import { nanoid } from "nanoid";
import type { FC } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import "./index.css";

export interface SanityImageData {
  src?: string;
  width?: number;
  height?: number;
  alt?: string;
}

interface ModalProps {
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
  ButtonCloseComponent: FC<{ onClick: () => void }>;
}

export const Modal: FC<ModalProps> = ({
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
  ButtonCloseComponent,
}) => {
  const dragItemRef = useRef<HTMLDivElement | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [isLgScreen, setIsLgScreen] = useState(false);
  const [, setIsHovered] = useState(false);
  const [, setLoading] = useState(true);
  const [highlightedElements, setHighlightedElements] = useState<Set<Element>>(
    new Set()
  );

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
    testing_debugging: "Testing & Debugging",
    version_control: "Version Control",
    maintenance_updates: "Maintenance & Updates",
    performance_optimization: "Performance",
    responsive_design: "Responsive Design",
    ux_ui_design: "UX/UI Consultancy",
    seo: "SEO Support",
    analytics_metrics: "Analytics & Metrics",
    security: "Security",
  };

  const mappedWorkDone = useMemo(
    () => workDone.map((item) => nameMapping[item] || item),
    [workDone]
  );

  const domain = link?.href?.match(/https?:\/\/(www\.)?([^\/]+)/)?.[2] || "";

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const handleMediaQueryChange = () => setIsLgScreen(mediaQuery.matches);
    setIsLgScreen(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  useEffect(() => {
    if (!isLgScreen) {
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const element = entry.target as HTMLElement;
            if (entry.isIntersecting && !highlightedElements.has(element)) {
              element.classList.add("highlighted");
              setHighlightedElements((prev) => new Set(prev).add(element));
            }
          }
        },
        { threshold: 0.5 }
      );

      const elements = document.querySelectorAll(".absolute-element");
      for (const element of Array.from(elements)) {
        observer.observe(element);
      }

      return () => {
        for (const element of Array.from(elements)) {
          observer.unobserve(element);
        }
      };
    }
  }, [isLgScreen, highlightedElements]);

  const handleClose = () => onClose();

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isLgScreen) return;
    const element = e.currentTarget;
    dragItemRef.current = element;
    dragOffset.current = {
      x: e.clientX - element.getBoundingClientRect().left,
      y: e.clientY - element.getBoundingClientRect().top,
    };
    setDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragging && dragItemRef.current) {
        dragItemRef.current.style.position = "absolute";
        dragItemRef.current.style.left = `${e.clientX - dragOffset.current.x}px`;
        dragItemRef.current.style.top = `${e.clientY - dragOffset.current.y}px`;
      }
    };

    const handleMouseUp = () => {
      setDragging(false);
      dragItemRef.current = null;
    };

    if (dragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  const formatCompanyName = (name: string) => name.replace(/_/g, " ");

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  const handleReady = () => setLoading(false);

  return (
    <div className="min-h-screen min-w-screen overflow-hidden modal-content">
      <div className="fixed top-0 left-0 right-0 bottom-0 p-6 lg:p-0 lg:flex lg:items-center lg:justify-center modal-wrapper z-50 bg-white dark:bg-slate-950 overflow-y-auto">
        <ButtonCloseComponent onClick={handleClose} />

        <div
          className="meta-data-wrapper mt-0 lg:mt-0 w-full lg:absolute top-14 left-14 z-10 bg-white p-8 rounded border lg:max-w-xl max-h-fit absolute-element"
          onMouseDown={handleMouseDown}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="text-wrapper">
            <div className="grid grid-cols-1 w-full">
              <TitleCopy
                text={title}
                mods="text-xl font-semibold lg:text-3xl uppercase"
              />
            </div>
            <div className="grid grid-cols-1 w-full justify-start">
              <div className="flex justify-start">
                <TitleCopy
                  as="h6"
                  text={formatCompanyName(company)}
                  mods="text-xl capitalize"
                />
                <span className="mx-2 relative top-1">/</span>
                <TitleCopy as="h6" text={year} mods="text-xl" />
              </div>
            </div>
            {description && (
              <div className="custom-scrollbar overflow-y-scroll">
                <div className="grid grid-cols-4 w-full mt-8 max-h-60">
                  <BodyCopy
                    tag="div"
                    text={description}
                    mods="col-span-full text-description"
                  />
                </div>
              </div>
            )}
            {link?.href && (
              <div className="mt-8 w-full link-text">
                <BodyCopy tag="span" text="More info at: " />
                <Link
                  href={link.href}
                  link_text={domain}
                  target="_blank"
                  rel="noreferrer noopener"
                />
              </div>
            )}
          </div>
        </div>

        {mappedWorkDone.length > 0 && (
          <div
            className="workdone-wrapper w-full mt-8 lg:absolute top-[10%] right-14 z-10 bg-white p-8 rounded border absolute-element lg:max-w-max"
            onMouseDown={handleMouseDown}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <TitleCopy text="What I did" mods="text-xl" />
            <ul className="col-span-full text-workdone mt-4 mb-2 list-arrows">
              {mappedWorkDone.map((item) => (
                <li key={nanoid()} className="text-sm">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {workType && (
          <div
            className="worktype-wrapper w-full mt-8 lg:absolute bottom-32 right-14 z-10 bg-white p-4 rounded border absolute-element lg:max-w-max lg:min-h-14 lg:max-h-14"
            onMouseDown={handleMouseDown}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <BodyCopy
              tag="div"
              text={`${workType} - Project`}
              mods="col-span-full capitalize text-worktype"
              align="right"
            />
          </div>
        )}

        <div
          className="logos-wrapper w-full mt-8 lg:absolute bottom-14 right-14 z-10 bg-white p-4 rounded border absolute-element lg:max-w-max lg:min-h-14 lg:max-h-16"
          onMouseDown={handleMouseDown}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <SuspenseIconGallery iconsData={iconsData} />
        </div>

        {videoUrl && (
          <VideoPlayer
            videoUrl={videoUrl}
            onReady={handleReady}
            isPlaying={false}
          />
        )}

        {!videoUrl && images.length > 0 && (
          <ImageSlider
            className="slider-wrapper mt-8 lg:mt-0"
            images={images}
          />
        )}
      </div>
    </div>
  );
};

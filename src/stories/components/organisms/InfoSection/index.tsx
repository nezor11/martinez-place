// InfoSection.tsx

/**
 * InfoSection is a component that displays a section with a title, subtitle, and optional icons and sections.
 *
 * Props:
 * - title: The title text to be displayed in the section. Optional.
 * - subtitle: The subtitle text to be displayed below the title. Optional.
 * - sections: An array of InfoItemObject representing the sections to be displayed. Optional.
 * - icons: An object containing icon properties to be displayed in the icon gallery. Optional.
 * - type: The type of the section, either "infoSection" or "sliderSection". Optional.
 *
 * Example usage:
 * <InfoSection
 *   title="About Us"
 *   subtitle="Learn more about our company"
 *   sections={[{ title: "Our Mission", content: "To provide the best service." }]}
 *   icons={{ iconsData: [{ name: "icon1", width: "24", height: "24" }] }}
 *   type="infoSection"
 * />
 */

import { ButtonTailwind } from "@/stories/components/atoms/ButtonTailwind";
import type { IconGalleryProps } from "@/stories/components/molecules/IconGallery";
import {
  InfoItem,
  type InfoItemObject,
} from "@/stories/components/molecules/InfoItem";
import { TitleSection } from "@/stories/components/molecules/TitleSection";
import { cn } from "@/utils";
import { type ComponentPropsWithRef, forwardRef, useState } from "react";

export interface InfoSectionObject {
  title?: string;
  subtitle?: string;
  sections?: InfoItemObject[];
  icons?: IconGalleryProps;
  type?: "infoSection" | "sliderSection";
  key?: string;
}

type InfoSectionProps = ComponentPropsWithRef<"div"> & InfoSectionObject;

export const InfoSection = forwardRef<HTMLElement, InfoSectionProps>(
  ({ icons, title, subtitle, sections, ...props }, ref) => {
    const titleText = title || "";
    const subtitleText = subtitle || "";

    let iconsData: { name: string; width: string; height: string }[] = [];

    if (icons?.iconsData) {
      iconsData = icons.iconsData.map((icon) => ({
        name: icon.name,
        width: icon.width ?? "1em",
        height: icon.height ?? "1em",
      }));
    }

    const initialItemsToShow = 2;
    const [itemsToShow, setItemsToShow] = useState(initialItemsToShow);

    const handleLoadMore = () => {
      setItemsToShow(itemsToShow + initialItemsToShow);
    };

    return (
      <section ref={ref} className={cn("info-section")} {...props}>
        {titleText !== "" && subtitleText !== "" && (
          <div className="grid grid-cols-5 gap-4">
            <div className="col-span-5 lg:col-span-2">
              <TitleSection
                header="h3"
                text={titleText}
                subtext={subtitleText}
                mods="text-2xl lg:text-3xl uppercase text-primary-500 font-medium"
                styles={{}}
                iconsData={iconsData}
              />
            </div>
            {sections && (
              <>
                <div className="col-span-5 lg:col-span-3">
                  {sections.slice(0, itemsToShow).map((section, index) => (
                    <InfoItem
                      key={section?.info?.key ?? index}
                      info={section.info}
                      subtitleEmpty={subtitleText === ""}
                    />
                  ))}
                </div>
                {sections.length > itemsToShow && (
                  <div className="col-span-5 text-right">
                    <ButtonTailwind
                      onClick={handleLoadMore}
                      size="sm"
                      variant="ghost"
                      className="w-32"
                    >
                      Load More
                    </ButtonTailwind>
                  </div>
                )}
              </>
            )}
          </div>
        )}
        {titleText !== "" && subtitleText === "" && sections && (
          <>
            <div className="grid grid-cols-5 gap-4">
              <div className="col-span-5 lg:col-span-2">
                <TitleSection
                  header="h3"
                  text={titleText}
                  mods="text-2xl lg:text-3xl uppercase text-primary-500 font-medium"
                  iconsData={iconsData}
                />
              </div>
              <div className="col-span-5 lg:col-span-3" />
            </div>
            {sections.map((section, index) => (
              <InfoItem
                key={section?.info?.key ?? index}
                info={section.info}
                subtitleEmpty={subtitleText === ""}
              />
            ))}
          </>
        )}
      </section>
    );
  }
);

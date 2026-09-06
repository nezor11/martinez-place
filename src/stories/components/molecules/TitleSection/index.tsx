/**
 * TitleSection is a component that displays a section with a header, text, subtext, and an optional icon gallery.
 *
 * Props:
 * - header: The HTML tag to be used for the header. Default is "h3".
 * - text: The main text to be displayed in the section. Default is "Me cago en tus muelas".
 * - subtext: Optional subtext to be displayed below the main text.
 * - mods: Additional CSS classes to be applied to the header. Default is "text-3xl uppercase text-primary-500 font-medium".
 * - styles: Optional CSS styles to be applied to the header.
 * - iconsData: An optional array of icon data objects to be displayed in the icon gallery.
 *
 * Example usage:
 * <TitleSection
 *   header="h2"
 *   text="Welcome to the Title Section"
 *   subtext="This is a subtitle"
 *   mods="text-4xl font-bold"
 *   styles={{ color: "red" }}
 *   iconsData={[{ name: "icon1", width: "24", height: "24" }]}
 * />
 */

import { BodyCopy } from "@/stories/components/atoms/BodyCopy";
import DOMPurify from "dompurify";
import type { CSSProperties, FC } from "react";
import { IconGallery, type IconGalleryProps } from "../IconGallery";
import "./index.css";

/**
 * Props for the TitleSection component.
 */
export interface TitleSectionProps extends Omit<IconGalleryProps, "iconsData"> {
  header: string;
  text: string;
  subtext?: string;
  mods: string;
  styles?: CSSProperties;
  iconsData?: { name: string; width: string; height: string }[];
}

export const TitleSection: FC<TitleSectionProps> = ({
  header = "h3",
  text = "Me cago en tus muelas",
  subtext = "",
  mods = "text-3xl uppercase text-primary-500 font-medium",
  styles = {},
  iconsData = [],
  ...props
}: TitleSectionProps) => {
  const Header = header as keyof JSX.IntrinsicElements;

  const sanitizedText = DOMPurify.sanitize(text);

  return (
    <div>
      <div className="flex items-center mb-0 lg:mb-6">
        {iconsData && iconsData.length > 0 && (
          <div className="text-2xl lg:text-3xl flex mr-1">
            <IconGallery iconsData={iconsData} />
          </div>
        )}
        <Header
          className={`info-section__text ${mods}`}
          style={styles}
          {...props}
        >
          {sanitizedText}
        </Header>
      </div>
      {subtext !== "" && (
        <BodyCopy tag="p" size="sm" mods="mt-4 lg:mt-0" italic text={subtext} />
      )}
    </div>
  );
};

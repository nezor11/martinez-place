/**
 * This file contains the ResumeSection component and related utility functions.
 *
 * The ResumeSection component is responsible for rendering a section of a resume.
 * It uses data from the Sanity CMS to dynamically generate the content.
 *
 * The utility functions in this file include:
 * - mapInfoSection: A function to map the section data to the expected structure.
 *
 * Props:
 * - section: An object of type Section that contains the data for the resume section.
 *
 * Example usage:
 *
 * <ResumeSection section={sectionData} />
 *
 * Where `sectionData` is an object containing the necessary data for the resume section.
 */

import type { IconGalleryProps } from "@/stories/components/molecules/IconGallery";
import { Resume } from "@/stories/components/templates/Resume";
import type { Section } from "@/utils/types/section";
import { sanityImageUrl } from "@/utils/sanityImage";
import type { FC } from "react";
import { type Messages, useMessages } from "@/i18n";

interface Props {
  section: Section;
}

export const mapInfoSection = (section: Section, t: Messages) => {
  const { titleSection, subtitleSection, sections, iconTitleDetails } = section;

  const icons: IconGalleryProps | undefined = iconTitleDetails
    ? {
        iconsData: [
          {
            name: iconTitleDetails.name,
            width: iconTitleDetails.width
              ? `${iconTitleDetails.width}px`
              : "1em",
            height: iconTitleDetails.height
              ? `${iconTitleDetails.height}px`
              : "1em",
          },
        ],
      }
    : undefined;

  return {
    title: titleSection,
    subtitle: subtitleSection,
    icons: icons,
    sections: (sections ?? []).map((infoItem) => {
      const {
        company,
        infoUrl,
        startDate,
        finishDate,
        jobTitle,
        jobDesc,
        imageDetails,
      } = infoItem;

      const startDateObj = new Date(startDate);
      const finishDateObj = finishDate ? new Date(finishDate) : null;
      const startYear = startDateObj.getUTCFullYear();
      const finishYear = finishDateObj ? finishDateObj.getUTCFullYear() : null;

      let dateText = `${startYear} > ${t.current}`;

      if (finishDateObj) {
        const finishYear = finishDateObj.getUTCFullYear();
        dateText =
          startYear !== finishYear ? `${startYear} > ${finishYear}` : dateText;
      }

      if (startYear === finishYear) {
        dateText = startYear.toString();
      }

      // 800x600 crop straight from the CDN URL; the image-url builder used
      // here before threw on the `{ url }` shape fetch-resume produces.
      const imageUrl = imageDetails?.url
        ? sanityImageUrl(imageDetails.url, { width: 800, height: 600 })
        : null;

      return {
        info: {
          company,
          infoUrl,
          date: dateText,
          jobTitle,
          jobDesc: jobDesc ?? "",
          imageDetails: imageUrl
            ? { src: imageUrl, alt: company ?? "" }
            : null,
        },
      };
    }),
  };
};

const ResumeSection: FC<Props> = ({ section }) => {
  const t = useMessages();
  return (
    <Resume
      key={section._key}
      resumeItems={[{ ...mapInfoSection(section, t), type: "infoSection" }]}
    />
  );
};

export default ResumeSection;

/**
 * This file contains the ResumeSection component and related utility functions.
 *
 * The ResumeSection component is responsible for rendering a section of a resume.
 * It uses data from the Sanity CMS to dynamically generate the content.
 *
 * The utility functions in this file include:
 * - urlFor: A function to build the image URL from the Sanity image object.
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
import blocksToHtml from "@sanity/block-content-to-html";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import type { FC } from "react";

interface Props {
  section: Section;
}

// Definir tu projectId y dataset
const projectId = "6zr8au58";
const dataset = "production";

// Function to build the image URL from the Sanity image object
const builder = imageUrlBuilder({ projectId, dataset });

const urlFor = (source: SanityImageSource) => {
  return builder.image(source);
};

export const mapInfoSection = (section: Section) => {
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
      const startYear = startDateObj.getFullYear();
      const finishYear = finishDateObj ? finishDateObj.getFullYear() : null;

      let dateText = `${startYear} > Current`;

      if (finishDateObj) {
        const finishYear = finishDateObj.getFullYear();
        dateText =
          startYear !== finishYear ? `${startYear} > ${finishYear}` : dateText;
      }

      if (startYear === finishYear) {
        dateText = startYear.toString();
      }

      const imageUrl = imageDetails?.url
        ? urlFor(imageDetails).width(800).height(600).url()
        : null;

      const consolidatedJobDescHtml = blocksToHtml({
        blocks: jobDesc,
        projectId: projectId,
        dataset: dataset,
      });

      return {
        info: {
          company,
          infoUrl,
          date: dateText,
          jobTitle,
          jobDesc: consolidatedJobDescHtml,
          imageDetails: imageUrl
            ? { src: imageUrl, alt: "Image Alt Text" }
            : null,
        },
      };
    }),
  };
};

const ResumeSection: FC<Props> = ({ section }) => {
  return (
    <Resume
      key={section._key}
      resumeItems={[{ ...mapInfoSection(section), type: "infoSection" }]}
    />
  );
};

export default ResumeSection;

/**
 * InfoItem is a component that displays information about a job or position, including company, date, job title, and job description.
 *
 * Props:
 * - info: An object containing the following properties:
 *   - company: The name of the company.
 *   - infoUrl: An optional URL for more information.
 *   - date: The date associated with the job or position.
 *   - jobTitle: The title of the job or position.
 *   - jobDesc: The description of the job or position.
 * - subtitleEmpty: A boolean indicating whether the subtitle is empty.
 *
 * Example usage:
 * <InfoItem
 *   info={{
 *     company: "Company Name",
 *     infoUrl: "https://example.com",
 *     date: "2021-2022",
 *     jobTitle: "Job Title",
 *     jobDesc: "Job Description"
 *   }}
 *   subtitleEmpty={false}
 * />
 */

import { BodyCopy } from "@/stories/components/atoms/BodyCopy";
import { Link } from "@/stories/components/atoms/Link";
import { TitleCopy } from "@/stories/components/atoms/TitleCopy";
import { cn } from "@/utils";
import { type ComponentPropsWithRef, forwardRef } from "react";

/**
 * Interface for the texts used in the InfoItem component.
 */
export interface InfoItemTexts {
  company: string;
  infoUrl?: string;
  date: string;
  jobTitle: string;
  jobDesc: string;
  key?: string;
}

/**
 * Interface for the common section used in the InfoItem component.
 */
export interface CommonSection {
  title?: string;
  subtitle?: string;
}

/**
 * Interface for the InfoItem object used in the InfoItem component.
 */
export interface InfoItemObject {
  info: InfoItemTexts;
}

/**
 * Props for the InfoItem component.
 */
type InfoItemProps = ComponentPropsWithRef<"div"> &
  InfoItemObject & { subtitleEmpty: boolean };

/**
 * InfoItem component.
 */
export const InfoItem = forwardRef<HTMLDivElement, InfoItemProps>(
  ({ info, subtitleEmpty, ...props }, ref) => {
    const colSpanClass =
      subtitleEmpty && info.company ? "col-span-5 lg:col-span-3" : "col-span-5";

    return (
      <div
        ref={ref}
        className={cn("grid grid-cols-5 gap-4 mb-8", colSpanClass)}
        {...props}
      >
        {info.company && (
          <div className="col-span-5 lg:col-span-2 flex flex-row lg:flex-col flex-wrap -mb-4">
            {info.infoUrl ? (
              <>
                <TitleCopy
                  as="h5"
                  mods="mb-2 font-medium text-base lg:text-xl dark:text-white mr-2"
                >
                  <Link
                    href={info.infoUrl}
                    link_text={info.company}
                    rel="noreferrer noopener"
                  />
                </TitleCopy>
              </>
            ) : (
              <TitleCopy
                as="h5"
                mods="mb-2 font-medium text-base lg:text-xl dark:text-white mr-2"
                underline
                text={info.company}
              />
            )}
            {info.date && (
              <TitleCopy
                as="h6"
                mods="text-gray-400 dark:text-white mb-2"
                text={info.date}
              />
            )}
          </div>
        )}
        <div className={colSpanClass}>
          {info.jobTitle && (
            <TitleCopy
              as="h4"
              mods="mb-2 font-medium text-xl dark:text-white"
              text={info.jobTitle}
            />
          )}
          {info.jobDesc && (
            <BodyCopy tag="div" text={info.jobDesc} mods="main-text" />
          )}
        </div>
      </div>
    );
  }
);

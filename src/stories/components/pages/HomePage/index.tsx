/**
 * HomePage is a component that displays the main content of the homepage, including the header, resume, and footer sections.
 *
 * Props:
 * - dataHeaderObject: An optional array of User objects representing the header data.
 * - dataResumeObject: An optional array of ResumeObject objects representing the resume data.
 * - dataFooterObject: An optional FooterProps object representing the footer data.
 *
 * Example usage:
 * <HomePage
 *   dataHeaderObject={[{ name: "John Doe", jobTitle: "Software Engineer" }]}
 *   dataResumeObject={[{ title: "Experience", items: [{ title: "Job 1", description: "Description of job 1" }] }]}
 *   dataFooterObject={{ copy_right_text: "© 2023 My Company" }}
 * />
 */

import {
  Footer,
  type FooterProps,
} from "@/stories/components/organisms/Footer";
import { Header, type User } from "@/stories/components/organisms/Header";
import {
  Resume,
  type ResumeObject,
} from "@/stories/components/templates/Resume";
import { cn } from "@/utils";
import { type ComponentPropsWithRef, forwardRef } from "react";

interface PageObject extends ResumeObject {
  dataHeaderObject?: User[] | null;
  dataResumeObject?: ResumeObject[] | null;
  dataFooterObject?: FooterProps | null; // Cambiado a un solo objeto, no un array
}

type PageProps = ComponentPropsWithRef<"div"> & PageObject;

export const Page = forwardRef<HTMLDivElement, PageProps>(
  ({ dataHeaderObject, dataResumeObject, dataFooterObject, ...props }, ref) => {
    return (
      <div className={cn("container mx-auto px-4")} {...props} ref={ref}>
        <Header user={dataHeaderObject ? dataHeaderObject[0] : null} />
        <Resume resumeItems={dataResumeObject} />
        <Footer {...dataFooterObject} />
      </div>
    );
  }
);

import type { InfoSectionObject } from "@/stories/components/organisms/InfoSection";
import { InfoSection } from "@/stories/components/organisms/InfoSection";
import type { SlideData } from "@/stories/components/organisms/SliderSection";
import { SliderSection } from "@/stories/components/organisms/SliderSection";

import { cn } from "@/utils";
import type { ComponentPropsWithRef } from "react";
import { forwardRef } from "react";

export interface SliderSectionObject extends InfoSectionObject {
  type: "sliderSection";
  slidesData: SlideData[];
  slides?: SlideData[];
}

export interface ResumeObject extends InfoSectionObject {
  resumeItems?: (InfoSectionObject | SliderSectionObject)[] | null;
}

type ResumeProps = ComponentPropsWithRef<"article"> & ResumeObject;

export const Resume = forwardRef<HTMLElement, ResumeProps>(
  ({ resumeItems, ...props }, ref) => {
    return (
      <article ref={ref} className={cn("my-10")} {...props}>
        {resumeItems?.map((item, index) => {
          const key = item.key?.toString() || index.toString(); // Ensure key is a string
          switch (item.type) {
            case "infoSection":
              return <InfoSection key={key} {...item} />;
            case "sliderSection": {
              const { slidesData, icons, title } = item as SliderSectionObject;
              return (
                <SliderSection
                  key={key}
                  slidesData={slidesData}
                  icons={icons}
                  title={title}
                />
              );
            }
            default:
              return <div key={key}>No data available</div>;
          }
        })}
      </article>
    );
  }
);

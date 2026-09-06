import type { FC } from "react";
import HeaderSection from "./HeaderSection";
import ResumeSection from "./ResumeSection";
import ResumeSlider from "./ResumeSlider";
import type { Section } from "./utils/types/section";

interface Props {
  section: Section;
}

const SectionRenderer: FC<Props> = ({ section }) => {
  switch (section._type) {
    case "header":
      return <HeaderSection section={section} />;
    case "infoSection":
      return <ResumeSection section={section} />;
    case "sliderSection":
      return <ResumeSlider slider={section} />;
    default:
      return null;
  }
};

export default SectionRenderer;

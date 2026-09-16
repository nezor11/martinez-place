import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProjectPage } from ".";

const meta: Meta<typeof ProjectPage> = {
  title: "Design System/Pages/ProjectPage",
  component: ProjectPage,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;

type Story = StoryObj<typeof meta>;

/** A client project with a gallery, as prerendered at /project/<slug>/. */
export const Gallery: Story = {
  args: {
    project: {
      slug: "gravida",
      slide: {
        _id: "slide-gravida",
        name: "Gravida",
        slideTitle:
          "WordPress backend & infrastructure · Migration to SiteGround",
        company: "novicell",
        type: "maintenance",
        workDate: "2026-05-15T12:00:00Z",
        infoUrl: "https://gravida.com",
        slideSummary:
          "Technical audit and full infrastructure migration of a multilingual WordPress site, plus new pricing pages and technical SEO.",
        slideDesc:
          '<p><a href="https://gravida.com" target="_blank" rel="noreferrer noopener">Gravida</a> is a fertility clinic in Barcelona that runs a <strong>multilingual WordPress platform</strong>. I started with a full <strong>technical audit</strong> and then planned and executed the <strong>migration to SiteGround</strong>.</p>',
        workDone: ["front_end", "back_end", "servers_hosting", "seo"],
        backgroundColor: "#A0143C",
        icons: [
          { icon: { name: "WordpressIcon" } },
          { icon: { name: "PhpIcon" } },
          { icon: { name: "JavaScriptIcon" } },
        ],
        images: [
          {
            src: "https://picsum.photos/seed/gravida/1440/900",
            width: 1440,
            height: 900,
            alt: "Gravida homepage",
          },
          {
            src: "https://picsum.photos/seed/gravida-2/1440/900",
            width: 1440,
            height: 900,
            alt: "Pricing page",
          },
        ],
      },
    },
  },
};

/** A project with a video: the poster shows a play button until clicked. */
export const Video: Story = {
  args: {
    project: {
      slug: "js-camp-barcelona",
      slide: {
        _id: "slide-jscamp",
        name: "JS Camp Barcelona",
        slideTitle: "Conference site and highlights",
        company: "freelance",
        type: "fresh",
        workDate: "2019-07-18T12:00:00Z",
        slideDesc:
          "<p>Site and video highlights for a JavaScript conference.</p>",
        workDone: ["front_end", "responsive_design"],
        videoUrl: "https://www.youtube.com/watch?v=pP-vSUNJ14A",
        icons: [{ icon: { name: "JavaScriptIcon" } }],
        images: [
          {
            src: "https://picsum.photos/seed/jscamp/1440/900",
            width: 1440,
            height: 900,
            alt: "Conference",
          },
        ],
      },
    },
  },
};

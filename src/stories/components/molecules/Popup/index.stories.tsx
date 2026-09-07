import { unsplashUrl } from "@/stories/utils/unsplash";
import ButtonClose from "@/stories/components/atoms/ButtonClose";
import { Code } from "@/stories/components/system/Code";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";
import { Popup } from ".";

const meta: Meta<typeof Popup> = {
  title: "Design System/Molecules/Popup",
  component: Popup,
  parameters: {
    docs: {
      description: {
        component: "",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "The title of the modal.",
      table: {
        category: "Content",
      },
    },
    videoUrl: {
      control: "text",
      description: "The URL of the video to display in the modal.",
      table: {
        category: "Content",
      },
    },
    images: {
      control: "object",
      description: "The images to display in the modal.",
      table: {
        category: "Content",
      },
    },
    company: {
      control: "text",
      description: "The name of the company.",
      table: {
        category: "Content",
      },
    },
    year: {
      control: "text",
      description: "The year of the project.",
      table: {
        category: "Content",
      },
    },
    description: {
      control: "text",
      description: "The description of the project.",
      table: {
        category: "Content",
      },
    },
    link: {
      control: "object",
      description: "The link to the project.",
      table: {
        category: "Content",
      },
    },
    workType: {
      control: "text",
      description: "The type of work.",
      table: {
        category: "Content",
      },
    },
    iconsData: {
      control: "object",
      description: "The icons data.",
      table: {
        category: "Content",
      },
    },
    onClose: {
      description: "The function to close the modal.",
      table: {
        category: "Actions",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const fetchImagesFromUnsplash = async (query: string, count = 3) => {
  try {
    const response = await fetch(
      unsplashUrl("photos/random", { query, count })
    );
    if (!response.ok) throw new Error("Error al obtener imágenes de Unsplash");

    const data = await response.json();
    console.log("SRC IMG ------------------------> ", data);
    return data.map(
      (img: { alt_description: string; urls: { raw: string } }) => ({
        alt: img.alt_description || "Unsplash Image",
        src: `${img.urls.raw}&w=1200&h=800&fit=crop`,
        width: 800,
        height: 1200,
      })
    );
  } catch (error) {
    console.error("Error fetching images:", error);
    return [
      {
        src: "https://placehold.co/800x1200",
        width: 800,
        height: 1200,
        alt: "Placeholder Image",
      },
    ];
  }
};

export const Default: Story = {
  args: {
    title: "Modal Title",
    company: "Company Name",
    year: "2021",
    description: "This is a description of the video.",
    link: {
      href: "https://www.youtube.com/watch?v=nAEvmGK5KRs",
      link_text: "Watch on YouTube",
      rel: "",
    },
    workType: "Frontend",
    iconsData: [
      {
        name: "CSS3Icon",
        width: "1em",
        height: "1em",
      },
      {
        name: "ViteIcon",
        width: "1em",
        height: "1em",
      },
      {
        name: "GitBranchIcon",
        width: "1em",
        height: "1em",
      },
    ],
    workDone: [
      "Maecenas sit amet justo sit amet tellus tincidunt efficitur",
      "Nullam nec turpis nec justo aliquam suscipit",
      "Pellentesque habitant morbi tristique sen",
    ],
    backgroundColor: "yellow",
    ButtonCloseComponent: ({ onClick }) => <ButtonClose onClick={onClick} />,
  },
  render: (args) => {
    const [images, setImages] = useState([]);

    useEffect(() => {
      const fetchAndSetCardImage = async () => {
        const fetchedImages = await fetchImagesFromUnsplash("nature", 2);
        console.log("Fetched Images:", fetchedImages);
        setImages(fetchedImages);
      };

      fetchAndSetCardImage();
    }, []);

    return <Popup {...args} images={images} />;
  },
};

export const SourceCode: Story = {
  parameters: {
    layout: "fullscreen",
    controls: {
      disable: true,
    },
    actions: {
      disable: true,
    },
  },
  render: () => (
    <>
      <Code directoryPath="src/stories/components/molecules/Popup/" />
    </>
  ),
};

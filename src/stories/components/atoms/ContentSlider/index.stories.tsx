import { unsplashUrl } from "@/stories/utils/unsplash";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";
import { ContentSlider } from ".";

const meta: Meta<typeof ContentSlider> = {
  title: "Design System/Atoms/Content Slider",
  component: ContentSlider,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: "",
      },
    },
  },
  argTypes: {
    images: {
      control: {
        type: "object",
      },
      description: "Array of images to display in the slider",
      table: {
        type: {
          summary: "Image[]",
        },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ContentSlider>;

interface UnsplashImage {
  alt_description: string;
  urls: {
    raw: string;
  };
}

// Función para obtener imágenes de Unsplash
const fetchImagesFromUnsplash = async (query: string, count = 3) => {
  try {
    const response = await fetch(
      unsplashUrl("photos/random", { query, count })
    );
    if (!response.ok) throw new Error("Error al obtener imágenes de Unsplash");

    const data = await response.json();
    console.log("SRC IMG ------------------------> ", data);
    return data.map((img: UnsplashImage) => ({
      alt: img.alt_description || "Unsplash Image",
      src: `${img.urls.raw}&w=800&h=1200&fit=crop`,
      width: 1200,
      height: 800,
    }));
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
    title: "Portfolio",
    company: "Company",
    year: "2021",
    description:
      "During my time at Ondho, I played a key role in the complete development of the Naturisthar website from the very beginning. This project was centered around creating a digital presence that embodies the brand's commitment to natural and holistic beauty. My work involved designing an intuitive and aesthetically pleasing site layout, integrating features that showcase the brand's offerings, and ensuring smooth performance. I also maintained a consistent, nature-inspired design throughout the site.",
    workDone: [
      "Maecenas sit amet justo sit amet tellus tincidunt efficitur.",
      "Nullam nec turpis nec justo aliquam suscipit.",
      "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
    ],
    link: {
      href: "https://www.google.com",
      link_text: "Google",
      rel: "noopener noreferrer",
    },
    iconsData: [
      { name: "WordpressIcon", width: "1em", height: "1em" },
      { name: "CSS3Icon", width: "1em", height: "1em" },
      { name: "HTML5Icon", width: "1em", height: "1em" },
      { name: "JavaScriptIcon", width: "1em", height: "1em" },
      { name: "LaravelIcon", width: "1em", height: "1em" },
      { name: "PhpIcon", width: "1em", height: "1em" },
      { name: "GitHubIcon", width: "1em", height: "1em" },
    ],
  },
  render: (args) => {
    const [images, setImages] = useState([
      {
        src: "https://placehold.co/800x1200",
        width: 800,
        height: 1200,
        alt: "Placeholder Image",
      },
    ]);

    useEffect(() => {
      const loadImages = async () => {
        const unsplashImages = await fetchImagesFromUnsplash(
          "web-development",
          3
        );
        setImages(unsplashImages);
      };
      loadImages();
    }, []);

    return <ContentSlider {...args} images={images} />;
  },
};

export const Video: Story = {
  args: {
    title: "Portfolio",
    company: "Company",
    year: "2021",
    description:
      "During my time at Ondho, I played a key role in the complete development of the Naturisthar website from the very beginning. This project was centered around creating a digital presence that embodies the brand's commitment to natural and holistic beauty. My work involved designing an intuitive and aesthetically pleasing site layout, integrating features that showcase the brand's offerings, and ensuring smooth performance. I also maintained a consistent, nature-inspired design throughout the site.",
    workDone: [
      "Maecenas sit amet justo sit amet tellus tincidunt efficitur.",
      "Nullam nec turpis nec justo aliquam suscipit.",
      "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
    ],
    link: {
      href: "https://www.google.com",
      link_text: "Google",
      rel: "noopener noreferrer",
    },
    backgroundColor: "#E5FFE5",
    videoUrl: "https://www.youtube.com/watch?v=6v2L2UGZJAM",
    iconsData: [
      { name: "WordpressIcon", width: "1em", height: "1em" },
      { name: "CSS3Icon", width: "1em", height: "1em" },
      { name: "HTML5Icon", width: "1em", height: "1em" },
      { name: "JavaScriptIcon", width: "1em", height: "1em" },
      { name: "LaravelIcon", width: "1em", height: "1em" },
      { name: "PhpIcon", width: "1em", height: "1em" },
      { name: "GitHubIcon", width: "1em", height: "1em" },
    ],
  },
  render: (args) => {
    const [images, setImages] = useState([
      {
        src: "https://placehold.co/800x1200",
        width: 800,
        height: 1200,
        alt: "Placeholder Image",
      },
    ]);

    useEffect(() => {
      const loadImages = async () => {
        const unsplashImages = await fetchImagesFromUnsplash(
          "web-development",
          1
        );
        setImages(unsplashImages);
      };
      loadImages();
    }, []);

    return <ContentSlider {...args} images={images} />;
  },
};

import { unsplashUrl } from "@/stories/utils/unsplash";
import { Code } from "@/stories/components/system/Code";
import type { Meta } from "@storybook/react";
import { useEffect, useState } from "react";
import { LazyImage } from ".";

const meta: Meta<typeof LazyImage> = {
  title: "Design System/Atoms/Lazy Image",
  component: LazyImage,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "LazyImage is a component that renders an image with a placeholder. It is used to display an image in a page or section. It accepts the following props: `placeholderSrc`, `src`, `alt`, `width`, and `height`.",
      },
    },
  },
  argTypes: {
    placeholderSrc: {
      control: "text",
      description: "The placeholder image source.",
      table: {
        defaultValue: { summary: "https://placehold.co/600x400" },
      },
    },
    src: {
      control: "text",
      description: "The image source from Unsplash.",
      table: {
        defaultValue: {
          summary: "https://source.unsplash.com/random/600x400/?mountain",
        },
      },
    },
    alt: {
      control: "text",
      description: "The alt text of the image.",
      table: {
        defaultValue: {
          summary: "Alt text",
        },
      },
    },
    width: {
      control: "number",
      description: "The width of the image.",
      table: {
        defaultValue: {
          summary: "600",
        },
      },
    },
    height: {
      control: "number",
      description: "The height of the image.",
      table: {
        defaultValue: {
          summary: "400",
        },
      },
    },
  },
};

export default meta;

// Función para buscar una imagen de montaña utilizando el endpoint correcto de búsqueda
const fetchMountainImage = async () => {
  const response = await fetch(
    unsplashUrl("search/photos", { query: "mountain", per_page: 1 })
  );
  const data = await response.json();

  if (!data.results?.length) {
    throw new Error("No se encontró ninguna imagen de montaña.");
  }

  return data.results[0].urls.regular;
};

export const Default = () => {
  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    const loadImage = async () => {
      try {
        const imgSrc = await fetchMountainImage();
        setImageSrc(imgSrc);
      } catch (error) {
        console.error("Error al cargar la imagen de Unsplash:", error instanceof Error ? error.message : error);
        setImageSrc("https://placehold.co/600x400?text=Image"); // Imagen de reemplazo
      }
    };
    loadImage();
  }, []);

  return (
    <LazyImage
      placeholderSrc="https://placehold.co/600x400"
      src={imageSrc}
      alt="Mountain Image from Unsplash"
      width={600}
      height={400}
    />
  );
};

export const SourceCode = {
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
      <Code directoryPath="src/stories/components/atoms/LazyImage/" />
    </>
  ),
};

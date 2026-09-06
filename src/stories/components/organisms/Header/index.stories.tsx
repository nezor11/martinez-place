import { unsplashUrl } from "@/stories/utils/unsplash";
import { Code } from "@/stories/components/system/Code";
import type { Meta, StoryFn } from "@storybook/react-vite";
import { useEffect, useState } from "react";
import { Header } from ".";

const meta: Meta<typeof Header> = {
  title: "Design System/Organisms/Header",
  component: Header,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Header is a component that renders a header with a user profile. It is used to display a header in a page or section. It accepts the following props: user which is an object containing the user name, job title, icons data, contact details, and image details.",
      },
    },
  },
  argTypes: {
    user: {
      description:
        "The user object contains the user's name, job title, icons data, contact details, and image details.",
      control: {
        type: "object",
      },
    },
  },
};

export default meta;

// Función para obtener una imagen aleatoria de rostro desde la API de Unsplash
const fetchFaceImage = async () => {
  try {
    const response = await fetch(
      unsplashUrl("photos/random", { query: "face" })
    );
    const data = await response.json();
    return {
      image: `${data.urls.raw}&w=300&h=300&fit=crop`, // Forzamos el tamaño de la imagen
      alt: data.alt_description || "Face image",
      width: 300,
      height: 300,
    };
  } catch (error) {
    console.error("Error al obtener la imagen de Unsplash:", error instanceof Error ? error.message : error);
    // Retornamos una imagen por defecto en caso de error
    return {
      image: "https://placehold.co/300x300",
      alt: "Placeholder image",
      width: 300,
      height: 300,
    };
  }
};

export const Default: StoryFn = (args) => {
  const [imageDetail, setImageDetail] = useState({
    image: "https://placehold.co/300x300", // Valor inicial placeholder
    alt: "Alt text",
    width: 300,
    height: 300,
  });

  useEffect(() => {
    const loadImage = async () => {
      const fetchedImage = await fetchFaceImage();
      setImageDetail(fetchedImage);
    };
    loadImage();
  }, []);

  return (
    <Header
      user={{
        ...args.user,
        imageDetail: imageDetail, // Actualizamos el detalle de la imagen dinámicamente
      }}
    />
  );
};

export const SourceCode: StoryFn = () => (
  <>
    <Code directoryPath="src/stories/components/organisms/Header/" />
  </>
);

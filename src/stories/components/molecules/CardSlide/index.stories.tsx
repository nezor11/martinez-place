import { unsplashUrl } from "@/stories/utils/unsplash";
import { Code } from "@/stories/components/system/Code";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";
import { CardSlide } from ".";

const meta: Meta<typeof CardSlide> = {
  title: "Design System/Molecules/Card Slide",
  component: CardSlide,
  parameters: {
    docs: {
      description: {
        component: "",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    year: {
      control: "text",
      description: "The year of the project.",
      table: {
        category: "Content",
      },
    },
    title: {
      control: "text",
      description: "The title of the project.",
      table: {
        category: "Content",
      },
    },
    summary: {
      control: "text",
      description: "The summary of the project.",
      table: {
        category: "Content",
      },
    },
    cardImage: {
      control: "text",
      description: "The image of the project.",
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
    iconsData: {
      control: "object",
      description: "The icons data of the project.",
      table: {
        category: "Content",
      },
    },
    workDone: {
      control: "object",
      description: "The work done in the project.",
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
    company: {
      control: "text",
      description: "The name of the company.",
      table: {
        category: "Content",
      },
    },
    link: {
      control: "object",
      description: "The link of the project.",
      table: {
        category: "Content",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

// Función para obtener imágenes de Unsplash con un tema específico
const fetchCardImage = async () => {
  try {
    const response = await fetch(
      unsplashUrl("photos/random", { query: "river" })
    );

    // Verificar si la respuesta es correcta (código de estado 200)
    if (!response.ok) {
      throw new Error(`Error de red: ${response.status}`);
    }

    // Parsear la respuesta solo si es un JSON válido
    const data = await response.json();
    return `${data.urls.raw}&w=300&h=350&fit=crop`;
  } catch (error) {
    console.error("Error al obtener la imagen de Unsplash:", error);
    // Devuelve una URL por defecto si ocurre un error
    return "https://placehold.co/300x350?text=Card+Slide";
  }
};

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
        src: `${img.urls.raw}&w=800&h=1200&fit=crop`,
        width: 1200,
        height: 800,
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
    year: "2021",
    title: "Fistro quietooor diodenoo",
    summary: "A gramenawer a peich a gramenawer pecador",
    description:
      "<p>Lorem fistrum mamaar no te digo trigo por no llamarte Rodrigor...</p>",
    iconsData: [
      { name: "CSS3Icon", width: "1em", height: "1em" },
      { name: "ViteIcon", width: "1em", height: "1em" },
      { name: "GitBranchIcon", width: "1em", height: "1em" },
    ],
    workDone: [
      "Maecenas sit amet justo sit amet tellus tincidunt efficitur",
      "Nullam nec turpis nec justo aliquam suscipit",
      "Pellentesque habitant morbi tristique sen",
    ],
    workType: "Frontend",
    company: "Company Name",
    link: {
      href: "https://www.youtube.com/watch?v=nAEvmGK5KRs",
      link_text: "Watch on YouTube",
      rel: "",
    },
    images: [], // Inicializa las imágenes vacías
    infoUrl: "https://example.com/project-info",
    cardImageAlt: "Project thumbnail",
    cardImageWidth: 300,
    cardImageHeight: 350,
    backgroundColor: "#f5f5f5",
  },
  render: (args) => {
    const [images, setImages] = useState([]);
    const [cardImage, setCardImage] = useState("");

    useEffect(() => {
      const fetchAndSetCardImage = async () => {
        const fetchedCardImage = await fetchCardImage();
        setCardImage(fetchedCardImage); // Actualiza `cardImage` con la URL de Unsplash
      };

      fetchAndSetCardImage();
    }, []);

    useEffect(() => {
      const fetchAndSetImages = async () => {
        const fetchedImages = await fetchImagesFromUnsplash("nature", 3); // Cambia el query según sea necesario
        setImages(fetchedImages); // Actualiza el estado con las imágenes
      };

      fetchAndSetImages();
    }, []);

    return (
      <CardSlide
        {...args}
        cardImage={cardImage || args.cardImage}
        images={images.length > 0 ? images : args.images}
      />
    );
  },
};

export const withVideo: Story = {
  args: {
    year: "2021",
    title: "Fistro quietooor diodenoo",
    summary: "A gramenawer a peich a gramenawer pecador",
    description:
      "<p>Lorem fistrum mamaar no te digo trigo por no llamarte Rodrigor...</p>",
    iconsData: [
      { name: "CSS3Icon", width: "1em", height: "1em" },
      { name: "ViteIcon", width: "1em", height: "1em" },
      { name: "GitBranchIcon", width: "1em", height: "1em" },
    ],
    workDone: [
      "Maecenas sit amet justo sit amet tellus tincidunt efficitur",
      "Nullam nec turpis nec justo aliquam suscipit",
      "Pellentesque habitant morbi tristique sen",
    ],
    workType: "Frontend",
    company: "Company Name",
    link: {
      href: "https://www.youtube.com/watch?v=nAEvmGK5KRs",
      link_text: "Watch on YouTube",
      rel: "",
    },
    backgroundColor: "#E558E5",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    images: [], // Inicializa las imágenes vacías
    infoUrl: "https://example.com/project-info",
    cardImageAlt: "Project thumbnail",
    cardImageWidth: 300,
    cardImageHeight: 350,
  },
  render: (args) => {
    const [cardImage, setCardImage] = useState("");
    const [images, setImages] = useState([]);

    useEffect(() => {
      const fetchAndSetCardImage = async () => {
        const fetchedCardImage = await fetchCardImage();
        setCardImage(fetchedCardImage); // Actualiza `cardImage` con la URL de Unsplash
      };

      fetchAndSetCardImage();
    }, []);

    useEffect(() => {
      const fetchAndSetImages = async () => {
        const fetchedImages = await fetchImagesFromUnsplash("nature", 3); // Cambia el query según sea necesario
        setImages(fetchedImages); // Actualiza el estado con las imágenes
      };

      fetchAndSetImages();
    }, []);

    return (
      <CardSlide
        {...args}
        cardImage={cardImage || args.cardImage}
        images={images.length > 0 ? images : args.images}
      />
    );
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
      <Code directoryPath="src/stories/components/molecules/CardSlide/" />
    </>
  ),
};

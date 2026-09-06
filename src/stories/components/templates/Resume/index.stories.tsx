import { unsplashUrl } from "@/stories/utils/unsplash";
import type { SlideData } from "@/stories/components/organisms/SliderSection";
import { Code } from "@/stories/components/system/Code";
import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";
import { Resume } from ".";

const meta: Meta<typeof Resume> = {
  title: "Design System/Templates/Resume",
  component: Resume,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

// Función para obtener una altura aleatoria para las imágenes de las cards
const getRandomHeight = () => {
  const heights = [200, 250, 300, 350];
  const randomIndex = Math.floor(Math.random() * heights.length);
  return heights[randomIndex];
};

// Función para obtener la imagen de la tarjeta con dimensiones dinámicas
const fetchCardImage = async () => {
  const height = getRandomHeight();
  try {
    const response = await fetch(
      unsplashUrl("photos/random", { query: "river" })
    );
    if (!response.ok) throw new Error(`Error de red: ${response.status}`);

    const data = await response.json();
    return {
      src: `${data.urls.raw}&w=300&h=${height}&fit=crop`,
      height,
    };
  } catch (error) {
    console.error("Error al obtener la imagen de Unsplash:", error);
    return {
      src: "https://placehold.co/300x350?text=Card+Slide",
      height: 300,
    };
  }
};

// Función para obtener un array de imágenes desde Unsplash
const fetchImagesFromUnsplash = async (query: string, count = 3) => {
  try {
    const response = await fetch(
      unsplashUrl("photos/random", { query, count })
    );
    if (!response.ok) throw new Error("Error al obtener imágenes de Unsplash");

    const data = await response.json();
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

export const Default = () => {
  const [slidesData, setSlidesData] = useState<SlideData[]>([]);

  useEffect(() => {
    const fetchImagesForSlides = async () => {
      const imagesFetched = await fetchImagesFromUnsplash("nature", 3);
      const slides = await Promise.all(
        Array.from({ length: 18 }, async (_, index) => {
          const slideImage = await fetchCardImage();
          return {
            year: `201${index + 1}`,
            title: `Project ${index + 1}`,
            description: "Dynamic project description",
            company: `Company ${index + 1}`,
            imageUrl: slideImage.src,
            cardImageHeight: slideImage.height,
            images: imagesFetched,
            workType: "Frontend",
            iconsData: [
              { name: "ViteIcon", width: "1em", height: "1em" },
              { name: "ReactIcon", width: "1em", height: "1em" },
            ],
          };
        })
      );

      setSlidesData(slides);
    };

    fetchImagesForSlides();
  }, []);

  return (
    <Resume
      resumeItems={[
        {
          type: "infoSection",
          title: "Benemeritaar",
          icons: {
            iconsData: [{ name: "WebPackIcon", width: "1em", height: "1em" }],
          },
          subtitle:
            "Te voy a borrar el cerito diodenoo torpedo por la gloria de mi madre pecador qué dise usteer llevame al sircoo a peich se calle ustée. Pecador pupita diodenoo tiene musho peligro pupita te voy a borrar el cerito no puedor ese que llega diodeno mamaar.",
          sections: [
            {
              info: {
                company: "Quietooor",
                date: "2020 > Current",
                jobTitle: "Gloria de mi madre trainer",
                jobDesc:
                  "Al ataquerl al ataquerl te va a hasé <strong>pupitaa al ataquerl pupita</strong>. Ahorarr ese pedazo de diodenoo te va a hasé pupitaa jarl. Hasta luego Lucas fistro no te digo trigo por no llamarte Rodrigor de la pradera te voy a borrar el cerito amatomaa fistro diodenoo torpedo.",
              },
            },
            {
              info: {
                company: "Diodenoo",
                date: "2020 > Current",
                jobTitle: "Sircoo developer",
                jobDesc:
                  "Quietooor me cago en tus muelas te voy a borrar el cerito ese pedazo de torpedo te voy a borrar el cerito pecador a gramenawer tiene musho peligro apetecan. A wan al ataquerl hasta luego Lucas condemor caballo blanco caballo negroorl.",
              },
            },
          ],
        },
        {
          type: "infoSection",
          title: "Education",
          icons: {
            iconsData: [{ name: "SchoolIcon", width: "1em", height: "1em" }],
          },
          sections: [
            {
              info: {
                company: "Universitat de Barcelona",
                date: "2005 > 2008",
                jobTitle: "Audiovisual Communication Degree",
                jobDesc: "<p>Specialized online training center.</p>",
              },
            },
            {
              info: {
                company: "Universitat Politècnica de València",
                date: "2001 > 2005",
                jobTitle: "First Stage of Audiovisual Communication",
                jobDesc:
                  "<p>Digital graphic design, multimedia creation, interactive communication.</p>",
              },
            },
          ],
        },
        {
          type: "sliderSection",
          title: "Projects",
          icons: {
            iconsData: [{ name: "ViteIcon", width: "1em", height: "1em" }],
          },
          slidesData,
        },
      ]}
    />
  );
};

export const SourceCode: Story = {
  parameters: {
    layout: "fullscreen",
    controls: { disable: true },
    actions: { disable: true },
  },
  render: () => (
    <Code directoryPath="src/stories/components/templates/Resume/" />
  ),
};

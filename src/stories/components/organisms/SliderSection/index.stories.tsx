import type { Meta } from "@storybook/react";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { type SlideData, SliderSection } from ".";

const meta: Meta<typeof SliderSection> = {
  title: "Design System/Organisms/Slider Section",
  component: SliderSection,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "",
      },
    },
  },
  argTypes: {},
};

export default meta;

// Función para obtener una altura aleatoria para las imágenes de las cards
const getRandomHeight = () => {
  const heights = [200, 250, 300, 350]; // Alturas posibles
  const randomIndex = Math.floor(Math.random() * heights.length);
  return heights[randomIndex]; // Devuelve una altura aleatoria
};

// Función para obtener la imagen de la tarjeta (card) con dimensiones dinámicas
const fetchCardImage = async () => {
  const height = getRandomHeight(); // Altura dinámica para la card

  try {
    const response = await fetch(
      "https://api.unsplash.com/photos/random?query=river&client_id=KsxUA5_AC79dw6VmBdoRAU6BUCf61iH6MKV4QLej6Wc"
    );

    if (!response.ok) {
      throw new Error(`Error de red: ${response.status}`);
    }

    const data = await response.json();
    return {
      src: `${data.urls.raw}&w=300&h=${height}&fit=crop`, // Aplica la altura dinámica
      height: height, // Retorna la altura para usarla al renderizar la card
    };
  } catch (error) {
    console.error("Error al obtener la imagen de Unsplash:", error);
    return {
      src: "https://placehold.co/300x350?text=Card+Slide", // Imagen por defecto
      height: 300, // Altura por defecto en caso de error
    };
  }
};

// Función para obtener un array de imágenes desde Unsplash
const fetchImagesFromUnsplash = async (query: string, count = 3) => {
  try {
    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=${query}&count=${count}&client_id=KsxUA5_AC79dw6VmBdoRAU6BUCf61iH6MKV4QLej6Wc`
    );
    if (!response.ok) throw new Error("Error al obtener imágenes de Unsplash");

    const data = await response.json();
    return data.map(
      (img: { alt_description: string; urls: { raw: string } }) => ({
        alt: img.alt_description || "Unsplash Image",
        src: `${img.urls.raw}&w=800&h=1200&fit=crop`,
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

export const Default: FC = () => {
  const [slidesData, setSlidesData] = useState<SlideData[]>([]);

  useEffect(() => {
    const fetchImagesForSlides = async () => {
      // Para cada slide, obtenemos una imagen única con una altura dinámica
      const slide1Image = await fetchCardImage();
      const slide2Image = await fetchCardImage();
      const slide3Image = await fetchCardImage();
      const slide4Image = await fetchCardImage();
      const slide5Image = await fetchCardImage();
      const slide6Image = await fetchCardImage();
      const slide7Image = await fetchCardImage();
      const slide8Image = await fetchCardImage();
      const slide9Image = await fetchCardImage();
      const slide10Image = await fetchCardImage();
      const slide11Image = await fetchCardImage();
      const slide12Image = await fetchCardImage();
      const slide13Image = await fetchCardImage();
      const slide14Image = await fetchCardImage();
      const slide15Image = await fetchCardImage();
      const slide16Image = await fetchCardImage();

      const imagesFetched = await fetchImagesFromUnsplash("nature", 3); // Imágenes para el popup

      // Actualiza el estado con los datos de cada slide y las imágenes obtenidas
      setSlidesData([
        {
          year: "2018",
          title: "Web Design Project",
          description: "A modern and responsive website design",
          iconsData: [
            { name: "ViteIcon", width: "1em", height: "1em" },
            { name: "ReactIcon", width: "1em", height: "1em" },
          ],
          company: "DesignCo",
          summary: "Cutting-edge web design for a tech startup",
          workDone: [
            "UI/UX design",
            "Responsive layout implementation",
            "Performance optimization",
          ],
          backgroundColor: "red",
          imageUrl: slide1Image.src, // Imagen obtenida de Unsplash
          cardImageHeight: slide1Image.height, // Altura dinámica
          images: imagesFetched, // Array de imágenes para el popup
          workType: "Frontend",
        },
        {
          year: "2019",
          title: "E-commerce Platform",
          description: "Full-stack development of an online store",
          iconsData: [
            { name: "NodeIcon", width: "1em", height: "1em" },
            { name: "PostgreSQLIcon", width: "1em", height: "1em" },
          ],
          company: "ShopTech",
          summary: "Scalable e-commerce solution with advanced features",
          workDone: [
            "Backend API development",
            "Database design",
            "Payment gateway integration",
          ],
          backgroundColor: "blue",
          imageUrl: slide2Image.src, // Imagen obtenida de Unsplash
          cardImageHeight: slide2Image.height, // Altura dinámica
          images: imagesFetched, // Array de imágenes para el popup
          workType: "Full Stack",
        },
        {
          year: "2020",
          title: "Mobile App Development",
          description: "Cross-platform app for iOS and Android",
          iconsData: [
            { name: "ReactNativeIcon", width: "1em", height: "1em" },
            { name: "TypeScriptIcon", width: "1em", height: "1em" },
          ],
          company: "MobileInnovate",
          summary: "Feature-rich mobile application for productivity",
          workDone: [
            "Cross-platform development",
            "State management implementation",
            "Native module integration",
          ],
          backgroundColor: "yellow",
          videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          imageUrl: slide3Image.src, // Imagen obtenida de Unsplash
          cardImageHeight: slide3Image.height, // Altura dinámica
          images: imagesFetched, // Array de imágenes para el popup
          workType: "Mobile",
        },
        {
          year: "2021",
          title: "AI Chatbot",
          description: "Development of an AI-powered customer service chatbot",
          iconsData: [
            { name: "PythonIcon", width: "1em", height: "1em" },
            { name: "TensorFlowIcon", width: "1em", height: "1em" },
          ],
          company: "ChatBot Inc.",
          summary: "Intelligent chatbot for customer support",
          workDone: [
            "Natural language processing",
            "Machine learning model training",
            "Integration with customer service platform",
          ],
          backgroundColor: "green",
          imageUrl: slide4Image.src, // Imagen obtenida de Unsplash
          cardImageHeight: slide4Image.height, // Altura dinámica
          images: imagesFetched, // Array de imágenes para el popup
          workType: "AI",
        },
        {
          year: "2022",
          title: "Blockchain Solution",
          description: "Development of a decentralized blockchain application",
          iconsData: [
            { name: "EthereumIcon", width: "1em", height: "1em" },
            { name: "SolidityIcon", width: "1em", height: "1em" },
          ],
          company: "BlockChain Co.",
          summary: "Secure and transparent blockchain solution",
          workDone: [
            "Smart contract development",
            "Blockchain integration",
            "Security audits",
          ],
          backgroundColor: "purple",
          imageUrl: slide5Image.src, // Imagen obtenida de Unsplash
          cardImageHeight: slide5Image.height, // Altura dinámica
          images: imagesFetched, // Array de imágenes para el popup
          workType: "Blockchain",
        },
        {
          year: "2023",
          title: "E-commerce Platform",
          description: "Development of a scalable e-commerce platform",
          iconsData: [
            { name: "ReactIcon", width: "1em", height: "1em" },
            { name: "NodeJSIcon", width: "1em", height: "1em" },
          ],
          company: "E-Shop Inc.",
          summary: "A robust and scalable e-commerce solution",
          workDone: [
            "Frontend development",
            "Backend development",
            "Payment gateway integration",
          ],
          backgroundColor: "blue",
          imageUrl: slide6Image.src, // Imagen obtenida de Unsplash
          cardImageHeight: slide6Image.height, // Altura dinámica
          images: imagesFetched, // Array de imágenes para el popup
          workType: "E-commerce",
        },
        {
          year: "2024",
          title: "IoT Home Automation",
          description: "Development of an IoT-based home automation system",
          iconsData: [
            { name: "IoTIcon", width: "1em", height: "1em" },
            { name: "ArduinoIcon", width: "1em", height: "1em" },
          ],
          company: "SmartHome Inc.",
          summary: "Automated home control and monitoring system",
          workDone: [
            "Sensor integration",
            "Mobile app development",
            "Cloud connectivity",
          ],
          backgroundColor: "orange",
          imageUrl: slide7Image.src, // Imagen obtenida de Unsplash
          cardImageHeight: slide7Image.height, // Altura dinámica
          images: imagesFetched, // Array de imágenes para el popup
          workType: "IoT",
        },
        {
          year: "2025",
          title: "Cybersecurity Solution",
          description: "Development of a comprehensive cybersecurity solution",
          iconsData: [
            { name: "SecurityIcon", width: "1em", height: "1em" },
            { name: "FirewallIcon", width: "1em", height: "1em" },
          ],
          company: "SecureTech",
          summary: "Advanced cybersecurity measures for enterprises",
          workDone: [
            "Threat detection",
            "Vulnerability assessment",
            "Incident response",
          ],
          backgroundColor: "red",
          imageUrl: slide8Image.src, // Imagen obtenida de Unsplash
          cardImageHeight: slide8Image.height, // Altura dinámica
          images: imagesFetched, // Array de imágenes para el popup
          workType: "Cybersecurity",
        },
        {
          year: "2026",
          title: "AI-Powered Analytics",
          description: "Development of an AI-powered analytics platform",
          iconsData: [
            { name: "AIIcon", width: "1em", height: "1em" },
            { name: "AnalyticsIcon", width: "1em", height: "1em" },
          ],
          company: "DataInsights",
          summary: "Advanced analytics using AI and machine learning",
          workDone: [
            "Data collection",
            "Model training",
            "Dashboard development",
          ],
          backgroundColor: "purple",
          imageUrl: slide9Image.src, // Imagen obtenida de Unsplash
          cardImageHeight: slide9Image.height, // Altura dinámica
          images: imagesFetched, // Array de imágenes para el popup
          workType: "Analytics",
        },
        {
          year: "2027",
          title: "Blockchain Payment System",
          description: "Development of a blockchain-based payment system",
          iconsData: [
            { name: "BlockchainIcon", width: "1em", height: "1em" },
            { name: "PaymentIcon", width: "1em", height: "1em" },
          ],
          company: "CryptoPay",
          summary: "Secure and efficient blockchain payment solutions",
          workDone: [
            "Smart contract development",
            "Wallet integration",
            "Transaction security",
          ],
          backgroundColor: "green",
          imageUrl: slide10Image.src, // Imagen obtenida de Unsplash
          cardImageHeight: slide10Image.height, // Altura dinámica
          images: imagesFetched, // Array de imágenes para el popup
          workType: "Blockchain",
        },
        {
          year: "2028",
          title: "Augmented Reality App",
          description: "Development of an augmented reality mobile application",
          iconsData: [
            { name: "ARIcon", width: "1em", height: "1em" },
            { name: "MobileAppIcon", width: "1em", height: "1em" },
          ],
          company: "ARVision",
          summary: "Immersive augmented reality experiences",
          workDone: ["3D modeling", "AR integration", "User experience design"],
          backgroundColor: "yellow",
          imageUrl: slide11Image.src, // Imagen obtenida de Unsplash
          cardImageHeight: slide11Image.height, // Altura dinámica
          images: imagesFetched, // Array de imágenes para el popup
          workType: "Augmented Reality",
        },
        {
          year: "2029",
          title: "AI Chatbot",
          description: "Development of an AI-powered customer service chatbot",
          iconsData: [
            { name: "AIIcon", width: "1em", height: "1em" },
            { name: "ChatbotIcon", width: "1em", height: "1em" },
          ],
          company: "ChatAI",
          summary: "Intelligent and responsive customer service solutions",
          workDone: [
            "Natural language processing",
            "Machine learning integration",
            "User interaction design",
          ],
          backgroundColor: "orange",
          imageUrl: slide12Image.src, // Imagen obtenida de Unsplash
          cardImageHeight: slide12Image.height, // Altura dinámica
          images: imagesFetched, // Array de imágenes para el popup
          workType: "AI",
        },
        {
          year: "2030",
          title: "Virtual Reality Game",
          description: "Development of an immersive virtual reality game",
          iconsData: [
            { name: "VRIcon", width: "1em", height: "1em" },
            { name: "GameIcon", width: "1em", height: "1em" },
          ],
          company: "VRGames",
          summary: "Cutting-edge virtual reality gaming experiences",
          workDone: [
            "3D game development",
            "VR integration",
            "Gameplay design",
          ],
          backgroundColor: "pink",
          imageUrl: slide13Image.src, // Imagen obtenida de Unsplash
          cardImageHeight: slide13Image.height, // Altura dinámica
          images: imagesFetched, // Array de imágenes para el popup
          workType: "Virtual Reality",
        },
        {
          year: "2031",
          title: "IoT Smart Home System",
          description: "Development of an IoT-based smart home system",
          iconsData: [
            { name: "IoTIcon", width: "1em", height: "1em" },
            { name: "SmartHomeIcon", width: "1em", height: "1em" },
          ],
          company: "SmartHomeTech",
          summary: "Innovative and connected smart home solutions",
          workDone: [
            "Device integration",
            "Home automation",
            "Security system development",
          ],
          backgroundColor: "cyan",
          imageUrl: slide14Image.src, // Imagen obtenida de Unsplash
          cardImageHeight: slide14Image.height, // Altura dinámica
          images: imagesFetched, // Array de imágenes para el popup
          workType: "IoT",
        },
        {
          year: "2032",
          title: "Healthcare Management System",
          description:
            "Development of a comprehensive healthcare management system",
          iconsData: [
            { name: "HealthcareIcon", width: "1em", height: "1em" },
            { name: "ManagementIcon", width: "1em", height: "1em" },
          ],
          company: "HealthTech",
          summary: "Efficient and secure healthcare management solutions",
          workDone: [
            "Patient data management",
            "Appointment scheduling",
            "Telemedicine integration",
          ],
          backgroundColor: "teal",
          imageUrl: slide15Image.src, // Imagen obtenida de Unsplash
          cardImageHeight: slide15Image.height, // Altura dinámica
          images: imagesFetched, // Array de imágenes para el popup
          workType: "Healthcare",
        },
        {
          year: "2033",
          title: "E-learning Platform",
          description: "Development of an interactive e-learning platform",
          iconsData: [
            { name: "ELearningIcon", width: "1em", height: "1em" },
            { name: "EducationIcon", width: "1em", height: "1em" },
          ],
          company: "EduTech",
          summary: "Engaging and effective online learning experiences",
          workDone: [
            "Course content creation",
            "Interactive modules",
            "User progress tracking",
          ],
          backgroundColor: "purple",
          imageUrl: slide16Image.src, // Imagen obtenida de Unsplash
          cardImageHeight: slide16Image.height, // Altura dinámica
          images: imagesFetched, // Array de imágenes para el popup
          workType: "E-learning",
        },
      ]);
    };

    fetchImagesForSlides();
  }, []);

  return (
    <SliderSection
      title="Projects"
      icons={{
        iconsData: [{ name: "ReactIcon", width: "1em", height: "1em" }],
      }}
      slidesData={slidesData} // Pasamos los datos de los slides al componente SliderSection
    />
  );
};

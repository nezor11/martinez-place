import { Code } from "@/stories/components/system/Code";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { InfoSection } from ".";

const meta: Meta<typeof InfoSection> = {
  title: "Design System/Organisms/Info Section",
  component: InfoSection,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "InfoSection is a component that renders a section with a title, subtitle, icons, and sections. It is used to display a section in a page or section. It accepts the following props: title, subtitle, icons, and sections.",
      },
    },
  },
  argTypes: {
    title: {
      control: "text",
      description:
        "The title of the section. By default, it is set to Benemeritaar.",
      default: "Benemeritaar",
    },
    subtitle: {
      control: "text",
      description:
        "The subtitle of the section. By default, it is set to empty string.",
      default: "Benemeritaar",
    },
    icons: {
      control: "object",
      description:
        "The icons property is optional and can be an object with iconsData. By default, it is set to an empty object.",
      defaultValue: {},
    },
    sections: {
      control: "object",
      description:
        "The sections property is optional and can be an array of objects with info. By default, it is set to an empty array.",
      defaultValue: [],
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const WithSubtitle: Story = {
  args: {
    title: "Benemeritaar",
    subtitle:
      "Te voy a borrar el cerito diodenoo torpedo por la gloria de mi madre pecador qué dise usteer llevame al sircoo a peich se calle ustée. Pecador pupita diodenoo tiene musho peligro pupita te voy a borrar el cerito no puedor ese que llega diodeno mamaar.",
    icons: {
      iconsData: [{ name: "ReactIcon", width: "25px", height: "25px" }],
    },
    sections: [
      {
        info: {
          company: "",
          date: "",
          jobTitle: "",
          jobDesc:
            "Al ataquerl al ataquerl te va a hasé pupitaa al ataquerl pupita. Ahorarr ese pedazo de diodenoo te va a hasé pupitaa jarl. Hasta luego Lucas fistro no te digo trigo por no llamarte Rodrigor de la pradera te voy a borrar el cerito amatomaa fistro diodenoo torpedo. Por la gloria de mi madre me cago en tus muelas a peich te voy a borrar el cerito. Quietooor se calle ustée pupita jarl ahorarr me cago en tus muelas.",
        },
      },
      {
        info: {
          company: "",
          date: "",
          jobTitle: "Sircoo  developer",
          jobDesc:
            "Quietooor me cago en tus muelas te voy a borrar el cerito ese pedazo de torpedo te voy a borrar el cerito pecador a gramenawer tiene musho peligro apetecan. A wan al ataquerl hasta luego Lucas condemor caballo blanco caballo negroorl mamaar ese pedazo de. Quietooor qué dise usteer al ataquerl qué dise usteer. De la pradera está la cosa muy malar de la pradera apetecan hasta luego Lucas sexuarl quietooor jarl. A gramenawer la caidita caballo blanco caballo negroorl la caidita te va a hasé pupitaa de la pradera por la gloria de mi madre.",
        },
      },
      {
        info: {
          company: "",
          date: "",
          jobTitle: "",
          jobDesc:
            "Lorem fistrum a wan ese hombree te va a hasé pupitaa jarl ese que llega benemeritaar por la gloria de mi madre caballo blanco caballo negroorl apetecan. Ese pedazo de la caidita diodeno amatomaa a gramenawer tiene musho peligro torpedo. Tiene musho peligro qué dise usteer a gramenawer a gramenawer de la pradera.",
        },
      },
    ],
  },
};

export const WithNoSubtitle: Story = {
  args: {
    title: "Benemeritaar",
    icons: {
      iconsData: [{ name: "NuxtIcon", width: "25px", height: "25px" }],
    },
    sections: [
      {
        info: {
          company: "Quietooor",
          infoUrl: "https://www.google.com",
          date: "2020 > Current",
          jobTitle: "Gloria de mi madre trainner",
          jobDesc:
            "Al ataquerl al ataquerl te va a hasé pupitaa al ataquerl pupita. Ahorarr ese pedazo de diodenoo te va a hasé pupitaa jarl. Hasta luego Lucas fistro no te digo trigo por no llamarte Rodrigor de la pradera te voy a borrar el cerito amatomaa fistro diodenoo torpedo. Por la gloria de mi madre me cago en tus muelas a peich te voy a borrar el cerito. Quietooor se calle ustée pupita jarl ahorarr me cago en tus muelas.",
        },
      },
      {
        info: {
          company: "Diodenoo",
          date: "2020 > Current",
          jobTitle: "Sircoo  developer",
          jobDesc:
            "Quietooor me cago en tus muelas te voy a borrar el cerito ese pedazo de torpedo te voy a borrar el cerito pecador a gramenawer tiene musho peligro apetecan. A wan al ataquerl hasta luego Lucas condemor caballo blanco caballo negroorl mamaar ese pedazo de. Quietooor qué dise usteer al ataquerl qué dise usteer. De la pradera está la cosa muy malar de la pradera apetecan hasta luego Lucas sexuarl quietooor jarl. A gramenawer la caidita caballo blanco caballo negroorl la caidita te va a hasé pupitaa de la pradera por la gloria de mi madre.",
        },
      },
      {
        info: {
          company: "",
          date: "",
          jobTitle: "",
          jobDesc:
            "Lorem fistrum a wan ese hombree te va a hasé pupitaa jarl ese que llega benemeritaar por la gloria de mi madre caballo blanco caballo negroorl apetecan. Ese pedazo de la caidita diodeno amatomaa a gramenawer tiene musho peligro torpedo. Tiene musho peligro qué dise usteer a gramenawer a gramenawer de la pradera.",
        },
      },
    ],
  },
};

export const WithSubtitleAndCompany: Story = {
  args: {
    title: "Musho peligro",
    subtitle:
      "Te voy a borrar el cerito diodenoo torpedo por la gloria de mi madre pecador qué dise usteer llevame al sircoo a peich se calle ustée. Pecador pupita diodenoo tiene musho peligro pupita te voy a borrar el cerito no puedor ese que llega diodeno mamaar.",
    icons: {
      iconsData: [{ name: "JavaScriptIcon", width: "25px", height: "25px" }],
    },
    sections: [
      {
        info: {
          company: "Condemor",
          date: "2020 > Current",
          jobTitle: "",
          jobDesc:
            "Amatomaa condemor sexuarl a gramenawer tiene musho peligro ahorarr se calle ustée quietooor te va a hasé pupitaa torpedo por la gloria de mi madre. Hasta luego Lucas se calle ustée va usté muy cargadoo tiene musho peligro apetecan quietooor condemor por la gloria de mi madre a wan condemor.",
        },
      },
      {
        info: {
          company: "Caballo blanco",
          date: "2020 > Current",
          jobTitle: "Sircoo  developer",
          jobDesc:
            "Quietooor me cago en tus muelas te voy a borrar el cerito ese pedazo de torpedo te voy a borrar el cerito pecador a gramenawer tiene musho peligro apetecan. A wan al ataquerl hasta luego Lucas condemor caballo blanco caballo negroorl mamaar ese pedazo de. Quietooor qué dise usteer al ataquerl qué dise usteer. De la pradera está la cosa muy malar de la pradera apetecan hasta luego Lucas sexuarl quietooor jarl. A gramenawer la caidita caballo blanco caballo negroorl la caidita te va a hasé pupitaa de la pradera por la gloria de mi madre.",
        },
      },
      {
        info: {
          company: "Mamaar",
          date: "",
          jobTitle: "Fistro caballo blanco",
          jobDesc:
            "Va usté muy cargadoo al ataquerl no puedor pecador. Por la gloria de mi madre mamaar fistro caballo blanco caballo negroorl no te digo trigo por no llamarte Rodrigor no puedor papaar papaar condemor. A gramenawer va usté muy cargadoo apetecan se calle ustée.",
        },
      },
      {
        info: {
          company: "",
          date: "",
          jobTitle: "",
          jobDesc:
            "Lorem fistrum a wan ese hombree te va a hasé pupitaa jarl ese que llega benemeritaar por la gloria de mi madre caballo blanco caballo negroorl apetecan. Ese pedazo de la caidita diodeno amatomaa a gramenawer tiene musho peligro torpedo. Tiene musho peligro qué dise usteer a gramenawer a gramenawer de la pradera.",
        },
      },
    ],
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
      <Code directoryPath="src/stories/components/organisms/InfoSection/" />
    </>
  ),
};

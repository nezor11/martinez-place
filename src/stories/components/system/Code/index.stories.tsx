// index.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Code } from "."; // Importa tu componente Code desde su archivo correspondiente

const meta: Meta = {
  title: "Source Code/Code", // Define el título de tu historia
  component: Code, // Especifica el componente asociado a esta historia
  parameters: {
    controls: { expanded: false },
  },
};

export default meta;

// Crea una "plantilla" de cómo se mapean los argumentos a la renderización (de SB)
type Story = StoryObj<typeof Code>;

// Define los argumentos por defecto, si es necesario
export const Default: Story = {
  parameters: {
    layout: "fullscreen",
    controls: {
      disable: true,
    },
    actions: {
      disable: true,
    },
    options: {
      panelPosition: "right",
    },
  },
  render: () => (
    <>
      <Code directoryPath="src/stories/components/system/Code/" />
    </>
  ),
};

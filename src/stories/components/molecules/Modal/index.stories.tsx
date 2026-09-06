import ButtonClose from "@/stories/components/atoms/ButtonClose";
import { Code } from "@/stories/components/system/Code";
import type { Meta, StoryObj } from "@storybook/react";
import { Modal } from ".";

const meta: Meta<typeof Modal> = {
  title: "Design System/Molecules/Modal",
  component: Modal,
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
      "Maecenas sit amet justo sit amet tellus tincidunt efficitur.",
      "Nullam nec turpis nec justo aliquam suscipit.",
      "Pellentesque habitant morbi tristique sen",
    ],
    ButtonCloseComponent: ({ onClick }) => <ButtonClose onClick={onClick} />,
  },
  render: (args) => <Modal {...args} />,
};

export const Video: Story = {
  args: {
    title: "Modal Title",
    videoUrl: "https://www.youtube.com/watch?v=nAEvmGK5KRs",
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
      "Maecenas sit amet justo sit amet tellus tincidunt efficitur.",
      "Nullam nec turpis nec justo aliquam suscipit.",
      "Pellentesque habitant morbi tristique sen",
    ],
    ButtonCloseComponent: ({ onClick }) => <ButtonClose onClick={onClick} />,
  },
  render: (args) => <Modal {...args} />,
};

export const Slider: Story = {
  args: {
    title: "Modal Title",
    images: [
      {
        src: "https://source.unsplash.com/random/600x400/?web-design",
        width: 600,
        height: 400,
      },
      {
        src: "https://source.unsplash.com/random/600x400/?web-development",
        width: 600,
        height: 400,
      },
      {
        src: "https://source.unsplash.com/random/600x400/?programming",
        width: 600,
        height: 400,
      },
      {
        src: "https://source.unsplash.com/random/600x400/?car",
        width: 600,
        height: 400,
      },
    ],
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
      "Maecenas sit amet justo sit amet tellus tincidunt efficitur.",
      "Nullam nec turpis nec justo aliquam suscipit.",
      "Pellentesque habitant morbi tristique sen",
    ],
    ButtonCloseComponent: ({ onClick }) => <ButtonClose onClick={onClick} />,
  },
  render: (args) => <Modal {...args} />,
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
      <Code directoryPath="src/stories/components/molecules/Modal/" />
    </>
  ),
};

import { Code } from "@/stories/components/system/Code";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { PortfolioFilter, type TechCount } from ".";

const meta: Meta<typeof PortfolioFilter> = {
  title: "Design System/Molecules/Portfolio Filter",
  component: PortfolioFilter,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Technology buttons, a magnifier that unfolds the text search and the live count. The owner keeps the state; this story wires it up locally.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const techs: TechCount[] = [
  { name: "WordpressIcon", count: 13 },
  { name: "JavaScriptIcon", count: 12 },
  { name: "HTML5Icon", count: 11 },
  { name: "CSS3Icon", count: 11 },
  { name: "ReactIcon", count: 3 },
  { name: "VueIcon", count: 3 },
  { name: "NuxtIcon", count: 2 },
  { name: "NextJSIcon", count: 1 },
];

const Playground = (props: Partial<React.ComponentProps<typeof PortfolioFilter>>) => {
  const [query, setQuery] = useState(props.query ?? "");
  const [searchOpen, setSearchOpen] = useState(props.searchOpen ?? false);
  const active = techs.find((tech) => tech.name.replace(/Icon$/, "").toLowerCase() === query.toLowerCase())?.name;
  return (
    <PortfolioFilter
      techs={techs.map((tech) => ({ ...tech, dimmed: Boolean(query) && tech.name !== active }))}
      activeIcon={active}
      onIconClick={(name) => {
        const label = name.replace(/Icon$/, "");
        setQuery((current) => (current === label ? "" : label));
      }}
      query={query}
      onQueryChange={setQuery}
      searchOpen={searchOpen}
      onSearchToggle={setSearchOpen}
      matchCount={active ? (techs.find((t) => t.name === active)?.count ?? 0) : 34}
      total={34}
    />
  );
};

export const Default: Story = {
  render: () => <Playground />,
};

export const SearchOpen: Story = {
  render: () => <Playground searchOpen query="Vue" />,
};

export const SourceCode: Story = {
  parameters: {
    layout: "fullscreen",
    controls: { disable: true },
    actions: { disable: true },
  },
  render: () => (
    <Code directoryPath="src/stories/components/molecules/PortfolioFilter/" />
  ),
};

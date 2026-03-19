import type { Meta, StoryObj } from "@storybook/react-vite";
import { FilterBar } from "./filter-bar";

const filters = [
  { label: "Design", value: "design", icon: "palette" },
  { label: "Development", value: "dev", icon: "code" },
  { label: "Marketing", value: "marketing", icon: "campaign" },
  { label: "Sales", value: "sales", icon: "trending_up" },
  { label: "Support", value: "support", icon: "support_agent" },
];

const meta = {
  title: "Forms/FilterBar",
  component: FilterBar,
  tags: ["autodocs"],
  argTypes: {
    showClearAll: { control: "boolean" },
  },
  args: {
    filters,
  },
} satisfies Meta<typeof FilterBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithActiveFilters: Story = {
  args: { defaultActiveValues: ["design", "dev"] },
};

export const NoClearAll: Story = {
  args: { defaultActiveValues: ["marketing"], showClearAll: false },
};

export const WithoutIcons: Story = {
  args: {
    filters: [
      { label: "All", value: "all" },
      { label: "Active", value: "active" },
      { label: "Archived", value: "archived" },
      { label: "Draft", value: "draft" },
    ],
    defaultActiveValues: ["active"],
  },
};

export const ManyFilters: Story = {
  args: {
    filters: [
      { label: "React", value: "react" },
      { label: "Vue", value: "vue" },
      { label: "Angular", value: "angular" },
      { label: "Svelte", value: "svelte" },
      { label: "Solid", value: "solid" },
      { label: "Qwik", value: "qwik" },
      { label: "Astro", value: "astro" },
      { label: "Next.js", value: "nextjs" },
    ],
  },
};

import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MultiSelect } from "./multi-select";

const frameworkOptions = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
  { value: "svelte", label: "Svelte" },
  { value: "solid", label: "SolidJS" },
  { value: "next", label: "Next.js" },
  { value: "nuxt", label: "Nuxt" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
  { value: "qwik", label: "Qwik" },
];

const meta = {
  title: "Forms/MultiSelect",
  component: MultiSelect,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    searchable: { control: "boolean" },
    clearable: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    options: frameworkOptions,
    placeholder: "Select frameworks...",
  },
} satisfies Meta<typeof MultiSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLabel: Story = {
  args: {
    label: "Frontend Frameworks",
  },
};

export const WithPreselected: Story = {
  args: {
    label: "Frameworks",
    defaultValue: ["react", "vue", "next"],
  },
};

export const WithMaxSelections: Story = {
  args: {
    label: "Pick up to 3",
    maxSelections: 3,
    defaultValue: ["react"],
  },
};

export const WithError: Story = {
  args: {
    label: "Required Field",
    error: "Please select at least one framework",
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled",
    disabled: true,
    defaultValue: ["react", "vue"],
  },
};

export const NotSearchable: Story = {
  args: {
    label: "Click to select",
    searchable: false,
  },
};

export const NoClearButton: Story = {
  args: {
    label: "No clear all",
    clearable: false,
    defaultValue: ["react"],
  },
};

export const SmallSize: Story = {
  args: {
    label: "Small",
    size: "sm",
    defaultValue: ["react", "vue"],
  },
};

export const LargeSize: Story = {
  args: {
    label: "Large",
    size: "lg",
    defaultValue: ["react"],
  },
};

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState(["react", "svelte"]);
    return (
      <div className="flex flex-col gap-4 max-w-md">
        <MultiSelect
          {...args}
          label="Controlled"
          value={value}
          onChange={setValue}
        />
        <p className="text-xs text-slate-500">
          Selected: {value.join(", ") || "none"}
        </p>
      </div>
    );
  },
};

export const WithDisabledOptions: Story = {
  args: {
    label: "Some disabled",
    options: [
      { value: "react", label: "React" },
      { value: "vue", label: "Vue", disabled: true },
      { value: "angular", label: "Angular" },
      { value: "svelte", label: "Svelte", disabled: true },
      { value: "solid", label: "SolidJS" },
    ],
  },
};

export const Gallery: Story = {
  render: (args) => (
    <div className="flex flex-col gap-8 max-w-md">
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Default</p>
        <MultiSelect {...args} />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase mb-2">With selections</p>
        <MultiSelect {...args} defaultValue={["react", "vue", "next"]} />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Max 2 selections</p>
        <MultiSelect {...args} maxSelections={2} defaultValue={["react"]} />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase mb-2">With error</p>
        <MultiSelect {...args} error="At least one is required" />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Disabled</p>
        <MultiSelect {...args} disabled defaultValue={["react", "svelte"]} />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Small</p>
        <MultiSelect {...args} size="sm" defaultValue={["angular"]} />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Large</p>
        <MultiSelect {...args} size="lg" defaultValue={["solid"]} />
      </div>
    </div>
  ),
};

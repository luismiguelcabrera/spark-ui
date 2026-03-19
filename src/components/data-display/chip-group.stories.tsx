import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChipGroup, useChipGroup } from "./chip-group";

/* -------------------------------------------------------------------------- */
/*  Mock Chip for stories (integrates with ChipGroup context)                  */
/* -------------------------------------------------------------------------- */

function StoryChip({ value, children }: { value: string; children: string }) {
  const ctx = useChipGroup();
  const isSelected = ctx?.selected.includes(value) ?? false;

  return (
    <button
      type="button"
      onClick={() => ctx?.toggle(value)}
      className={`inline-flex items-center h-7 px-2.5 text-xs font-medium rounded-lg transition-colors ${
        isSelected
          ? "bg-primary/10 text-primary ring-1 ring-primary/30"
          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
      }`}
    >
      {children}
    </button>
  );
}

const meta = {
  title: "Data Display/ChipGroup",
  component: ChipGroup,
  tags: ["autodocs"],
  argTypes: {
    multiple: { control: "boolean" },
    mandatory: { control: "boolean" },
    color: {
      control: "select",
      options: [
        "default",
        "primary",
        "secondary",
        "success",
        "warning",
        "destructive",
      ],
    },
  },
} satisfies Meta<typeof ChipGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: null,
  },
  render: (args) => (
    <ChipGroup {...args} defaultValue="react">
      <StoryChip value="react">React</StoryChip>
      <StoryChip value="vue">Vue</StoryChip>
      <StoryChip value="angular">Angular</StoryChip>
      <StoryChip value="svelte">Svelte</StoryChip>
    </ChipGroup>
  ),
};

export const Multiple: Story = {
  args: { multiple: true, children: null },
  render: (args) => (
    <ChipGroup {...args} defaultValue={["react", "svelte"]}>
      <StoryChip value="react">React</StoryChip>
      <StoryChip value="vue">Vue</StoryChip>
      <StoryChip value="angular">Angular</StoryChip>
      <StoryChip value="svelte">Svelte</StoryChip>
    </ChipGroup>
  ),
};

export const Mandatory: Story = {
  args: { mandatory: true, children: null },
  render: (args) => (
    <ChipGroup {...args} defaultValue="react">
      <StoryChip value="react">React</StoryChip>
      <StoryChip value="vue">Vue</StoryChip>
      <StoryChip value="angular">Angular</StoryChip>
    </ChipGroup>
  ),
};

export const Controlled: Story = {
  args: { children: null },
  render: (args) => {
    const [value, setValue] = useState<string | string[]>("react");
    return (
      <div className="space-y-4">
        <ChipGroup {...args} value={value} onChange={setValue}>
          <StoryChip value="react">React</StoryChip>
          <StoryChip value="vue">Vue</StoryChip>
          <StoryChip value="angular">Angular</StoryChip>
        </ChipGroup>
        <p className="text-sm text-slate-500">
          Selected: <strong>{JSON.stringify(value)}</strong>
        </p>
      </div>
    );
  },
};

export const ControlledMultiple: Story = {
  args: { multiple: true, children: null },
  render: (args) => {
    const [value, setValue] = useState<string | string[]>(["react"]);
    return (
      <div className="space-y-4">
        <ChipGroup {...args} value={value} onChange={setValue}>
          <StoryChip value="react">React</StoryChip>
          <StoryChip value="vue">Vue</StoryChip>
          <StoryChip value="angular">Angular</StoryChip>
          <StoryChip value="svelte">Svelte</StoryChip>
        </ChipGroup>
        <p className="text-sm text-slate-500">
          Selected: <strong>{JSON.stringify(value)}</strong>
        </p>
      </div>
    );
  },
};

export const FilterExample: Story = {
  args: { children: null },
  render: (args) => (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase text-slate-500">Category</p>
      <ChipGroup {...args} multiple defaultValue={["all"]}>
        <StoryChip value="all">All</StoryChip>
        <StoryChip value="design">Design</StoryChip>
        <StoryChip value="dev">Development</StoryChip>
        <StoryChip value="marketing">Marketing</StoryChip>
        <StoryChip value="sales">Sales</StoryChip>
      </ChipGroup>
    </div>
  ),
};

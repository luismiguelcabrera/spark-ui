import type { Meta, StoryObj } from "@storybook/react-vite";
import { Combobox } from "./combobox";

const fruits = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "date", label: "Date" },
  { value: "elderberry", label: "Elderberry" },
  { value: "fig", label: "Fig" },
  { value: "grape", label: "Grape" },
];

const meta = {
  title: "Forms/Combobox",
  component: Combobox,
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
    error: { control: "text" },
    placeholder: { control: "text" },
    searchPlaceholder: { control: "text" },
  },
  args: {
    options: fruits,
  },
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDefaultValue: Story = {
  args: { defaultValue: "cherry" },
};

export const WithPlaceholder: Story = {
  args: { placeholder: "Choose a fruit..." },
};

export const WithError: Story = {
  args: { error: "Please select a fruit" },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "banana" },
};

export const WithDisabledOptions: Story = {
  args: {
    options: [
      { value: "apple", label: "Apple" },
      { value: "banana", label: "Banana", disabled: true },
      { value: "cherry", label: "Cherry" },
      { value: "date", label: "Date", disabled: true },
      { value: "elderberry", label: "Elderberry" },
    ],
  },
};

export const ManyOptions: Story = {
  args: {
    options: Array.from({ length: 50 }, (_, i) => ({
      value: `option-${i + 1}`,
      label: `Option ${i + 1}`,
    })),
    placeholder: "Search 50 options...",
  },
};

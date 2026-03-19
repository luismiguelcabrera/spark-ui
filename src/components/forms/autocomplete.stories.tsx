import type { Meta, StoryObj } from "@storybook/react-vite";
import { Autocomplete } from "./autocomplete";
import type { AutocompleteOption } from "./autocomplete";

const fruits: AutocompleteOption[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "date", label: "Date" },
  { value: "elderberry", label: "Elderberry" },
  { value: "fig", label: "Fig" },
  { value: "grape", label: "Grape" },
];

const meta = {
  title: "Forms/Autocomplete",
  component: Autocomplete,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    disabled: { control: "boolean" },
    error: { control: "text" },
    placeholder: { control: "text" },
    freeSolo: { control: "boolean" },
    filterLocally: { control: "boolean" },
  },
  args: {
    options: fruits,
    placeholder: "Search fruits...",
  },
} satisfies Meta<typeof Autocomplete>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLabel: Story = {
  args: {
    label: "Favorite Fruit",
    placeholder: "Start typing...",
  },
};

export const FreeSolo: Story = {
  args: {
    freeSolo: true,
    placeholder: "Type anything or pick a suggestion...",
    label: "Free text input",
  },
};

export const WithError: Story = {
  args: {
    error: "Please select a valid fruit",
    label: "Fruit",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: "Cannot interact",
    label: "Disabled",
  },
};

export const AsyncSearch: Story = {
  args: {
    options: undefined,
    placeholder: "Search countries...",
    label: "Country (async)",
    onSearch: (query: string) =>
      new Promise<AutocompleteOption[]>((resolve) => {
        setTimeout(() => {
          const countries = [
            { value: "us", label: "United States" },
            { value: "uk", label: "United Kingdom" },
            { value: "ca", label: "Canada" },
            { value: "au", label: "Australia" },
            { value: "de", label: "Germany" },
            { value: "fr", label: "France" },
            { value: "jp", label: "Japan" },
            { value: "br", label: "Brazil" },
          ];
          const q = query.toLowerCase();
          resolve(countries.filter((c) => c.label.toLowerCase().includes(q)));
        }, 800);
      }),
  },
};

export const AllSizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4 max-w-sm">
      <Autocomplete {...args} size="sm" label="Small" placeholder="Size sm" />
      <Autocomplete {...args} size="md" label="Medium" placeholder="Size md" />
      <Autocomplete {...args} size="lg" label="Large" placeholder="Size lg" />
    </div>
  ),
};

export const Empty: Story = {
  args: {
    options: [],
    placeholder: "No options available",
    label: "Empty list",
  },
};

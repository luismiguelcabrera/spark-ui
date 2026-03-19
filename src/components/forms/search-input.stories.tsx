import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SearchInput } from "./search-input";

const meta = {
  title: "Forms/SearchInput",
  component: SearchInput,
  tags: ["autodocs"],
  argTypes: {
    icon: { control: "text" },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { placeholder: "Search..." },
};

export const CustomIcon: Story = {
  args: { placeholder: "Filter items...", icon: "filter_list" },
};

export const Disabled: Story = {
  args: { placeholder: "Search...", disabled: true },
};

export const WithClearButton: Story = {
  render: (args) => {
    const [value, setValue] = useState("React");
    return (
      <div className="max-w-sm">
        <SearchInput
          {...args}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onClear={() => setValue("")}
          placeholder="Search..."
        />
      </div>
    );
  },
};

export const FullWidth: Story = {
  args: { placeholder: "Search the documentation...", className: "w-full max-w-lg" },
};

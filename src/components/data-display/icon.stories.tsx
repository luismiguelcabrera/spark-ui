import type { Meta, StoryObj } from "@storybook/react-vite";
import { Icon } from "./icon";

const meta = {
  title: "Data Display/Icon",
  component: Icon,
  tags: ["autodocs"],
  argTypes: {
    name: { control: "text" },
    size: { control: "select", options: ["sm", "md", "lg", "xl"] },
    filled: { control: "boolean" },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { name: "home" },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-end gap-4">
      <Icon {...args} name="star" size="sm" />
      <Icon {...args} name="star" size="md" />
      <Icon {...args} name="star" size="lg" />
      <Icon {...args} name="star" size="xl" />
    </div>
  ),
};

export const CommonIcons: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-4">
      {[
        "home", "search", "settings", "mail", "bell",
        "user", "heart", "star", "check", "x",
        "plus", "minus", "arrow-left", "arrow-right", "chevron-down",
        "eye", "edit", "trash", "download", "upload",
      ].map((name) => (
        <div key={name} className="flex flex-col items-center gap-2 w-20">
          <Icon {...args} name={name} size="lg" className="text-slate-700" />
          <span className="text-[10px] text-slate-500 text-center">{name}</span>
        </div>
      ))}
    </div>
  ),
};

export const Colors: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <Icon {...args} name="heart" size="lg" className="text-red-500" />
      <Icon {...args} name="check-circle" size="lg" className="text-green-500" />
      <Icon {...args} name="alert-triangle" size="lg" className="text-amber-500" />
      <Icon {...args} name="info" size="lg" className="text-blue-500" />
      <Icon {...args} name="star" size="lg" className="text-purple-500" />
    </div>
  ),
};

export const NavigationIcons: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-4">
      {[
        "arrow-left", "arrow-right", "arrow-up", "arrow-down",
        "chevron-left", "chevron-right", "chevron-up", "chevron-down",
      ].map((name) => (
        <div key={name} className="flex flex-col items-center gap-2 w-24">
          <Icon {...args} name={name} size="lg" className="text-slate-700" />
          <span className="text-[10px] text-slate-500 text-center">{name}</span>
        </div>
      ))}
    </div>
  ),
};

export const ActionIcons: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-4">
      {[
        "edit", "trash", "copy", "download", "upload",
        "share", "bookmark", "filter", "refresh", "external-link",
      ].map((name) => (
        <div key={name} className="flex flex-col items-center gap-2 w-24">
          <Icon {...args} name={name} size="lg" className="text-slate-700" />
          <span className="text-[10px] text-slate-500 text-center">{name}</span>
        </div>
      ))}
    </div>
  ),
};

export const MaterialSymbolsFallback: Story = {
  args: {
    name: "deployed_code",
    size: "xl",
  },
};

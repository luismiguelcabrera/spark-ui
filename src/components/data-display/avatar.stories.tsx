import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "./avatar";

const meta = {
  title: "Data Display/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    ring: { control: "select", options: ["none", "white", "primary"] },
    density: { control: "select", options: ["default", "comfortable", "compact"] },
    icon: { control: "text" },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithInitials: Story = { args: { initials: "JD", size: "lg" } };
export const WithImage: Story = {
  args: { src: "https://i.pravatar.cc/150?u=1", alt: "User", size: "lg" },
};
export const Fallback: Story = { args: { alt: "Alice", size: "lg" } };
export const WithRing: Story = {
  args: { initials: "AB", size: "lg", ring: "primary" },
};

export const WithIcon: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <Avatar {...args} icon="user" size="sm" alt="User avatar" />
      <Avatar {...args} icon="user" size="md" alt="User avatar" />
      <Avatar {...args} icon="user" size="lg" alt="User avatar" />
      <Avatar {...args} icon="user" size="xl" alt="User avatar" />
    </div>
  ),
};

export const Density: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <span className="text-xs text-slate-500 w-24">Default:</span>
        <Avatar {...args} density="default" size="xs" initials="XS" />
        <Avatar {...args} density="default" size="sm" initials="SM" />
        <Avatar {...args} density="default" size="md" initials="MD" />
        <Avatar {...args} density="default" size="lg" initials="LG" />
        <Avatar {...args} density="default" size="xl" initials="XL" />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xs text-slate-500 w-24">Comfortable:</span>
        <Avatar {...args} density="comfortable" size="xs" initials="XS" />
        <Avatar {...args} density="comfortable" size="sm" initials="SM" />
        <Avatar {...args} density="comfortable" size="md" initials="MD" />
        <Avatar {...args} density="comfortable" size="lg" initials="LG" />
        <Avatar {...args} density="comfortable" size="xl" initials="XL" />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xs text-slate-500 w-24">Compact:</span>
        <Avatar {...args} density="compact" size="xs" initials="XS" />
        <Avatar {...args} density="compact" size="sm" initials="SM" />
        <Avatar {...args} density="compact" size="md" initials="MD" />
        <Avatar {...args} density="compact" size="lg" initials="LG" />
        <Avatar {...args} density="compact" size="xl" initials="XL" />
      </div>
    </div>
  ),
};

export const IconWithDensity: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <Avatar {...args} icon="user" density="compact" size="md" alt="User avatar" />
      <Avatar {...args} icon="user" density="default" size="md" alt="User avatar" />
      <Avatar {...args} icon="user" density="comfortable" size="md" alt="User avatar" />
    </div>
  ),
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import { AvatarGroup } from "./avatar-group";
import { Avatar } from "./avatar";

const meta = {
  title: "Data Display/AvatarGroup",
  component: AvatarGroup,
  tags: ["autodocs"],
  argTypes: {
    max: { control: { type: "number", min: 1, max: 10 } },
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    spacing: { control: "select", options: ["tight", "normal", "loose"] },
  },
} satisfies Meta<typeof AvatarGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const avatars = [
  { src: "https://i.pravatar.cc/150?u=1", alt: "Alice" },
  { src: "https://i.pravatar.cc/150?u=2", alt: "Bob" },
  { src: "https://i.pravatar.cc/150?u=3", alt: "Charlie" },
  { src: "https://i.pravatar.cc/150?u=4", alt: "Diana" },
  { src: "https://i.pravatar.cc/150?u=5", alt: "Eve" },
  { src: "https://i.pravatar.cc/150?u=6", alt: "Frank" },
  { src: "https://i.pravatar.cc/150?u=7", alt: "Grace" },
];

export const Default: Story = {
  args: { max: 4 },
  render: (args) => (
    <AvatarGroup {...args}>
      {avatars.map((a) => (
        <Avatar key={a.alt} src={a.src} alt={a.alt} size={args.size} />
      ))}
    </AvatarGroup>
  ),
};

export const MaxThree: Story = {
  args: { max: 3 },
  render: (args) => (
    <AvatarGroup {...args}>
      {avatars.map((a) => (
        <Avatar key={a.alt} src={a.src} alt={a.alt} size={args.size} />
      ))}
    </AvatarGroup>
  ),
};

export const Large: Story = {
  args: { max: 4, size: "lg" },
  render: (args) => (
    <AvatarGroup {...args}>
      {avatars.map((a) => (
        <Avatar key={a.alt} src={a.src} alt={a.alt} size="lg" />
      ))}
    </AvatarGroup>
  ),
};

export const Small: Story = {
  args: { max: 5, size: "sm" },
  render: (args) => (
    <AvatarGroup {...args}>
      {avatars.map((a) => (
        <Avatar key={a.alt} src={a.src} alt={a.alt} size="sm" />
      ))}
    </AvatarGroup>
  ),
};

export const TightSpacing: Story = {
  args: { max: 4, spacing: "tight" },
  render: (args) => (
    <AvatarGroup {...args}>
      {avatars.map((a) => (
        <Avatar key={a.alt} src={a.src} alt={a.alt} size={args.size} />
      ))}
    </AvatarGroup>
  ),
};

export const LooseSpacing: Story = {
  args: { max: 4, spacing: "loose" },
  render: (args) => (
    <AvatarGroup {...args}>
      {avatars.map((a) => (
        <Avatar key={a.alt} src={a.src} alt={a.alt} size={args.size} />
      ))}
    </AvatarGroup>
  ),
};

export const WithInitials: Story = {
  args: { max: 3 },
  render: (args) => (
    <AvatarGroup {...args}>
      <Avatar initials="AB" size={args.size} />
      <Avatar initials="CD" size={args.size} />
      <Avatar initials="EF" size={args.size} />
      <Avatar initials="GH" size={args.size} />
      <Avatar initials="IJ" size={args.size} />
    </AvatarGroup>
  ),
};

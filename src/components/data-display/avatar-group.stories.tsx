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
    shape: { control: "select", options: ["circle", "square", "rounded"] },
    spacing: { control: "select", options: ["tight", "normal", "loose"] },
    borderColor: {
      control: "select",
      options: ["white", "gray", "dark", "none"],
    },
    reversed: { control: "boolean" },
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
  args: { max: 4, size: "md" },
  render: (args) => (
    <AvatarGroup {...args}>
      {avatars.map((a) => (
        <Avatar key={a.alt} src={a.src} alt={a.alt} />
      ))}
    </AvatarGroup>
  ),
};

export const MaxThree: Story = {
  args: { max: 3, size: "md" },
  render: (args) => (
    <AvatarGroup {...args}>
      {avatars.map((a) => (
        <Avatar key={a.alt} src={a.src} alt={a.alt} />
      ))}
    </AvatarGroup>
  ),
};

export const Large: Story = {
  args: { max: 4, size: "lg" },
  render: (args) => (
    <AvatarGroup {...args}>
      {avatars.map((a) => (
        <Avatar key={a.alt} src={a.src} alt={a.alt} />
      ))}
    </AvatarGroup>
  ),
};

export const Small: Story = {
  args: { max: 5, size: "sm" },
  render: (args) => (
    <AvatarGroup {...args}>
      {avatars.map((a) => (
        <Avatar key={a.alt} src={a.src} alt={a.alt} />
      ))}
    </AvatarGroup>
  ),
};

export const TightSpacing: Story = {
  args: { max: 4, spacing: "tight" },
  render: (args) => (
    <AvatarGroup {...args}>
      {avatars.map((a) => (
        <Avatar key={a.alt} src={a.src} alt={a.alt} />
      ))}
    </AvatarGroup>
  ),
};

export const LooseSpacing: Story = {
  args: { max: 4, spacing: "loose" },
  render: (args) => (
    <AvatarGroup {...args}>
      {avatars.map((a) => (
        <Avatar key={a.alt} src={a.src} alt={a.alt} />
      ))}
    </AvatarGroup>
  ),
};

// ------------------------------------------------------------------
// Size propagation — no need to pass size to each Avatar anymore
// ------------------------------------------------------------------
export const WithInitials: Story = {
  args: { max: 3, size: "md", color: "primary" as never },
  render: (args) => (
    <AvatarGroup {...args}>
      <Avatar initials="AB" color="primary" />
      <Avatar initials="CD" color="secondary" />
      <Avatar initials="EF" color="success" />
      <Avatar initials="GH" color="warning" />
      <Avatar initials="IJ" color="accent" />
    </AvatarGroup>
  ),
};

// ------------------------------------------------------------------
// Shape
// ------------------------------------------------------------------
export const SquareAvatars: Story = {
  args: { max: 4, size: "lg", shape: "square" },
  render: (args) => (
    <AvatarGroup {...args}>
      {avatars.map((a) => (
        <Avatar key={a.alt} src={a.src} alt={a.alt} />
      ))}
    </AvatarGroup>
  ),
};

export const RoundedAvatars: Story = {
  args: { max: 4, size: "lg", shape: "rounded" },
  render: (args) => (
    <AvatarGroup {...args}>
      {avatars.map((a) => (
        <Avatar key={a.alt} src={a.src} alt={a.alt} />
      ))}
    </AvatarGroup>
  ),
};

// ------------------------------------------------------------------
// Border color
// ------------------------------------------------------------------
export const DarkBackground: Story = {
  args: { max: 4, size: "lg", borderColor: "dark" },
  render: (args) => (
    <div className="rounded-lg bg-gray-900 p-6">
      <AvatarGroup {...args}>
        <Avatar src="https://i.pravatar.cc/150?u=1" alt="Alice" status="online" />
        <Avatar src="https://i.pravatar.cc/150?u=2" alt="Bob" status="busy" />
        <Avatar src="https://i.pravatar.cc/150?u=3" alt="Charlie" status="away" />
        <Avatar src="https://i.pravatar.cc/150?u=4" alt="Diana" />
        <Avatar src="https://i.pravatar.cc/150?u=5" alt="Eve" />
      </AvatarGroup>
    </div>
  ),
};

export const NoBorder: Story = {
  args: { max: 4, size: "md", borderColor: "none" },
  render: (args) => (
    <AvatarGroup {...args}>
      {avatars.map((a) => (
        <Avatar key={a.alt} src={a.src} alt={a.alt} />
      ))}
    </AvatarGroup>
  ),
};

// ------------------------------------------------------------------
// Reversed stacking
// ------------------------------------------------------------------
export const Reversed: Story = {
  args: { max: 4, size: "lg", reversed: true },
  render: (args) => (
    <AvatarGroup {...args}>
      {avatars.map((a) => (
        <Avatar key={a.alt} src={a.src} alt={a.alt} />
      ))}
    </AvatarGroup>
  ),
};

// ------------------------------------------------------------------
// Custom excess counter
// ------------------------------------------------------------------
export const CustomExcess: Story = {
  args: { max: 3, size: "md" },
  render: (args) => (
    <AvatarGroup
      {...args}
      renderExcess={(n, hidden) => (
        <div
          title={`Hidden: ${hidden.length} avatars`}
          className="relative flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white text-xs font-semibold ring-2 ring-white"
        >
          +{n}
        </div>
      )}
    >
      {avatars.map((a) => (
        <Avatar key={a.alt} src={a.src} alt={a.alt} />
      ))}
    </AvatarGroup>
  ),
};

// ------------------------------------------------------------------
// Clickable excess counter
// ------------------------------------------------------------------
export const ClickableExcess: Story = {
  args: { max: 3, size: "md" },
  render: (args) => (
    <AvatarGroup
      {...args}
      onExcessClick={() => alert("Show all members")}
    >
      {avatars.map((a) => (
        <Avatar key={a.alt} src={a.src} alt={a.alt} />
      ))}
    </AvatarGroup>
  ),
};

// ------------------------------------------------------------------
// Status indicators in a group
// ------------------------------------------------------------------
export const WithStatus: Story = {
  args: { max: 5, size: "lg" },
  render: (args) => (
    <AvatarGroup {...args}>
      <Avatar src="https://i.pravatar.cc/150?u=1" alt="Alice" status="online" />
      <Avatar src="https://i.pravatar.cc/150?u=2" alt="Bob" status="busy" />
      <Avatar src="https://i.pravatar.cc/150?u=3" alt="Charlie" status="away" />
      <Avatar src="https://i.pravatar.cc/150?u=4" alt="Diana" status="offline" />
      <Avatar src="https://i.pravatar.cc/150?u=5" alt="Eve" status="online" />
    </AvatarGroup>
  ),
};

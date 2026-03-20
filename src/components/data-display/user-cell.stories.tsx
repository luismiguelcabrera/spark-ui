import type { Meta, StoryObj } from "@storybook/react-vite";
import { UserCell } from "./user-cell";

const meta = {
  title: "Data Display/UserCell",
  component: UserCell,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    name: { control: "text" },
    subtitle: { control: "text" },
    avatarSrc: { control: "text" },
    avatarInitials: { control: "text" },
  },
} satisfies Meta<typeof UserCell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "Jane Cooper",
    subtitle: "jane@example.com",
    avatarInitials: "JC",
  },
};

export const WithAvatar: Story = {
  args: {
    name: "John Doe",
    subtitle: "Software Engineer",
    avatarSrc: "https://i.pravatar.cc/150?u=john",
  },
};

export const Small: Story = {
  args: {
    name: "Alice Smith",
    subtitle: "Online",
    avatarInitials: "AS",
    size: "sm",
  },
};

export const Medium: Story = {
  args: {
    name: "Bob Johnson",
    subtitle: "Product Manager",
    avatarInitials: "BJ",
    size: "md",
  },
};

export const Large: Story = {
  args: {
    name: "Carol Williams",
    subtitle: "VP of Engineering",
    avatarInitials: "CW",
    size: "lg",
  },
};

export const NoSubtitle: Story = {
  args: {
    name: "Dave Brown",
    avatarInitials: "DB",
  },
};

export const AllSizes: Story = {
  render: (args) => (
    <div className="space-y-4">
      {(["sm", "md", "lg"] as const).map((size) => (
        <div key={size} className="flex items-center gap-4">
          <span className="w-12 text-xs text-muted-foreground">{size}</span>
          <UserCell
            {...args}
            name="Jane Cooper"
            subtitle="jane@example.com"
            avatarInitials="JC"
            size={size}
          />
        </div>
      ))}
    </div>
  ),
};

export const UserList: Story = {
  render: (args) => (
    <div className="max-w-sm border rounded-lg divide-y">
      {[
        { name: "Alice Martin", subtitle: "CEO", initials: "AM" },
        { name: "Bob Chen", subtitle: "CTO", initials: "BC" },
        { name: "Carol Davis", subtitle: "Designer", initials: "CD" },
        { name: "Dave Wilson", subtitle: "Engineer", initials: "DW" },
        { name: "Eve Garcia", subtitle: "PM", initials: "EG" },
      ].map((user) => (
        <div key={user.name} className="p-3">
          <UserCell
            {...args}
            name={user.name}
            subtitle={user.subtitle}
            avatarInitials={user.initials}
          />
        </div>
      ))}
    </div>
  ),
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import { NotificationItem } from "./notification-item";

const meta = {
  title: "Feedback/NotificationItem",
  component: NotificationItem,
  tags: ["autodocs"],
  argTypes: {
    state: { control: "select", options: ["unread", "read"] },
    icon: { control: "text" },
    title: { control: "text" },
    description: { control: "text" },
    timestamp: { control: "text" },
  },
} satisfies Meta<typeof NotificationItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "New message received",
    description: "John sent you a message about the project update.",
    timestamp: "2 min ago",
    state: "unread",
  },
};

export const Unread: Story = {
  args: {
    title: "Deployment complete",
    description: "Your application has been deployed to production.",
    timestamp: "5 min ago",
    state: "unread",
    icon: "cloud_done",
  },
};

export const Read: Story = {
  args: {
    title: "Weekly report ready",
    description: "Your weekly analytics report is now available.",
    timestamp: "1 hour ago",
    state: "read",
    icon: "assessment",
  },
};

export const WithCustomIcon: Story = {
  args: {
    title: "Payment received",
    description: "You received a payment of $250.00 from Client Co.",
    timestamp: "30 min ago",
    state: "unread",
    icon: "payments",
  },
};

export const NoDescription: Story = {
  args: {
    title: "System maintenance scheduled",
    timestamp: "3 hours ago",
    state: "read",
    icon: "build",
  },
};

export const LongContent: Story = {
  args: {
    title: "Team invitation accepted",
    description:
      "Sarah has accepted your invitation to join the Design Team. She now has access to all shared projects and resources in the workspace.",
    timestamp: "Yesterday",
    state: "unread",
    icon: "group_add",
  },
};

export const NotificationList: Story = {
  args: {
    title: "",
    timestamp: "",
  },
  render: (args) => (
    <div className="max-w-md space-y-1">
      <NotificationItem
        {...args}
        title="New comment on your post"
        description="Alex commented: 'Great work on this feature!'"
        timestamp="Just now"
        state="unread"
        icon="comment"
      />
      <NotificationItem
        {...args}
        title="Pull request approved"
        description="Your PR #142 was approved by 2 reviewers."
        timestamp="10 min ago"
        state="unread"
        icon="check_circle"
      />
      <NotificationItem
        {...args}
        title="Build failed"
        description="CI pipeline failed on branch feature/auth."
        timestamp="30 min ago"
        state="read"
        icon="error"
      />
      <NotificationItem
        {...args}
        title="New team member"
        description="Jordan joined the Engineering team."
        timestamp="1 hour ago"
        state="read"
        icon="person_add"
      />
      <NotificationItem
        {...args}
        title="Security update"
        description="A new security patch has been applied."
        timestamp="2 hours ago"
        state="read"
        icon="security"
      />
    </div>
  ),
};

export const AllStates: Story = {
  args: {
    title: "",
    timestamp: "",
  },
  render: (args) => (
    <div className="max-w-md space-y-2">
      <p className="text-xs font-semibold text-slate-600 uppercase mb-1">Unread</p>
      <NotificationItem
        {...args}
        title="New feature available"
        description="Check out the new dashboard widgets."
        timestamp="5 min ago"
        state="unread"
      />
      <p className="text-xs font-semibold text-slate-600 uppercase mt-4 mb-1">Read</p>
      <NotificationItem
        {...args}
        title="New feature available"
        description="Check out the new dashboard widgets."
        timestamp="5 min ago"
        state="read"
      />
    </div>
  ),
};

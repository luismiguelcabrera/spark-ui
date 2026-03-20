import type { Meta, StoryObj } from "@storybook/react-vite";
import { EmptyState } from "./empty-state";

const meta = {
  title: "Data Display/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
  argTypes: {
    icon: { control: "text" },
    title: { control: "text" },
    description: { control: "text" },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "No items found",
    description: "There are no items to display at the moment.",
  },
};

export const NoResults: Story = {
  args: {
    icon: "search",
    title: "No results found",
    description: "Try adjusting your search or filter criteria.",
  },
};

export const EmptyInbox: Story = {
  args: {
    icon: "mail",
    title: "Your inbox is empty",
    description: "New messages will appear here when they arrive.",
  },
};

export const NoNotifications: Story = {
  args: {
    icon: "bell",
    title: "No notifications",
    description: "You're all caught up! Check back later for updates.",
  },
};

export const WithAction: Story = {
  args: {
    icon: "add_circle",
    title: "No projects yet",
    description: "Create your first project to get started.",
    action: (
      <button
        type="button"
        className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90"
      >
        Create Project
      </button>
    ),
  },
};

export const WithMultipleActions: Story = {
  args: {
    icon: "folder",
    title: "No files uploaded",
    description: "Upload files to organize and share with your team.",
    action: (
      <div className="flex gap-3">
        <button
          type="button"
          className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium"
        >
          Upload File
        </button>
        <button
          type="button"
          className="px-4 py-2 rounded-lg border border-muted text-navy-text text-sm font-medium"
        >
          Import
        </button>
      </div>
    ),
  },
};

export const ErrorState: Story = {
  args: {
    icon: "error",
    title: "Something went wrong",
    description: "We encountered an unexpected error. Please try again.",
    action: (
      <button
        type="button"
        className="px-4 py-2 rounded-lg bg-destructive text-white text-sm font-medium"
      >
        Retry
      </button>
    ),
  },
};

import type { Meta, StoryObj } from "@storybook/react";
import { AlertDialog } from "./alert-dialog";

const meta = {
  title: "Feedback/AlertDialog",
  component: AlertDialog,
  tags: ["autodocs"],
  argTypes: {
    type: { control: "select", options: ["info", "warning", "danger", "success"] },
  },
} satisfies Meta<typeof AlertDialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Danger: Story = {
  args: {
    open: true,
    title: "Delete project?",
    description: "This action cannot be undone. All data will be permanently removed.",
    type: "danger",
    confirmText: "Delete",
    onOpenChange: () => {},
  },
};

export const Warning: Story = {
  args: {
    open: true,
    title: "Unsaved changes",
    description: "You have unsaved changes. Are you sure you want to leave?",
    type: "warning",
    confirmText: "Leave",
    cancelText: "Stay",
    onOpenChange: () => {},
  },
};

export const Success: Story = {
  args: {
    open: true,
    title: "Payment successful",
    description: "Your order has been placed successfully.",
    type: "success",
    confirmText: "View Order",
    cancelText: "Close",
    onOpenChange: () => {},
  },
};

export const Info: Story = {
  args: {
    open: true,
    title: "New feature available",
    description: "We've added dark mode support. Would you like to enable it?",
    type: "info",
    confirmText: "Enable",
    cancelText: "Maybe later",
    onOpenChange: () => {},
  },
};

import type { Meta, StoryObj } from "@storybook/react";
import { Snackbar } from "./snackbar";

const meta = {
  title: "Feedback/Snackbar",
  component: Snackbar,
  tags: ["autodocs"],
  argTypes: {
    type: { control: "select", options: ["default", "success", "error", "warning", "info"] },
    position: { control: "select", options: ["top", "bottom", "top-left", "top-right", "bottom-left", "bottom-right"] },
  },
} satisfies Meta<typeof Snackbar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { open: true, message: "Changes saved successfully", onClose: () => {}, duration: 0 },
};

export const Success: Story = {
  args: { open: true, message: "File uploaded", description: "document.pdf has been uploaded", type: "success", onClose: () => {}, duration: 0 },
};

export const Error: Story = {
  args: { open: true, message: "Upload failed", description: "Please try again", type: "error", onClose: () => {}, duration: 0 },
};

export const WithAction: Story = {
  args: { open: true, message: "Item deleted", action: { label: "Undo", onClick: () => {} }, onClose: () => {}, duration: 0 },
};

export const Warning: Story = {
  args: { open: true, message: "Low disk space", description: "Only 2GB remaining", type: "warning", onClose: () => {}, duration: 0 },
};

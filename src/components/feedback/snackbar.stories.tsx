import type { Meta, StoryObj } from "@storybook/react-vite";
import { Snackbar } from "./snackbar";

const meta = {
  title: "Feedback/Snackbar",
  component: Snackbar,
  tags: ["autodocs"],
  argTypes: {
    type: { control: "select", options: ["default", "success", "error", "warning", "info"] },
    position: { control: "select", options: ["top", "bottom", "top-left", "top-right", "bottom-left", "bottom-right"] },
    location: {
      control: "select",
      options: [undefined, "bottom-center", "bottom-left", "bottom-right", "top-center", "top-left", "top-right"],
    },
    timeout: { control: { type: "number" } },
    multiLine: { control: "boolean" },
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

// === New stories for timeout prop ===

export const WithTimeout: Story = {
  args: {
    open: true,
    message: "This snackbar will auto-dismiss in 3 seconds",
    timeout: 3000,
    onClose: () => {},
  },
};

export const NoAutoDismiss: Story = {
  args: {
    open: true,
    message: "This snackbar will not auto-dismiss",
    timeout: 0,
    onClose: () => {},
  },
};

// === New stories for location prop ===

export const LocationBottomCenter: Story = {
  args: {
    open: true,
    message: "Bottom center (default)",
    location: "bottom-center",
    onClose: () => {},
    duration: 0,
  },
};

export const LocationTopCenter: Story = {
  args: {
    open: true,
    message: "Top center snackbar",
    location: "top-center",
    type: "info",
    onClose: () => {},
    duration: 0,
  },
};

export const LocationTopRight: Story = {
  args: {
    open: true,
    message: "Top right snackbar",
    location: "top-right",
    type: "success",
    onClose: () => {},
    duration: 0,
  },
};

export const LocationBottomLeft: Story = {
  args: {
    open: true,
    message: "Bottom left snackbar",
    location: "bottom-left",
    type: "warning",
    onClose: () => {},
    duration: 0,
  },
};

// === New stories for multiLine prop ===

export const MultiLine: Story = {
  args: {
    open: true,
    message: "File could not be uploaded",
    description: "The file you selected exceeds the maximum allowed size of 25 MB. Please select a smaller file and try again.",
    multiLine: true,
    type: "error",
    onClose: () => {},
    duration: 0,
  },
};

export const MultiLineWithAction: Story = {
  args: {
    open: true,
    message: "3 items archived",
    description: "The selected items have been moved to the archive. You can restore them within 30 days.",
    multiLine: true,
    action: { label: "Undo", onClick: () => {} },
    onClose: () => {},
    duration: 0,
  },
};

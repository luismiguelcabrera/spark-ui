import type { Meta, StoryObj } from "@storybook/react-vite";
import { AutoResizeTextarea } from "./auto-resize-textarea";

const meta = {
  title: "Forms/AutoResizeTextarea",
  component: AutoResizeTextarea,
  tags: ["autodocs"],
  argTypes: {
    minRows: { control: { type: "number", min: 1, max: 20 } },
    maxRows: { control: { type: "number", min: 1, max: 50 } },
    error: { control: "text" },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof AutoResizeTextarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Type something...",
  },
};

export const WithError: Story = {
  args: {
    placeholder: "Type something...",
    error: "This field is required",
  },
};

export const WithMinRows: Story = {
  args: {
    minRows: 5,
    placeholder: "This textarea starts with 5 rows...",
  },
};

export const WithMaxRows: Story = {
  args: {
    maxRows: 5,
    placeholder: "This textarea grows up to 5 rows, then scrolls...",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: "Cannot edit this content.",
  },
};

export const PrefilledContent: Story = {
  args: {
    defaultValue:
      "This is the first line.\nThis is the second line.\nThis is the third line.\nThis is the fourth line.\nThis is the fifth line.\nThis is the sixth line.",
  },
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import { Toast } from "./toast";

const meta = {
  title: "Feedback/Toast",
  component: Toast,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["success", "error", "warning", "info"] },
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = { args: { title: "Info", description: "Something happened." } };
export const Success: Story = {
  args: { title: "Success!", description: "Your changes were saved.", variant: "success" },
};
export const Error: Story = {
  args: { title: "Error", description: "Something went wrong.", variant: "error" },
};
export const Warning: Story = {
  args: { title: "Warning", description: "Check your input.", variant: "warning" },
};

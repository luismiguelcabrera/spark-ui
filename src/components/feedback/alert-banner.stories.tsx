import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlertBanner } from "./alert-banner";

const meta = {
  title: "Feedback/AlertBanner",
  component: AlertBanner,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["info", "success", "warning", "danger"] },
  },
} satisfies Meta<typeof AlertBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = { args: { title: "Information", description: "A helpful message." } };
export const Success: Story = {
  args: { title: "All good!", description: "Operation completed.", variant: "success" },
};
export const Warning: Story = {
  args: { title: "Caution", description: "Proceed carefully.", variant: "warning" },
};
export const Danger: Story = {
  args: { title: "Error", description: "Something broke.", variant: "danger" },
};

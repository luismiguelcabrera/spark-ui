import type { Meta, StoryObj } from "@storybook/react-vite";
import { Alert } from "./alert";

const meta = {
  title: "Feedback/Alert",
  component: Alert,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["info", "success", "warning", "error"],
    },
    dismissible: { control: "boolean" },
    title: { control: "text" },
    icon: { control: "text" },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "This is an informational alert message.",
  },
};

export const Info: Story = {
  args: {
    variant: "info",
    title: "Information",
    children: "This is an informational alert with a title.",
  },
};

export const Success: Story = {
  args: {
    variant: "success",
    title: "Success",
    children: "Your changes have been saved successfully.",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    title: "Warning",
    children: "Please review your input before proceeding.",
  },
};

export const Error: Story = {
  args: {
    variant: "error",
    title: "Error",
    children: "Something went wrong. Please try again later.",
  },
};

export const WithTitle: Story = {
  args: {
    variant: "info",
    title: "Did you know?",
    children: "You can customize this alert with different variants, icons, and dismiss behavior.",
  },
};

export const Dismissible: Story = {
  args: {
    variant: "warning",
    title: "Session expiring",
    children: "Your session will expire in 5 minutes. Save your work.",
    dismissible: true,
    onDismiss: () => {},
  },
};

export const CustomIcon: Story = {
  args: {
    variant: "info",
    icon: "star",
    title: "Featured",
    children: "This alert uses a custom icon instead of the default.",
  },
};

export const AllVariants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Alert {...args} variant="info" title="Info">
        This is an informational message.
      </Alert>
      <Alert {...args} variant="success" title="Success">
        Operation completed successfully.
      </Alert>
      <Alert {...args} variant="warning" title="Warning">
        Proceed with caution.
      </Alert>
      <Alert {...args} variant="error" title="Error">
        An error has occurred.
      </Alert>
    </div>
  ),
  args: {
    dismissible: false,
  },
};

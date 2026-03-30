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
    fill: {
      control: "select",
      options: ["flat", "tonal", "outlined"],
    },
    border: {
      control: "select",
      options: [undefined, "top", "bottom", "start", "end"],
    },
    prominent: { control: "boolean" },
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

// === New stories for fill variants ===

export const TonalFill: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Alert {...args} variant="info" fill="tonal" title="Info (Tonal)">
        Tonal alerts have a stronger background color.
      </Alert>
      <Alert {...args} variant="success" fill="tonal" title="Success (Tonal)">
        Operation completed with tonal styling.
      </Alert>
      <Alert {...args} variant="warning" fill="tonal" title="Warning (Tonal)">
        Proceed with caution.
      </Alert>
      <Alert {...args} variant="error" fill="tonal" title="Error (Tonal)">
        Something went wrong.
      </Alert>
    </div>
  ),
  args: {},
};

export const OutlinedFill: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Alert {...args} variant="info" fill="outlined" title="Info (Outlined)">
        Outlined alerts have a transparent background.
      </Alert>
      <Alert {...args} variant="success" fill="outlined" title="Success (Outlined)">
        Operation completed with outlined styling.
      </Alert>
      <Alert {...args} variant="warning" fill="outlined" title="Warning (Outlined)">
        Proceed with caution.
      </Alert>
      <Alert {...args} variant="error" fill="outlined" title="Error (Outlined)">
        Something went wrong.
      </Alert>
    </div>
  ),
  args: {},
};

// === New stories for border prop ===

export const BorderStart: Story = {
  args: {
    variant: "error",
    border: "start",
    title: "Error",
    children: "An error occurred with a left border accent.",
  },
};

export const BorderTop: Story = {
  args: {
    variant: "info",
    border: "top",
    title: "Information",
    children: "This alert has a top border accent.",
  },
};

export const AllBorders: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Alert {...args} variant="info" border="top" title="Top Border">
        Border on the top side.
      </Alert>
      <Alert {...args} variant="success" border="bottom" title="Bottom Border">
        Border on the bottom side.
      </Alert>
      <Alert {...args} variant="warning" border="start" title="Start Border">
        Border on the start (left) side.
      </Alert>
      <Alert {...args} variant="error" border="end" title="End Border">
        Border on the end (right) side.
      </Alert>
    </div>
  ),
  args: {},
};

// === New stories for prominent prop ===

export const Prominent: Story = {
  args: {
    variant: "warning",
    prominent: true,
    title: "Important Notice",
    children: "This is a prominent alert with a larger icon and bolder styling.",
  },
};

export const ProminentWithBorder: Story = {
  args: {
    variant: "error",
    prominent: true,
    border: "start",
    title: "Critical Error",
    children: "A critical error has occurred. Please contact support immediately.",
    dismissible: true,
    onDismiss: () => {},
  },
};

// === Combination gallery ===

export const FillVariantsGallery: Story = {
  render: (args) => (
    <div className="flex flex-col gap-6">
      {(["flat", "tonal", "outlined"] as const).map((fill) => (
        <div key={fill} className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{fill}</p>
          <div className="flex flex-col gap-2">
            {(["info", "success", "warning", "error"] as const).map((variant) => (
              <Alert key={variant} {...args} variant={variant} fill={fill} title={`${variant} — ${fill}`}>
                This is a {variant} alert with {fill} fill style.
              </Alert>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
  args: {},
};

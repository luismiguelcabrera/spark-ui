import type { Meta, StoryObj } from "@storybook/react-vite";
import { Result } from "./result";

const meta = {
  title: "Feedback/Result",
  component: Result,
  tags: ["autodocs"],
  argTypes: {
    status: {
      control: "select",
      options: ["success", "error", "warning", "info", "403", "404", "500"],
    },
  },
} satisfies Meta<typeof Result>;

export default meta;
type Story = StoryObj<typeof meta>;

// -- Individual status stories --

export const Success: Story = {
  args: {
    status: "success",
    title: "Successfully Purchased",
    subtitle:
      "Your order #12345 has been placed. We'll send you a confirmation email shortly.",
    extra: (
      <div className="flex gap-3">
        <button className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg">
          Go Home
        </button>
        <button className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg">
          View Order
        </button>
      </div>
    ),
  },
};

export const Error: Story = {
  args: {
    status: "error",
    title: "Submission Failed",
    subtitle: "Please check your network connection and try again.",
    extra: (
      <button className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg">
        Retry
      </button>
    ),
  },
};

export const Warning: Story = {
  args: {
    status: "warning",
    title: "Account Suspended",
    subtitle:
      "Your account has been temporarily suspended. Contact support for more information.",
  },
};

export const Info: Story = {
  args: {
    status: "info",
    title: "Update Available",
    subtitle: "A new version is available. Please update to get the latest features.",
  },
};

export const Forbidden: Story = {
  args: {
    status: "403",
    title: "403 - Access Denied",
    subtitle: "You do not have permission to access this page.",
    extra: (
      <button className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg">
        Go Back
      </button>
    ),
  },
};

export const NotFound: Story = {
  args: {
    status: "404",
    title: "404 - Page Not Found",
    subtitle: "The page you're looking for doesn't exist or has been moved.",
    extra: (
      <button className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg">
        Return Home
      </button>
    ),
  },
};

export const ServerError: Story = {
  args: {
    status: "500",
    title: "500 - Internal Server Error",
    subtitle: "Something went wrong on our end. Please try again later.",
    extra: (
      <button className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg">
        Refresh
      </button>
    ),
  },
};

// -- Gallery --

export const Gallery: Story = {
  args: {
    status: "success",
    title: "Gallery",
  },
  render: (args) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="border border-slate-200 rounded-xl">
        <Result {...args} status="success" title="Payment Successful" subtitle="Thank you for your purchase." />
      </div>
      <div className="border border-slate-200 rounded-xl">
        <Result {...args} status="error" title="Upload Failed" subtitle="File size exceeds the limit." />
      </div>
      <div className="border border-slate-200 rounded-xl">
        <Result {...args} status="warning" title="Trial Expiring" subtitle="Your trial ends in 3 days." />
      </div>
      <div className="border border-slate-200 rounded-xl">
        <Result {...args} status="info" title="Maintenance Scheduled" subtitle="System will be down on Saturday." />
      </div>
      <div className="border border-slate-200 rounded-xl">
        <Result {...args} status="403" title="403 Forbidden" subtitle="Access denied." />
      </div>
      <div className="border border-slate-200 rounded-xl">
        <Result {...args} status="404" title="404 Not Found" subtitle="Page does not exist." />
      </div>
    </div>
  ),
};

// -- With Children --

export const WithChildren: Story = {
  args: {
    status: "success",
    title: "Order Confirmed",
    subtitle: "Your order has been placed successfully.",
    children: (
      <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-600 text-left">
        <p className="font-medium text-slate-900 mb-2">Order Details</p>
        <p>Order #: 2024-001234</p>
        <p>Total: $49.99</p>
        <p>Estimated delivery: 3-5 business days</p>
      </div>
    ),
    extra: (
      <button className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg">
        Track Order
      </button>
    ),
  },
};

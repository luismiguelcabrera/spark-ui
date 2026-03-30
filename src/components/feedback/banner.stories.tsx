import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Banner } from "./banner";
import { Button } from "../forms/button";

const meta = {
  title: "Feedback/Banner",
  component: Banner,
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "select",
      options: ["info", "warning", "danger", "success"],
    },
    sticky: { control: "boolean" },
    dismissible: { control: "boolean" },
  },
} satisfies Meta<typeof Banner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: "A new version of the application is available.",
    color: "info",
  },
};

export const Warning: Story = {
  args: {
    text: "Your trial expires in 3 days. Upgrade now to keep your data.",
    color: "warning",
  },
};

export const Danger: Story = {
  args: {
    text: "Your account has been flagged for suspicious activity.",
    color: "danger",
  },
};

export const Success: Story = {
  args: {
    text: "Deployment completed successfully.",
    color: "success",
  },
};

export const WithActions: Story = {
  args: {
    text: "A new version is available.",
    color: "info",
    actions: (
      <button
        type="button"
        className="text-sm font-bold underline underline-offset-2 hover:no-underline"
      >
        Update now
      </button>
    ),
  },
};

export const Dismissible: Story = {
  render: (args) => {
    const [visible, setVisible] = useState(true);
    if (!visible) {
      return (
        <Button size="sm" onClick={() => setVisible(true)}>
          Show banner again
        </Button>
      );
    }
    return (
      <Banner
        {...args}
        text="This banner can be dismissed."
        color="info"
        dismissible
        onDismiss={() => setVisible(false)}
      />
    );
  },
};

export const Sticky: Story = {
  render: (args) => (
    <div className="relative h-64 overflow-auto border rounded-lg">
      <Banner
        {...args}
        text="This banner is sticky at the top."
        color="warning"
        sticky
      />
      <div className="p-4 space-y-4">
        {Array.from({ length: 20 }, (_, i) => (
          <p key={i} className="text-sm text-slate-500">
            Scroll content line {i + 1}
          </p>
        ))}
      </div>
    </div>
  ),
};

export const CustomIcon: Story = {
  args: {
    text: "Settings have been updated.",
    icon: "settings",
    color: "success",
  },
};

export const Gallery: Story = {
  render: (args) => (
    <div className="space-y-2">
      <Banner {...args} text="Informational message." color="info" />
      <Banner {...args} text="Warning — action may be needed." color="warning" />
      <Banner {...args} text="Critical error occurred." color="danger" />
      <Banner {...args} text="Operation completed successfully." color="success" />
      <Banner
        {...args}
        text="Dismissible banner with action."
        color="info"
        dismissible
        actions={
          <button
            type="button"
            className="text-sm font-bold underline underline-offset-2 hover:no-underline"
          >
            Learn more
          </button>
        }
      />
    </div>
  ),
};

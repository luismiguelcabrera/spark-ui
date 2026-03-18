import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckboxCard } from "./checkbox-card";

const meta = {
  title: "Forms/CheckboxCard",
  component: CheckboxCard,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    color: { control: "select", options: ["primary", "secondary", "success"] },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof CheckboxCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Premium Plan",
    description: "Access all features with priority support",
    defaultChecked: false,
  },
};

export const WithIcon: Story = {
  args: {
    title: "Cloud Storage",
    description: "50 GB of secure cloud storage",
    icon: "cloud",
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="space-y-4 max-w-sm">
      <CheckboxCard {...args} size="sm" title="Small" description="Compact card" />
      <CheckboxCard {...args} size="md" title="Medium" description="Default size card" />
      <CheckboxCard {...args} size="lg" title="Large" description="Spacious card" />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    title: "Unavailable Option",
    description: "This option is currently unavailable",
    disabled: true,
  },
};

export const Gallery: Story = {
  render: (args) => (
    <div className="space-y-4 max-w-md">
      <CheckboxCard
        {...args}
        title="Email Notifications"
        description="Receive email updates about your account"
        icon="mail"
        color="primary"
        defaultChecked
      />
      <CheckboxCard
        {...args}
        title="SMS Alerts"
        description="Get text messages for important events"
        icon="chat"
        color="success"
      />
      <CheckboxCard
        {...args}
        title="Push Notifications"
        description="Browser push notifications (desktop only)"
        icon="notifications"
        color="secondary"
        disabled
      />
    </div>
  ),
};

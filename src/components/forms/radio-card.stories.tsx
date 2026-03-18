import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadioCardGroup } from "./radio-card";

const meta = {
  title: "Forms/RadioCard",
  component: RadioCardGroup,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    color: { control: "select", options: ["primary", "secondary", "success"] },
    orientation: { control: "select", options: ["horizontal", "vertical"] },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof RadioCardGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

const planOptions = [
  { value: "free", title: "Free", description: "Basic features for personal use" },
  { value: "pro", title: "Pro", description: "Advanced features for professionals" },
  { value: "enterprise", title: "Enterprise", description: "Custom solutions for teams" },
];

export const Default: Story = {
  args: {
    options: planOptions,
    defaultValue: "pro",
  },
};

export const Vertical: Story = {
  args: {
    options: planOptions,
    orientation: "vertical",
    defaultValue: "free",
  },
};

export const WithIcons: Story = {
  args: {
    options: [
      { value: "email", title: "Email", description: "Send via email", icon: "mail" },
      { value: "sms", title: "SMS", description: "Send via text message", icon: "chat" },
      { value: "push", title: "Push", description: "Browser notification", icon: "notifications" },
    ],
    defaultValue: "email",
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="space-y-8">
      <div>
        <p className="text-xs text-slate-500 mb-2">Small</p>
        <RadioCardGroup {...args} options={planOptions} size="sm" defaultValue="free" />
      </div>
      <div>
        <p className="text-xs text-slate-500 mb-2">Medium</p>
        <RadioCardGroup {...args} options={planOptions} size="md" defaultValue="pro" />
      </div>
      <div>
        <p className="text-xs text-slate-500 mb-2">Large</p>
        <RadioCardGroup {...args} options={planOptions} size="lg" defaultValue="enterprise" />
      </div>
    </div>
  ),
};

export const Gallery: Story = {
  render: (args) => (
    <div className="space-y-8">
      <div>
        <p className="text-xs text-slate-500 mb-2">Primary (horizontal)</p>
        <RadioCardGroup
          {...args}
          options={planOptions}
          color="primary"
          defaultValue="pro"
        />
      </div>
      <div>
        <p className="text-xs text-slate-500 mb-2">Success (vertical)</p>
        <RadioCardGroup
          {...args}
          options={[
            { value: "monthly", title: "Monthly", description: "$9/mo" },
            { value: "annual", title: "Annual", description: "$99/yr (save 8%)" },
          ]}
          color="success"
          orientation="vertical"
          defaultValue="annual"
        />
      </div>
      <div>
        <p className="text-xs text-slate-500 mb-2">With disabled option</p>
        <RadioCardGroup
          {...args}
          options={[
            { value: "a", title: "Available" },
            { value: "b", title: "Disabled", disabled: true },
            { value: "c", title: "Available too" },
          ]}
          defaultValue="a"
        />
      </div>
    </div>
  ),
};

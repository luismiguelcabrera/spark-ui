import type { Meta, StoryObj } from "@storybook/react-vite";
import { Divider } from "./divider";

const meta = {
  title: "Feedback/Divider",
  component: Divider,
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
  },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: (args) => (
    <div className="w-full max-w-md">
      <p className="text-sm text-slate-600 mb-4">Content above the divider</p>
      <Divider {...args} />
      <p className="text-sm text-slate-600 mt-4">Content below the divider</p>
    </div>
  ),
};

export const WithLabel: Story = {
  args: {
    label: "OR",
  },
  render: (args) => (
    <div className="w-full max-w-md">
      <p className="text-sm text-slate-600 mb-4">Sign in with email</p>
      <Divider {...args} />
      <p className="text-sm text-slate-600 mt-4">Sign in with Google</p>
    </div>
  ),
};

export const CustomLabel: Story = {
  args: {
    label: "Section Break",
  },
  render: (args) => (
    <div className="w-full max-w-md">
      <Divider {...args} />
    </div>
  ),
};

export const InCard: Story = {
  args: {},
  render: (args) => (
    <div className="w-full max-w-sm rounded-xl border border-muted bg-surface p-4 shadow-sm">
      <h3 className="text-sm font-bold text-secondary">Account Settings</h3>
      <p className="text-xs text-muted-foreground mt-1">Manage your account preferences</p>
      <Divider {...args} className="my-4" />
      <h3 className="text-sm font-bold text-secondary">Notifications</h3>
      <p className="text-xs text-muted-foreground mt-1">Configure how you receive alerts</p>
      <Divider {...args} className="my-4" />
      <h3 className="text-sm font-bold text-secondary">Privacy</h3>
      <p className="text-xs text-muted-foreground mt-1">Control your data sharing settings</p>
    </div>
  ),
};

export const WithLabelVariants: Story = {
  args: {},
  render: (args) => (
    <div className="w-full max-w-md space-y-6">
      <Divider {...args} />
      <Divider {...args} label="OR" />
      <Divider {...args} label="Continue" />
      <Divider {...args} label="End of results" />
    </div>
  ),
};

export const InForm: Story = {
  args: {},
  render: (args) => (
    <div className="w-full max-w-sm space-y-4">
      <div>
        <label className="text-sm font-medium text-slate-700">Email</label>
        <input
          type="email"
          placeholder="you@example.com"
          className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-slate-700">Password</label>
        <input
          type="password"
          placeholder="Enter password"
          className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
        />
      </div>
      <button
        type="button"
        className="w-full px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium"
      >
        Sign In
      </button>
      <Divider {...args} label="OR" />
      <button
        type="button"
        className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
      >
        Continue with Google
      </button>
    </div>
  ),
};

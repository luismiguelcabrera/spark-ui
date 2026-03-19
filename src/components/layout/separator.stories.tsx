import type { Meta, StoryObj } from "@storybook/react-vite";
import { Separator } from "./separator";

const meta = {
  title: "Layout/Separator",
  component: Separator,
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
    decorative: { control: "boolean" },
    label: { control: "text" },
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    orientation: "horizontal",
    decorative: true,
  },
  render: (args) => (
    <div className="max-w-md space-y-4">
      <p className="text-sm text-slate-600">Content above the separator</p>
      <Separator orientation={args.orientation} decorative={args.decorative} label={args.label} />
      <p className="text-sm text-slate-600">Content below the separator</p>
    </div>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <div className="max-w-md space-y-4">
      <p className="text-sm text-slate-600">First section</p>
      <Separator />
      <p className="text-sm text-slate-600">Second section</p>
      <Separator />
      <p className="text-sm text-slate-600">Third section</p>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex items-center gap-4 h-8">
      <span className="text-sm text-slate-600">Home</span>
      <Separator orientation="vertical" />
      <span className="text-sm text-slate-600">Settings</span>
      <Separator orientation="vertical" />
      <span className="text-sm text-slate-600">Profile</span>
    </div>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div className="max-w-md space-y-6">
      <Separator label="OR" />
      <Separator label="Section" />
      <Separator label="Continue with" />
    </div>
  ),
};

export const InCard: Story = {
  render: () => (
    <div className="max-w-sm bg-white border border-slate-200 rounded-xl p-4 space-y-3">
      <div>
        <p className="text-sm font-medium text-slate-900">Account</p>
        <p className="text-xs text-slate-500">Manage your account settings</p>
      </div>
      <Separator />
      <div>
        <p className="text-sm font-medium text-slate-900">Notifications</p>
        <p className="text-xs text-slate-500">Configure notification preferences</p>
      </div>
      <Separator />
      <div>
        <p className="text-sm font-medium text-slate-900">Privacy</p>
        <p className="text-xs text-slate-500">Control your privacy settings</p>
      </div>
    </div>
  ),
};

export const NonDecorative: Story = {
  render: () => (
    <div className="max-w-md space-y-4">
      <p className="text-sm text-slate-600">
        When <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">decorative=false</code>,
        the separator gets <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">role=&quot;separator&quot;</code> and
        <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">aria-orientation</code> for accessibility.
      </p>
      <Separator decorative={false} />
      <p className="text-sm text-slate-500">Inspect the element to see ARIA attributes.</p>
    </div>
  ),
};

import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { LoadingOverlay } from "./loading-overlay";

const meta = {
  title: "Feedback/LoadingOverlay",
  component: LoadingOverlay,
  tags: ["autodocs"],
  argTypes: {
    visible: { control: "boolean" },
    blur: { control: "boolean" },
    fullScreen: { control: "boolean" },
    label: { control: "text" },
    zIndex: { control: "number" },
  },
} satisfies Meta<typeof LoadingOverlay>;

export default meta;
type Story = StoryObj<typeof meta>;

const SampleContent = () => (
  <div className="p-6 space-y-4">
    <h3 className="text-lg font-bold text-secondary">Dashboard</h3>
    <p className="text-sm text-slate-600">
      This is some sample content that will be covered by the loading overlay.
    </p>
    <div className="grid grid-cols-2 gap-4">
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
        <p className="text-sm font-medium text-slate-700">Revenue</p>
        <p className="text-2xl font-bold text-secondary">$12,400</p>
      </div>
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
        <p className="text-sm font-medium text-slate-700">Users</p>
        <p className="text-2xl font-bold text-secondary">1,234</p>
      </div>
    </div>
  </div>
);

export const Default: Story = {
  args: {
    visible: true,
  },
  render: (args) => (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <LoadingOverlay {...args}>
        <SampleContent />
      </LoadingOverlay>
    </div>
  ),
};

export const WithLabel: Story = {
  args: {
    visible: true,
    label: "Loading data...",
  },
  render: (args) => (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <LoadingOverlay {...args}>
        <SampleContent />
      </LoadingOverlay>
    </div>
  ),
};

export const NoBlur: Story = {
  args: {
    visible: true,
    blur: false,
    label: "Processing...",
  },
  render: (args) => (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <LoadingOverlay {...args}>
        <SampleContent />
      </LoadingOverlay>
    </div>
  ),
};

export const Hidden: Story = {
  args: {
    visible: false,
  },
  render: (args) => (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <LoadingOverlay {...args}>
        <SampleContent />
      </LoadingOverlay>
    </div>
  ),
};

export const Interactive: Story = {
  args: {
    visible: false,
  },
  render: (args) => {
    const Controller = () => {
      const [visible, setVisible] = useState(false);
      return (
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => {
              setVisible(true);
              setTimeout(() => setVisible(false), 2000);
            }}
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium"
          >
            Simulate Loading (2s)
          </button>
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <LoadingOverlay {...args} visible={visible} label="Fetching data...">
              <SampleContent />
            </LoadingOverlay>
          </div>
        </div>
      );
    };
    return <Controller />;
  },
};

export const CustomSpinner: Story = {
  args: {
    visible: true,
    spinner: (
      <div className="flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    ),
    label: "Please wait...",
  },
  render: (args) => (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <LoadingOverlay {...args}>
        <SampleContent />
      </LoadingOverlay>
    </div>
  ),
};

export const OnCard: Story = {
  args: {
    visible: true,
    label: "Saving...",
  },
  render: (args) => (
    <div className="max-w-sm rounded-xl border border-slate-200 overflow-hidden">
      <LoadingOverlay {...args}>
        <div className="p-5 space-y-3">
          <h4 className="font-bold text-secondary">Edit Profile</h4>
          <div>
            <label htmlFor="overlay-name" className="text-sm text-slate-600">Name</label>
            <input id="overlay-name" className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm" defaultValue="John Doe" />
          </div>
          <div>
            <label htmlFor="overlay-email" className="text-sm text-slate-600">Email</label>
            <input id="overlay-email" className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm" defaultValue="john@example.com" />
          </div>
          <button type="button" className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium">
            Save
          </button>
        </div>
      </LoadingOverlay>
    </div>
  ),
};

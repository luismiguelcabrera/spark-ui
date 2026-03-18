import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { NavigationProgress } from "./navigation-progress";

const meta = {
  title: "Feedback/NavigationProgress",
  component: NavigationProgress,
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "select",
      options: ["primary", "secondary", "success", "warning", "destructive"],
    },
    loading: { control: "boolean" },
    progress: { control: { type: "range", min: 0, max: 100, step: 1 } },
    height: { control: { type: "number", min: 1, max: 10 } },
  },
} satisfies Meta<typeof NavigationProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

// -- Basic loading state --

export const Loading: Story = {
  args: {
    loading: true,
  },
};

export const DeterminateProgress: Story = {
  args: {
    progress: 65,
  },
};

export const CustomHeight: Story = {
  args: {
    loading: true,
    height: 5,
  },
};

// -- Color variants --

export const Primary: Story = { args: { loading: true, color: "primary" } };
export const Secondary: Story = { args: { loading: true, color: "secondary" } };
export const Success: Story = { args: { loading: true, color: "success" } };
export const Warning: Story = { args: { loading: true, color: "warning" } };
export const Destructive: Story = { args: { loading: true, color: "destructive" } };

// -- Interactive toggle --

export const ToggleLoading: Story = {
  args: { loading: false },
  render: function Render(args) {
    const [isLoading, setIsLoading] = useState(false);
    return (
      <div>
        <NavigationProgress {...args} loading={isLoading} />
        <div className="p-8">
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg"
            onClick={() => setIsLoading(!isLoading)}
          >
            {isLoading ? "Stop Loading" : "Start Loading"}
          </button>
          <p className="mt-2 text-sm text-slate-500">
            Click to toggle the loading state. When stopped, the bar will animate to 100% and fade out.
          </p>
        </div>
      </div>
    );
  },
};

// -- Simulated file upload --

export const SimulatedUpload: Story = {
  args: { progress: 0 },
  render: function Render(args) {
    const [progress, setProgress] = useState<number | undefined>(undefined);
    const [uploading, setUploading] = useState(false);

    const startUpload = () => {
      setUploading(true);
      setProgress(0);
      let p = 0;
      const interval = setInterval(() => {
        p += Math.random() * 15;
        if (p >= 100) {
          p = 100;
          clearInterval(interval);
          setTimeout(() => {
            setUploading(false);
            setProgress(undefined);
          }, 500);
        }
        setProgress(Math.round(p));
      }, 300);
    };

    return (
      <div>
        <NavigationProgress {...args} progress={progress} loading={uploading} />
        <div className="p-8">
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg disabled:opacity-50"
            onClick={startUpload}
            disabled={uploading}
          >
            {uploading ? `Uploading... ${progress ?? 0}%` : "Start Upload"}
          </button>
        </div>
      </div>
    );
  },
};

// -- Gallery --

export const Gallery: Story = {
  args: { loading: true },
  render: (args) => (
    <div className="space-y-24 pt-4">
      <div>
        <p className="text-sm font-medium text-slate-600 mb-2">Primary (loading)</p>
        <div className="relative h-3 bg-slate-100 rounded overflow-hidden">
          <NavigationProgress {...args} loading color="primary" />
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-slate-600 mb-2">Success (60%)</p>
        <div className="relative h-3 bg-slate-100 rounded overflow-hidden">
          <NavigationProgress {...args} progress={60} color="success" />
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-slate-600 mb-2">Warning (30%)</p>
        <div className="relative h-3 bg-slate-100 rounded overflow-hidden">
          <NavigationProgress {...args} progress={30} color="warning" />
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-slate-600 mb-2">Destructive (90%)</p>
        <div className="relative h-3 bg-slate-100 rounded overflow-hidden">
          <NavigationProgress {...args} progress={90} color="destructive" />
        </div>
      </div>
    </div>
  ),
};

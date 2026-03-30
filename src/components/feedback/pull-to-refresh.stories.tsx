import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { PullToRefresh } from "./pull-to-refresh";

const meta = {
  title: "Feedback/PullToRefresh",
  component: PullToRefresh,
  tags: ["autodocs"],
  argTypes: {
    threshold: { control: { type: "range", min: 20, max: 200, step: 10 } },
    maxPull: { control: { type: "range", min: 50, max: 300, step: 10 } },
    disabled: { control: "boolean" },
  },
  args: {
    threshold: 80,
    maxPull: 120,
    disabled: false,
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 400, margin: "0 auto", border: "1px solid #e2e8f0", borderRadius: 16, overflow: "hidden" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PullToRefresh>;

export default meta;
type Story = StoryObj<typeof meta>;

const SampleList = () => (
  <div className="divide-y divide-slate-100">
    {Array.from({ length: 10 }, (_, i) => (
      <div key={i} className="flex items-center gap-3 px-4 py-3">
        <div className="w-10 h-10 rounded-full bg-slate-200" />
        <div className="flex-1">
          <div className="text-sm font-medium text-slate-900">Item {i + 1}</div>
          <div className="text-xs text-slate-500">Description for item {i + 1}</div>
        </div>
      </div>
    ))}
  </div>
);

export const Default: Story = {
  render: (args) => {
    const [refreshCount, setRefreshCount] = useState(0);

    return (
      <PullToRefresh
        {...args}
        onRefresh={async () => {
          await new Promise((r) => setTimeout(r, 1500));
          setRefreshCount((c) => c + 1);
        }}
      >
        <div className="bg-white min-h-[400px]">
          <div className="px-4 py-3 border-b border-slate-100">
            <p className="text-sm font-medium text-slate-900">
              Pull down to refresh (refreshed {refreshCount} times)
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Use touch or mobile emulation in DevTools
            </p>
          </div>
          <SampleList />
        </div>
      </PullToRefresh>
    );
  },
};

export const CustomIndicator: Story = {
  render: (args) => (
    <PullToRefresh
      {...args}
      onRefresh={async () => {
        await new Promise((r) => setTimeout(r, 1500));
      }}
      pullingContent={
        <div className="flex items-center gap-2 text-primary text-sm font-medium">
          <span>Keep pulling...</span>
        </div>
      }
      refreshingContent={
        <div className="flex items-center gap-2 text-primary text-sm font-medium">
          <span className="inline-block w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span>Updating feed...</span>
        </div>
      }
    >
      <div className="bg-white min-h-[400px]">
        <div className="px-4 py-3 border-b border-slate-100">
          <p className="text-sm font-medium text-slate-900">Custom indicator</p>
        </div>
        <SampleList />
      </div>
    </PullToRefresh>
  ),
};

export const Gallery: Story = {
  render: (args) => (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-bold text-slate-700 mb-2 px-4">Default</h3>
        <PullToRefresh
          {...args}
          onRefresh={() => new Promise((r) => setTimeout(r, 1000))}
        >
          <div className="bg-white p-4 min-h-[200px]">
            <p className="text-sm text-slate-600">Default pull-to-refresh indicator</p>
          </div>
        </PullToRefresh>
      </div>

      <div>
        <h3 className="text-sm font-bold text-slate-700 mb-2 px-4">Disabled</h3>
        <PullToRefresh
          {...args}
          disabled
          onRefresh={() => new Promise((r) => setTimeout(r, 1000))}
        >
          <div className="bg-white p-4 min-h-[200px]">
            <p className="text-sm text-slate-400">Disabled - pull gesture has no effect</p>
          </div>
        </PullToRefresh>
      </div>

      <div>
        <h3 className="text-sm font-bold text-slate-700 mb-2 px-4">Low threshold (30px)</h3>
        <PullToRefresh
          {...args}
          threshold={30}
          onRefresh={() => new Promise((r) => setTimeout(r, 1000))}
        >
          <div className="bg-white p-4 min-h-[200px]">
            <p className="text-sm text-slate-600">Easy to trigger (30px threshold)</p>
          </div>
        </PullToRefresh>
      </div>
    </div>
  ),
};

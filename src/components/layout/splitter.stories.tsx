import type { Meta, StoryObj } from "@storybook/react-vite";
import { Splitter } from "./splitter";

const meta = {
  title: "Layout/Splitter",
  component: Splitter,
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
    defaultSize: { control: { type: "range", min: 0, max: 100 } },
    minSize: { control: { type: "range", min: 0, max: 100 } },
    maxSize: { control: { type: "range", min: 0, max: 100 } },
    gutterSize: { control: { type: "range", min: 2, max: 24 } },
  },
} satisfies Meta<typeof Splitter>;

export default meta;
type Story = StoryObj<typeof meta>;

const Pane = ({ children, bg }: { children: string; bg: string }) => (
  <div
    className={`flex h-full min-h-[200px] items-center justify-center ${bg} p-4 text-sm font-medium`}
  >
    {children}
  </div>
);

export const Default: Story = {
  args: {
    children: [
      <Pane key="1" bg="bg-blue-50">Left Pane</Pane>,
      <Pane key="2" bg="bg-green-50">Right Pane</Pane>,
    ],
  },
};

export const Vertical: Story = {
  args: {
    orientation: "vertical",
    children: [
      <Pane key="1" bg="bg-blue-50">Top Pane</Pane>,
      <Pane key="2" bg="bg-green-50">Bottom Pane</Pane>,
    ],
  },
  decorators: [
    (Story) => (
      <div style={{ height: 400 }}>
        <Story />
      </div>
    ),
  ],
};

export const CustomSizes: Story = {
  args: {
    defaultSize: 30,
    gutterSize: 12,
    children: [
      <Pane key="1" bg="bg-purple-50">30% Pane</Pane>,
      <Pane key="2" bg="bg-orange-50">70% Pane</Pane>,
    ],
  },
};

export const MinMax: Story = {
  args: {
    defaultSize: 50,
    minSize: 20,
    maxSize: 80,
    children: [
      <Pane key="1" bg="bg-rose-50">Min 20% / Max 80%</Pane>,
      <Pane key="2" bg="bg-cyan-50">Constrained</Pane>,
    ],
  },
};

export const Gallery: Story = {
  render: (args) => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-2 text-sm font-semibold text-slate-600">
          Horizontal (default)
        </h3>
        <Splitter {...args}>
          <Pane bg="bg-blue-50">Left</Pane>
          <Pane bg="bg-green-50">Right</Pane>
        </Splitter>
      </div>
      <div>
        <h3 className="mb-2 text-sm font-semibold text-slate-600">
          Vertical
        </h3>
        <div style={{ height: 300 }}>
          <Splitter {...args} orientation="vertical">
            <Pane bg="bg-purple-50">Top</Pane>
            <Pane bg="bg-orange-50">Bottom</Pane>
          </Splitter>
        </div>
      </div>
      <div>
        <h3 className="mb-2 text-sm font-semibold text-slate-600">
          Narrow gutter (4px)
        </h3>
        <Splitter {...args} gutterSize={4}>
          <Pane bg="bg-rose-50">Left</Pane>
          <Pane bg="bg-cyan-50">Right</Pane>
        </Splitter>
      </div>
      <div>
        <h3 className="mb-2 text-sm font-semibold text-slate-600">
          Wide gutter (16px)
        </h3>
        <Splitter {...args} gutterSize={16}>
          <Pane bg="bg-amber-50">Left</Pane>
          <Pane bg="bg-emerald-50">Right</Pane>
        </Splitter>
      </div>
    </div>
  ),
  args: {
    children: [
      <Pane key="1" bg="bg-blue-50">Left</Pane>,
      <Pane key="2" bg="bg-green-50">Right</Pane>,
    ],
  },
};

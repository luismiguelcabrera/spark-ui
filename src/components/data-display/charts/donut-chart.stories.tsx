import type { Meta, StoryObj } from "@storybook/react-vite";
import { DonutChart } from "./donut-chart";

const browserShare = [
  { label: "Chrome", value: 65, color: "#4285F4" },
  { label: "Safari", value: 19, color: "#5AC8FA" },
  { label: "Firefox", value: 8, color: "#FF7139" },
  { label: "Edge", value: 5, color: "#0078D7" },
  { label: "Other", value: 3, color: "#9ca3af" },
];

const revenueByProduct = [
  { label: "SaaS", value: 45 },
  { label: "Consulting", value: 25 },
  { label: "Licensing", value: 20 },
  { label: "Support", value: 10 },
];

const meta = {
  title: "Data Display/Charts/DonutChart",
  component: DonutChart,
  tags: ["autodocs"],
  argTypes: {
    size: { control: { type: "range", min: 100, max: 400, step: 20 } },
    thickness: { control: { type: "range", min: 10, max: 80, step: 5 } },
    showLabels: { control: "boolean" },
    showLegend: { control: "boolean" },
    animate: { control: "boolean" },
  },
} satisfies Meta<typeof DonutChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: browserShare,
  },
};

export const WithCenterLabel: Story = {
  args: {
    data: browserShare,
    centerLabel: (
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-900">65%</div>
        <div className="text-xs text-gray-500">Chrome</div>
      </div>
    ),
  },
};

export const WithLegend: Story = {
  args: {
    data: browserShare,
    showLegend: true,
  },
};

export const WithLabels: Story = {
  args: {
    data: browserShare,
    showLabels: true,
    showLegend: true,
  },
};

export const LargeDonut: Story = {
  args: {
    data: browserShare,
    size: 300,
    thickness: 50,
    showLegend: true,
    centerLabel: <span className="text-lg font-semibold text-gray-700">Browsers</span>,
  },
};

export const ThinDonut: Story = {
  args: {
    data: revenueByProduct,
    thickness: 15,
    showLegend: true,
  },
};

export const SmallDonut: Story = {
  args: {
    data: revenueByProduct,
    size: 120,
    thickness: 20,
  },
};

export const NoAnimation: Story = {
  args: {
    data: browserShare,
    animate: false,
    showLegend: true,
  },
};

export const AutoColors: Story = {
  args: {
    data: revenueByProduct,
    showLegend: true,
    centerLabel: (
      <div className="text-center">
        <div className="text-xl font-bold text-gray-900">$2.4M</div>
        <div className="text-xs text-gray-500">Revenue</div>
      </div>
    ),
  },
};

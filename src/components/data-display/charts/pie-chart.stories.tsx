import type { Meta, StoryObj } from "@storybook/react-vite";
import { PieChart } from "./pie-chart";

// ─── Sample Data ─────────────────────────────────────────────────────────────

const browserShare = [
  { name: "Chrome", value: 65, color: "#4285F4" },
  { name: "Safari", value: 19, color: "#5AC8FA" },
  { name: "Firefox", value: 8, color: "#FF7139" },
  { name: "Edge", value: 5, color: "#0078D7" },
  { name: "Other", value: 3, color: "#9ca3af" },
];

const revenueByProduct = [
  { name: "SaaS", value: 45 },
  { name: "Consulting", value: 25 },
  { name: "Licensing", value: 20 },
  { name: "Support", value: 10 },
];

// ─── Meta ────────────────────────────────────────────────────────────────────

const meta = {
  title: "Data Display/Charts/PieChart",
  component: PieChart,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["pie", "donut"] },
    size: { control: { type: "range", min: 100, max: 400, step: 20 } },
    thickness: { control: { type: "range", min: 10, max: 80, step: 5 } },
    showLabel: { control: "boolean" },
    showLegend: { control: "boolean" },
    legendPosition: {
      control: "select",
      options: ["top", "bottom", "left", "right"],
    },
    animate: { control: "boolean" },
  },
} satisfies Meta<typeof PieChart>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Stories ─────────────────────────────────────────────────────────────────

export const Donut: Story = {
  name: "Donut (Default)",
  args: {
    data: browserShare,
    variant: "donut",
  },
};

export const Pie: Story = {
  name: "Pie",
  args: {
    data: browserShare,
    variant: "pie",
  },
};

export const DonutWithLabel: Story = {
  name: "Donut with Center Label",
  args: {
    data: browserShare,
    variant: "donut",
    label: (
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
    variant: "donut",
    showLegend: true,
  },
};

export const WithLabels: Story = {
  name: "With Percentage Labels",
  args: {
    data: browserShare,
    variant: "donut",
    showLabel: true,
    showLegend: true,
  },
};

export const PieWithLegend: Story = {
  name: "Pie with Legend",
  args: {
    data: browserShare,
    variant: "pie",
    showLegend: true,
    showLabel: true,
  },
};

export const LargeDonut: Story = {
  args: {
    data: browserShare,
    variant: "donut",
    size: 300,
    thickness: 50,
    showLegend: true,
    label: (
      <span className="text-lg font-semibold text-gray-700">Browsers</span>
    ),
  },
};

export const ThinDonut: Story = {
  args: {
    data: revenueByProduct,
    variant: "donut",
    thickness: 15,
    showLegend: true,
  },
};

export const SmallDonut: Story = {
  args: {
    data: revenueByProduct,
    variant: "donut",
    size: 120,
    thickness: 20,
  },
};

export const NoAnimation: Story = {
  args: {
    data: browserShare,
    variant: "donut",
    animate: false,
    showLegend: true,
  },
};

export const AutoColors: Story = {
  args: {
    data: revenueByProduct,
    variant: "donut",
    showLegend: true,
    label: (
      <div className="text-center">
        <div className="text-xl font-bold text-gray-900">$2.4M</div>
        <div className="text-xs text-gray-500">Revenue</div>
      </div>
    ),
  },
};

export const LegendPositions: Story = {
  name: "Legend Position - Right",
  args: {
    data: browserShare,
    variant: "donut",
    showLegend: true,
    legendPosition: "right",
    size: 200,
  },
};

export const NamedColors: Story = {
  name: "Named Color Palette",
  args: {
    data: revenueByProduct,
    variant: "pie",
    colors: ["indigo", "emerald", "amber", "rose"],
    showLegend: true,
    showLabel: true,
  },
};

export const WithValueFormatter: Story = {
  args: {
    data: revenueByProduct,
    variant: "donut",
    showLegend: true,
    valueFormatter: (v: number) => `$${v}K`,
  },
};

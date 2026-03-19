import type { Meta, StoryObj } from "@storybook/react-vite";
import { SparkLineChart } from "./spark-line-chart";
import { SparkBarChart } from "./spark-bar-chart";
import { SparkAreaChart } from "./spark-area-chart";

// ─── Sample Data ─────────────────────────────────────────────────────────────

const revenueData = [12, 18, 14, 22, 19, 25, 28, 24, 30, 26, 32, 35];
const temperatureData = [5, 8, 12, 18, 22, 25, 28, 26, 22, 16, 10, 6];
const stockData = [100, 102, 98, 105, 110, 108, 115, 120, 118, 125, 130, 128];
const shortData = [3, 7, 2, 8, 5];
const volatileData = [50, 20, 80, 30, 70, 10, 90, 40, 60, 50];

// ─── Meta ────────────────────────────────────────────────────────────────────

const meta = {
  title: "Data Display/Charts/SparkCharts",
  component: SparkLineChart,
  tags: ["autodocs"],
  argTypes: {
    height: { control: { type: "range", min: 16, max: 80, step: 4 } },
    animate: { control: "boolean" },
  },
} satisfies Meta<typeof SparkLineChart>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── SparkLineChart Stories ─────────────────────────────────────────────────

export const SparkLine: Story = {
  name: "Spark Line - Default",
  args: {
    data: revenueData,
    height: 32,
    width: 120,
    color: "indigo",
  },
};

export const SparkLineLarge: Story = {
  name: "Spark Line - Large",
  args: {
    data: revenueData,
    height: 48,
    width: 200,
    color: "emerald",
    strokeWidth: 2,
  },
};

export const SparkLineSmooth: Story = {
  name: "Spark Line - Smooth",
  args: {
    data: temperatureData,
    height: 32,
    width: 150,
    color: "amber",
    curveType: "monotone",
  },
};

export const SparkLineStep: Story = {
  name: "Spark Line - Step",
  args: {
    data: shortData,
    height: 32,
    width: 120,
    color: "violet",
    curveType: "step",
  },
};

// ─── SparkBarChart Stories ──────────────────────────────────────────────────

export const SparkBar: Story = {
  name: "Spark Bar - Default",
  args: {
    data: revenueData,
    height: 32,
    width: 120,
  },
  render: (args) => (
    <SparkBarChart
      data={revenueData}
      height={args.height}
      width={120}
      color="indigo"
    />
  ),
};

export const SparkBarWide: Story = {
  name: "Spark Bar - Wide",
  args: {
    data: revenueData,
    height: 32,
    width: 120,
  },
  render: () => (
    <SparkBarChart
      data={volatileData}
      height={40}
      width={200}
      color="rose"
    />
  ),
};

export const SparkBarCustomColor: Story = {
  name: "Spark Bar - Custom Hex Color",
  args: {
    data: revenueData,
    height: 32,
    width: 120,
  },
  render: () => (
    <SparkBarChart
      data={stockData}
      height={32}
      width={160}
      color="#10b981"
    />
  ),
};

// ─── SparkAreaChart Stories ─────────────────────────────────────────────────

export const SparkArea: Story = {
  name: "Spark Area - Gradient",
  args: {
    data: revenueData,
    height: 32,
    width: 120,
  },
  render: () => (
    <SparkAreaChart
      data={revenueData}
      height={40}
      width={160}
      color="indigo"
      fill="gradient"
      curveType="monotone"
    />
  ),
};

export const SparkAreaSolid: Story = {
  name: "Spark Area - Solid Fill",
  args: {
    data: revenueData,
    height: 32,
    width: 120,
  },
  render: () => (
    <SparkAreaChart
      data={temperatureData}
      height={40}
      width={160}
      color="emerald"
      fill="solid"
      curveType="monotone"
    />
  ),
};

export const SparkAreaNoFill: Story = {
  name: "Spark Area - No Fill (Line Only)",
  args: {
    data: revenueData,
    height: 32,
    width: 120,
  },
  render: () => (
    <SparkAreaChart
      data={stockData}
      height={40}
      width={160}
      color="amber"
      fill="none"
      curveType="natural"
    />
  ),
};

// ─── Comparison & Inline Usage Stories ───────────────────────────────────────

export const InlineKPI: Story = {
  name: "Inline KPI Cards",
  args: {
    data: revenueData,
    height: 32,
    width: 120,
  },
  render: () => (
    <div className="grid grid-cols-3 gap-4 p-4">
      <div className="rounded-lg border border-gray-200 p-4 flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500 font-medium">Revenue</div>
          <div className="text-lg font-bold text-gray-900">$35K</div>
          <div className="text-xs text-emerald-700">+12.5%</div>
        </div>
        <SparkLineChart
          data={revenueData}
          height={32}
          width={80}
          color="emerald"
          curveType="monotone"
        />
      </div>
      <div className="rounded-lg border border-gray-200 p-4 flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500 font-medium">Users</div>
          <div className="text-lg font-bold text-gray-900">1,240</div>
          <div className="text-xs text-red-600">-3.2%</div>
        </div>
        <SparkBarChart
          data={volatileData}
          height={32}
          width={80}
          color="red"
        />
      </div>
      <div className="rounded-lg border border-gray-200 p-4 flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500 font-medium">Stock</div>
          <div className="text-lg font-bold text-gray-900">$128</div>
          <div className="text-xs text-indigo-600">+28%</div>
        </div>
        <SparkAreaChart
          data={stockData}
          height={32}
          width={80}
          color="indigo"
          fill="gradient"
          curveType="monotone"
        />
      </div>
    </div>
  ),
};

export const AllSparkVariants: Story = {
  name: "Gallery - All Spark Chart Types",
  args: {
    data: revenueData,
    height: 32,
    width: 120,
  },
  render: () => (
    <div className="space-y-6 p-4">
      <div>
        <h3 className="text-sm font-semibold mb-3 text-gray-700">
          SparkLineChart Variants
        </h3>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <SparkLineChart
              data={revenueData}
              height={32}
              width={120}
              color="indigo"
            />
            <div className="text-xs text-gray-500 mt-1">Linear</div>
          </div>
          <div className="text-center">
            <SparkLineChart
              data={revenueData}
              height={32}
              width={120}
              color="emerald"
              curveType="monotone"
            />
            <div className="text-xs text-gray-500 mt-1">Monotone</div>
          </div>
          <div className="text-center">
            <SparkLineChart
              data={revenueData}
              height={32}
              width={120}
              color="amber"
              curveType="step"
            />
            <div className="text-xs text-gray-500 mt-1">Step</div>
          </div>
          <div className="text-center">
            <SparkLineChart
              data={revenueData}
              height={32}
              width={120}
              color="rose"
              curveType="natural"
            />
            <div className="text-xs text-gray-500 mt-1">Natural</div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3 text-gray-700">
          SparkBarChart Variants
        </h3>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <SparkBarChart
              data={revenueData}
              height={32}
              width={120}
              color="indigo"
            />
            <div className="text-xs text-gray-500 mt-1">Default</div>
          </div>
          <div className="text-center">
            <SparkBarChart
              data={volatileData}
              height={32}
              width={120}
              color="rose"
            />
            <div className="text-xs text-gray-500 mt-1">Volatile</div>
          </div>
          <div className="text-center">
            <SparkBarChart
              data={shortData}
              height={32}
              width={120}
              color="emerald"
            />
            <div className="text-xs text-gray-500 mt-1">Short Data</div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3 text-gray-700">
          SparkAreaChart Variants
        </h3>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <SparkAreaChart
              data={revenueData}
              height={32}
              width={120}
              color="indigo"
              fill="gradient"
              curveType="monotone"
            />
            <div className="text-xs text-gray-500 mt-1">Gradient</div>
          </div>
          <div className="text-center">
            <SparkAreaChart
              data={temperatureData}
              height={32}
              width={120}
              color="emerald"
              fill="solid"
              curveType="monotone"
            />
            <div className="text-xs text-gray-500 mt-1">Solid</div>
          </div>
          <div className="text-center">
            <SparkAreaChart
              data={stockData}
              height={32}
              width={120}
              color="amber"
              fill="none"
              curveType="monotone"
            />
            <div className="text-xs text-gray-500 mt-1">No Fill</div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const TableWithSparklines: Story = {
  name: "Table with Sparklines",
  args: {
    data: revenueData,
    height: 32,
    width: 120,
  },
  render: () => (
    <div className="p-4">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left">
            <th className="pb-2 font-medium text-gray-600">Metric</th>
            <th className="pb-2 font-medium text-gray-600">Current</th>
            <th className="pb-2 font-medium text-gray-600">Trend</th>
            <th className="pb-2 font-medium text-gray-600">Change</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-gray-100">
            <td className="py-3 font-medium text-gray-900">Revenue</td>
            <td className="py-3 text-gray-700">$35K</td>
            <td className="py-3">
              <SparkLineChart
                data={revenueData}
                height={24}
                width={80}
                color="emerald"
                curveType="monotone"
              />
            </td>
            <td className="py-3 text-emerald-700">+12.5%</td>
          </tr>
          <tr className="border-b border-gray-100">
            <td className="py-3 font-medium text-gray-900">Temperature</td>
            <td className="py-3 text-gray-700">6 C</td>
            <td className="py-3">
              <SparkAreaChart
                data={temperatureData}
                height={24}
                width={80}
                color="amber"
                fill="gradient"
                curveType="monotone"
              />
            </td>
            <td className="py-3 text-red-600">-76%</td>
          </tr>
          <tr className="border-b border-gray-100">
            <td className="py-3 font-medium text-gray-900">Stock</td>
            <td className="py-3 text-gray-700">$128</td>
            <td className="py-3">
              <SparkBarChart
                data={stockData}
                height={24}
                width={80}
                color="indigo"
              />
            </td>
            <td className="py-3 text-indigo-600">+28%</td>
          </tr>
          <tr>
            <td className="py-3 font-medium text-gray-900">Volatility</td>
            <td className="py-3 text-gray-700">50</td>
            <td className="py-3">
              <SparkLineChart
                data={volatileData}
                height={24}
                width={80}
                color="rose"
                curveType="monotone"
              />
            </td>
            <td className="py-3 text-gray-500">0%</td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
};

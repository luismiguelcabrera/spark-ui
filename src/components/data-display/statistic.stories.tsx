import type { Meta, StoryObj } from "@storybook/react-vite";
import { Statistic } from "./statistic";

const meta = {
  title: "Data Display/Statistic",
  component: Statistic,
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text" },
    value: { control: "text" },
    precision: { control: { type: "number", min: 0, max: 4 } },
    loading: { control: "boolean" },
  },
} satisfies Meta<typeof Statistic>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Active Users",
    value: 112893,
  },
};

export const WithPrefix: Story = {
  args: {
    title: "Revenue",
    value: 45231,
    prefix: "$",
    precision: 2,
  },
};

export const WithSuffix: Story = {
  args: {
    title: "Conversion Rate",
    value: 3.24,
    suffix: "%",
    precision: 2,
  },
};

export const PositiveTrend: Story = {
  args: {
    title: "Monthly Sales",
    value: 128400,
    prefix: "$",
    trend: { value: 12.5 },
  },
};

export const NegativeTrend: Story = {
  args: {
    title: "Bounce Rate",
    value: 42.3,
    suffix: "%",
    precision: 1,
    trend: { value: -5.2 },
  },
};

export const InvertedTrend: Story = {
  args: {
    title: "Error Rate",
    value: 2.1,
    suffix: "%",
    precision: 1,
    trend: { value: -8, isUpGood: false },
  },
};

export const Loading: Story = {
  args: {
    title: "Total Revenue",
    value: 0,
    loading: true,
  },
};

export const StringValue: Story = {
  args: {
    title: "Status",
    value: "Healthy",
  },
};

export const Gallery: Story = {
  render: (args) => (
    <div className="grid grid-cols-3 gap-6">
      <Statistic
        {...args}
        title="Total Revenue"
        value={128400}
        prefix="$"
        trend={{ value: 12.5 }}
      />
      <Statistic
        {...args}
        title="Active Users"
        value={8234}
        trend={{ value: 8.1 }}
      />
      <Statistic
        {...args}
        title="Conversion"
        value={3.24}
        suffix="%"
        precision={2}
        trend={{ value: -2.1 }}
      />
      <Statistic
        {...args}
        title="Uptime"
        value={99.97}
        suffix="%"
        precision={2}
      />
      <Statistic
        {...args}
        title="Error Rate"
        value={0.3}
        suffix="%"
        precision={1}
        trend={{ value: -15, isUpGood: false }}
      />
      <Statistic
        {...args}
        title="Avg Response"
        value={142}
        suffix="ms"
        trend={{ value: 5.2 }}
      />
    </div>
  ),
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatCard } from "./stat-card";

const meta = {
  title: "Data Display/StatCard",
  component: StatCard,
  tags: ["autodocs"],
  argTypes: {
    icon: { control: "text" },
    label: { control: "text" },
    value: { control: "text" },
    change: { control: "text" },
    iconBg: { control: "text" },
    iconColor: { control: "text" },
    changeColor: { control: "text" },
  },
} satisfies Meta<typeof StatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: "chart_bar",
    label: "Total Revenue",
    value: "$45,231",
    change: "+12.5%",
  },
};

export const WithNegativeChange: Story = {
  args: {
    icon: "arrow_downward",
    label: "Bounce Rate",
    value: "32.4%",
    change: "-5.2%",
    changeColor: "text-red-600",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
  },
};

export const CustomIcon: Story = {
  args: {
    icon: "person",
    label: "Active Users",
    value: "2,847",
    change: "+8.1%",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
};

export const NoChange: Story = {
  args: {
    icon: "mail",
    label: "Total Messages",
    value: "12,394",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
};

export const LargeNumber: Story = {
  args: {
    icon: "visibility",
    label: "Page Views",
    value: "1.2M",
    change: "+23%",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
};

export const Gallery: Story = {
  render: (args) => (
    <div className="grid grid-cols-2 gap-4 max-w-2xl">
      <StatCard
        {...args}
        icon="chart_bar"
        label="Revenue"
        value="$45,231"
        change="+12.5%"
        iconBg="bg-blue-100"
        iconColor="text-blue-600"
      />
      <StatCard
        {...args}
        icon="person"
        label="Users"
        value="2,847"
        change="+8.1%"
        iconBg="bg-emerald-100"
        iconColor="text-emerald-600"
      />
      <StatCard
        {...args}
        icon="shopping_cart"
        label="Orders"
        value="1,234"
        change="-3.2%"
        changeColor="text-red-600"
        iconBg="bg-amber-100"
        iconColor="text-amber-600"
      />
      <StatCard
        {...args}
        icon="star"
        label="Reviews"
        value="4.8"
        change="+0.3"
        iconBg="bg-purple-100"
        iconColor="text-purple-600"
      />
    </div>
  ),
};

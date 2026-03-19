import type { Meta, StoryObj } from "@storybook/react-vite";
import { Snippet } from "./snippet";

const meta = {
  title: "Data Display/Snippet",
  component: Snippet,
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "select",
      options: ["default", "primary", "secondary", "success", "warning", "danger"],
    },
    symbol: { control: "text" },
    hideCopyButton: { control: "boolean" },
    hideSymbol: { control: "boolean" },
  },
} satisfies Meta<typeof Snippet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "npm install @spark-ui/core",
  },
};

export const Primary: Story = {
  args: {
    children: "pnpm add @spark-ui/core",
    color: "primary",
  },
};

export const Success: Story = {
  args: {
    children: "Build completed successfully",
    color: "success",
    symbol: ">",
  },
};

export const Warning: Story = {
  args: {
    children: "npm audit found 3 vulnerabilities",
    color: "warning",
    symbol: "!",
  },
};

export const Danger: Story = {
  args: {
    children: "Error: Module not found",
    color: "danger",
    symbol: "x",
  },
};

export const NoCopyButton: Story = {
  args: {
    children: "npx create-next-app@latest",
    hideCopyButton: true,
  },
};

export const NoSymbol: Story = {
  args: {
    children: "https://github.com/spark-ui/spark-ui",
    hideSymbol: true,
  },
};

export const CustomSymbol: Story = {
  args: {
    children: "SELECT * FROM users WHERE active = true;",
    symbol: "sql>",
    color: "secondary",
  },
};

export const AllColors: Story = {
  render: (args) => (
    <div className="space-y-3">
      <Snippet {...args} color="default">npm install @spark-ui/core</Snippet>
      <Snippet {...args} color="primary">pnpm add @spark-ui/core</Snippet>
      <Snippet {...args} color="secondary">yarn add @spark-ui/core</Snippet>
      <Snippet {...args} color="success">Build completed</Snippet>
      <Snippet {...args} color="warning">npm audit fix</Snippet>
      <Snippet {...args} color="danger">rm -rf node_modules</Snippet>
    </div>
  ),
};

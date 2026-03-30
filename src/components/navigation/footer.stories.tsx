import type { Meta, StoryObj } from "@storybook/react-vite";
import { Footer } from "./footer";

const meta = {
  title: "Navigation/Footer",
  component: Footer,
  tags: ["autodocs"],
  argTypes: {
    fixed: { control: "boolean" },
    bordered: { control: "boolean" },
    padded: { control: "boolean" },
  },
} satisfies Meta<typeof Footer>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    bordered: true,
  },
  render: (args) => (
    <Footer {...args}>
      <p className="text-sm text-slate-500 text-center">&copy; 2024 SparkUI. All rights reserved.</p>
    </Footer>
  ),
};

export const WithLinks: Story = {
  args: {
    bordered: true,
  },
  render: (args) => (
    <Footer {...args}>
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">&copy; 2024 SparkUI</p>
        <div className="flex gap-4 text-sm text-slate-500">
          <a href="#" className="hover:text-slate-700">Privacy</a>
          <a href="#" className="hover:text-slate-700">Terms</a>
          <a href="#" className="hover:text-slate-700">Contact</a>
        </div>
      </div>
    </Footer>
  ),
};

export const Fixed: Story = {
  args: {
    fixed: true,
    bordered: true,
  },
  render: (args) => (
    <div className="relative h-48 bg-slate-50 rounded-xl overflow-hidden border border-slate-200">
      <div className="p-6">
        <p className="text-sm text-slate-500">Page content above the fixed footer.</p>
      </div>
      <Footer {...args} className="absolute">
        <p className="text-sm text-slate-500 text-center">Fixed footer content</p>
      </Footer>
    </div>
  ),
};

export const NoPadding: Story = {
  args: {
    padded: false,
    bordered: true,
  },
  render: (args) => (
    <Footer {...args}>
      <div className="px-4 py-2">
        <p className="text-sm text-slate-500">Custom padding</p>
      </div>
    </Footer>
  ),
};

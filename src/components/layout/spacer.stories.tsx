import type { Meta, StoryObj } from "@storybook/react-vite";
import { Spacer } from "./spacer";

const meta = {
  title: "Layout/Spacer",
  component: Spacer,
  tags: ["autodocs"],
} satisfies Meta<typeof Spacer>;

export default meta;
type Story = StoryObj<typeof meta>;

const Box = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-primary/10 border border-primary/20 rounded-lg p-3 text-sm font-medium text-primary text-center ${className}`}
  >
    {children}
  </div>
);

export const HorizontalSpacing: Story = {
  render: (args) => (
    <div className="flex items-center border rounded-lg p-4 w-full">
      <Box>Left</Box>
      <Spacer {...args} />
      <Box>Right</Box>
    </div>
  ),
};

export const VerticalSpacing: Story = {
  render: (args) => (
    <div className="flex flex-col border rounded-lg p-4 h-64">
      <Box>Top</Box>
      <Spacer {...args} />
      <Box>Bottom</Box>
    </div>
  ),
};

export const NavbarExample: Story = {
  name: "Navbar Use Case",
  render: (args) => (
    <div className="flex items-center border rounded-lg p-4 w-full bg-slate-50">
      <span className="font-bold text-lg text-primary">Logo</span>
      <Spacer {...args} />
      <div className="flex gap-2">
        <button
          type="button"
          className="px-3 py-1.5 text-sm rounded-md bg-primary text-white"
        >
          Sign In
        </button>
        <button
          type="button"
          className="px-3 py-1.5 text-sm rounded-md border border-slate-300 text-slate-700"
        >
          Sign Up
        </button>
      </div>
    </div>
  ),
};

export const MultipleSpacer: Story = {
  name: "Multiple Spacers",
  render: (args) => (
    <div className="flex items-center border rounded-lg p-4 w-full">
      <Box>A</Box>
      <Spacer {...args} />
      <Box>B</Box>
      <Spacer {...args} />
      <Box>C</Box>
    </div>
  ),
};

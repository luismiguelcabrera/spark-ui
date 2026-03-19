import type { Meta, StoryObj } from "@storybook/react-vite";
import { Wrap } from "./wrap";

const meta = {
  title: "Layout/Wrap",
  component: Wrap,
  tags: ["autodocs"],
  argTypes: {
    gap: {
      control: "select",
      options: ["0", "1", "2", "3", "4", "5", "6", "8"],
    },
    align: {
      control: "select",
      options: ["start", "center", "end", "stretch", "baseline"],
    },
    justify: {
      control: "select",
      options: ["start", "center", "end", "between", "around", "evenly"],
    },
  },
} satisfies Meta<typeof Wrap>;

export default meta;
type Story = StoryObj<typeof meta>;

function Box({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-primary/10 border border-primary/20 rounded-lg px-4 py-2 text-sm font-medium text-primary ${className}`}>
      {children}
    </div>
  );
}

export const Default: Story = {
  args: {
    gap: "2",
  },
  render: (args) => (
    <Wrap gap={args.gap} align={args.align} justify={args.justify}>
      {Array.from({ length: 10 }, (_, i) => (
        <Box key={i}>Item {i + 1}</Box>
      ))}
    </Wrap>
  ),
};

export const Tags: Story = {
  render: () => (
    <Wrap gap="2">
      {["React", "TypeScript", "Tailwind CSS", "Storybook", "Vitest", "ESLint", "Prettier", "Node.js"].map(
        (tag) => (
          <span
            key={tag}
            className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-xs font-medium text-primary border border-primary/20"
          >
            {tag}
          </span>
        ),
      )}
    </Wrap>
  ),
};

export const GapScale: Story = {
  render: () => (
    <div className="space-y-6">
      {(["1", "2", "4", "6", "8"] as const).map((gap) => (
        <div key={gap}>
          <p className="text-xs text-slate-400 mb-2 font-mono">gap=&quot;{gap}&quot;</p>
          <Wrap gap={gap}>
            {Array.from({ length: 8 }, (_, i) => (
              <Box key={i}>Item {i + 1}</Box>
            ))}
          </Wrap>
        </div>
      ))}
    </div>
  ),
};

export const CenterAligned: Story = {
  render: () => (
    <Wrap gap="3" justify="center">
      {Array.from({ length: 7 }, (_, i) => (
        <Box key={i} className={i % 2 === 0 ? "px-8" : "px-4"}>
          Item {i + 1}
        </Box>
      ))}
    </Wrap>
  ),
};

export const SpaceBetween: Story = {
  render: () => (
    <Wrap gap="3" justify="between">
      {Array.from({ length: 5 }, (_, i) => (
        <Box key={i}>Item {i + 1}</Box>
      ))}
    </Wrap>
  ),
};

export const MixedSizes: Story = {
  render: () => (
    <Wrap gap="3" align="center">
      <Box className="px-8 py-4 text-lg">Large</Box>
      <Box className="px-3 py-1 text-xs">Tiny</Box>
      <Box className="px-6 py-3">Medium</Box>
      <Box className="px-2 py-1 text-xs">XS</Box>
      <Box className="px-10 py-5 text-lg">Extra Large</Box>
      <Box>Default</Box>
    </Wrap>
  ),
};

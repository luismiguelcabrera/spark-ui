import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack, HStack, VStack } from "./stack";

const meta = {
  title: "Layout/Stack",
  component: Stack,
  tags: ["autodocs"],
  argTypes: {
    direction: {
      control: "select",
      options: ["vertical", "horizontal"],
    },
    gap: {
      control: "select",
      options: ["0", "1", "2", "3", "4", "5", "6", "8", "10", "12"],
    },
    align: {
      control: "select",
      options: ["start", "center", "end", "stretch", "baseline"],
    },
    justify: {
      control: "select",
      options: ["start", "center", "end", "between", "around", "evenly"],
    },
    wrap: { control: "boolean" },
    row: { control: "boolean" },
  },
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

function Box({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-primary/10 border border-primary/20 rounded-lg p-3 text-sm font-medium text-primary text-center ${className}`}>
      {children}
    </div>
  );
}

export const Default: Story = {
  args: {
    direction: "vertical",
    gap: "4",
  },
  render: (args) => (
    <Stack direction={args.direction} gap={args.gap} align={args.align} justify={args.justify} wrap={args.wrap}>
      <Box>Item 1</Box>
      <Box>Item 2</Box>
      <Box>Item 3</Box>
    </Stack>
  ),
};

export const Vertical: Story = {
  render: () => (
    <Stack gap="4">
      <Box>First</Box>
      <Box>Second</Box>
      <Box>Third</Box>
    </Stack>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <HStack gap="4" align="center">
      <Box>Left</Box>
      <Box>Center</Box>
      <Box>Right</Box>
    </HStack>
  ),
};

export const SpaceBetween: Story = {
  render: () => (
    <HStack gap="4" justify="between" align="center" className="w-full">
      <Box>Left</Box>
      <Box>Center</Box>
      <Box>Right</Box>
    </HStack>
  ),
};

export const GapScale: Story = {
  render: () => (
    <div className="space-y-6">
      {(["1", "2", "4", "6", "8"] as const).map((gap) => (
        <div key={gap}>
          <p className="text-xs text-slate-500 mb-2 font-mono">gap=&quot;{gap}&quot;</p>
          <HStack gap={gap}>
            <Box>A</Box>
            <Box>B</Box>
            <Box>C</Box>
          </HStack>
        </div>
      ))}
    </div>
  ),
};

export const VStackAligned: Story = {
  render: () => (
    <VStack gap="3" align="center">
      <Box className="w-32">Short</Box>
      <Box className="w-48">Medium width</Box>
      <Box className="w-24">Tiny</Box>
    </VStack>
  ),
};

export const WrappingStack: Story = {
  render: () => (
    <Stack row gap="3" wrap className="max-w-sm">
      {Array.from({ length: 10 }, (_, i) => (
        <Box key={i} className="px-4">Item {i + 1}</Box>
      ))}
    </Stack>
  ),
};

export const Nested: Story = {
  render: () => (
    <VStack gap="4">
      <HStack gap="3" align="center">
        <Box>Row 1 - A</Box>
        <Box>Row 1 - B</Box>
        <Box>Row 1 - C</Box>
      </HStack>
      <HStack gap="3" align="center">
        <Box>Row 2 - A</Box>
        <Box>Row 2 - B</Box>
      </HStack>
    </VStack>
  ),
};

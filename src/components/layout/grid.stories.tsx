import type { Meta, StoryObj } from "@storybook/react-vite";
import { Grid, GridItem } from "./grid";

const meta = {
  title: "Layout/Grid",
  component: Grid,
  tags: ["autodocs"],
  argTypes: {
    cols: {
      control: "select",
      options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    },
    gap: {
      control: "select",
      options: ["0", "1", "2", "3", "4", "5", "6", "8", "10", "12"],
    },
    flow: {
      control: "select",
      options: ["row", "col", "dense", "row-dense", "col-dense"],
    },
    align: {
      control: "select",
      options: ["start", "center", "end", "stretch"],
    },
  },
} satisfies Meta<typeof Grid>;

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
    cols: 3,
    gap: "4",
  },
  render: (args) => (
    <Grid cols={args.cols} gap={args.gap}>
      {Array.from({ length: 6 }, (_, i) => (
        <Box key={i}>Cell {i + 1}</Box>
      ))}
    </Grid>
  ),
};

export const WithSpanning: Story = {
  render: () => (
    <Grid cols={4} gap="4">
      <GridItem span={2}>
        <Box>Spans 2 columns</Box>
      </GridItem>
      <Box>3</Box>
      <Box>4</Box>
      <Box>5</Box>
      <GridItem span={3}>
        <Box>Spans 3 columns</Box>
      </GridItem>
    </Grid>
  ),
};

export const FeatureGrid: Story = {
  render: () => (
    <Grid cols={4} gap="4">
      <GridItem span={2} rowSpan={2}>
        <Box className="h-full min-h-[120px]">2x2 Feature</Box>
      </GridItem>
      <Box>A</Box>
      <Box>B</Box>
      <Box>C</Box>
      <Box>D</Box>
    </Grid>
  ),
};

export const ResponsiveGaps: Story = {
  render: () => (
    <div className="space-y-6">
      {(["2", "4", "6", "8"] as const).map((gap) => (
        <div key={gap}>
          <p className="text-xs text-slate-500 mb-2 font-mono">gap=&quot;{gap}&quot;</p>
          <Grid cols={4} gap={gap}>
            {Array.from({ length: 4 }, (_, i) => (
              <Box key={i}>{i + 1}</Box>
            ))}
          </Grid>
        </div>
      ))}
    </div>
  ),
};

export const TwelveColumn: Story = {
  render: () => (
    <Grid cols={12} gap="2">
      <GridItem span={12}>
        <Box>Header (12)</Box>
      </GridItem>
      <GridItem span={3}>
        <Box>Sidebar (3)</Box>
      </GridItem>
      <GridItem span={6}>
        <Box>Main (6)</Box>
      </GridItem>
      <GridItem span={3}>
        <Box>Aside (3)</Box>
      </GridItem>
      <GridItem span={12}>
        <Box>Footer (12)</Box>
      </GridItem>
    </Grid>
  ),
};

export const DifferentRowAndColGap: Story = {
  render: () => (
    <Grid cols={3} rowGap="8" colGap="2">
      {Array.from({ length: 9 }, (_, i) => (
        <Box key={i}>Cell {i + 1}</Box>
      ))}
    </Grid>
  ),
};

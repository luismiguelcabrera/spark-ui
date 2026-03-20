import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProgressBar } from "./progress-bar";

const meta = {
  title: "Data Display/ProgressBar",
  component: ProgressBar,
  tags: ["autodocs"],
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100 } },
    size: { control: "select", options: ["sm", "md"] },
    indeterminate: { control: "boolean" },
    striped: { control: "boolean" },
    bufferValue: { control: { type: "range", min: 0, max: 100 } },
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { value: 60 } };
export const Full: Story = { args: { value: 100 } };
export const Empty: Story = { args: { value: 0 } };
export const Medium: Story = { args: { value: 45, size: "md" } };

// === New stories for indeterminate prop ===

export const Indeterminate: Story = {
  args: { indeterminate: true },
};

export const IndeterminateMedium: Story = {
  args: { indeterminate: true, size: "md" },
};

// === New stories for striped prop ===

export const Striped: Story = {
  args: { value: 65, striped: true },
};

export const StripedMedium: Story = {
  args: { value: 75, striped: true, size: "md" },
};

export const IndeterminateStriped: Story = {
  args: { indeterminate: true, striped: true, size: "md" },
};

// === New stories for bufferValue prop ===

export const WithBuffer: Story = {
  args: { value: 30, bufferValue: 60 },
};

export const BufferMedium: Story = {
  args: { value: 40, bufferValue: 80, size: "md" },
};

export const BufferWithStripes: Story = {
  args: { value: 25, bufferValue: 55, striped: true, size: "md" },
};

// === Gallery story ===

export const AllVariants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-6 w-80">
      <div>
        <p className="text-sm font-semibold text-muted-foreground mb-2">Default</p>
        <ProgressBar {...args} value={60} />
      </div>
      <div>
        <p className="text-sm font-semibold text-muted-foreground mb-2">Striped</p>
        <ProgressBar {...args} value={60} striped />
      </div>
      <div>
        <p className="text-sm font-semibold text-muted-foreground mb-2">With Buffer</p>
        <ProgressBar {...args} value={35} bufferValue={70} />
      </div>
      <div>
        <p className="text-sm font-semibold text-muted-foreground mb-2">Indeterminate</p>
        <ProgressBar {...args} indeterminate />
      </div>
      <div>
        <p className="text-sm font-semibold text-muted-foreground mb-2">Indeterminate + Striped</p>
        <ProgressBar {...args} indeterminate striped />
      </div>
      <div>
        <p className="text-sm font-semibold text-muted-foreground mb-2">Medium size</p>
        <ProgressBar {...args} value={50} size="md" striped />
      </div>
    </div>
  ),
  args: {},
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import { Countdown } from "./countdown";

const futureDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000 + 30 * 60 * 1000);

const meta = {
  title: "Data Display/Countdown",
  component: Countdown,
  tags: ["autodocs"],
  args: {
    targetDate: futureDate,
  },
  argTypes: {
    variant: { control: "select", options: ["default", "cards", "minimal", "compact"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
    showDays: { control: "boolean" },
    showHours: { control: "boolean" },
    showMinutes: { control: "boolean" },
    showSeconds: { control: "boolean" },
    separator: { control: "text" },
  },
} satisfies Meta<typeof Countdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Cards: Story = {
  args: { variant: "cards" },
};

export const Minimal: Story = {
  args: { variant: "minimal" },
};

export const Compact: Story = {
  args: { variant: "compact" },
};

export const Large: Story = {
  args: { size: "lg", variant: "cards" },
};

export const Small: Story = {
  args: { size: "sm", variant: "cards" },
};

export const CustomSeparator: Story = {
  args: { separator: "|", variant: "default" },
};

export const HoursAndMinutesOnly: Story = {
  args: { showDays: false, showSeconds: false, variant: "cards" },
};

export const AllVariants: Story = {
  render: (args) => (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-2">Default</p>
        <Countdown {...args} variant="default" />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 mb-2">Cards</p>
        <Countdown {...args} variant="cards" />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 mb-2">Minimal</p>
        <Countdown {...args} variant="minimal" />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 mb-2">Compact</p>
        <Countdown {...args} variant="compact" />
      </div>
    </div>
  ),
};

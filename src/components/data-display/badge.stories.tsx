import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./badge";
import { Icon } from "./icon";

const meta = {
  title: "Data Display/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default", "primary", "success", "warning", "danger",
        "info", "accent", "mint", "purple", "indigo", "live",
      ],
    },
    size: { control: "select", options: ["sm", "md", "lg"] },
    dot: { control: "boolean" },
    bordered: { control: "boolean" },
    floating: { control: "boolean" },
    max: { control: "number" },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: "Badge" } };
export const Success: Story = { args: { children: "Active", variant: "success" } };
export const Danger: Story = { args: { children: "Error", variant: "danger" } };
export const Live: Story = { args: { children: "Live", variant: "live" } };

export const Dot: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <Badge {...args} dot variant="success" />
      <Badge {...args} dot variant="danger" />
      <Badge {...args} dot variant="primary" />
      <Badge {...args} dot variant="warning" />
      <Badge {...args} dot variant="info" />
    </div>
  ),
};

export const WithMax: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <Badge {...args} max={99} variant="danger">50</Badge>
      <Badge {...args} max={99} variant="danger">99</Badge>
      <Badge {...args} max={99} variant="danger">150</Badge>
      <Badge {...args} max={9} variant="primary">25</Badge>
    </div>
  ),
};

export const Bordered: Story = {
  render: (args) => (
    <div className="flex items-center gap-4 bg-slate-100 p-4 rounded-lg">
      <Badge {...args} bordered variant="danger">3</Badge>
      <Badge {...args} bordered variant="success">Active</Badge>
      <Badge {...args} bordered dot variant="primary" />
    </div>
  ),
};

export const Floating: Story = {
  render: (args) => (
    <div className="flex items-center gap-8">
      <Badge {...args} floating content="5" variant="danger" bordered>
        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-sm font-bold">
          AB
        </div>
      </Badge>
      <Badge {...args} floating content="99+" variant="primary" bordered>
        <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center">
          <Icon name="mail" size="md" className="text-slate-500" />
        </div>
      </Badge>
      <Badge {...args} floating dot variant="success" bordered>
        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-sm font-bold">
          JD
        </div>
      </Badge>
    </div>
  ),
};

export const FloatingWithMax: Story = {
  render: (args) => (
    <div className="flex items-center gap-8">
      <Badge {...args} floating max={99} content="150" variant="danger" bordered>
        <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center">
          <Icon name="bell" size="md" className="text-slate-500" />
        </div>
      </Badge>
    </div>
  ),
};

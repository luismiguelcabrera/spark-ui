import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pagination } from "./pagination";

const meta = {
  title: "Navigation/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["simple", "numbered"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
    rounded: { control: "boolean" },
    showFirstLast: { control: "boolean" },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Simple: Story = {
  args: { total: 100, pageSize: 10, defaultCurrent: 1 },
};

export const Numbered: Story = {
  args: { total: 250, pageSize: 25, defaultCurrent: 3, variant: "numbered" },
};

export const LastPage: Story = {
  args: { total: 50, pageSize: 10, defaultCurrent: 5 },
};

export const WithFirstLast: Story = {
  args: {
    total: 200,
    pageSize: 10,
    defaultCurrent: 5,
    variant: "numbered",
    showFirstLast: true,
  },
};

export const Rounded: Story = {
  args: {
    total: 200,
    pageSize: 10,
    defaultCurrent: 5,
    variant: "numbered",
    rounded: true,
  },
};

export const SmallSize: Story = {
  args: {
    total: 200,
    pageSize: 10,
    defaultCurrent: 5,
    variant: "numbered",
    size: "sm",
  },
};

export const LargeSize: Story = {
  args: {
    total: 200,
    pageSize: 10,
    defaultCurrent: 5,
    variant: "numbered",
    size: "lg",
  },
};

export const CustomActiveColor: Story = {
  args: {
    total: 200,
    pageSize: 10,
    defaultCurrent: 5,
    variant: "numbered",
    activeColor: "bg-emerald-600",
  },
};

export const SimpleWithFirstLast: Story = {
  args: {
    total: 100,
    pageSize: 10,
    defaultCurrent: 5,
    showFirstLast: true,
  },
};

export const Gallery: Story = {
  render: (args) => (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase mb-3">Numbered (default)</p>
        <Pagination total={200} pageSize={10} defaultCurrent={5} variant="numbered" aria-label="Numbered pagination" {...args} />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase mb-3">With First/Last + Rounded</p>
        <Pagination
          total={200}
          pageSize={10}
          defaultCurrent={5}
          variant="numbered"
          aria-label="First last pagination"
        />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase mb-3">Small Size</p>
        <Pagination total={200} pageSize={10} defaultCurrent={5} variant="numbered" size="sm" aria-label="Small pagination" />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase mb-3">Large Size</p>
        <Pagination total={200} pageSize={10} defaultCurrent={5} variant="numbered" size="lg" aria-label="Large pagination" />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase mb-3">Custom Active Color</p>
        <Pagination
          total={200}
          pageSize={10}
          defaultCurrent={5}
          variant="numbered"
          aria-label="Custom color pagination"
        />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase mb-3">Simple with First/Last</p>
        <Pagination total={100} pageSize={10} defaultCurrent={5} aria-label="Simple pagination" />
      </div>
    </div>
  ),
};

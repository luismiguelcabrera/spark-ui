import type { Meta, StoryObj } from "@storybook/react-vite";
import { Masonry } from "./masonry";

const meta = {
  title: "Layout/Masonry",
  component: Masonry,
  tags: ["autodocs"],
  argTypes: {
    columns: { control: { type: "number", min: 1, max: 8 } },
    gap: { control: { type: "range", min: 0, max: 48 } },
  },
} satisfies Meta<typeof Masonry>;

export default meta;
type Story = StoryObj<typeof meta>;

const items = [
  { h: 120, color: "bg-blue-100", label: "1" },
  { h: 180, color: "bg-green-100", label: "2" },
  { h: 100, color: "bg-purple-100", label: "3" },
  { h: 200, color: "bg-orange-100", label: "4" },
  { h: 140, color: "bg-rose-100", label: "5" },
  { h: 160, color: "bg-cyan-100", label: "6" },
  { h: 110, color: "bg-amber-100", label: "7" },
  { h: 190, color: "bg-emerald-100", label: "8" },
  { h: 130, color: "bg-indigo-100", label: "9" },
];

const MasonryItem = ({
  h,
  color,
  label,
}: {
  h: number;
  color: string;
  label: string;
}) => (
  <div
    className={`flex items-center justify-center rounded-lg ${color} text-sm font-semibold text-slate-700`}
    style={{ height: h }}
  >
    Item {label}
  </div>
);

export const Default: Story = {
  args: {
    columns: 3,
    gap: 16,
    children: items.map((item) => (
      <MasonryItem key={item.label} {...item} />
    )),
  },
};

export const TwoColumns: Story = {
  args: {
    columns: 2,
    gap: 16,
    children: items.map((item) => (
      <MasonryItem key={item.label} {...item} />
    )),
  },
};

export const FourColumns: Story = {
  args: {
    columns: 4,
    gap: 12,
    children: items.map((item) => (
      <MasonryItem key={item.label} {...item} />
    )),
  },
};

export const Responsive: Story = {
  args: {
    columns: { sm: 1, md: 2, lg: 3, xl: 4 },
    gap: 16,
    children: items.map((item) => (
      <MasonryItem key={item.label} {...item} />
    )),
  },
};

export const Gallery: Story = {
  render: (args) => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-2 text-sm font-semibold text-slate-600">
          2 columns, 8px gap
        </h3>
        <Masonry {...args} columns={2} gap={8}>
          {items.slice(0, 6).map((item) => (
            <MasonryItem key={item.label} {...item} />
          ))}
        </Masonry>
      </div>
      <div>
        <h3 className="mb-2 text-sm font-semibold text-slate-600">
          3 columns, 16px gap (default)
        </h3>
        <Masonry {...args} columns={3} gap={16}>
          {items.map((item) => (
            <MasonryItem key={item.label} {...item} />
          ))}
        </Masonry>
      </div>
      <div>
        <h3 className="mb-2 text-sm font-semibold text-slate-600">
          4 columns, 24px gap
        </h3>
        <Masonry {...args} columns={4} gap={24}>
          {items.map((item) => (
            <MasonryItem key={item.label} {...item} />
          ))}
        </Masonry>
      </div>
      <div>
        <h3 className="mb-2 text-sm font-semibold text-slate-600">
          1 column (stacked)
        </h3>
        <Masonry {...args} columns={1} gap={12}>
          {items.slice(0, 4).map((item) => (
            <MasonryItem key={item.label} {...item} />
          ))}
        </Masonry>
      </div>
    </div>
  ),
  args: {
    columns: 3,
    gap: 16,
    children: items.map((item) => (
      <MasonryItem key={item.label} {...item} />
    )),
  },
};

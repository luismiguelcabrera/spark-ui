import type { Meta, StoryObj } from "@storybook/react-vite";
import { Container } from "./container";

const meta = {
  title: "Layout/Container",
  component: Container,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl", "2xl", "full"],
    },
  },
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: "xl",
  },
  render: (args) => (
    <Container size={args.size} className="bg-slate-50 p-4 rounded-lg">
      <div className="bg-white border border-slate-200 p-6 rounded-lg text-center">
        <p className="text-sm text-slate-600">
          Container with size <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">{args.size}</code>
        </p>
      </div>
    </Container>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="space-y-4">
      {(["sm", "md", "lg", "xl", "2xl", "full"] as const).map((size) => (
        <Container key={size} size={size} className="bg-slate-50 p-2 rounded-lg">
          <div className="bg-white p-3 rounded text-xs text-center font-mono border border-slate-200">
            {size}
          </div>
        </Container>
      ))}
    </div>
  ),
};

export const WithContent: Story = {
  render: () => (
    <Container size="md">
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Article Title</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          The Container component constrains content width and centers it horizontally.
          It includes responsive padding that adjusts at different breakpoints.
          This makes it ideal for wrapping page-level content like articles, forms, or dashboards.
        </p>
        <p className="text-sm text-slate-600 leading-relaxed">
          Use the <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">size</code> prop to
          control the maximum width: sm, md, lg, xl, 2xl, or full.
        </p>
      </div>
    </Container>
  ),
};

export const Nested: Story = {
  render: () => (
    <Container size="xl" className="bg-slate-50 p-6 rounded-xl">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Outer Container (xl)</h2>
      <Container size="sm" className="bg-white border border-slate-200 p-6 rounded-lg">
        <p className="text-sm text-slate-500 text-center">
          Inner Container (sm) nested inside an xl container
        </p>
      </Container>
    </Container>
  ),
};

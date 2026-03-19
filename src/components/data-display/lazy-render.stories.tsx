import type { Meta, StoryObj } from "@storybook/react-vite";
import { LazyRender } from "./lazy-render";

const meta = {
  title: "Data Display/LazyRender",
  component: LazyRender,
  tags: ["autodocs"],
  argTypes: {
    once: { control: "boolean" },
    rootMargin: { control: "text" },
    threshold: { control: { type: "number", min: 0, max: 1, step: 0.1 } },
  },
} satisfies Meta<typeof LazyRender>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    once: true,
    placeholder: (
      <div className="h-40 rounded-xl bg-slate-100 animate-pulse flex items-center justify-center text-sm text-slate-700">
        Loading content...
      </div>
    ),
    children: (
      <div className="h-40 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-medium text-primary">
        Content loaded!
      </div>
    ),
  },
};

export const ScrollToReveal: Story = {
  args: {
    once: true,
    children: null,
  },
  render: (args) => (
    <div>
      <div className="h-[80vh] flex items-center justify-center text-slate-700">
        Scroll down to reveal lazy content
      </div>
      {Array.from({ length: 5 }, (_, i) => (
        <LazyRender
          key={i}
          {...args}
          placeholder={
            <div className="h-32 mb-4 rounded-xl bg-slate-100 animate-pulse" />
          }
        >
          <div className="h-32 mb-4 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-medium text-primary">
            Card {i + 1} loaded
          </div>
        </LazyRender>
      ))}
      <div className="h-[50vh]" />
    </div>
  ),
};

export const WithRootMargin: Story = {
  args: {
    once: true,
    rootMargin: "200px 0px",
    placeholder: (
      <div className="h-40 rounded-xl bg-slate-100 animate-pulse flex items-center justify-center text-sm text-slate-700">
        Will load 200px before entering viewport
      </div>
    ),
    children: (
      <div className="h-40 rounded-xl bg-green-50 border border-green-200 flex items-center justify-center text-sm font-medium text-green-700">
        Pre-loaded with rootMargin
      </div>
    ),
  },
};

export const ToggleOnScroll: Story = {
  args: {
    once: false,
    placeholder: (
      <div className="h-40 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-sm text-red-700">
        Out of viewport
      </div>
    ),
    children: (
      <div className="h-40 rounded-xl bg-green-50 border border-green-200 flex items-center justify-center text-sm text-green-700">
        In viewport
      </div>
    ),
  },
};

export const LazyImage: Story = {
  args: {
    once: true,
    children: null,
  },
  render: (args) => (
    <div>
      <div className="h-[80vh] flex items-center justify-center text-slate-700">
        Scroll down for lazy images
      </div>
      {Array.from({ length: 3 }, (_, i) => (
        <LazyRender
          key={i}
          {...args}
          placeholder={
            <div className="h-64 mb-4 rounded-xl bg-slate-100 animate-pulse" />
          }
        >
          <img
            src={`https://picsum.photos/seed/${i}/800/300`}
            alt={`Lazy loaded ${i + 1}`}
            className="h-64 w-full object-cover mb-4 rounded-xl"
          />
        </LazyRender>
      ))}
    </div>
  ),
};

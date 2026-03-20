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
      <div className="h-40 rounded-xl bg-muted animate-pulse flex items-center justify-center text-sm text-navy-text">
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
      <div className="h-[80vh] flex items-center justify-center text-navy-text">
        Scroll down to reveal lazy content
      </div>
      {Array.from({ length: 5 }, (_, i) => (
        <LazyRender
          key={i}
          {...args}
          placeholder={
            <div className="h-32 mb-4 rounded-xl bg-muted animate-pulse" />
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
      <div className="h-40 rounded-xl bg-muted animate-pulse flex items-center justify-center text-sm text-navy-text">
        Will load 200px before entering viewport
      </div>
    ),
    children: (
      <div className="h-40 rounded-xl bg-success/10 border border-success/20 flex items-center justify-center text-sm font-medium text-success">
        Pre-loaded with rootMargin
      </div>
    ),
  },
};

export const ToggleOnScroll: Story = {
  args: {
    once: false,
    placeholder: (
      <div className="h-40 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-center text-sm text-destructive">
        Out of viewport
      </div>
    ),
    children: (
      <div className="h-40 rounded-xl bg-success/10 border border-success/20 flex items-center justify-center text-sm text-success">
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
      <div className="h-[80vh] flex items-center justify-center text-navy-text">
        Scroll down for lazy images
      </div>
      {Array.from({ length: 3 }, (_, i) => (
        <LazyRender
          key={i}
          {...args}
          placeholder={
            <div className="h-64 mb-4 rounded-xl bg-muted animate-pulse" />
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

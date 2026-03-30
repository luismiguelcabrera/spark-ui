import type { Meta, StoryObj } from "@storybook/react-vite";
import { SlideGroup } from "./slide-group";

const meta = {
  title: "Navigation/SlideGroup",
  component: SlideGroup,
  tags: ["autodocs"],
  argTypes: {
    showArrows: { control: "boolean" },
    centerActive: { control: "boolean" },
  },
} satisfies Meta<typeof SlideGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

const items = Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`);

export const Default: Story = {
  args: {
    showArrows: true,
  },
  render: (args) => (
    <div className="max-w-md">
      <SlideGroup {...args}>
        {items.map((item) => (
          <div
            key={item}
            className="shrink-0 px-4 py-2 bg-slate-100 rounded-lg text-sm text-slate-700 whitespace-nowrap"
          >
            {item}
          </div>
        ))}
      </SlideGroup>
    </div>
  ),
};

export const WithoutArrows: Story = {
  args: {
    showArrows: false,
  },
  render: (args) => (
    <div className="max-w-md">
      <SlideGroup {...args}>
        {items.map((item) => (
          <div
            key={item}
            className="shrink-0 px-4 py-2 bg-slate-100 rounded-lg text-sm text-slate-700 whitespace-nowrap"
          >
            {item}
          </div>
        ))}
      </SlideGroup>
    </div>
  ),
};

export const FewItems: Story = {
  args: {
    showArrows: true,
  },
  render: (args) => (
    <div className="max-w-md">
      <SlideGroup {...args}>
        <div className="shrink-0 px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium">Active</div>
        <div className="shrink-0 px-4 py-2 bg-slate-100 rounded-lg text-sm text-slate-700">Tab 2</div>
        <div className="shrink-0 px-4 py-2 bg-slate-100 rounded-lg text-sm text-slate-700">Tab 3</div>
      </SlideGroup>
    </div>
  ),
};

export const ChipStyle: Story = {
  args: {
    showArrows: true,
  },
  render: (args) => (
    <div className="max-w-sm">
      <SlideGroup {...args}>
        {["All", "Music", "Podcasts", "Live", "Gaming", "Sports", "News", "Fashion", "Learning", "Trending"].map(
          (label) => (
            <button
              key={label}
              type="button"
              className="shrink-0 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-sm text-slate-700 transition-colors"
            >
              {label}
            </button>
          )
        )}
      </SlideGroup>
    </div>
  ),
};

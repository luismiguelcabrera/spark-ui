import type { Meta, StoryObj } from "@storybook/react";
import { TableOfContents, type TocItem } from "./table-of-contents";

const meta = {
  title: "Navigation/TableOfContents",
  component: TableOfContents,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "minimal", "bordered"],
    },
    smooth: {
      control: "boolean",
    },
    offset: {
      control: "number",
    },
  },
} satisfies Meta<typeof TableOfContents>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Data ────────────────────────────────────────────────

const flatItems: TocItem[] = [
  { id: "introduction", label: "Introduction" },
  { id: "getting-started", label: "Getting Started" },
  { id: "installation", label: "Installation" },
  { id: "configuration", label: "Configuration" },
  { id: "api-reference", label: "API Reference" },
  { id: "faq", label: "FAQ" },
];

const nestedItems: TocItem[] = [
  {
    id: "introduction",
    label: "Introduction",
    children: [
      { id: "overview", label: "Overview", level: 1 },
      { id: "motivation", label: "Motivation", level: 1 },
    ],
  },
  {
    id: "getting-started",
    label: "Getting Started",
    children: [
      { id: "installation", label: "Installation", level: 1 },
      {
        id: "configuration",
        label: "Configuration",
        level: 1,
        children: [
          { id: "basic-config", label: "Basic Config", level: 2 },
          { id: "advanced-config", label: "Advanced Config", level: 2 },
        ],
      },
    ],
  },
  {
    id: "api-reference",
    label: "API Reference",
    children: [
      { id: "components", label: "Components", level: 1 },
      { id: "hooks", label: "Hooks", level: 1 },
      { id: "utilities", label: "Utilities", level: 1 },
    ],
  },
  { id: "changelog", label: "Changelog" },
];

// ── Stories ──────────────────────────────────────────────

export const Default: Story = {
  args: {
    items: flatItems,
    activeId: "getting-started",
    variant: "default",
  },
};

export const Nested: Story = {
  args: {
    items: nestedItems,
    activeId: "configuration",
    variant: "default",
  },
};

export const Minimal: Story = {
  args: {
    items: flatItems,
    activeId: "installation",
    variant: "minimal",
  },
};

export const Bordered: Story = {
  args: {
    items: nestedItems,
    activeId: "hooks",
    variant: "bordered",
  },
};

export const Gallery: Story = {
  render: (args) => (
    <div className="grid grid-cols-3 gap-8">
      <div>
        <h3 className="text-sm font-semibold text-slate-500 mb-4">Default</h3>
        <TableOfContents
          {...args}
          items={nestedItems}
          activeId="configuration"
          variant="default"
        />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-slate-500 mb-4">Minimal</h3>
        <TableOfContents
          {...args}
          items={nestedItems}
          activeId="configuration"
          variant="minimal"
        />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-slate-500 mb-4">Bordered</h3>
        <TableOfContents
          {...args}
          items={nestedItems}
          activeId="configuration"
          variant="bordered"
        />
      </div>
    </div>
  ),
  args: {
    items: nestedItems,
    variant: "default",
  },
};

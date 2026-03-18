import type { Meta, StoryObj } from "@storybook/react-vite";
import { Cascader, type CascaderOption } from "./cascader";

const locationOptions: CascaderOption[] = [
  {
    label: "United States",
    value: "us",
    children: [
      {
        label: "California",
        value: "ca",
        children: [
          { label: "Los Angeles", value: "la" },
          { label: "San Francisco", value: "sf" },
          { label: "San Diego", value: "sd" },
        ],
      },
      {
        label: "New York",
        value: "ny",
        children: [
          { label: "New York City", value: "nyc" },
          { label: "Buffalo", value: "buf" },
          { label: "Albany", value: "alb" },
        ],
      },
      {
        label: "Texas",
        value: "tx",
        children: [
          { label: "Houston", value: "hou" },
          { label: "Dallas", value: "dal" },
          { label: "Austin", value: "aus" },
        ],
      },
    ],
  },
  {
    label: "Canada",
    value: "ca-country",
    children: [
      {
        label: "Ontario",
        value: "on",
        children: [
          { label: "Toronto", value: "tor" },
          { label: "Ottawa", value: "ott" },
        ],
      },
      {
        label: "British Columbia",
        value: "bc",
        children: [
          { label: "Vancouver", value: "van" },
          { label: "Victoria", value: "vic" },
        ],
      },
    ],
  },
  {
    label: "Mexico",
    value: "mx",
    children: [
      {
        label: "Mexico City",
        value: "mxc-state",
        children: [{ label: "Mexico City", value: "mxc" }],
      },
      {
        label: "Jalisco",
        value: "jal",
        children: [{ label: "Guadalajara", value: "gdl" }],
      },
    ],
  },
];

const meta = {
  title: "Forms/Cascader",
  component: Cascader,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    expandTrigger: { control: "select", options: ["click", "hover"] },
    searchable: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    options: locationOptions,
    placeholder: "Select location...",
  },
} satisfies Meta<typeof Cascader>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Basic ──
export const Default: Story = {};

export const WithDefaultValue: Story = {
  args: {
    defaultValue: ["us", "ca", "sf"],
  },
};

export const Controlled: Story = {
  args: {
    value: ["ca-country", "on", "tor"],
  },
};

// ── Search ──
export const Searchable: Story = {
  args: {
    searchable: true,
  },
};

// ── Sizes ──
export const Small: Story = { args: { size: "sm" } };
export const Medium: Story = { args: { size: "md" } };
export const Large: Story = { args: { size: "lg" } };

// ── Expand Trigger ──
export const HoverExpand: Story = {
  args: {
    expandTrigger: "hover",
  },
};

// ── Disabled ──
export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: ["us", "ny", "nyc"],
  },
};

// ── Custom Display ──
export const CustomDisplayRender: Story = {
  args: {
    defaultValue: ["us", "ca", "la"],
    displayRender: (labels: string[]) => labels.join(" -> "),
  },
};

// ── Gallery ──
export const Gallery: Story = {
  render: (args) => (
    <div className="flex flex-col gap-6 max-w-md">
      <div>
        <p className="text-xs font-semibold text-slate-400 mb-2">SMALL</p>
        <Cascader {...args} size="sm" placeholder="Small cascader" />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-400 mb-2">MEDIUM (DEFAULT)</p>
        <Cascader {...args} size="md" placeholder="Medium cascader" />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-400 mb-2">LARGE</p>
        <Cascader {...args} size="lg" placeholder="Large cascader" />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-400 mb-2">WITH SEARCH</p>
        <Cascader {...args} searchable placeholder="Search locations..." />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-400 mb-2">DISABLED</p>
        <Cascader {...args} disabled defaultValue={["us", "ca", "la"]} />
      </div>
    </div>
  ),
};

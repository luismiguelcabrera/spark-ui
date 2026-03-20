import type { Meta, StoryObj } from "@storybook/react-vite";
import { OrganizationChart } from "./organization-chart";
import type { OrgNode } from "./organization-chart";

const simpleData: OrgNode = {
  id: "ceo",
  label: "Alice Chen",
  title: "CEO",
  children: [
    {
      id: "cto",
      label: "Bob Smith",
      title: "CTO",
      children: [
        { id: "dev1", label: "Carol Lee", title: "Sr. Engineer" },
        { id: "dev2", label: "Dan Park", title: "Sr. Engineer" },
      ],
    },
    {
      id: "cfo",
      label: "Eve Johnson",
      title: "CFO",
      children: [
        { id: "fin1", label: "Frank Wu", title: "Finance Manager" },
      ],
    },
  ],
};

const meta = {
  title: "Data Display/OrganizationChart",
  component: OrganizationChart,
  tags: ["autodocs"],
  argTypes: {
    direction: { control: "select", options: ["vertical", "horizontal"] },
    lineColor: { control: "text" },
  },
} satisfies Meta<typeof OrganizationChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { data: simpleData },
};

export const Horizontal: Story = {
  args: { data: simpleData, direction: "horizontal" },
};

export const SingleNode: Story = {
  args: {
    data: { id: "root", label: "Solo Founder", title: "CEO & CTO" },
  },
};

export const DeepHierarchy: Story = {
  args: {
    data: {
      id: "l1",
      label: "Level 1",
      title: "Root",
      children: [
        {
          id: "l2",
          label: "Level 2",
          title: "Director",
          children: [
            {
              id: "l3",
              label: "Level 3",
              title: "Manager",
              children: [
                { id: "l4a", label: "Level 4-A", title: "Lead" },
                { id: "l4b", label: "Level 4-B", title: "Lead" },
              ],
            },
          ],
        },
      ],
    },
  },
};

export const WideOrg: Story = {
  args: {
    data: {
      id: "ceo",
      label: "CEO",
      title: "Chief Executive",
      children: [
        { id: "vp1", label: "VP Engineering", title: "VP" },
        { id: "vp2", label: "VP Product", title: "VP" },
        { id: "vp3", label: "VP Design", title: "VP" },
        { id: "vp4", label: "VP Sales", title: "VP" },
        { id: "vp5", label: "VP Marketing", title: "VP" },
      ],
    },
  },
};

export const WithClickHandler: Story = {
  args: {
    data: simpleData,
    onNodeClick: (node) => alert(`Clicked: ${node.label} (${node.title})`),
  },
};

export const CustomLineColor: Story = {
  args: {
    data: simpleData,
    lineColor: "primary",
  },
};

export const CustomNodeRenderer: Story = {
  args: {
    data: {
      id: "ceo",
      label: "Alice Chen",
      title: "CEO",
      children: [
        { id: "cto", label: "Bob Smith", title: "CTO" },
        { id: "cfo", label: "Eve Johnson", title: "CFO" },
      ],
    },
    renderNode: (node: OrgNode) => (
      <div className="inline-flex items-center gap-2 rounded-lg bg-primary/10 border border-primary/20 px-4 py-2">
        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
          {node.label.charAt(0)}
        </div>
        <div>
          <div className="text-sm font-semibold text-navy-text">{node.label}</div>
          {node.title && <div className="text-xs text-muted-foreground">{node.title}</div>}
        </div>
      </div>
    ),
  },
};

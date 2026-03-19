import type { Meta, StoryObj } from "@storybook/react-vite";
import { MetadataGrid, MetadataItem } from "./metadata-grid";

const meta = {
  title: "Data Display/MetadataGrid",
  component: MetadataGrid,
  tags: ["autodocs"],
  argTypes: {
    columns: { control: "select", options: [2, 3, 4] },
  },
} satisfies Meta<typeof MetadataGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <MetadataItem label="Status" value="Active" />
        <MetadataItem label="Created" value="Jan 15, 2026" />
        <MetadataItem label="Updated" value="Mar 10, 2026" />
        <MetadataItem label="Owner" value="John Doe" />
      </>
    ),
  },
};

export const ThreeColumns: Story = {
  args: {
    columns: 3,
    children: (
      <>
        <MetadataItem label="Name" value="Spark UI" />
        <MetadataItem label="Version" value="1.0.0" />
        <MetadataItem label="License" value="MIT" />
        <MetadataItem label="Downloads" value="12,450" />
        <MetadataItem label="Stars" value="1,234" />
        <MetadataItem label="Contributors" value="42" />
      </>
    ),
  },
};

export const TwoColumns: Story = {
  args: {
    columns: 2,
    children: (
      <>
        <MetadataItem label="Full Name" value="Jane Smith" />
        <MetadataItem label="Email" value="jane@example.com" />
        <MetadataItem label="Role" value="Admin" />
        <MetadataItem label="Department" value="Engineering" />
      </>
    ),
  },
};

export const WithIcons: Story = {
  args: {
    columns: 2,
    children: (
      <>
        <MetadataItem icon="user" label="Author" value="Alice Johnson" />
        <MetadataItem icon="calendar" label="Published" value="Feb 28, 2026" />
        <MetadataItem icon="clock" label="Read Time" value="5 min" />
        <MetadataItem icon="eye" label="Views" value="2,340" />
      </>
    ),
  },
};

export const ProjectDetails: Story = {
  args: {
    columns: 4,
    children: (
      <>
        <MetadataItem icon="folder" label="Project" value="spark-ui" />
        <MetadataItem icon="git-branch" label="Branch" value="main" />
        <MetadataItem icon="check-circle" label="Build" value="Passing" />
        <MetadataItem icon="shield" label="Coverage" value="94%" />
        <MetadataItem icon="package" label="Size" value="42 KB" />
        <MetadataItem icon="zap" label="Performance" value="98/100" />
        <MetadataItem icon="globe" label="CDN" value="Enabled" />
        <MetadataItem icon="lock" label="Security" value="A+" />
      </>
    ),
  },
};

export const RichValues: Story = {
  args: {
    columns: 3,
    children: (
      <>
        <MetadataItem
          label="Status"
          value={
            <span className="inline-flex items-center gap-1.5 text-green-700">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Online
            </span>
          }
        />
        <MetadataItem
          label="Progress"
          value={
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 rounded-full bg-slate-200">
                <div className="h-2 rounded-full bg-primary" style={{ width: "73%" }} />
              </div>
              <span className="text-sm">73%</span>
            </div>
          }
        />
        <MetadataItem
          label="Rating"
          value={<span className="text-amber-700">4.8 / 5.0</span>}
        />
      </>
    ),
  },
};

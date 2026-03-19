import type { Meta, StoryObj } from "@storybook/react-vite";
import { TreeSelect, type TreeSelectNode } from "./tree-select";

const fileSystemData: TreeSelectNode[] = [
  {
    label: "Documents",
    value: "docs",
    icon: "folder",
    children: [
      {
        label: "Work",
        value: "work",
        icon: "folder",
        children: [
          { label: "Proposal.docx", value: "proposal", icon: "description" },
          { label: "Budget.xlsx", value: "budget", icon: "description" },
          { label: "Presentation.pptx", value: "presentation", icon: "description" },
        ],
      },
      {
        label: "Personal",
        value: "personal",
        icon: "folder",
        children: [
          { label: "Resume.pdf", value: "resume", icon: "description" },
          { label: "Cover Letter.docx", value: "cover-letter", icon: "description" },
        ],
      },
      { label: "README.md", value: "readme", icon: "description" },
    ],
  },
  {
    label: "Images",
    value: "images",
    icon: "folder",
    children: [
      { label: "photo-1.png", value: "photo1", icon: "image" },
      { label: "photo-2.jpg", value: "photo2", icon: "image" },
      { label: "logo.svg", value: "logo", icon: "image" },
    ],
  },
  {
    label: "Music",
    value: "music",
    icon: "folder",
    children: [
      {
        label: "Albums",
        value: "albums",
        icon: "folder",
        children: [
          { label: "track-01.mp3", value: "track01", icon: "music_note" },
          { label: "track-02.mp3", value: "track02", icon: "music_note" },
        ],
      },
      { label: "podcast.mp3", value: "podcast", icon: "music_note" },
    ],
  },
  {
    label: "Archive (locked)",
    value: "archive",
    icon: "folder",
    disabled: true,
    children: [
      { label: "old-data.zip", value: "old-data" },
    ],
  },
];

const meta = {
  title: "Forms/TreeSelect",
  component: TreeSelect,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    multiple: { control: "boolean" },
    checkable: { control: "boolean" },
    searchable: { control: "boolean" },
    expandAll: { control: "boolean" },
    showPath: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    data: fileSystemData,
    placeholder: "Select a file...",
  },
} satisfies Meta<typeof TreeSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Basic ──
export const Default: Story = {};

export const WithDefaultValue: Story = {
  args: {
    defaultValue: "readme",
  },
};

export const Controlled: Story = {
  args: {
    value: "proposal",
    showPath: true,
  },
};

// ── Expand All ──
export const ExpandedAll: Story = {
  args: {
    expandAll: true,
  },
};

// ── Multiple ──
export const Multiple: Story = {
  args: {
    multiple: true,
    expandAll: true,
  },
};

export const MultipleWithValues: Story = {
  args: {
    multiple: true,
    value: ["photo1", "logo", "readme"],
    expandAll: true,
  },
};

// ── Checkable ──
export const Checkable: Story = {
  args: {
    checkable: true,
    expandAll: true,
  },
};

export const CheckableWithValues: Story = {
  args: {
    checkable: true,
    expandAll: true,
    value: ["photo1", "photo2", "logo", "images"],
  },
};

// ── Search ──
export const Searchable: Story = {
  args: {
    searchable: true,
    expandAll: true,
  },
};

// ── Show Path ──
export const ShowPath: Story = {
  args: {
    value: "proposal",
    showPath: true,
  },
};

// ── Sizes ──
export const Small: Story = { args: { size: "sm" } };
export const Medium: Story = { args: { size: "md" } };
export const Large: Story = { args: { size: "lg" } };

// ── Disabled ──
export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: "readme",
  },
};

// ── Gallery ──
export const Gallery: Story = {
  render: (args) => (
    <div className="flex flex-col gap-6 max-w-md">
      <div>
        <p className="text-xs font-semibold text-slate-500 mb-2">SINGLE SELECT</p>
        <TreeSelect {...args} placeholder="Select a file..." />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-500 mb-2">MULTIPLE SELECT</p>
        <TreeSelect {...args} multiple expandAll placeholder="Select files..." />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-500 mb-2">CHECKABLE</p>
        <TreeSelect {...args} checkable expandAll placeholder="Check files..." />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-500 mb-2">SEARCHABLE</p>
        <TreeSelect {...args} searchable expandAll placeholder="Search files..." />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-500 mb-2">SHOW PATH</p>
        <TreeSelect {...args} value="proposal" showPath />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-500 mb-2">DISABLED</p>
        <TreeSelect {...args} disabled defaultValue="readme" />
      </div>
    </div>
  ),
};

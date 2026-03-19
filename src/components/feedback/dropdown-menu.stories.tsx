import type { Meta, StoryObj } from "@storybook/react-vite";
import { DropdownMenu } from "./dropdown-menu";
import type { DropdownItem } from "./dropdown-menu";

const meta = {
  title: "Feedback/DropdownMenu",
  component: DropdownMenu,
  tags: ["autodocs"],
  argTypes: {
    align: { control: "select", options: ["left", "right"] },
  },
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultItems: DropdownItem[] = [
  { label: "Edit", icon: "edit" },
  { label: "Duplicate", icon: "content_copy" },
  { label: "Share", icon: "share" },
  { label: "", divider: true },
  { label: "Delete", icon: "delete", danger: true },
];

export const Default: Story = {
  args: {
    items: defaultItems,
    trigger: (
      <button
        type="button"
        className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium"
      >
        Open Menu
      </button>
    ),
  },
};

export const RightAligned: Story = {
  args: {
    items: defaultItems,
    align: "right",
    trigger: (
      <button
        type="button"
        className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium"
      >
        Right-Aligned Menu
      </button>
    ),
  },
  render: (args) => (
    <div className="flex justify-end">
      <DropdownMenu {...args} />
    </div>
  ),
};

export const WithIcons: Story = {
  args: {
    items: [
      { label: "Profile", icon: "person" },
      { label: "Settings", icon: "settings" },
      { label: "Help", icon: "help" },
      { label: "", divider: true },
      { label: "Sign Out", icon: "logout" },
    ],
    trigger: (
      <button
        type="button"
        className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium border border-slate-200"
      >
        Account
      </button>
    ),
  },
};

export const WithDangerItem: Story = {
  args: {
    items: [
      { label: "Edit", icon: "edit" },
      { label: "Archive", icon: "archive" },
      { label: "", divider: true },
      { label: "Delete permanently", icon: "delete", danger: true },
    ],
    trigger: (
      <button
        type="button"
        className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium"
      >
        Actions
      </button>
    ),
  },
};

export const SimpleList: Story = {
  args: {
    items: [
      { label: "Option A" },
      { label: "Option B" },
      { label: "Option C" },
      { label: "Option D" },
    ],
    trigger: (
      <button
        type="button"
        className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium"
      >
        Simple Menu
      </button>
    ),
  },
};

export const CompoundAPI: Story = {
  args: {},
  render: (args) => (
    <DropdownMenu
      {...args}
      trigger={
        <button
          type="button"
          className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium"
        >
          Compound Menu
        </button>
      }
    >
      <DropdownMenu.Item icon="edit" onClick={() => {}}>
        Edit
      </DropdownMenu.Item>
      <DropdownMenu.Item icon="content_copy" onClick={() => {}}>
        Duplicate
      </DropdownMenu.Item>
      <DropdownMenu.Item icon="share" onClick={() => {}}>
        Share
      </DropdownMenu.Item>
      <DropdownMenu.Divider />
      <DropdownMenu.Item icon="delete" danger onClick={() => {}}>
        Delete
      </DropdownMenu.Item>
    </DropdownMenu>
  ),
};

export const MixedContent: Story = {
  args: {},
  render: (args) => (
    <DropdownMenu
      {...args}
      trigger={
        <button
          type="button"
          className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium border border-slate-200"
        >
          More Options
        </button>
      }
    >
      <DropdownMenu.Item icon="visibility" onClick={() => {}}>
        View Details
      </DropdownMenu.Item>
      <DropdownMenu.Item icon="download" onClick={() => {}}>
        Download
      </DropdownMenu.Item>
      <DropdownMenu.Item icon="print" onClick={() => {}}>
        Print
      </DropdownMenu.Item>
      <DropdownMenu.Divider />
      <DropdownMenu.Item icon="flag" onClick={() => {}}>
        Report
      </DropdownMenu.Item>
    </DropdownMenu>
  ),
};

export const InlineMode: Story = {
  args: {
    items: [
      { label: "Cut", icon: "content_cut" },
      { label: "Copy", icon: "content_copy" },
      { label: "Paste", icon: "content_paste" },
    ],
  },
  render: (args) => (
    <div className="relative w-48">
      <DropdownMenu {...args} />
    </div>
  ),
};

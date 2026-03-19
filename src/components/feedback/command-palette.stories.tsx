import type { Meta, StoryObj } from "@storybook/react-vite";
import { CommandPalette } from "./command-palette";
import type { CommandGroup } from "./command-palette";

const meta = {
  title: "Feedback/CommandPalette",
  component: CommandPalette,
  tags: ["autodocs"],
  argTypes: {
    placeholder: { control: "text" },
  },
} satisfies Meta<typeof CommandPalette>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultGroups: CommandGroup[] = [
  {
    label: "Suggestions",
    items: [
      { label: "New File", icon: "description", shortcut: "Ctrl+N" },
      { label: "Open File", icon: "folder_open", shortcut: "Ctrl+O" },
      { label: "Save", icon: "save", shortcut: "Ctrl+S" },
    ],
  },
  {
    label: "Recent",
    items: [
      { label: "project-config.json", icon: "code" },
      { label: "README.md", icon: "description" },
      { label: "package.json", icon: "code" },
    ],
  },
];

export const Default: Story = {
  args: {
    groups: defaultGroups,
    placeholder: "Type a command or search\u2026",
  },
  render: (args) => (
    <div className="max-w-lg mx-auto">
      <CommandPalette {...args} />
    </div>
  ),
};

export const CustomPlaceholder: Story = {
  args: {
    groups: defaultGroups,
    placeholder: "Search files, commands, settings\u2026",
  },
  render: (args) => (
    <div className="max-w-lg mx-auto">
      <CommandPalette {...args} />
    </div>
  ),
};

export const SingleGroup: Story = {
  args: {
    groups: [
      {
        label: "Actions",
        items: [
          { label: "Toggle Dark Mode", icon: "dark_mode", shortcut: "Ctrl+D" },
          { label: "Toggle Sidebar", icon: "menu", shortcut: "Ctrl+B" },
          { label: "Focus Editor", icon: "edit", shortcut: "Ctrl+1" },
        ],
      },
    ],
  },
  render: (args) => (
    <div className="max-w-lg mx-auto">
      <CommandPalette {...args} />
    </div>
  ),
};

export const ManyItems: Story = {
  args: {
    groups: [
      {
        label: "File",
        items: [
          { label: "New File", icon: "description", shortcut: "Ctrl+N" },
          { label: "New Window", icon: "open_in_new", shortcut: "Ctrl+Shift+N" },
          { label: "Open File", icon: "folder_open", shortcut: "Ctrl+O" },
          { label: "Save All", icon: "save", shortcut: "Ctrl+Shift+S" },
        ],
      },
      {
        label: "Edit",
        items: [
          { label: "Undo", icon: "undo", shortcut: "Ctrl+Z" },
          { label: "Redo", icon: "redo", shortcut: "Ctrl+Y" },
          { label: "Find", icon: "search", shortcut: "Ctrl+F" },
          { label: "Replace", icon: "find_replace", shortcut: "Ctrl+H" },
        ],
      },
      {
        label: "View",
        items: [
          { label: "Zoom In", icon: "zoom_in", shortcut: "Ctrl+=" },
          { label: "Zoom Out", icon: "zoom_out", shortcut: "Ctrl+-" },
          { label: "Full Screen", icon: "fullscreen", shortcut: "F11" },
        ],
      },
    ],
  },
  render: (args) => (
    <div className="max-w-lg mx-auto">
      <CommandPalette {...args} />
    </div>
  ),
};

export const CompoundAPI: Story = {
  args: {},
  render: (args) => (
    <div className="max-w-lg mx-auto">
      <CommandPalette {...args}>
        <CommandPalette.Group label="Navigation">
          <CommandPalette.Item icon="home" onClick={() => {}}>
            Go to Home
          </CommandPalette.Item>
          <CommandPalette.Item icon="settings" shortcut="Ctrl+,">
            Open Settings
          </CommandPalette.Item>
          <CommandPalette.Item icon="person" shortcut="Ctrl+P">
            View Profile
          </CommandPalette.Item>
        </CommandPalette.Group>
        <CommandPalette.Group label="Actions">
          <CommandPalette.Item icon="add" onClick={() => {}}>
            Create New Project
          </CommandPalette.Item>
          <CommandPalette.Item icon="upload" onClick={() => {}}>
            Import Data
          </CommandPalette.Item>
        </CommandPalette.Group>
      </CommandPalette>
    </div>
  ),
};

export const NoIcons: Story = {
  args: {
    groups: [
      {
        label: "Quick Actions",
        items: [
          { label: "Copy current URL" },
          { label: "Clear cache" },
          { label: "Reset preferences" },
          { label: "Export data as CSV" },
        ],
      },
    ],
  },
  render: (args) => (
    <div className="max-w-lg mx-auto">
      <CommandPalette {...args} />
    </div>
  ),
};

export const WithShortcutsOnly: Story = {
  args: {
    groups: [
      {
        label: "Keyboard Shortcuts",
        items: [
          { label: "Bold", shortcut: "Ctrl+B" },
          { label: "Italic", shortcut: "Ctrl+I" },
          { label: "Underline", shortcut: "Ctrl+U" },
          { label: "Strikethrough", shortcut: "Ctrl+Shift+X" },
          { label: "Code", shortcut: "Ctrl+E" },
        ],
      },
    ],
  },
  render: (args) => (
    <div className="max-w-lg mx-auto">
      <CommandPalette {...args} />
    </div>
  ),
};

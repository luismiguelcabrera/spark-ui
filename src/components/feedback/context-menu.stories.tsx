import type { Meta, StoryObj } from "@storybook/react-vite";
import { ContextMenu } from "./context-menu";
import type { ContextMenuItem } from "./context-menu";

const meta = {
  title: "Feedback/ContextMenu",
  component: ContextMenu,
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof ContextMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

const basicItems: ContextMenuItem[] = [
  { label: "Cut", icon: "cut", shortcut: "Ctrl+X", onClick: () => {} },
  { label: "Copy", icon: "copy", shortcut: "Ctrl+C", onClick: () => {} },
  { label: "Paste", icon: "clipboard", shortcut: "Ctrl+V", onClick: () => {} },
  { separator: true },
  { label: "Select All", shortcut: "Ctrl+A", onClick: () => {} },
];

const fileItems: ContextMenuItem[] = [
  { label: "Open", icon: "folder-open", onClick: () => {} },
  { label: "Edit", icon: "edit", onClick: () => {} },
  { label: "Download", icon: "download", shortcut: "Ctrl+D", onClick: () => {} },
  { label: "Share", icon: "share", onClick: () => {} },
  { separator: true },
  { label: "Rename", icon: "edit", onClick: () => {} },
  { label: "Move to...", icon: "folder", onClick: () => {} },
  { separator: true },
  { label: "Delete", icon: "delete", danger: true, onClick: () => {} },
];

const itemsWithDisabled: ContextMenuItem[] = [
  { label: "Undo", icon: "undo", shortcut: "Ctrl+Z", disabled: true, onClick: () => {} },
  { label: "Redo", icon: "redo", shortcut: "Ctrl+Y", disabled: true, onClick: () => {} },
  { separator: true },
  { label: "Cut", icon: "cut", shortcut: "Ctrl+X", onClick: () => {} },
  { label: "Copy", icon: "copy", shortcut: "Ctrl+C", onClick: () => {} },
  { label: "Paste", icon: "clipboard", shortcut: "Ctrl+V", onClick: () => {} },
];

export const Default: Story = {
  args: {
    items: basicItems,
  },
  render: (args) => (
    <ContextMenu {...args}>
      <div className="flex items-center justify-center h-48 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 text-slate-600 text-sm">
        Right-click here
      </div>
    </ContextMenu>
  ),
};

export const FileContextMenu: Story = {
  args: {
    items: fileItems,
  },
  render: (args) => (
    <ContextMenu {...args}>
      <div className="flex items-center gap-3 p-4 border border-muted rounded-xl bg-surface hover:bg-muted/30 cursor-default">
        <div className="w-10 h-10 bg-primary/15 rounded-lg flex items-center justify-center text-primary text-sm font-bold">
          PDF
        </div>
        <div>
          <p className="text-sm font-medium text-slate-700">Document.pdf</p>
          <p className="text-xs text-slate-600">2.4 MB - Modified today</p>
        </div>
      </div>
    </ContextMenu>
  ),
};

export const WithDisabledItems: Story = {
  args: {
    items: itemsWithDisabled,
  },
  render: (args) => (
    <ContextMenu {...args}>
      <div className="flex items-center justify-center h-48 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 text-slate-600 text-sm">
        Right-click here (Undo/Redo disabled)
      </div>
    </ContextMenu>
  ),
};

export const Disabled: Story = {
  args: {
    items: basicItems,
    disabled: true,
  },
  render: (args) => (
    <ContextMenu {...args}>
      <div className="flex items-center justify-center h-48 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 text-slate-600 text-sm">
        Context menu disabled
      </div>
    </ContextMenu>
  ),
};

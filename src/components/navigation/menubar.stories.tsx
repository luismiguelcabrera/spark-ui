import type { Meta, StoryObj } from "@storybook/react-vite";
import { Menubar } from "./menubar";
import type { MenubarMenu } from "./menubar";

const meta = {
  title: "Navigation/Menubar",
  component: Menubar,
  tags: ["autodocs"],
} satisfies Meta<typeof Menubar>;

export default meta;
type Story = StoryObj<typeof meta>;

const fileMenu: MenubarMenu = {
  label: "File",
  items: [
    { label: "New File", icon: "file", shortcut: "Ctrl+N", onClick: () => {} },
    { label: "Open...", icon: "folder-open", shortcut: "Ctrl+O", onClick: () => {} },
    { label: "Save", icon: "save", shortcut: "Ctrl+S", onClick: () => {} },
    { label: "Save As...", shortcut: "Ctrl+Shift+S", onClick: () => {} },
    { separator: true },
    { label: "Export", icon: "download", onClick: () => {} },
    { label: "Print", icon: "printer", shortcut: "Ctrl+P", onClick: () => {} },
    { separator: true },
    { label: "Close", shortcut: "Ctrl+W", onClick: () => {} },
  ],
};

const editMenu: MenubarMenu = {
  label: "Edit",
  items: [
    { label: "Undo", icon: "undo", shortcut: "Ctrl+Z", onClick: () => {} },
    { label: "Redo", icon: "redo", shortcut: "Ctrl+Y", onClick: () => {} },
    { separator: true },
    { label: "Cut", icon: "cut", shortcut: "Ctrl+X", onClick: () => {} },
    { label: "Copy", icon: "copy", shortcut: "Ctrl+C", onClick: () => {} },
    { label: "Paste", icon: "clipboard", shortcut: "Ctrl+V", onClick: () => {} },
    { separator: true },
    { label: "Find", icon: "search", shortcut: "Ctrl+F", onClick: () => {} },
    { label: "Replace", shortcut: "Ctrl+H", onClick: () => {} },
  ],
};

const viewMenu: MenubarMenu = {
  label: "View",
  items: [
    { label: "Zoom In", icon: "zoom-in", shortcut: "Ctrl++", onClick: () => {} },
    { label: "Zoom Out", icon: "zoom-out", shortcut: "Ctrl+-", onClick: () => {} },
    { separator: true },
    { label: "Full Screen", shortcut: "F11", onClick: () => {} },
    { label: "Toggle Sidebar", shortcut: "Ctrl+B", onClick: () => {} },
  ],
};

const helpMenu: MenubarMenu = {
  label: "Help",
  items: [
    { label: "Documentation", icon: "file", onClick: () => {} },
    { label: "Release Notes", onClick: () => {} },
    { separator: true },
    { label: "About", icon: "info", onClick: () => {} },
  ],
};

export const Default: Story = {
  args: {
    menus: [fileMenu, editMenu, viewMenu, helpMenu],
  },
};

export const FileMenuOnly: Story = {
  args: {
    menus: [fileMenu],
  },
};

export const WithDisabledItems: Story = {
  args: {
    menus: [
      {
        label: "Edit",
        items: [
          { label: "Undo", icon: "undo", shortcut: "Ctrl+Z", disabled: true, onClick: () => {} },
          { label: "Redo", icon: "redo", shortcut: "Ctrl+Y", disabled: true, onClick: () => {} },
          { separator: true },
          { label: "Cut", icon: "cut", shortcut: "Ctrl+X", onClick: () => {} },
          { label: "Copy", icon: "copy", shortcut: "Ctrl+C", onClick: () => {} },
          { label: "Paste", icon: "clipboard", shortcut: "Ctrl+V", onClick: () => {} },
        ],
      },
    ],
  },
};

export const WithDangerItem: Story = {
  args: {
    menus: [
      {
        label: "Actions",
        items: [
          { label: "Duplicate", icon: "copy", onClick: () => {} },
          { label: "Archive", icon: "archive", onClick: () => {} },
          { separator: true },
          { label: "Delete", icon: "delete", danger: true, onClick: () => {} },
        ],
      },
    ],
  },
};

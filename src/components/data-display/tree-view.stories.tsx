import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { TreeView } from "./tree-view";

const meta = {
  title: "Data Display/TreeView",
  component: TreeView,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    showLines: { control: "boolean" },
    selectable: { control: "boolean" },
    expandAll: { control: "boolean" },
    searchable: { control: "boolean" },
  },
} satisfies Meta<typeof TreeView>;

export default meta;
type Story = StoryObj<typeof meta>;

const fileTree = [
  {
    id: "src",
    label: "src",
    icon: "folder",
    children: [
      {
        id: "components",
        label: "components",
        icon: "folder",
        children: [
          { id: "button", label: "Button.tsx", icon: "file" },
          { id: "input", label: "Input.tsx", icon: "file" },
          { id: "modal", label: "Modal.tsx", icon: "file" },
        ],
      },
      {
        id: "hooks",
        label: "hooks",
        icon: "folder",
        children: [
          { id: "useDebounce", label: "useDebounce.ts", icon: "file" },
          { id: "useToggle", label: "useToggle.ts", icon: "file" },
        ],
      },
      { id: "index", label: "index.ts", icon: "file" },
    ],
  },
  { id: "package", label: "package.json", icon: "file" },
  { id: "tsconfig", label: "tsconfig.json", icon: "settings" },
];

export const Default: Story = {
  args: { nodes: fileTree, size: "md", showLines: false },
};

export const WithLines: Story = {
  args: {
    nodes: fileTree,
    size: "md",
    showLines: true,
    defaultExpandedIds: ["src", "components"],
  },
};

export const Small: Story = {
  args: {
    nodes: fileTree,
    size: "sm",
    defaultExpandedIds: ["src"],
  },
};

export const Large: Story = {
  args: {
    nodes: fileTree,
    size: "lg",
    defaultExpandedIds: ["src", "components", "hooks"],
  },
};

export const AllExpanded: Story = {
  args: {
    nodes: fileTree,
    size: "md",
    showLines: true,
    defaultExpandedIds: ["src", "components", "hooks"],
  },
};

export const ExpandAll: Story = {
  args: {
    nodes: fileTree,
    size: "md",
    showLines: true,
    expandAll: true,
  },
};

export const Selectable: Story = {
  args: {
    nodes: fileTree,
    size: "md",
    selectable: true,
    expandAll: true,
  },
  render: (args) => {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    return (
      <div className="max-w-sm">
        <TreeView
          {...args}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
        />
        <p className="text-sm text-muted-foreground mt-4">
          Selected: {selectedIds.length === 0 ? "none" : selectedIds.join(", ")}
        </p>
      </div>
    );
  },
};

export const Searchable: Story = {
  args: {
    nodes: fileTree,
    size: "md",
    searchable: true,
    expandAll: true,
  },
};

export const SearchableSelectable: Story = {
  args: {
    nodes: fileTree,
    size: "md",
    searchable: true,
    selectable: true,
    expandAll: true,
  },
  render: (args) => {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    return (
      <div className="max-w-sm">
        <TreeView
          {...args}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
        />
        <p className="text-sm text-muted-foreground mt-4">
          Selected: {selectedIds.length === 0 ? "none" : selectedIds.join(", ")}
        </p>
      </div>
    );
  },
};

export const NestedProject: Story = {
  args: {
    size: "md",
    showLines: true,
    defaultExpandedIds: ["app", "routes", "lib"],
    nodes: [
      {
        id: "app",
        label: "app",
        icon: "folder",
        children: [
          {
            id: "routes",
            label: "routes",
            icon: "folder",
            children: [
              { id: "home", label: "home.tsx", icon: "file" },
              { id: "about", label: "about.tsx", icon: "file" },
              {
                id: "dashboard",
                label: "dashboard",
                icon: "folder",
                children: [
                  { id: "dash-index", label: "index.tsx", icon: "file" },
                  { id: "dash-settings", label: "settings.tsx", icon: "file" },
                ],
              },
            ],
          },
          {
            id: "lib",
            label: "lib",
            icon: "folder",
            children: [
              { id: "utils", label: "utils.ts", icon: "file" },
              { id: "db", label: "db.ts", icon: "file" },
            ],
          },
          { id: "root", label: "root.tsx", icon: "file" },
        ],
      },
      { id: "pkg", label: "package.json", icon: "file" },
      { id: "readme", label: "README.md", icon: "file" },
    ],
  },
};

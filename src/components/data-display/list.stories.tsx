import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { List, ListItem } from "./list";

const meta = {
  title: "Data Display/List",
  component: List,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["plain", "card", "divided"] },
    density: { control: "select", options: ["default", "comfortable", "compact"] },
    nav: { control: "boolean" },
    selectable: { control: "boolean" },
  },
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="max-w-md">
      <List {...args}>
        <ListItem icon="check" title="Complete project setup" description="Initialize the repo and configure tooling" timestamp="2m ago" />
        <ListItem icon="file" title="Write documentation" description="Add API docs and usage examples" timestamp="5m ago" />
        <ListItem icon="settings" title="Configure CI/CD" description="Set up automated testing pipeline" timestamp="1h ago" />
      </List>
    </div>
  ),
};

export const CardVariant: Story = {
  args: { variant: "card" },
  render: (args) => (
    <div className="max-w-md">
      <List {...args}>
        <ListItem icon="check" title="Item 1" description="Card variant description" />
        <ListItem icon="file" title="Item 2" description="Another card item" />
      </List>
    </div>
  ),
};

export const DividedVariant: Story = {
  args: { variant: "divided" },
  render: (args) => (
    <div className="max-w-md">
      <List {...args}>
        <ListItem icon="check" title="Item 1" description="Divided variant" />
        <ListItem icon="file" title="Item 2" description="With dividers" />
        <ListItem icon="settings" title="Item 3" description="Between items" />
      </List>
    </div>
  ),
};

export const NavMode: Story = {
  args: { nav: true },
  render: (args) => (
    <div className="max-w-xs">
      <List {...args}>
        <ListItem icon="home" title="Dashboard" active />
        <ListItem icon="file" title="Documents" />
        <ListItem icon="settings" title="Settings" />
        <ListItem icon="user" title="Profile" />
      </List>
    </div>
  ),
};

export const CompactDensity: Story = {
  args: { density: "compact", variant: "divided" },
  render: (args) => (
    <div className="max-w-md">
      <List {...args}>
        <ListItem title="Item 1" description="Compact spacing" />
        <ListItem title="Item 2" description="Less padding" />
        <ListItem title="Item 3" description="Dense layout" />
        <ListItem title="Item 4" description="Saves space" />
      </List>
    </div>
  ),
};

export const ComfortableDensity: Story = {
  args: { density: "comfortable" },
  render: (args) => (
    <div className="max-w-md">
      <List {...args}>
        <ListItem icon="check" title="Item 1" description="Comfortable spacing" />
        <ListItem icon="file" title="Item 2" description="More breathing room" />
      </List>
    </div>
  ),
};

export const Selectable: Story = {
  render: (args) => {
    const [selectedKey, setSelectedKey] = useState<string | undefined>(undefined);
    return (
      <div className="max-w-md">
        <List {...args} selectable selectedKey={selectedKey} onSelect={setSelectedKey}>
          <ListItem icon="check" title="Option A" description="First option" value="a" />
          <ListItem icon="file" title="Option B" description="Second option" value="b" />
          <ListItem icon="settings" title="Option C" description="Third option" value="c" />
        </List>
        <p className="text-sm text-slate-500 mt-4">Selected: {selectedKey ?? "none"}</p>
      </div>
    );
  },
};

export const SelectableCompact: Story = {
  render: (args) => {
    const [selectedKey, setSelectedKey] = useState<string>("inbox");
    return (
      <div className="max-w-xs">
        <List {...args} selectable selectedKey={selectedKey} onSelect={setSelectedKey} density="compact" variant="divided">
          <ListItem title="Inbox" value="inbox" />
          <ListItem title="Sent" value="sent" />
          <ListItem title="Drafts" value="drafts" />
          <ListItem title="Trash" value="trash" />
        </List>
      </div>
    );
  },
};

import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Toolbar, ToolbarButton, ToolbarSeparator, ToolbarGroup } from "./toolbar";
import { Icon } from "../data-display/icon";

const meta = {
  title: "Forms/Toolbar",
  component: Toolbar,
  tags: ["autodocs"],
  argTypes: {
    orientation: { control: "select", options: ["horizontal", "vertical"] },
  },
} satisfies Meta<typeof Toolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TextFormatting: Story = {
  render: (args) => {
    const [bold, setBold] = useState(false);
    const [italic, setItalic] = useState(false);
    const [underline, setUnderline] = useState(false);

    return (
      <Toolbar {...args}>
        <ToolbarGroup>
          <ToolbarButton active={bold} onClick={() => setBold(!bold)} tooltip="Bold">
            <Icon name="format-bold" size="sm" />
          </ToolbarButton>
          <ToolbarButton active={italic} onClick={() => setItalic(!italic)} tooltip="Italic">
            <Icon name="format-italic" size="sm" />
          </ToolbarButton>
          <ToolbarButton active={underline} onClick={() => setUnderline(!underline)} tooltip="Underline">
            <Icon name="format-underline" size="sm" />
          </ToolbarButton>
        </ToolbarGroup>
        <ToolbarSeparator />
        <ToolbarGroup>
          <ToolbarButton tooltip="Align Left">
            <Icon name="format-align-left" size="sm" />
          </ToolbarButton>
          <ToolbarButton tooltip="Align Center">
            <Icon name="format-align-center" size="sm" />
          </ToolbarButton>
          <ToolbarButton tooltip="Align Right">
            <Icon name="format-align-right" size="sm" />
          </ToolbarButton>
        </ToolbarGroup>
        <ToolbarSeparator />
        <ToolbarGroup>
          <ToolbarButton tooltip="Bullet List">
            <Icon name="list" size="sm" />
          </ToolbarButton>
          <ToolbarButton tooltip="Numbered List">
            <Icon name="list-ordered" size="sm" />
          </ToolbarButton>
        </ToolbarGroup>
      </Toolbar>
    );
  },
};

export const Simple: Story = {
  render: (args) => (
    <Toolbar {...args}>
      <ToolbarButton tooltip="Undo">
        <Icon name="undo" size="sm" />
      </ToolbarButton>
      <ToolbarButton tooltip="Redo">
        <Icon name="redo" size="sm" />
      </ToolbarButton>
      <ToolbarSeparator />
      <ToolbarButton tooltip="Cut">
        <Icon name="cut" size="sm" />
      </ToolbarButton>
      <ToolbarButton tooltip="Copy">
        <Icon name="copy" size="sm" />
      </ToolbarButton>
      <ToolbarButton tooltip="Paste">
        <Icon name="clipboard" size="sm" />
      </ToolbarButton>
    </Toolbar>
  ),
};

export const WithDisabledButtons: Story = {
  render: (args) => (
    <Toolbar {...args}>
      <ToolbarButton tooltip="Undo" disabled>
        <Icon name="undo" size="sm" />
      </ToolbarButton>
      <ToolbarButton tooltip="Redo" disabled>
        <Icon name="redo" size="sm" />
      </ToolbarButton>
      <ToolbarSeparator />
      <ToolbarButton tooltip="Save">
        <Icon name="save" size="sm" />
      </ToolbarButton>
      <ToolbarButton tooltip="Download">
        <Icon name="download" size="sm" />
      </ToolbarButton>
    </Toolbar>
  ),
};

export const Vertical: Story = {
  args: { orientation: "vertical" },
  render: (args) => (
    <Toolbar {...args}>
      <ToolbarButton tooltip="Select">
        <Icon name="cursor" size="sm" />
      </ToolbarButton>
      <ToolbarButton tooltip="Pencil">
        <Icon name="edit" size="sm" />
      </ToolbarButton>
      <ToolbarSeparator orientation="horizontal" />
      <ToolbarButton tooltip="Zoom In">
        <Icon name="zoom-in" size="sm" />
      </ToolbarButton>
      <ToolbarButton tooltip="Zoom Out">
        <Icon name="zoom-out" size="sm" />
      </ToolbarButton>
    </Toolbar>
  ),
};

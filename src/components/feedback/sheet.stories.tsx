import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Sheet } from "./sheet";

const meta = {
  title: "Feedback/Sheet",
  component: Sheet,
  tags: ["autodocs"],
  argTypes: {
    side: { control: "select", options: ["left", "right", "top", "bottom"] },
    size: { control: "select", options: ["sm", "md", "lg", "xl", "full"] },
    showClose: { control: "boolean" },
    closeOnOverlayClick: { control: "boolean" },
    closeOnEscape: { control: "boolean" },
  },
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

const SheetDemo = ({
  side = "right",
  size = "md",
  title = "Sheet Title",
  description,
  footer,
  ...rest
}: Partial<React.ComponentProps<typeof Sheet>>) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium"
      >
        Open {side} sheet
      </button>
      <Sheet
        open={open}
        onOpenChange={setOpen}
        side={side}
        size={size}
        title={title}
        description={description}
        footer={footer}
        {...rest}
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            This is the sheet content. It slides in from the {side} side of the screen.
          </p>
          <p className="text-sm text-slate-600">
            You can put any content here, like forms, details panels, or navigation menus.
          </p>
        </div>
      </Sheet>
    </>
  );
};

export const Right: Story = {
  render: (args) => <SheetDemo {...args} side="right" title="Settings" description="Manage your preferences" />,
};

export const Left: Story = {
  render: (args) => <SheetDemo {...args} side="left" title="Navigation" />,
};

export const Top: Story = {
  render: (args) => <SheetDemo {...args} side="top" title="Notifications" />,
};

export const Bottom: Story = {
  render: (args) => <SheetDemo {...args} side="bottom" title="Details" />,
};

export const Small: Story = {
  render: (args) => <SheetDemo {...args} size="sm" title="Small Sheet" />,
};

export const Large: Story = {
  render: (args) => <SheetDemo {...args} size="lg" title="Large Sheet" />,
};

export const ExtraLarge: Story = {
  render: (args) => <SheetDemo {...args} size="xl" title="Extra Large Sheet" />,
};

export const WithFooter: Story = {
  render: (args) => (
    <SheetDemo
      {...args}
      title="Edit Profile"
      description="Make changes to your profile"
      footer={
        <div className="flex justify-end gap-2">
          <button type="button" className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">
            Cancel
          </button>
          <button type="button" className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg">
            Save Changes
          </button>
        </div>
      }
    />
  ),
};

export const AllSides: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-3">
      <SheetDemo {...args} side="left" title="Left Sheet" />
      <SheetDemo {...args} side="right" title="Right Sheet" />
      <SheetDemo {...args} side="top" title="Top Sheet" />
      <SheetDemo {...args} side="bottom" title="Bottom Sheet" />
    </div>
  ),
};

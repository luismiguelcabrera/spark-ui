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
    swipeable: { control: "boolean" },
    edgeSwipeable: { control: "boolean" },
    showDragHandle: { control: "boolean" },
    swipeThreshold: { control: { type: "range", min: 20, max: 300, step: 10 } },
    edgeWidth: { control: { type: "range", min: 10, max: 50, step: 5 } },
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

// --- Swipeable stories ---

const NavContent = () => (
  <nav>
    <ul className="space-y-1">
      {["Home", "Profile", "Settings", "Messages", "Notifications"].map(
        (item) => (
          <li key={item}>
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              {item}
            </a>
          </li>
        )
      )}
    </ul>
  </nav>
);

export const SwipeableLeft: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium"
        >
          Open Swipeable Left Sheet
        </button>
        <p className="text-xs text-slate-500 mt-2">
          Swipe the panel to the left to close it on touch devices.
        </p>
        <Sheet
          {...args}
          open={open}
          onOpenChange={setOpen}
          side="left"
          title="Navigation"
          swipeable
        >
          <NavContent />
        </Sheet>
      </div>
    );
  },
};

export const SwipeableBottom: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium"
        >
          Open Swipeable Bottom Sheet
        </button>
        <p className="text-xs text-slate-500 mt-2">
          Swipe down on the panel to close it on touch devices.
        </p>
        <Sheet
          {...args}
          open={open}
          onOpenChange={setOpen}
          side="bottom"
          title="Actions"
          swipeable
          showDragHandle
        >
          <NavContent />
        </Sheet>
      </div>
    );
  },
};

export const EdgeSwipeable: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium"
        >
          Open Edge-Swipeable Sheet
        </button>
        <p className="text-xs text-slate-500 mt-2">
          On touch devices, swipe from the left edge of the screen to open. Swipe the panel left to close.
        </p>
        <Sheet
          {...args}
          open={open}
          onOpenChange={setOpen}
          side="left"
          title="Navigation"
          swipeable
          edgeSwipeable
          onSwipeOpen={() => console.log("Opened via edge swipe")}
        >
          <NavContent />
        </Sheet>
      </div>
    );
  },
};

export const WithDragHandle: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium"
        >
          Open Sheet with Drag Handle
        </button>
        <Sheet
          {...args}
          open={open}
          onOpenChange={setOpen}
          side="bottom"
          title="Details"
          showDragHandle
          swipeable
        >
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              This bottom sheet has a drag handle indicator and can be swiped down to close.
            </p>
            <NavContent />
          </div>
        </Sheet>
      </div>
    );
  },
};

export const SwipeableGallery: Story = {
  render: (args) => (
    <div className="space-y-4 p-4">
      <h3 className="text-sm font-bold text-slate-700">Swipeable Sheet Variants</h3>
      <p className="text-xs text-slate-500 mb-4">
        Click buttons to open. On touch devices, swipe the panel to close.
      </p>
      <div className="flex flex-wrap gap-3">
        {(["left", "right", "bottom"] as const).map((side) => {
          const Demo = () => {
            const [open, setOpen] = useState(false);
            return (
              <>
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium"
                >
                  {side} sheet
                </button>
                <Sheet
                  {...args}
                  open={open}
                  onOpenChange={setOpen}
                  side={side}
                  title={`${side.charAt(0).toUpperCase() + side.slice(1)} Sheet`}
                  swipeable
                  showDragHandle={side === "bottom"}
                >
                  <NavContent />
                </Sheet>
              </>
            );
          };
          return <Demo key={side} />;
        })}
      </div>
    </div>
  ),
};

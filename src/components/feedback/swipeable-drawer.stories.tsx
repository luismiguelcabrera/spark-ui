import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { SwipeableDrawer } from "./swipeable-drawer";

const meta = {
  title: "Feedback/SwipeableDrawer",
  component: SwipeableDrawer,
  tags: ["autodocs"],
  argTypes: {
    side: { control: "select", options: ["left", "right", "bottom"] },
    overlay: { control: "boolean" },
    swipeThreshold: { control: { type: "range", min: 10, max: 90, step: 5 } },
    swipeAreaWidth: { control: { type: "range", min: 10, max: 50, step: 5 } },
    width: { control: { type: "number", min: 200, max: 600, step: 20 } },
  },
  args: {
    side: "left",
    overlay: true,
    swipeThreshold: 50,
    swipeAreaWidth: 20,
    width: 300,
  },
} satisfies Meta<typeof SwipeableDrawer>;

export default meta;
type Story = StoryObj<typeof meta>;

const NavContent = () => (
  <nav className="p-4">
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

const DrawerDemo = ({
  side,
  title,
  ...args
}: {
  side: "left" | "right" | "bottom";
  title: string;
  [key: string]: unknown;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
      >
        Open {title}
      </button>
      <SwipeableDrawer
        {...args}
        open={open}
        onOpenChange={setOpen}
        side={side}
        title={title}
      >
        <NavContent />
      </SwipeableDrawer>
    </div>
  );
};

export const Left: Story = {
  render: (args) => (
    <DrawerDemo {...args} side="left" title="Navigation" />
  ),
};

export const Right: Story = {
  render: (args) => (
    <DrawerDemo {...args} side="right" title="Details" />
  ),
};

export const Bottom: Story = {
  render: (args) => (
    <DrawerDemo
      {...args}
      side="bottom"
      title="Actions"
      height="50vh"
    />
  ),
};

export const WithContent: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);

    return (
      <div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Open Drawer with Rich Content
        </button>
        <SwipeableDrawer
          {...args}
          open={open}
          onOpenChange={setOpen}
          side="left"
          title="User Profile"
          width={320}
        >
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                JD
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">John Doe</div>
                <div className="text-xs text-slate-500">john@example.com</div>
              </div>
            </div>
            <div className="h-px bg-slate-100" />
            <NavContent />
            <div className="h-px bg-slate-100" />
            <button
              type="button"
              className="w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
            >
              Sign Out
            </button>
          </div>
        </SwipeableDrawer>
      </div>
    );
  },
};

export const Gallery: Story = {
  render: (args) => (
    <div className="space-y-4 p-4">
      <h3 className="text-sm font-bold text-slate-700">Swipeable Drawer Variants</h3>
      <p className="text-xs text-slate-500 mb-4">
        Click buttons to open. On mobile, swipe from the edge to open, swipe the drawer to close.
      </p>
      <div className="flex flex-wrap gap-3">
        <DrawerDemo {...args} side="left" title="Left Drawer" />
        <DrawerDemo {...args} side="right" title="Right Drawer" />
        <DrawerDemo {...args} side="bottom" title="Bottom Sheet" />
      </div>
    </div>
  ),
};

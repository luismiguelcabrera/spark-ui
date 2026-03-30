import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { BottomSheet } from "./bottom-sheet";
import { Button } from "../forms/button";

const meta = {
  title: "Feedback/BottomSheet",
  component: BottomSheet,
  tags: ["autodocs"],
  argTypes: {
    fullscreen: { control: "boolean" },
    persistent: { control: "boolean" },
  },
} satisfies Meta<typeof BottomSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Bottom Sheet</Button>
        <BottomSheet
          {...args}
          open={open}
          onOpenChange={setOpen}
          title="Actions"
        >
          <div className="space-y-4">
            <button
              type="button"
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-50 text-sm font-medium text-slate-900"
            >
              Share
            </button>
            <button
              type="button"
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-50 text-sm font-medium text-slate-900"
            >
              Copy link
            </button>
            <button
              type="button"
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-50 text-sm font-medium text-red-600"
            >
              Delete
            </button>
          </div>
        </BottomSheet>
      </>
    );
  },
};

export const Fullscreen: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Fullscreen Sheet</Button>
        <BottomSheet
          {...args}
          open={open}
          onOpenChange={setOpen}
          title="Full Details"
          fullscreen
        >
          <div className="space-y-4">
            <p className="text-sm text-slate-500">
              This sheet takes up the full viewport height.
            </p>
            <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center text-sm text-slate-400">
              Content area
            </div>
          </div>
        </BottomSheet>
      </>
    );
  },
};

export const Persistent: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Persistent Sheet</Button>
        <BottomSheet
          {...args}
          open={open}
          onOpenChange={setOpen}
          title="Confirm Selection"
          persistent
        >
          <p className="text-sm text-slate-500 mb-4">
            Tap the backdrop — it won't close. Use the close button or action
            below.
          </p>
          <Button className="w-full" onClick={() => setOpen(false)}>
            Confirm
          </Button>
        </BottomSheet>
      </>
    );
  },
};

export const NoTitle: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Simple Sheet</Button>
        <BottomSheet {...args} open={open} onOpenChange={setOpen}>
          <div className="space-y-3 pb-2">
            <p className="text-sm text-slate-500 text-center">
              Choose an option
            </p>
            <button
              type="button"
              className="w-full text-center py-3 rounded-lg bg-primary text-white text-sm font-semibold"
              onClick={() => setOpen(false)}
            >
              Take Photo
            </button>
            <button
              type="button"
              className="w-full text-center py-3 rounded-lg bg-slate-100 text-slate-900 text-sm font-semibold"
              onClick={() => setOpen(false)}
            >
              Choose from Gallery
            </button>
          </div>
        </BottomSheet>
      </>
    );
  },
};

export const Gallery: Story = {
  render: () => {
    const [sheet, setSheet] = useState<string | null>(null);
    return (
      <div className="flex gap-3 flex-wrap">
        <Button onClick={() => setSheet("default")}>Default</Button>
        <Button onClick={() => setSheet("fullscreen")}>Fullscreen</Button>
        <Button onClick={() => setSheet("persistent")}>Persistent</Button>

        <BottomSheet
          open={sheet === "default"}
          onOpenChange={() => setSheet(null)}
          title="Default Sheet"
        >
          <p className="text-sm text-slate-500">
            Standard bottom sheet with title.
          </p>
        </BottomSheet>

        <BottomSheet
          open={sheet === "fullscreen"}
          onOpenChange={() => setSheet(null)}
          title="Fullscreen Sheet"
          fullscreen
        >
          <p className="text-sm text-slate-500">
            Full height bottom sheet.
          </p>
        </BottomSheet>

        <BottomSheet
          open={sheet === "persistent"}
          onOpenChange={() => setSheet(null)}
          title="Persistent Sheet"
          persistent
        >
          <p className="text-sm text-slate-500 mb-4">
            Cannot be dismissed by tapping the backdrop.
          </p>
          <Button size="sm" onClick={() => setSheet(null)}>
            Close
          </Button>
        </BottomSheet>
      </div>
    );
  },
};

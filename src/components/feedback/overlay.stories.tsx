import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Overlay } from "./overlay";
import { Button } from "../forms/button";

const meta = {
  title: "Feedback/Overlay",
  component: Overlay,
  tags: ["autodocs"],
  argTypes: {
    scrim: { control: "boolean" },
    blur: { control: "boolean" },
    closeOnClick: { control: "boolean" },
    closeOnEscape: { control: "boolean" },
  },
} satisfies Meta<typeof Overlay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Overlay</Button>
        <Overlay {...args} open={open} onOpenChange={setOpen}>
          <div className="flex items-center justify-center h-full">
            <div className="bg-white rounded-2xl shadow-float p-8 max-w-sm mx-4">
              <h2 className="text-lg font-bold text-slate-900 mb-2">
                Custom Content
              </h2>
              <p className="text-sm text-slate-500 mb-4">
                This is an overlay with custom content. Click the backdrop or
                press Escape to close.
              </p>
              <Button onClick={() => setOpen(false)}>Close</Button>
            </div>
          </div>
        </Overlay>
      </>
    );
  },
};

export const WithBlur: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <div className="space-y-2">
          <p className="text-sm text-slate-500">
            Background content that will be blurred
          </p>
          <Button onClick={() => setOpen(true)}>Open Blurred Overlay</Button>
        </div>
        <Overlay {...args} open={open} onOpenChange={setOpen} blur>
          <div className="flex items-center justify-center h-full">
            <div className="bg-white rounded-2xl shadow-float p-8 max-w-sm mx-4">
              <h2 className="text-lg font-bold text-slate-900 mb-2">
                Blurred Background
              </h2>
              <p className="text-sm text-slate-500 mb-4">
                The backdrop is blurred behind this overlay.
              </p>
              <Button onClick={() => setOpen(false)}>Close</Button>
            </div>
          </div>
        </Overlay>
      </>
    );
  },
};

export const NoScrim: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Without Scrim</Button>
        <Overlay
          {...args}
          open={open}
          onOpenChange={setOpen}
          scrim={false}
          closeOnClick={false}
        >
          <div className="flex items-center justify-center h-full">
            <div className="bg-white rounded-2xl shadow-float border border-slate-200 p-8 max-w-sm mx-4">
              <h2 className="text-lg font-bold text-slate-900 mb-2">
                No Scrim
              </h2>
              <p className="text-sm text-slate-500 mb-4">
                No backdrop dimming. Press Escape to close.
              </p>
              <Button onClick={() => setOpen(false)}>Close</Button>
            </div>
          </div>
        </Overlay>
      </>
    );
  },
};

export const Persistent: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Persistent Overlay</Button>
        <Overlay
          {...args}
          open={open}
          onOpenChange={setOpen}
          closeOnClick={false}
          closeOnEscape={false}
        >
          <div className="flex items-center justify-center h-full">
            <div className="bg-white rounded-2xl shadow-float p-8 max-w-sm mx-4">
              <h2 className="text-lg font-bold text-slate-900 mb-2">
                Persistent Overlay
              </h2>
              <p className="text-sm text-slate-500 mb-4">
                Cannot be dismissed by backdrop click or Escape. Use the button
                below.
              </p>
              <Button onClick={() => setOpen(false)}>Dismiss</Button>
            </div>
          </div>
        </Overlay>
      </>
    );
  },
};

export const Gallery: Story = {
  render: () => {
    const [overlay, setOverlay] = useState<string | null>(null);
    return (
      <div className="flex gap-3 flex-wrap">
        <Button onClick={() => setOverlay("default")}>Default</Button>
        <Button onClick={() => setOverlay("blur")}>Blur</Button>
        <Button onClick={() => setOverlay("no-scrim")}>No Scrim</Button>

        <Overlay
          open={overlay === "default"}
          onOpenChange={() => setOverlay(null)}
        >
          <div className="flex items-center justify-center h-full">
            <div className="bg-white rounded-2xl shadow-float p-6 max-w-xs mx-4 text-center">
              <p className="text-sm font-medium">Default overlay</p>
              <Button
                size="sm"
                className="mt-3"
                onClick={() => setOverlay(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </Overlay>

        <Overlay
          open={overlay === "blur"}
          onOpenChange={() => setOverlay(null)}
          blur
        >
          <div className="flex items-center justify-center h-full">
            <div className="bg-white rounded-2xl shadow-float p-6 max-w-xs mx-4 text-center">
              <p className="text-sm font-medium">Blurred overlay</p>
              <Button
                size="sm"
                className="mt-3"
                onClick={() => setOverlay(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </Overlay>

        <Overlay
          open={overlay === "no-scrim"}
          onOpenChange={() => setOverlay(null)}
          scrim={false}
        >
          <div className="flex items-center justify-center h-full">
            <div className="bg-white rounded-2xl shadow-float border border-slate-200 p-6 max-w-xs mx-4 text-center">
              <p className="text-sm font-medium">No scrim overlay</p>
              <Button
                size="sm"
                className="mt-3"
                onClick={() => setOverlay(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </Overlay>
      </div>
    );
  },
};

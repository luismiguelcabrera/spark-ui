import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Dialog, useDialog } from "./dialog";
import { Button } from "../forms/button";

const meta = {
  title: "Feedback/Dialog",
  component: Dialog,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["default", "danger"] },
    showCancel: { control: "boolean" },
    loading: { control: "boolean" },
    closeOnBackdrop: { control: "boolean" },
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Dialog</Button>
        <Dialog
          {...args}
          open={open}
          onOpenChange={setOpen}
          title="Save changes?"
          description="Your changes will be saved to the database."
          onConfirm={() => setOpen(false)}
        />
      </>
    );
  },
};

export const Danger: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button color="destructive" onClick={() => setOpen(true)}>
          Delete Account
        </Button>
        <Dialog
          {...args}
          open={open}
          onOpenChange={setOpen}
          title="Delete account?"
          description="This action cannot be undone. All your data will be permanently deleted."
          variant="danger"
          confirmText="Delete"
          onConfirm={() => setOpen(false)}
        />
      </>
    );
  },
};

export const AlertStyle: Story = {
  name: "Alert (no cancel)",
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Show Alert</Button>
        <Dialog
          {...args}
          open={open}
          onOpenChange={setOpen}
          title="Session expired"
          description="Please log in again to continue."
          showCancel={false}
          confirmText="OK"
          onConfirm={() => setOpen(false)}
        />
      </>
    );
  },
};

export const WithCustomContent: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Form Dialog</Button>
        <Dialog
          {...args}
          open={open}
          onOpenChange={setOpen}
          title="Rename project"
          confirmText="Save"
          onConfirm={() => setOpen(false)}
        >
          <input
            type="text"
            placeholder="New project name"
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            defaultValue="My Project"
          />
        </Dialog>
      </>
    );
  },
};

export const Loading: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Loading Dialog</Button>
        <Dialog
          {...args}
          open={open}
          onOpenChange={setOpen}
          title="Processing..."
          description="Please wait while we save your changes."
          loading={true}
        />
      </>
    );
  },
};

export const PromiseBased: Story = {
  name: "useDialog (Promise-based)",
  render: () => {
    const { confirm, DialogElement } = useDialog();
    const [lastResult, setLastResult] = useState<string>("—");

    return (
      <div className="flex flex-col gap-4 items-start">
        <Button
          onClick={async () => {
            const result = await confirm({
              title: "Discard changes?",
              description: "You have unsaved changes that will be lost.",
              confirmText: "Discard",
              variant: "danger",
            });
            setLastResult(result ? "Discarded" : "Kept changes");
          }}
        >
          Discard Changes
        </Button>
        <Button
          variant="outline"
          onClick={async () => {
            const result = await confirm({
              title: "Publish article?",
              description: "This will make your article visible to everyone.",
              confirmText: "Publish",
            });
            setLastResult(result ? "Published" : "Cancelled");
          }}
        >
          Publish Article
        </Button>
        <p className="text-sm text-slate-500">
          Last result: <strong>{lastResult}</strong>
        </p>
        {DialogElement}
      </div>
    );
  },
};

export const Gallery: Story = {
  render: () => {
    const [openDefault, setOpenDefault] = useState(false);
    const [openDanger, setOpenDanger] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);

    return (
      <div className="flex gap-3 flex-wrap">
        <Button onClick={() => setOpenDefault(true)}>Default</Button>
        <Button color="destructive" onClick={() => setOpenDanger(true)}>
          Danger
        </Button>
        <Button variant="outline" onClick={() => setOpenAlert(true)}>
          Alert
        </Button>

        <Dialog
          open={openDefault}
          onOpenChange={setOpenDefault}
          title="Confirm action"
          description="Are you sure you want to proceed?"
          onConfirm={() => setOpenDefault(false)}
        />
        <Dialog
          open={openDanger}
          onOpenChange={setOpenDanger}
          title="Delete item?"
          description="This cannot be undone."
          variant="danger"
          confirmText="Delete"
          onConfirm={() => setOpenDanger(false)}
        />
        <Dialog
          open={openAlert}
          onOpenChange={setOpenAlert}
          title="Update available"
          description="A new version is ready to install."
          showCancel={false}
          confirmText="OK"
          onConfirm={() => setOpenAlert(false)}
        />
      </div>
    );
  },
};

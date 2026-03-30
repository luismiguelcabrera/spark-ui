import type { Meta, StoryObj } from "@storybook/react-vite";
import { useSnackbarQueue } from "./snackbar-queue";
import { Button } from "../forms/button";

// Dummy component for meta — we'll use the hook in render
function SnackbarQueueStory() {
  return null;
}

const meta = {
  title: "Feedback/SnackbarQueue",
  component: SnackbarQueueStory,
  tags: ["autodocs"],
} satisfies Meta<typeof SnackbarQueueStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const { enqueue, SnackbarQueueElement } = useSnackbarQueue();
    return (
      <div className="space-y-3">
        <Button
          onClick={() => enqueue({ message: "Changes saved successfully" })}
        >
          Show Snackbar
        </Button>
        {SnackbarQueueElement}
      </div>
    );
  },
};

export const Variants: Story = {
  render: () => {
    const { enqueue, SnackbarQueueElement } = useSnackbarQueue();
    return (
      <div className="flex gap-3 flex-wrap">
        <Button
          onClick={() => enqueue({ message: "Default message" })}
        >
          Default
        </Button>
        <Button
          color="success"
          onClick={() =>
            enqueue({ message: "File uploaded", variant: "success" })
          }
        >
          Success
        </Button>
        <Button
          color="destructive"
          onClick={() =>
            enqueue({ message: "Upload failed", variant: "error" })
          }
        >
          Error
        </Button>
        <Button
          color="warning"
          onClick={() =>
            enqueue({ message: "Low disk space", variant: "warning" })
          }
        >
          Warning
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            enqueue({ message: "System update available", variant: "info" })
          }
        >
          Info
        </Button>
        {SnackbarQueueElement}
      </div>
    );
  },
};

export const WithAction: Story = {
  render: () => {
    const { enqueue, SnackbarQueueElement } = useSnackbarQueue();
    return (
      <div className="space-y-3">
        <Button
          onClick={() =>
            enqueue({
              message: "Item deleted",
              action: {
                label: "Undo",
                onClick: () => {
                  enqueue({ message: "Undo successful", variant: "success" });
                },
              },
            })
          }
        >
          Delete Item
        </Button>
        {SnackbarQueueElement}
      </div>
    );
  },
};

export const RapidFire: Story = {
  name: "Rapid Queue",
  render: () => {
    const { enqueue, SnackbarQueueElement } = useSnackbarQueue();
    let count = 0;
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-500">
          Click rapidly to queue multiple snackbars. They appear one at a time.
        </p>
        <Button
          onClick={() => {
            count++;
            const variants = [
              "default",
              "success",
              "error",
              "warning",
              "info",
            ] as const;
            enqueue({
              message: `Notification #${count}`,
              variant: variants[count % variants.length],
              duration: 2000,
            });
          }}
        >
          Queue Snackbar
        </Button>
        {SnackbarQueueElement}
      </div>
    );
  },
};

export const Gallery: Story = {
  render: () => {
    const { enqueue, SnackbarQueueElement } = useSnackbarQueue();
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-500">
          Try each button. Snackbars queue up and show one at a time.
        </p>
        <div className="flex gap-2 flex-wrap">
          <Button
            size="sm"
            onClick={() =>
              enqueue({ message: "Default snackbar", duration: 3000 })
            }
          >
            Default
          </Button>
          <Button
            size="sm"
            color="success"
            onClick={() =>
              enqueue({
                message: "Success!",
                variant: "success",
                duration: 3000,
              })
            }
          >
            Success
          </Button>
          <Button
            size="sm"
            color="destructive"
            onClick={() =>
              enqueue({
                message: "Something went wrong",
                variant: "error",
                duration: 3000,
              })
            }
          >
            Error
          </Button>
          <Button
            size="sm"
            color="warning"
            onClick={() =>
              enqueue({
                message: "Heads up!",
                variant: "warning",
                duration: 3000,
              })
            }
          >
            Warning
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              enqueue({
                message: "With action",
                action: { label: "Undo", onClick: () => {} },
                duration: 3000,
              })
            }
          >
            With Action
          </Button>
        </div>
        {SnackbarQueueElement}
      </div>
    );
  },
};

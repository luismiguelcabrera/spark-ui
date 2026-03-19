import type { Meta, StoryObj } from "@storybook/react-vite";
import { ImperativeFeedbackProvider } from "./imperative-provider";
import {
  toast,
  Modal as ImperativeModal,
  notification,
} from "../../hooks/use-imperative-feedback";

const meta = {
  title: "Feedback/ImperativeFeedbackProvider",
  component: ImperativeFeedbackProvider,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <ImperativeFeedbackProvider>
        <Story />
      </ImperativeFeedbackProvider>
    ),
  ],
} satisfies Meta<typeof ImperativeFeedbackProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

function ToastDemo() {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => toast.success("File saved successfully")}
        className="px-4 py-2 bg-green-700 text-white rounded-lg text-sm font-medium"
      >
        Success Toast
      </button>
      <button
        type="button"
        onClick={() => toast.error("Something went wrong")}
        className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium"
      >
        Error Toast
      </button>
      <button
        type="button"
        onClick={() => toast.warning("Please check your input")}
        className="px-4 py-2 bg-amber-700 text-white rounded-lg text-sm font-medium"
      >
        Warning Toast
      </button>
      <button
        type="button"
        onClick={() => toast.info("New version available")}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
      >
        Info Toast
      </button>
    </div>
  );
}

function ModalDemo() {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() =>
          ImperativeModal.confirm({
            title: "Delete Item",
            description: "Are you sure you want to delete this item? This action cannot be undone.",
            confirmLabel: "Delete",
            cancelLabel: "Cancel",
            onConfirm: () => console.log("Confirmed"),
            onCancel: () => console.log("Cancelled"),
          })
        }
        className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium"
      >
        Confirm Modal
      </button>
      <button
        type="button"
        onClick={() =>
          ImperativeModal.info({
            title: "Information",
            description: "Your changes have been saved. You can close this dialog.",
            closeLabel: "Got it",
          })
        }
        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
      >
        Info Modal
      </button>
    </div>
  );
}

function NotificationDemo() {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() =>
          notification.show({
            title: "New Message",
            message: "You have a new message from John.",
            variant: "info",
          })
        }
        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
      >
        Info Notification
      </button>
      <button
        type="button"
        onClick={() =>
          notification.show({
            title: "Payment Received",
            message: "Your payment of $50 has been processed.",
            variant: "success",
          })
        }
        className="px-4 py-2 bg-green-700 text-white rounded-lg text-sm font-medium"
      >
        Success Notification
      </button>
      <button
        type="button"
        onClick={() =>
          notification.show({
            title: "Connection Lost",
            message: "Unable to reach the server. Retrying...",
            variant: "error",
          })
        }
        className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium"
      >
        Error Notification
      </button>
    </div>
  );
}

export const Toasts: Story = {
  args: { children: null },
  render: () => <ToastDemo />,
};

export const ToastWithDescription: Story = {
  args: { children: null },
  render: () => (
    <button
      type="button"
      onClick={() =>
        toast("File uploaded", {
          variant: "success",
          description: "report-2024.pdf was uploaded successfully.",
        })
      }
      className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium"
    >
      Toast with Description
    </button>
  ),
};

export const Modals: Story = {
  args: { children: null },
  render: () => <ModalDemo />,
};

export const Notifications: Story = {
  args: { children: null },
  render: () => <NotificationDemo />,
};

export const AllFeedbackTypes: Story = {
  args: { children: null },
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-bold text-slate-700 mb-2">Toasts</h3>
        <ToastDemo />
      </div>
      <div>
        <h3 className="text-sm font-bold text-slate-700 mb-2">Modals</h3>
        <ModalDemo />
      </div>
      <div>
        <h3 className="text-sm font-bold text-slate-700 mb-2">Notifications</h3>
        <NotificationDemo />
      </div>
    </div>
  ),
};

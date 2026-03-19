import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Modal } from "./modal";

const meta = {
  title: "Feedback/Modal",
  component: Modal,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg", "full"] },
    title: { control: "text" },
    description: { control: "text" },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

const ModalDemo = ({
  size,
  title = "Modal Title",
  description,
  footer,
  children,
}: {
  size?: "sm" | "md" | "lg" | "full";
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  children?: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium"
      >
        Open Modal
      </button>
      <Modal
        open={open}
        onOpenChange={setOpen}
        size={size}
        title={title}
        description={description}
        footer={footer}
      >
        {children ?? (
          <p className="text-sm text-slate-600">
            This is the modal content. Click the overlay or press Escape to close.
          </p>
        )}
      </Modal>
    </>
  );
};

export const Default: Story = {
  render: (args) => (
    <ModalDemo size={args.size ?? undefined} title={args.title} description={args.description} />
  ),
};

export const Small: Story = {
  render: (args) => <ModalDemo {...args} size="sm" title="Small Modal" />,
};

export const Medium: Story = {
  render: (args) => <ModalDemo {...args} size="md" title="Medium Modal" />,
};

export const Large: Story = {
  render: (args) => <ModalDemo {...args} size="lg" title="Large Modal" />,
};

export const FullSize: Story = {
  render: (args) => (
    <ModalDemo {...args} size="full" title="Full Size Modal">
      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          This modal takes up most of the screen. Great for complex workflows.
        </p>
        <div className="h-64 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center">
          <span className="text-sm text-slate-400">Content area</span>
        </div>
      </div>
    </ModalDemo>
  ),
};

export const WithDescription: Story = {
  render: (args) => (
    <ModalDemo
      {...args}
      title="Confirm Action"
      description="This action cannot be undone. Please review before continuing."
    />
  ),
};

export const WithFooter: Story = {
  render: (args) => (
    <ModalDemo
      {...args}
      title="Save Changes"
      description="You have unsaved changes."
      footer={
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            Discard
          </button>
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg"
          >
            Save
          </button>
        </div>
      }
    />
  ),
};

export const WithForm: Story = {
  render: (args) => (
    <ModalDemo
      {...args}
      title="Create Account"
      footer={
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg"
          >
            Create
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-700">Name</label>
          <input
            type="text"
            placeholder="Full name"
            className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Password</label>
          <input
            type="password"
            placeholder="Create a password"
            className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
          />
        </div>
      </div>
    </ModalDemo>
  ),
};

export const InlineMode: Story = {
  render: (args) => (
    <Modal {...args} title="Inline Modal" description="This modal renders inline without an overlay.">
      <p className="text-sm text-slate-600">
        When no <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">open</code> or{" "}
        <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">defaultOpen</code> prop is provided,
        the modal renders directly in the DOM without overlay.
      </p>
    </Modal>
  ),
};

export const AllSizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-3">
      {(["sm", "md", "lg", "full"] as const).map((size) => {
        const Demo = () => {
          const [open, setOpen] = useState(false);
          return (
            <>
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium"
              >
                {size.toUpperCase()}
              </button>
              <Modal
                {...args}
                open={open}
                onOpenChange={setOpen}
                size={size}
                title={`${size.toUpperCase()} Modal`}
                description={`This is the ${size} size variant.`}
              >
                <p className="text-sm text-slate-600">Modal content for {size} size.</p>
              </Modal>
            </>
          );
        };
        return <Demo key={size} />;
      })}
    </div>
  ),
};

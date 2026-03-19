import type { Meta, StoryObj } from "@storybook/react-vite";
import { Resizable } from "./resizable";

const meta = {
  title: "Layout/Resizable",
  component: Resizable,
  tags: ["autodocs"],
  argTypes: {
    direction: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
    minSize: { control: { type: "number", min: 50, max: 500 } },
    maxSize: { control: { type: "number", min: 100, max: 1000 } },
    defaultSize: { control: { type: "number", min: 50, max: 500 } },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Resizable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    direction: "horizontal",
    defaultSize: 300,
    minSize: 150,
    maxSize: 600,
  },
  render: (args) => (
    <div className="border border-slate-200 rounded-xl overflow-hidden h-64">
      <Resizable {...args}>
        <div className="h-full bg-slate-50 p-4">
          <p className="text-sm text-slate-600">Resizable panel</p>
          <p className="text-xs text-slate-400 mt-1">Drag the handle to resize</p>
        </div>
      </Resizable>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="border border-slate-200 rounded-xl overflow-hidden w-full max-w-md">
      <Resizable direction="vertical" defaultSize={150} minSize={80} maxSize={300}>
        <div className="w-full bg-slate-50 p-4">
          <p className="text-sm text-slate-600">Vertical resizable panel</p>
          <p className="text-xs text-slate-400 mt-1">Drag the handle below to resize vertically</p>
        </div>
      </Resizable>
      <div className="p-4 bg-white">
        <p className="text-sm text-slate-500">Content below the resizable area</p>
      </div>
    </div>
  ),
};

export const SidebarLayout: Story = {
  render: () => (
    <div className="border border-slate-200 rounded-xl overflow-hidden flex h-80">
      <Resizable direction="horizontal" defaultSize={240} minSize={180} maxSize={400}>
        <div className="h-full bg-slate-900 text-white p-4">
          <p className="text-sm font-semibold mb-3">Sidebar</p>
          <nav className="space-y-1 text-sm">
            <div className="px-3 py-2 rounded-lg bg-white/10">Dashboard</div>
            <div className="px-3 py-2 rounded-lg hover:bg-white/5">Users</div>
            <div className="px-3 py-2 rounded-lg hover:bg-white/5">Settings</div>
          </nav>
        </div>
      </Resizable>
      <div className="flex-1 p-6 bg-white">
        <h2 className="text-base font-semibold text-slate-900 mb-2">Main Content</h2>
        <p className="text-sm text-slate-500">
          Drag the handle between the sidebar and content to resize.
        </p>
      </div>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="border border-slate-200 rounded-xl overflow-hidden h-48">
      <Resizable direction="horizontal" defaultSize={250} disabled>
        <div className="h-full bg-slate-100 p-4">
          <p className="text-sm text-slate-500">Disabled resizable panel</p>
          <p className="text-xs text-slate-400 mt-1">The handle is not interactive</p>
        </div>
      </Resizable>
    </div>
  ),
};

export const WithCallback: Story = {
  render: () => (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">
        Check the browser console to see the <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">onResize</code> callback firing.
      </p>
      <div className="border border-slate-200 rounded-xl overflow-hidden h-48">
        <Resizable
          direction="horizontal"
          defaultSize={300}
          minSize={100}
          maxSize={500}
          onResize={(size) => console.log("Resized to:", size)}
        >
          <div className="h-full bg-primary/5 p-4">
            <p className="text-sm text-primary">Resize me and check the console</p>
          </div>
        </Resizable>
      </div>
    </div>
  ),
};

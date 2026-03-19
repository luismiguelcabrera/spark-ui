import type { Meta, StoryObj } from "@storybook/react-vite";
import { AppShell, AppShellHeader, AppShellContent } from "./app-shell";

const meta = {
  title: "Layout/AppShell",
  component: AppShell,
  tags: ["autodocs"],
  argTypes: {
    defaultCollapsed: { control: "boolean" },
  },
} satisfies Meta<typeof AppShell>;

export default meta;
type Story = StoryObj<typeof meta>;

function DemoSidebar() {
  return (
    <aside className="w-60 bg-slate-900 text-white p-4 flex flex-col gap-4 shrink-0 min-h-[400px]">
      <div className="font-bold text-lg">Logo</div>
      <nav className="flex flex-col gap-1 text-sm">
        <a href="#" className="px-3 py-2 rounded-lg bg-white/10">Dashboard</a>
        <a href="#" className="px-3 py-2 rounded-lg hover:bg-white/5">Users</a>
        <a href="#" className="px-3 py-2 rounded-lg hover:bg-white/5">Settings</a>
      </nav>
    </aside>
  );
}

export const Default: Story = {
  render: () => (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <AppShell sidebar={<DemoSidebar />}>
        <AppShellHeader>
          <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 bg-white">
            <h1 className="text-base font-semibold text-slate-900">Dashboard</h1>
            <div className="h-8 w-8 rounded-full bg-slate-200" />
          </div>
        </AppShellHeader>
        <AppShellContent>
          <div className="p-6 space-y-4">
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <p className="text-sm text-slate-500">Main content area</p>
            </div>
          </div>
        </AppShellContent>
      </AppShell>
    </div>
  ),
};

export const WithoutSidebar: Story = {
  render: () => (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <AppShell>
        <AppShellHeader>
          <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 bg-white">
            <h1 className="text-base font-semibold text-slate-900">Simple Layout</h1>
          </div>
        </AppShellHeader>
        <AppShellContent>
          <div className="p-6">
            <p className="text-sm text-slate-500">AppShell without a sidebar renders a full-width layout.</p>
          </div>
        </AppShellContent>
      </AppShell>
    </div>
  ),
};

export const CollapsedSidebar: Story = {
  args: {
    defaultCollapsed: true,
  },
  render: (args) => (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <AppShell sidebar={<DemoSidebar />} defaultCollapsed={args.defaultCollapsed}>
        <AppShellHeader>
          <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 bg-white">
            <h1 className="text-base font-semibold text-slate-900">Collapsed</h1>
          </div>
        </AppShellHeader>
        <AppShellContent>
          <div className="p-6">
            <p className="text-sm text-slate-500">
              Pass <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">defaultCollapsed</code> to start with a collapsed sidebar.
            </p>
          </div>
        </AppShellContent>
      </AppShell>
    </div>
  ),
};

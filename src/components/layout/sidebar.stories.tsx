import type { Meta, StoryObj } from "@storybook/react-vite";
import { Sidebar, SidebarNavGroup, SidebarNavItem } from "./sidebar";
import { SidebarProvider } from "./sidebar-context";
import { AppShell, AppShellHeader, AppShellContent } from "./app-shell";

const meta = {
  title: "Layout/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <AppShell
      sidebar={
        <Sidebar
          logo={<span className="text-lg font-bold text-white">Spark</span>}
        >
          <SidebarNavGroup label="Main">
            <SidebarNavItem icon="dashboard" label="Dashboard" active href="#" />
            <SidebarNavItem icon="people" label="Users" href="#" />
            <SidebarNavItem icon="analytics" label="Analytics" href="#" />
          </SidebarNavGroup>
          <SidebarNavGroup label="Settings">
            <SidebarNavItem icon="settings" label="General" href="#" />
            <SidebarNavItem icon="security" label="Security" href="#" />
          </SidebarNavGroup>
        </Sidebar>
      }
    >
      <AppShellHeader>
        <div className="flex items-center px-6 py-3 border-b border-slate-200 bg-white">
          <h1 className="text-base font-semibold text-slate-900">Dashboard</h1>
        </div>
      </AppShellHeader>
      <AppShellContent>
        <div className="p-6">
          <p className="text-sm text-slate-500">Main content area</p>
        </div>
      </AppShellContent>
    </AppShell>
  ),
};

export const Collapsible: Story = {
  render: () => (
    <AppShell
      sidebar={
        <Sidebar
          logo={<span className="text-lg font-bold text-white">Spark</span>}
          collapsible
        >
          <SidebarNavGroup label="Main">
            <SidebarNavItem icon="dashboard" label="Dashboard" active href="#" />
            <SidebarNavItem icon="people" label="Users" href="#" />
            <SidebarNavItem icon="analytics" label="Analytics" href="#" />
          </SidebarNavGroup>
        </Sidebar>
      }
    >
      <AppShellHeader>
        <div className="flex items-center px-6 py-3 border-b border-slate-200 bg-white">
          <h1 className="text-base font-semibold text-slate-900">Collapsible Sidebar</h1>
        </div>
      </AppShellHeader>
      <AppShellContent>
        <div className="p-6">
          <p className="text-sm text-slate-500">Click the toggle button on the sidebar edge to collapse/expand.</p>
        </div>
      </AppShellContent>
    </AppShell>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <AppShell
      sidebar={
        <Sidebar
          logo={<span className="text-lg font-bold text-white">Spark</span>}
          footer={
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 rounded-full bg-white/20" />
              <div>
                <p className="text-xs font-medium text-white">John Doe</p>
                <p className="text-xs text-white/60">Admin</p>
              </div>
            </div>
          }
        >
          <SidebarNavGroup>
            <SidebarNavItem icon="dashboard" label="Dashboard" active href="#" />
            <SidebarNavItem icon="people" label="Users" href="#" />
          </SidebarNavGroup>
        </Sidebar>
      }
    >
      <AppShellContent>
        <div className="p-6">
          <p className="text-sm text-slate-500">Sidebar with a footer section containing user info.</p>
        </div>
      </AppShellContent>
    </AppShell>
  ),
};

export const MultipleGroups: Story = {
  render: () => (
    <AppShell
      sidebar={
        <Sidebar logo={<span className="text-lg font-bold text-white">App</span>}>
          <SidebarNavGroup label="Overview">
            <SidebarNavItem icon="dashboard" label="Dashboard" active href="#" />
            <SidebarNavItem icon="bar_chart" label="Reports" href="#" />
          </SidebarNavGroup>
          <SidebarNavGroup label="Management">
            <SidebarNavItem icon="people" label="Users" href="#" />
            <SidebarNavItem icon="inventory_2" label="Products" href="#" />
            <SidebarNavItem icon="receipt_long" label="Orders" href="#" />
          </SidebarNavGroup>
          <SidebarNavGroup label="System">
            <SidebarNavItem icon="settings" label="Settings" href="#" />
            <SidebarNavItem icon="help" label="Help" href="#" />
          </SidebarNavGroup>
        </Sidebar>
      }
    >
      <AppShellContent>
        <div className="p-6">
          <p className="text-sm text-slate-500">Sidebar with multiple nav groups.</p>
        </div>
      </AppShellContent>
    </AppShell>
  ),
};

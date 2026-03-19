import type { Meta, StoryObj } from "@storybook/react-vite";
import { AdminPage } from "./admin-page";
import { SidebarProvider } from "./sidebar-context";

const meta = {
  title: "Layout/AdminPage",
  component: AdminPage,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <SidebarProvider>
        <Story />
      </SidebarProvider>
    ),
  ],
} satisfies Meta<typeof AdminPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <AdminPage>
      <AdminPage.Header title="Dashboard" subtitle="Overview of your account" />
      <div className="px-4 md:px-0 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <p className="text-sm text-slate-500">Total Users</p>
          <p className="text-2xl font-bold text-slate-900">1,234</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <p className="text-sm text-slate-500">Revenue</p>
          <p className="text-2xl font-bold text-slate-900">$12,345</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <p className="text-sm text-slate-500">Active Sessions</p>
          <p className="text-2xl font-bold text-slate-900">567</p>
        </div>
      </div>
    </AdminPage>
  ),
};

export const WithAction: Story = {
  render: () => (
    <AdminPage>
      <AdminPage.Header
        title="Products"
        subtitle="Manage your product catalog"
        action={
          <button
            type="button"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
          >
            Add Product
          </button>
        }
      />
      <div className="px-4 md:px-0">
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <p className="text-sm text-slate-500">Product list would go here</p>
        </div>
      </div>
    </AdminPage>
  ),
};

export const TitleOnly: Story = {
  render: () => (
    <AdminPage>
      <AdminPage.Header title="Settings" />
      <div className="px-4 md:px-0 space-y-4">
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <p className="text-sm font-medium text-slate-700">General</p>
          <p className="text-sm text-slate-500 mt-1">Configure general settings</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <p className="text-sm font-medium text-slate-700">Notifications</p>
          <p className="text-sm text-slate-500 mt-1">Manage notification preferences</p>
        </div>
      </div>
    </AdminPage>
  ),
};

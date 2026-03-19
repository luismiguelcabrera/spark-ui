import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tabs } from "./tabs";

const meta = {
  title: "Navigation/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  argTypes: {
    orientation: { control: "select", options: ["horizontal", "vertical"] },
    density: { control: "select", options: ["default", "comfortable", "compact"] },
    grow: { control: "boolean" },
    showArrows: { control: "boolean" },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Legacy: Story = {
  args: {
    tabs: [
      { label: "Overview", value: "overview", active: true },
      { label: "Members", value: "members" },
      { label: "Settings", value: "settings" },
    ],
  },
};

export const Compound: Story = {
  render: (args) => (
    <Tabs defaultValue="overview" {...args}>
      <Tabs.List>
        <Tabs.Tab value="overview">Overview</Tabs.Tab>
        <Tabs.Tab value="members">Members</Tabs.Tab>
        <Tabs.Tab value="settings">Settings</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="overview">
        <p className="p-4">Overview content</p>
      </Tabs.Panel>
      <Tabs.Panel value="members">
        <p className="p-4">Members content</p>
      </Tabs.Panel>
      <Tabs.Panel value="settings">
        <p className="p-4">Settings content</p>
      </Tabs.Panel>
    </Tabs>
  ),
};

export const VerticalLegacy: Story = {
  args: {
    orientation: "vertical",
    tabs: [
      { label: "General", value: "general", active: true },
      { label: "Security", value: "security" },
      { label: "Notifications", value: "notifications" },
      { label: "Billing", value: "billing" },
    ],
  },
};

export const VerticalCompound: Story = {
  render: (args) => (
    <Tabs defaultValue="general" orientation="vertical" {...args}>
      <Tabs.List>
        <Tabs.Tab value="general">General</Tabs.Tab>
        <Tabs.Tab value="security">Security</Tabs.Tab>
        <Tabs.Tab value="notifications">Notifications</Tabs.Tab>
        <Tabs.Tab value="billing">Billing</Tabs.Tab>
      </Tabs.List>
      <div className="flex-1">
        <Tabs.Panel value="general">
          <div className="p-6">
            <h3 className="text-lg font-bold text-secondary">General Settings</h3>
            <p className="text-sm text-slate-500 mt-2">Manage your account settings and preferences.</p>
          </div>
        </Tabs.Panel>
        <Tabs.Panel value="security">
          <div className="p-6">
            <h3 className="text-lg font-bold text-secondary">Security</h3>
            <p className="text-sm text-slate-500 mt-2">Configure password, 2FA, and session settings.</p>
          </div>
        </Tabs.Panel>
        <Tabs.Panel value="notifications">
          <div className="p-6">
            <h3 className="text-lg font-bold text-secondary">Notifications</h3>
            <p className="text-sm text-slate-500 mt-2">Choose what notifications you receive.</p>
          </div>
        </Tabs.Panel>
        <Tabs.Panel value="billing">
          <div className="p-6">
            <h3 className="text-lg font-bold text-secondary">Billing</h3>
            <p className="text-sm text-slate-500 mt-2">Manage your subscription and payment methods.</p>
          </div>
        </Tabs.Panel>
      </div>
    </Tabs>
  ),
};

export const GrowTabs: Story = {
  render: (args) => (
    <Tabs defaultValue="a" grow {...args}>
      <Tabs.List>
        <Tabs.Tab value="a">Tab A</Tabs.Tab>
        <Tabs.Tab value="b">Tab B</Tabs.Tab>
        <Tabs.Tab value="c">Tab C</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="a"><p className="p-4 text-sm text-slate-600">Each tab stretches equally.</p></Tabs.Panel>
      <Tabs.Panel value="b"><p className="p-4 text-sm text-slate-600">Panel B content.</p></Tabs.Panel>
      <Tabs.Panel value="c"><p className="p-4 text-sm text-slate-600">Panel C content.</p></Tabs.Panel>
    </Tabs>
  ),
};

export const DensityVariants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-8">
      {(["compact", "default", "comfortable"] as const).map((density) => (
        <div key={density}>
          <p className="text-xs font-semibold text-slate-500 uppercase mb-3">{density}</p>
          <Tabs defaultValue="a" density={density} {...args}>
            <Tabs.List>
              <Tabs.Tab value="a">Tab A</Tabs.Tab>
              <Tabs.Tab value="b">Tab B</Tabs.Tab>
              <Tabs.Tab value="c">Tab C</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="a"><p className="p-4 text-sm text-slate-600">Content for {density} density</p></Tabs.Panel>
            <Tabs.Panel value="b"><p className="p-4 text-sm text-slate-600">Panel B</p></Tabs.Panel>
            <Tabs.Panel value="c"><p className="p-4 text-sm text-slate-600">Panel C</p></Tabs.Panel>
          </Tabs>
        </div>
      ))}
    </div>
  ),
};

export const ShowArrowsLegacy: Story = {
  args: {
    showArrows: true,
    tabs: Array.from({ length: 15 }, (_, i) => ({
      label: `Tab ${i + 1}`,
      value: `tab-${i + 1}`,
      active: i === 0,
    })),
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 500 }}>
        <Story />
      </div>
    ),
  ],
};

export const Gallery: Story = {
  render: (args) => (
    <div className="flex flex-col gap-10">
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase mb-3">Horizontal (default)</p>
        <Tabs defaultValue="a" {...args}>
          <Tabs.List>
            <Tabs.Tab value="a">Tab A</Tabs.Tab>
            <Tabs.Tab value="b">Tab B</Tabs.Tab>
            <Tabs.Tab value="c">Tab C</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="a"><p className="p-4 text-sm text-slate-600">Horizontal panel A</p></Tabs.Panel>
          <Tabs.Panel value="b"><p className="p-4 text-sm text-slate-600">Horizontal panel B</p></Tabs.Panel>
          <Tabs.Panel value="c"><p className="p-4 text-sm text-slate-600">Horizontal panel C</p></Tabs.Panel>
        </Tabs>
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase mb-3">Vertical</p>
        <Tabs defaultValue="x" orientation="vertical">
          <Tabs.List>
            <Tabs.Tab value="x">Tab X</Tabs.Tab>
            <Tabs.Tab value="y">Tab Y</Tabs.Tab>
            <Tabs.Tab value="z">Tab Z</Tabs.Tab>
          </Tabs.List>
          <div className="flex-1">
            <Tabs.Panel value="x"><p className="p-4 text-sm text-slate-600">Vertical panel X</p></Tabs.Panel>
            <Tabs.Panel value="y"><p className="p-4 text-sm text-slate-600">Vertical panel Y</p></Tabs.Panel>
            <Tabs.Panel value="z"><p className="p-4 text-sm text-slate-600">Vertical panel Z</p></Tabs.Panel>
          </div>
        </Tabs>
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase mb-3">Grow + Compact</p>
        <Tabs defaultValue="a" grow density="compact">
          <Tabs.List>
            <Tabs.Tab value="a">Tab A</Tabs.Tab>
            <Tabs.Tab value="b">Tab B</Tabs.Tab>
            <Tabs.Tab value="c">Tab C</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="a"><p className="p-4 text-sm text-slate-600">Grow + compact panel</p></Tabs.Panel>
          <Tabs.Panel value="b"><p className="p-4 text-sm text-slate-600">Panel B</p></Tabs.Panel>
          <Tabs.Panel value="c"><p className="p-4 text-sm text-slate-600">Panel C</p></Tabs.Panel>
        </Tabs>
      </div>
    </div>
  ),
};

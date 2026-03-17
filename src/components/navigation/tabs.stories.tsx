import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tabs } from "./tabs";

const meta = {
  title: "Navigation/Tabs",
  component: Tabs,
  tags: ["autodocs"],
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
  render: () => (
    <Tabs defaultValue="overview">
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

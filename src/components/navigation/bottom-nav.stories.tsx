import type { Meta, StoryObj } from "@storybook/react-vite";
import { BottomNav } from "./bottom-nav";
import type { BottomNavItem } from "./bottom-nav";

const meta = {
  title: "Navigation/BottomNav",
  component: BottomNav,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["default", "floating", "bordered"] },
    showLabels: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <div className="relative h-96 bg-slate-50 rounded-xl overflow-hidden border border-slate-200">
        <div className="p-6">
          <p className="text-sm text-slate-500">Page content area. Scroll down to see the bottom nav.</p>
        </div>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BottomNav>;

export default meta;
type Story = StoryObj<typeof meta>;

const items: BottomNavItem[] = [
  { label: "Home", icon: "home", active: true },
  { label: "Search", icon: "search" },
  { label: "Notifications", icon: "bell", badge: 3 },
  { label: "Messages", icon: "mail" },
  { label: "Profile", icon: "user" },
];

export const Default: Story = {
  args: {
    items,
    className: "absolute",
  },
};

export const Floating: Story = {
  args: {
    items,
    variant: "floating",
    className: "absolute",
  },
};

export const Bordered: Story = {
  args: {
    items,
    variant: "bordered",
    className: "absolute",
  },
};

export const WithBadges: Story = {
  args: {
    items: [
      { label: "Home", icon: "home", active: true },
      { label: "Orders", icon: "shopping-cart", badge: 5 },
      { label: "Inbox", icon: "mail", badge: 12 },
      { label: "Alerts", icon: "bell", badge: 100 },
      { label: "Account", icon: "user" },
    ],
    className: "absolute",
  },
};

export const WithoutLabels: Story = {
  args: {
    items,
    showLabels: false,
    className: "absolute",
  },
};

export const WithDisabledItem: Story = {
  args: {
    items: [
      { label: "Home", icon: "home", active: true },
      { label: "Search", icon: "search" },
      { label: "Premium", icon: "star", disabled: true },
      { label: "Profile", icon: "user" },
    ],
    className: "absolute",
  },
};

export const ThreeItems: Story = {
  args: {
    items: [
      { label: "Home", icon: "home", active: true },
      { label: "Search", icon: "search" },
      { label: "Profile", icon: "user" },
    ],
    variant: "floating",
    className: "absolute",
  },
};

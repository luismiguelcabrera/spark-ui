import type { Meta, StoryObj } from "@storybook/react-vite";
import { Dock } from "./dock";
import { Icon } from "./icon";

const defaultItems = [
  { id: "home", icon: <Icon name="home" size="lg" className="text-slate-600" />, label: "Home" },
  { id: "search", icon: <Icon name="search" size="lg" className="text-slate-600" />, label: "Search" },
  { id: "mail", icon: <Icon name="mail" size="lg" className="text-slate-600" />, label: "Mail", badge: 3 },
  { id: "calendar", icon: <Icon name="calendar" size="lg" className="text-slate-600" />, label: "Calendar" },
  { id: "settings", icon: <Icon name="settings" size="lg" className="text-slate-600" />, label: "Settings" },
];

const meta = {
  title: "Data Display/Dock",
  component: Dock,
  tags: ["autodocs"],
  argTypes: {
    position: { control: "select", options: ["bottom", "left", "right"] },
    magnification: { control: "boolean" },
  },
} satisfies Meta<typeof Dock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { items: defaultItems },
};

export const NoMagnification: Story = {
  args: { items: defaultItems, magnification: false },
};

export const LeftPosition: Story = {
  args: { items: defaultItems, position: "left" },
};

export const RightPosition: Story = {
  args: { items: defaultItems, position: "right" },
};

export const WithActiveItem: Story = {
  args: {
    items: [
      { id: "home", icon: <Icon name="home" size="lg" className="text-slate-600" />, label: "Home", active: true },
      { id: "search", icon: <Icon name="search" size="lg" className="text-slate-600" />, label: "Search" },
      { id: "mail", icon: <Icon name="mail" size="lg" className="text-slate-600" />, label: "Mail" },
      { id: "settings", icon: <Icon name="settings" size="lg" className="text-slate-600" />, label: "Settings" },
    ],
  },
};

export const WithBadges: Story = {
  args: {
    items: [
      { id: "home", icon: <Icon name="home" size="lg" className="text-slate-600" />, label: "Home" },
      { id: "mail", icon: <Icon name="mail" size="lg" className="text-slate-600" />, label: "Mail", badge: 12 },
      { id: "bell", icon: <Icon name="bell" size="lg" className="text-slate-600" />, label: "Notifications", badge: "99+" },
      { id: "chat", icon: <Icon name="chat" size="lg" className="text-slate-600" />, label: "Chat", badge: 5 },
    ],
  },
};

export const StringIcons: Story = {
  args: {
    items: [
      { id: "home", icon: "home", label: "Home" },
      { id: "search", icon: "search", label: "Search" },
      { id: "settings", icon: "settings", label: "Settings" },
      { id: "person", icon: "person", label: "Profile" },
    ],
  },
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import { NavigationMenu } from "./navigation-menu";
import type { NavigationMenuItem } from "./navigation-menu";

const meta = {
  title: "Navigation/NavigationMenu",
  component: NavigationMenu,
  tags: ["autodocs"],
  argTypes: {
    orientation: { control: "select", options: ["horizontal", "vertical"] },
  },
} satisfies Meta<typeof NavigationMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

const megaMenuItems: NavigationMenuItem[] = [
  {
    label: "Products",
    children: [
      {
        label: "Analytics",
        description: "Understand your traffic and conversions",
        icon: "chart",
        href: "#",
      },
      {
        label: "Automation",
        description: "Automate your workflows and save time",
        icon: "settings",
        href: "#",
      },
      {
        label: "Integrations",
        description: "Connect with your favorite tools",
        icon: "link",
        href: "#",
        featured: true,
      },
      {
        label: "Security",
        description: "Enterprise-grade security features",
        icon: "shield",
        href: "#",
      },
    ],
  },
  {
    label: "Solutions",
    children: [
      {
        label: "For Startups",
        description: "Everything you need to get started",
        icon: "rocket",
        href: "#",
      },
      {
        label: "For Enterprise",
        description: "Scale with confidence",
        icon: "building",
        href: "#",
      },
      {
        label: "For Developers",
        description: "Build with powerful APIs",
        icon: "code",
        href: "#",
      },
    ],
  },
  {
    label: "Pricing",
    href: "#",
  },
  {
    label: "Docs",
    href: "#",
    icon: "file",
  },
];

export const Default: Story = {
  args: {
    items: megaMenuItems,
  },
  render: (args) => (
    <div className="p-8">
      <NavigationMenu {...args} />
    </div>
  ),
};

export const WithActiveItem: Story = {
  args: {
    items: [
      ...megaMenuItems.slice(0, 2),
      { label: "Pricing", href: "#", active: true },
      { label: "Docs", href: "#", icon: "file" },
    ],
  },
  render: (args) => (
    <div className="p-8">
      <NavigationMenu {...args} />
    </div>
  ),
};

export const SimpleNav: Story = {
  args: {
    items: [
      { label: "Home", href: "#", icon: "home", active: true },
      { label: "About", href: "#" },
      { label: "Services", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  render: (args) => (
    <div className="p-8">
      <NavigationMenu {...args} />
    </div>
  ),
};

export const Vertical: Story = {
  args: {
    items: [
      { label: "Dashboard", href: "#", icon: "home", active: true },
      { label: "Projects", href: "#", icon: "folder" },
      {
        label: "Settings",
        icon: "settings",
        children: [
          { label: "General", href: "#", description: "Manage general settings" },
          { label: "Security", href: "#", description: "Password and authentication" },
          { label: "Notifications", href: "#", description: "Email and push notifications" },
        ],
      },
      { label: "Help", href: "#", icon: "help-circle" },
    ],
    orientation: "vertical",
  },
  render: (args) => (
    <div className="p-8 w-64">
      <NavigationMenu {...args} />
    </div>
  ),
};

export const WithFeaturedItems: Story = {
  args: {
    items: [
      {
        label: "Resources",
        children: [
          {
            label: "Blog",
            description: "Latest news and updates",
            icon: "edit",
            href: "#",
          },
          {
            label: "New! AI Assistant",
            description: "Try our new AI-powered assistant",
            icon: "star",
            href: "#",
            featured: true,
          },
          {
            label: "Community",
            description: "Join our developer community",
            icon: "users",
            href: "#",
          },
        ],
      },
    ],
  },
  render: (args) => (
    <div className="p-8">
      <NavigationMenu {...args} />
    </div>
  ),
};

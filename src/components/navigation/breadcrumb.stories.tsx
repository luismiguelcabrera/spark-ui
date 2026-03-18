import type { Meta, StoryObj } from "@storybook/react-vite";
import { Breadcrumb } from "./breadcrumb";

const meta = {
  title: "Navigation/Breadcrumb",
  component: Breadcrumb,
  tags: ["autodocs"],
  argTypes: {
    maxItems: { control: "number" },
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      { label: "Home", href: "/" },
      { label: "Products", href: "/products" },
      { label: "Widget Pro" },
    ],
  },
};

export const WithIcons: Story = {
  args: {
    items: [
      { label: "Home", href: "/", icon: "home" },
      { label: "Settings", href: "/settings", icon: "settings" },
      { label: "Profile", icon: "user" },
    ],
  },
};

export const CustomSeparatorSlash: Story = {
  name: "Custom Separator (slash)",
  args: {
    items: [
      { label: "Home", href: "/" },
      { label: "Blog", href: "/blog" },
      { label: "Post Title" },
    ],
    separator: <span className="text-slate-300 text-xs">/</span>,
  },
};

export const CustomSeparatorIcon: Story = {
  name: "Custom Separator (arrow icon)",
  args: {
    items: [
      { label: "Home", href: "/" },
      { label: "Docs", href: "/docs" },
      { label: "API" },
    ],
    separator: "arrow-right",
  },
};

export const Collapsible: Story = {
  args: {
    items: [
      { label: "Home", href: "/" },
      { label: "Products", href: "/products" },
      { label: "Electronics", href: "/products/electronics" },
      { label: "Phones", href: "/products/electronics/phones" },
      { label: "iPhone 15" },
    ],
    maxItems: 3,
  },
};

export const LongPath: Story = {
  args: {
    items: [
      { label: "Home", href: "/" },
      { label: "Users", href: "/users" },
      { label: "Admin", href: "/users/admin" },
      { label: "Settings", href: "/users/admin/settings" },
      { label: "Security", href: "/users/admin/settings/security" },
      { label: "Two-Factor Auth" },
    ],
    maxItems: 4,
  },
};

export const SingleItem: Story = {
  args: {
    items: [{ label: "Dashboard" }],
  },
};

export const TwoItems: Story = {
  args: {
    items: [
      { label: "Home", href: "/" },
      { label: "Current Page" },
    ],
  },
};

export const Gallery: Story = {
  render: (args) => (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Default</p>
        <Breadcrumb
          {...args}
          items={[
            { label: "Home", href: "/" },
            { label: "Products", href: "/products" },
            { label: "Widget" },
          ]}
        />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase mb-2">With Icons</p>
        <Breadcrumb
          items={[
            { label: "Home", href: "/", icon: "home" },
            { label: "Settings", href: "/settings", icon: "settings" },
            { label: "Profile", icon: "user" },
          ]}
        />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Custom Separator</p>
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Blog", href: "/blog" },
            { label: "My Post" },
          ]}
          separator={<span className="text-slate-300">/</span>}
        />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Collapsed (maxItems=3)</p>
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Products", href: "/products" },
            { label: "Electronics", href: "/products/electronics" },
            { label: "Phones", href: "/products/electronics/phones" },
            { label: "iPhone 15" },
          ]}
          maxItems={3}
        />
      </div>
    </div>
  ),
};

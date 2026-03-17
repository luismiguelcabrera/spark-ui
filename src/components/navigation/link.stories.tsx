import type { Meta, StoryObj } from "@storybook/react-vite";
import { Link } from "./link";

const meta = {
  title: "Navigation/Link",
  component: Link,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["default", "subtle", "muted", "nav", "unstyled"] },
    size: { control: "select", options: ["xs", "sm", "md", "lg"] },
    external: { control: "boolean" },
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "Default Link", href: "#" },
};

export const Subtle: Story = {
  args: { children: "Subtle Link", href: "#", variant: "subtle" },
};

export const Muted: Story = {
  args: { children: "Muted Link", href: "#", variant: "muted" },
};

export const Nav: Story = {
  args: { children: "Nav Link", href: "#", variant: "nav" },
};

export const Unstyled: Story = {
  args: { children: "Unstyled Link", href: "#", variant: "unstyled" },
};

export const External: Story = {
  args: { children: "External Link", href: "https://example.com", external: true },
};

export const Small: Story = {
  args: { children: "Small Link", href: "#", size: "sm" },
};

export const Large: Story = {
  args: { children: "Large Link", href: "#", size: "lg" },
};

export const ExtraSmall: Story = {
  args: { children: "Extra Small Link", href: "#", size: "xs" },
};

export const AllVariants: Story = {
  render: (args) => (
    <div className="space-y-3">
      <div>
        <Link {...args} href="#" variant="default">Default - underlined primary link</Link>
      </div>
      <div>
        <Link {...args} href="#" variant="subtle">Subtle - underline on hover</Link>
      </div>
      <div>
        <Link {...args} href="#" variant="muted">Muted - subdued text</Link>
      </div>
      <div>
        <Link {...args} href="#" variant="nav">Nav - navigation style</Link>
      </div>
      <div>
        <Link {...args} href="#" variant="unstyled">Unstyled - no styling</Link>
      </div>
    </div>
  ),
};

export const AllSizes: Story = {
  render: (args) => (
    <div className="space-y-3">
      <div><Link {...args} href="#" size="xs">Extra Small (xs)</Link></div>
      <div><Link {...args} href="#" size="sm">Small (sm)</Link></div>
      <div><Link {...args} href="#" size="md">Medium (md)</Link></div>
      <div><Link {...args} href="#" size="lg">Large (lg)</Link></div>
    </div>
  ),
};

export const InText: Story = {
  render: (args) => (
    <p className="text-sm text-slate-600 max-w-lg">
      By continuing, you agree to our{" "}
      <Link {...args} href="#" size="sm">Terms of Service</Link> and{" "}
      <Link {...args} href="#" size="sm">Privacy Policy</Link>. For questions, visit our{" "}
      <Link {...args} href="#" size="sm" variant="subtle">Help Center</Link>.
    </p>
  ),
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import { MegaMenu, type MegaMenuSection } from "./mega-menu";

const meta = {
  title: "Navigation/MegaMenu",
  component: MegaMenu,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof MegaMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Data ────────────────────────────────────────────────

const defaultSections: MegaMenuSection[] = [
  {
    label: "Products",
    columns: [
      {
        title: "Software",
        items: [
          {
            label: "Analytics",
            href: "#analytics",
            description: "Track user engagement and conversion metrics",
          },
          {
            label: "Automation",
            href: "#automation",
            description: "Automate repetitive workflows and tasks",
          },
          {
            label: "Integration",
            href: "#integration",
            description: "Connect with 200+ third-party services",
          },
        ],
      },
      {
        title: "Hardware",
        items: [
          {
            label: "Servers",
            href: "#servers",
            description: "High-performance cloud servers",
          },
          {
            label: "Storage",
            href: "#storage",
            description: "Scalable object and block storage",
          },
        ],
      },
    ],
  },
  {
    label: "Solutions",
    columns: [
      {
        title: "By Industry",
        items: [
          { label: "Healthcare", href: "#healthcare" },
          { label: "Finance", href: "#finance" },
          { label: "Education", href: "#education" },
        ],
      },
      {
        title: "By Size",
        items: [
          { label: "Enterprise", href: "#enterprise" },
          { label: "Startup", href: "#startup" },
          { label: "SMB", href: "#smb" },
        ],
      },
    ],
  },
  {
    label: "Resources",
    columns: [
      {
        items: [
          { label: "Documentation", href: "#docs" },
          { label: "Blog", href: "#blog" },
          { label: "Community", href: "#community" },
          { label: "Changelog", href: "#changelog" },
        ],
      },
    ],
  },
];

const withIconsSections: MegaMenuSection[] = [
  {
    label: "Features",
    columns: [
      {
        title: "Core",
        items: [
          {
            label: "Dashboard",
            href: "#dashboard",
            icon: "dashboard",
            description: "Real-time overview of your data",
          },
          {
            label: "Reports",
            href: "#reports",
            icon: "description",
            description: "Generate and export detailed reports",
          },
          {
            label: "Notifications",
            href: "#notifications",
            icon: "notifications",
            description: "Stay updated with smart alerts",
          },
        ],
      },
      {
        title: "Advanced",
        items: [
          {
            label: "API Access",
            href: "#api",
            icon: "code",
            description: "RESTful API for custom integrations",
          },
          {
            label: "Security",
            href: "#security",
            icon: "security",
            description: "Enterprise-grade security controls",
          },
          {
            label: "Settings",
            href: "#settings",
            icon: "settings",
            description: "Customize your workspace",
          },
        ],
      },
    ],
  },
  {
    label: "Platform",
    columns: [
      {
        items: [
          { label: "Web App", href: "#web", icon: "language" },
          { label: "Mobile", href: "#mobile", icon: "phone_iphone" },
          { label: "Desktop", href: "#desktop", icon: "computer" },
        ],
      },
    ],
  },
];

const withFooterSections: MegaMenuSection[] = [
  {
    label: "Products",
    columns: [
      {
        title: "Popular",
        items: [
          {
            label: "Analytics Pro",
            href: "#analytics-pro",
            icon: "trending_up",
            description: "Advanced analytics suite",
          },
          {
            label: "Team Hub",
            href: "#team-hub",
            icon: "group",
            description: "Collaboration for teams",
          },
        ],
      },
      {
        title: "New",
        items: [
          {
            label: "AI Assistant",
            href: "#ai",
            icon: "auto_awesome",
            description: "AI-powered productivity tools",
          },
          {
            label: "Workflows",
            href: "#workflows",
            icon: "account_tree",
            description: "Visual workflow builder",
          },
        ],
      },
    ],
    footer: (
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-500">Explore all 20+ products</span>
        <a href="#all-products" className="text-primary font-medium hover:underline">
          View all →
        </a>
      </div>
    ),
  },
  {
    label: "Company",
    columns: [
      {
        items: [
          { label: "About", href: "#about" },
          { label: "Careers", href: "#careers" },
          { label: "Press", href: "#press" },
        ],
      },
    ],
    footer: (
      <div className="text-sm text-slate-500">
        We are hiring! <a href="#careers" className="text-primary font-medium hover:underline">See open positions</a>
      </div>
    ),
  },
];

// ── Stories ──────────────────────────────────────────────

export const Default: Story = {
  args: {
    sections: defaultSections,
  },
};

export const WithIcons: Story = {
  args: {
    sections: withIconsSections,
  },
};

export const WithFooter: Story = {
  args: {
    sections: withFooterSections,
  },
};

export const Gallery: Story = {
  render: (args) => (
    <div className="space-y-12">
      <div>
        <h3 className="text-sm font-semibold text-slate-500 mb-4">Default</h3>
        <MegaMenu {...args} sections={defaultSections} aria-label="Default navigation" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-slate-500 mb-4">With Icons</h3>
        <MegaMenu {...args} sections={withIconsSections} aria-label="Icons navigation" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-slate-500 mb-4">With Footer</h3>
        <MegaMenu {...args} sections={withFooterSections} aria-label="Footer navigation" />
      </div>
    </div>
  ),
  args: {
    sections: defaultSections,
  },
};

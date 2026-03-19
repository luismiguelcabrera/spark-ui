import type { Meta, StoryObj } from "@storybook/react-vite";
import { SkipNavLink, SkipNavContent } from "./skip-nav";

const meta = {
  title: "Navigation/SkipNav",
  component: SkipNavLink,
  tags: ["autodocs"],
  argTypes: {
    contentId: { control: "text" },
  },
} satisfies Meta<typeof SkipNavLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        The SkipNavLink is visually hidden until it receives keyboard focus. Press <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-xs font-mono">Tab</kbd> to
        reveal it in the top-left corner.
      </p>
      <div className="relative border border-slate-200 rounded-xl overflow-hidden">
        <SkipNavLink />
        <header className="bg-slate-900 text-white px-6 py-3">
          <nav className="flex gap-4 text-sm">
            <a href="#" className="hover:text-white/80">Home</a>
            <a href="#" className="hover:text-white/80">About</a>
            <a href="#" className="hover:text-white/80">Contact</a>
          </nav>
        </header>
        <SkipNavContent>
          <main className="p-6">
            <h1 className="text-lg font-semibold text-slate-900 mb-2">Main Content</h1>
            <p className="text-sm text-slate-500">
              This is the main content area. The skip link jumps here, bypassing the navigation.
            </p>
          </main>
        </SkipNavContent>
      </div>
    </div>
  ),
};

export const CustomId: Story = {
  render: () => (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        Custom <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">contentId</code> to target a different element.
      </p>
      <div className="relative border border-slate-200 rounded-xl overflow-hidden">
        <SkipNavLink contentId="article-content">Skip to article</SkipNavLink>
        <header className="bg-slate-50 px-6 py-3 border-b border-slate-200">
          <p className="text-sm text-slate-600">Site Header</p>
        </header>
        <SkipNavContent id="article-content">
          <article className="p-6">
            <h2 className="text-base font-semibold text-slate-900 mb-2">Article</h2>
            <p className="text-sm text-slate-500">Article content targeted by the skip link.</p>
          </article>
        </SkipNavContent>
      </div>
    </div>
  ),
};

export const CustomLabel: Story = {
  render: () => (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        Custom children text for the skip link.
      </p>
      <div className="relative border border-slate-200 rounded-xl overflow-hidden">
        <SkipNavLink>Jump to content</SkipNavLink>
        <header className="bg-primary text-white px-6 py-3">
          <p className="text-sm">Navigation bar</p>
        </header>
        <SkipNavContent>
          <div className="p-6">
            <p className="text-sm text-slate-500">Main content area.</p>
          </div>
        </SkipNavContent>
      </div>
    </div>
  ),
};

export const FullPageDemo: Story = {
  render: () => (
    <div className="relative border border-slate-200 rounded-xl overflow-hidden">
      <SkipNavLink />
      <header className="bg-slate-900 text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <span className="font-bold">Spark UI</span>
          <nav className="flex gap-4 text-sm">
            <a href="#" className="hover:text-white/80">Home</a>
            <a href="#" className="hover:text-white/80">Docs</a>
            <a href="#" className="hover:text-white/80">Blog</a>
            <a href="#" className="hover:text-white/80">GitHub</a>
          </nav>
        </div>
      </header>
      <div className="flex">
        <aside className="w-48 bg-slate-50 border-r border-slate-200 p-4 text-sm text-slate-600 space-y-2">
          <p className="font-medium text-slate-700">Sidebar</p>
          <a href="#" className="block hover:text-primary">Getting Started</a>
          <a href="#" className="block hover:text-primary">Components</a>
          <a href="#" className="block hover:text-primary">API</a>
        </aside>
        <SkipNavContent>
          <main className="flex-1 p-6">
            <h1 className="text-xl font-bold text-slate-900 mb-3">Documentation</h1>
            <p className="text-sm text-slate-500">
              Tab to reveal the skip link. It lets keyboard users bypass the header and sidebar
              navigation to jump directly to this content area.
            </p>
          </main>
        </SkipNavContent>
      </div>
    </div>
  ),
};

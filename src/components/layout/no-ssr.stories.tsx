import type { Meta, StoryObj } from "@storybook/react-vite";
import { NoSsr } from "./no-ssr";

const meta = {
  title: "Layout/NoSsr",
  component: NoSsr,
  tags: ["autodocs"],
} satisfies Meta<typeof NoSsr>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-sm text-green-800 font-medium">
          This content is only rendered on the client.
        </p>
      </div>
    ),
  },
};

export const WithFallback: Story = {
  args: {
    fallback: (
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg animate-pulse">
        <p className="text-sm text-slate-500">Loading...</p>
      </div>
    ),
    children: (
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-sm text-green-800 font-medium">
          Client-only content loaded!
        </p>
      </div>
    ),
  },
};

export const BrowserApiExample: Story = {
  name: "Browser API Example",
  render: (args) => (
    <NoSsr
      {...args}
      fallback={
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">Detecting window size...</p>
        </div>
      }
    >
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800 font-medium">
          Window inner width: {typeof window !== "undefined" ? window.innerWidth : "N/A"}px
        </p>
        <p className="text-sm text-blue-800">
          User agent: {typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 60) + "..." : "N/A"}
        </p>
      </div>
    </NoSsr>
  ),
};

export const NestedNoSsr: Story = {
  name: "Nested Content",
  render: (args) => (
    <div className="space-y-3">
      <div className="p-4 bg-slate-50 border rounded-lg">
        <p className="text-sm text-slate-600">This renders on server and client.</p>
      </div>
      <NoSsr {...args}>
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800 font-medium">Client only section</p>
          <ul className="mt-2 text-sm text-green-700 list-disc list-inside">
            <li>Uses browser APIs safely</li>
            <li>No hydration mismatch</li>
            <li>Shows fallback during SSR</li>
          </ul>
        </div>
      </NoSsr>
    </div>
  ),
};

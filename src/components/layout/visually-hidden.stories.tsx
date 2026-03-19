import type { Meta, StoryObj } from "@storybook/react-vite";
import { VisuallyHidden } from "./visually-hidden";

const meta = {
  title: "Layout/VisuallyHidden",
  component: VisuallyHidden,
  tags: ["autodocs"],
} satisfies Meta<typeof VisuallyHidden>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        VisuallyHidden renders content that is invisible to sighted users but remains accessible
        to screen readers. It uses CSS techniques (absolute positioning, zero dimensions, clip rect)
        to visually hide the element while keeping it in the accessibility tree.
      </p>
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
        <p className="text-sm text-slate-600">
          There is hidden text after this sentence.
          <VisuallyHidden>This text is only visible to screen readers.</VisuallyHidden>
        </p>
        <p className="text-xs text-slate-500 mt-2">
          Inspect the DOM to find the hidden span element.
        </p>
      </div>
    </div>
  ),
};

export const IconButton: Story = {
  render: () => (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        Common use case: providing accessible labels for icon-only buttons.
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          className="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">edit</span>
          <VisuallyHidden>Edit item</VisuallyHidden>
        </button>
        <button
          type="button"
          className="w-10 h-10 rounded-lg bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">delete</span>
          <VisuallyHidden>Delete item</VisuallyHidden>
        </button>
        <button
          type="button"
          className="w-10 h-10 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">share</span>
          <VisuallyHidden>Share item</VisuallyHidden>
        </button>
      </div>
    </div>
  ),
};

export const FormLabel: Story = {
  render: () => (
    <div className="space-y-4 max-w-sm">
      <p className="text-sm text-slate-600">
        Providing accessible labels for inputs that have placeholder-only visual labels.
      </p>
      <div>
        <label>
          <VisuallyHidden>Search</VisuallyHidden>
          <input
            type="search"
            placeholder="Search..."
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </label>
      </div>
    </div>
  ),
};

export const SkipLink: Story = {
  render: () => (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        VisuallyHidden content becomes visible when focused. Tab into the area below to reveal the skip link.
      </p>
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
        <a
          href="#main"
          className="absolute w-px h-px p-0 -m-px overflow-hidden [clip:rect(0,0,0,0)] border-0 focus:static focus:w-auto focus:h-auto focus:p-2 focus:m-0 focus:overflow-visible focus:[clip:auto] focus:bg-primary focus:text-white focus:rounded-lg focus:text-sm focus:font-medium"
        >
          Skip to main content
        </a>
        <p className="text-xs text-slate-500">Tab into this area to see the skip link appear.</p>
      </div>
    </div>
  ),
};

export const TableCaption: Story = {
  render: () => (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        Providing an accessible caption for a data table without taking up visual space.
      </p>
      <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
        <caption>
          <VisuallyHidden>Monthly revenue summary for Q1 2024</VisuallyHidden>
        </caption>
        <thead>
          <tr className="bg-slate-50">
            <th className="text-left p-3 font-medium text-slate-700">Month</th>
            <th className="text-right p-3 font-medium text-slate-700">Revenue</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-slate-200">
            <td className="p-3 text-slate-600">January</td>
            <td className="p-3 text-right text-slate-600">$12,000</td>
          </tr>
          <tr className="border-t border-slate-200">
            <td className="p-3 text-slate-600">February</td>
            <td className="p-3 text-right text-slate-600">$15,500</td>
          </tr>
          <tr className="border-t border-slate-200">
            <td className="p-3 text-slate-600">March</td>
            <td className="p-3 text-right text-slate-600">$18,200</td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
};

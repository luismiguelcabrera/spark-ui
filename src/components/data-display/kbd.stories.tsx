import type { Meta, StoryObj } from "@storybook/react-vite";
import { Kbd } from "./kbd";

const meta = {
  title: "Data Display/Kbd",
  component: Kbd,
  tags: ["autodocs"],
  argTypes: {
    combo: { control: "text" },
    platformAware: { control: "boolean" },
    separator: { control: "text" },
  },
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "K" },
};

export const CommandK: Story = {
  args: { combo: "Mod+K" },
};

export const CtrlShiftP: Story = {
  args: { combo: "Ctrl+Shift+P" },
};

export const CopyPaste: Story = {
  render: (args) => (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2 text-sm text-slate-600">
        Copy: <Kbd {...args} combo="Mod+C" />
      </div>
      <div className="flex items-center gap-2 text-sm text-slate-600">
        Paste: <Kbd {...args} combo="Mod+V" />
      </div>
      <div className="flex items-center gap-2 text-sm text-slate-600">
        Undo: <Kbd {...args} combo="Mod+Z" />
      </div>
    </div>
  ),
};

export const CommonShortcuts: Story = {
  render: (args) => (
    <div className="space-y-3">
      {[
        { label: "Search", combo: "Mod+K" },
        { label: "Save", combo: "Mod+S" },
        { label: "Select All", combo: "Mod+A" },
        { label: "Find & Replace", combo: "Mod+Shift+H" },
        { label: "Command Palette", combo: "Ctrl+Shift+P" },
        { label: "Toggle Terminal", combo: "Ctrl+`" },
      ].map(({ label, combo }) => (
        <div key={combo} className="flex items-center justify-between w-64 text-sm text-slate-700">
          <span>{label}</span>
          <Kbd {...args} combo={combo} />
        </div>
      ))}
    </div>
  ),
};

export const SingleKeys: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <Kbd {...args}>Esc</Kbd>
      <Kbd {...args}>Tab</Kbd>
      <Kbd {...args}>Enter</Kbd>
      <Kbd {...args}>Space</Kbd>
      <Kbd {...args}>F1</Kbd>
    </div>
  ),
};

export const ArrowKeys: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <Kbd {...args} keys={["up"]} />
      <Kbd {...args} keys={["down"]} />
      <Kbd {...args} keys={["left"]} />
      <Kbd {...args} keys={["right"]} />
    </div>
  ),
};

export const PlatformAwareOff: Story = {
  args: {
    combo: "Ctrl+Shift+P",
    platformAware: false,
  },
};

export const CustomSeparator: Story = {
  args: {
    combo: "Mod+Shift+K",
    separator: " + ",
  },
};

export const KeysArray: Story = {
  args: {
    keys: ["Mod", "Shift", "Enter"],
  },
};

export const InContext: Story = {
  render: (args) => (
    <div className="flex items-center gap-2 text-sm text-slate-600">
      Press <Kbd {...args} combo="Mod+K" /> to open the search bar, or <Kbd {...args}>Esc</Kbd> to close it.
    </div>
  ),
};

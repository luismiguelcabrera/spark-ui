import type { Meta, StoryObj } from "@storybook/react-vite";
import { Icon } from "../components/data-display/icon";

const meta = {
  title: "Icons/Animated Icons",
  component: Icon,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg", "xl"] },
    animationTrigger: { control: "select", options: ["hover", "always"] },
  },
  args: { size: "xl" as const, animated: true, animationTrigger: "hover" as const },
  parameters: {
    docs: {
      description: {
        component:
          'Add `animated` to any `<Icon>` for per-icon SVG animation. 20 icons have custom part-based animations (bell clapper swings, heart fills, gear rotates). All other 425 icons get smart default animations. One unified API: `<Icon name="bell" animated />`.',
      },
    },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

const customAnimatedIcons = [
  { name: "bell", desc: "Clapper swings", color: "text-amber-500" },
  { name: "heart", desc: "Fills with beat", color: "text-red-500" },
  { name: "star", desc: "Pops & fills", color: "text-yellow-500" },
  { name: "mail", desc: "Flap opens", color: "text-blue-500" },
  { name: "check-circle", desc: "Check draws in", color: "text-green-500" },
  { name: "eye", desc: "Blinks", color: "text-slate-700" },
  { name: "lock", desc: "Shackle lifts", color: "text-slate-700" },
  { name: "trash", desc: "Lid opens", color: "text-red-500" },
  { name: "download", desc: "Arrow pulses down", color: "text-blue-500" },
  { name: "upload", desc: "Arrow pulses up", color: "text-blue-500" },
  { name: "settings", desc: "Gear rotates", color: "text-slate-600" },
  { name: "rocket", desc: "Lifts off", color: "text-purple-500" },
  { name: "wifi", desc: "Arcs pulse in", color: "text-green-500" },
  { name: "volume-2", desc: "Waves pulse", color: "text-slate-700" },
  { name: "sun", desc: "Rays rotate & glow", color: "text-amber-400" },
  { name: "search", desc: "Lens zooms", color: "text-slate-700" },
  { name: "copy", desc: "Pages shift", color: "text-slate-700" },
  { name: "bookmark", desc: "Fills in", color: "text-indigo-500" },
  { name: "sparkles", desc: "Twinkle staggered", color: "text-yellow-500" },
  { name: "send", desc: "Plane flies", color: "text-blue-500" },
];

export const CustomAnimations: Story = {
  args: { name: "bell" },
  render: (args) => (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        These 20 icons have unique per-part SVG animations. Hover to see them.
      </p>
      <div className="grid grid-cols-5 gap-6">
        {customAnimatedIcons.map(({ name, desc, color }) => (
          <div key={name} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-200 cursor-pointer hover:border-slate-400 transition-colors">
            <Icon
              name={name}
              size={args.size}
              animated
              animationTrigger={args.animationTrigger}
              className={color}
            />
            <span className="text-xs font-medium text-slate-700">{name}</span>
            <span className="text-[10px] text-slate-500">{desc}</span>
          </div>
        ))}
      </div>
    </div>
  ),
};

const smartDefaultIcons = [
  { name: "loader", label: "Spins" },
  { name: "alert-triangle", label: "Shakes" },
  { name: "trophy", label: "Tada" },
  { name: "cloud", label: "Floats" },
  { name: "arrow-down", label: "Bounces" },
  { name: "file", label: "Slides up" },
  { name: "circle", label: "Scales in" },
  { name: "code", label: "Fades in" },
  { name: "leaf", label: "Floats" },
  { name: "car", label: "Shakes" },
  { name: "shopping-cart", label: "Bounces" },
  { name: "brain", label: "Pulses" },
  { name: "gamepad", label: "Tada" },
  { name: "flame", label: "Floats" },
  { name: "phone", label: "Bounces" },
];

export const SmartDefaults: Story = {
  args: { name: "loader" },
  render: (args) => (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        All other icons get smart default animations based on type. No custom SVG needed.
      </p>
      <div className="grid grid-cols-5 gap-6">
        {smartDefaultIcons.map(({ name, label }) => (
          <div key={name} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-200 cursor-pointer hover:border-slate-400 transition-colors">
            <Icon
              name={name}
              size={args.size}
              animated
              animationTrigger={args.animationTrigger}
              className="text-slate-700"
            />
            <span className="text-xs font-medium text-slate-700">{name}</span>
            <span className="text-[10px] text-slate-500">{label}</span>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const RealWorldUsage: Story = {
  args: { name: "bell" },
  render: () => (
    <div className="space-y-6 max-w-md">
      <button className="flex items-center gap-2 px-4 py-2.5 bg-red-700 text-white rounded-lg w-full justify-center">
        <Icon name="heart" size="md" animated />
        <span>Like this post</span>
      </button>

      <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-700 text-white rounded-lg w-full justify-center">
        <Icon name="send" size="md" animated />
        <span>Send message</span>
      </button>

      <button className="flex items-center gap-2 px-4 py-2.5 bg-purple-700 text-white rounded-lg w-full justify-center">
        <Icon name="rocket" size="md" animated />
        <span>Deploy now</span>
      </button>

      <div className="flex items-center gap-3 p-4 rounded-lg bg-amber-50 border border-amber-200">
        <Icon name="bell" size="lg" animated animationTrigger="always" className="text-amber-600" />
        <span className="text-sm text-amber-800">You have 5 unread notifications</span>
      </div>

      <div className="flex items-center gap-3 p-4 rounded-lg bg-green-50 border border-green-200">
        <Icon name="check-circle" size="lg" animated animationTrigger="always" className="text-green-600" />
        <span className="text-sm text-green-800">Changes saved successfully!</span>
      </div>

      <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-100 border border-slate-200">
        <Icon name="settings" size="lg" animated animationTrigger="always" className="text-slate-600" />
        <span className="text-sm text-slate-700">Processing your request...</span>
      </div>
    </div>
  ),
};

export const AlwaysAnimating: Story = {
  args: { name: "settings", animationTrigger: "always" as const },
  render: (args) => (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        With animationTrigger=&quot;always&quot;, animations play continuously.
      </p>
      <div className="flex gap-8 items-center">
        <Icon name="settings" size={args.size} animated animationTrigger="always" className="text-slate-600" />
        <Icon name="sparkles" size={args.size} animated animationTrigger="always" className="text-yellow-500" />
        <Icon name="sun" size={args.size} animated animationTrigger="always" className="text-amber-400" />
        <Icon name="download" size={args.size} animated animationTrigger="always" className="text-blue-500" />
        <Icon name="wifi" size={args.size} animated animationTrigger="always" className="text-green-500" />
        <Icon name="loader" size={args.size} animated animationTrigger="always" className="text-slate-500" />
      </div>
    </div>
  ),
};

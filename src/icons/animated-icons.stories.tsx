import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  AnimatedBellIcon,
  AnimatedHeartIcon,
  AnimatedMailIcon,
  AnimatedCheckCircleIcon,
  AnimatedStarIcon,
  AnimatedEyeIcon,
  AnimatedLockIcon,
  AnimatedTrashIcon,
  AnimatedDownloadIcon,
  AnimatedUploadIcon,
  AnimatedSettingsIcon,
  AnimatedRocketIcon,
  AnimatedWifiIcon,
  AnimatedVolumeIcon,
  AnimatedSunIcon,
  AnimatedSearchIcon,
  AnimatedCopyIcon,
  AnimatedBookmarkIcon,
  AnimatedSparklesIcon,
  AnimatedSendIcon,
} from "./animated-icons";

const meta = {
  title: "Icons/Animated Icons",
  tags: ["autodocs"],
  argTypes: {
    trigger: { control: "select", options: ["hover", "always"] },
    size: { control: "number", min: 16, max: 64, step: 4 },
  },
  args: { trigger: "hover" as const, size: 32 },
  parameters: {
    docs: {
      description: {
        component:
          "Per-icon SVG animations where different parts move independently. Each icon has a unique, hand-crafted animation — bell clappers swing, hearts fill, locks open, gears rotate. Pure CSS, GPU-accelerated, zero JS overhead. Respects prefers-reduced-motion.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const icons = [
  { name: "Bell", desc: "Clapper swings", Comp: AnimatedBellIcon, color: "text-amber-500" },
  { name: "Heart", desc: "Fills with beat", Comp: AnimatedHeartIcon, color: "text-red-500" },
  { name: "Star", desc: "Pops & fills", Comp: AnimatedStarIcon, color: "text-yellow-500" },
  { name: "Mail", desc: "Flap opens", Comp: AnimatedMailIcon, color: "text-blue-500" },
  { name: "Check Circle", desc: "Check draws in", Comp: AnimatedCheckCircleIcon, color: "text-green-500" },
  { name: "Eye", desc: "Blinks", Comp: AnimatedEyeIcon, color: "text-slate-700" },
  { name: "Lock", desc: "Shackle lifts", Comp: AnimatedLockIcon, color: "text-slate-700" },
  { name: "Trash", desc: "Lid opens", Comp: AnimatedTrashIcon, color: "text-red-500" },
  { name: "Download", desc: "Arrow pulses down", Comp: AnimatedDownloadIcon, color: "text-blue-500" },
  { name: "Upload", desc: "Arrow pulses up", Comp: AnimatedUploadIcon, color: "text-blue-500" },
  { name: "Settings", desc: "Gear rotates", Comp: AnimatedSettingsIcon, color: "text-slate-600" },
  { name: "Rocket", desc: "Lifts off", Comp: AnimatedRocketIcon, color: "text-purple-500" },
  { name: "Wifi", desc: "Arcs pulse in", Comp: AnimatedWifiIcon, color: "text-green-500" },
  { name: "Volume", desc: "Waves pulse", Comp: AnimatedVolumeIcon, color: "text-slate-700" },
  { name: "Sun", desc: "Rays rotate & glow", Comp: AnimatedSunIcon, color: "text-amber-400" },
  { name: "Search", desc: "Lens zooms", Comp: AnimatedSearchIcon, color: "text-slate-700" },
  { name: "Copy", desc: "Pages shift", Comp: AnimatedCopyIcon, color: "text-slate-700" },
  { name: "Bookmark", desc: "Fills in", Comp: AnimatedBookmarkIcon, color: "text-indigo-500" },
  { name: "Sparkles", desc: "Twinkle staggered", Comp: AnimatedSparklesIcon, color: "text-yellow-500" },
  { name: "Send", desc: "Plane flies", Comp: AnimatedSendIcon, color: "text-blue-500" },
];

export const Gallery: Story = {
  render: (args) => (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        Hover each icon to see its unique animation. Each has custom SVG part movement — not generic transforms.
      </p>
      <div className="grid grid-cols-5 gap-6">
        {icons.map(({ name, desc, Comp, color }) => (
          <div key={name} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-200 cursor-pointer hover:border-slate-400 transition-colors">
            <Comp size={args.size as number} trigger={args.trigger as "hover" | "always"} className={color} />
            <span className="text-sm font-medium text-slate-700">{name}</span>
            <span className="text-xs text-slate-500">{desc}</span>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const AlwaysAnimating: Story = {
  args: { trigger: "always" as const, size: 40 },
  render: (args) => (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        With trigger=&quot;always&quot;, animations play continuously. Best for loading states or attention-grabbing UI.
      </p>
      <div className="flex gap-8 items-center">
        <AnimatedSettingsIcon size={args.size as number} trigger="always" className="text-slate-600" />
        <AnimatedSparklesIcon size={args.size as number} trigger="always" className="text-yellow-500" />
        <AnimatedSunIcon size={args.size as number} trigger="always" className="text-amber-400" />
        <AnimatedDownloadIcon size={args.size as number} trigger="always" className="text-blue-500" />
        <AnimatedWifiIcon size={args.size as number} trigger="always" className="text-green-500" />
      </div>
    </div>
  ),
};

export const RealWorldUsage: Story = {
  render: () => (
    <div className="space-y-6 max-w-md">
      <button className="flex items-center gap-2 px-4 py-2 bg-red-700 text-white rounded-lg w-full justify-center">
        <AnimatedHeartIcon size={20} trigger="hover" />
        <span>Like this post</span>
      </button>

      <button className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg w-full justify-center">
        <AnimatedSendIcon size={20} trigger="hover" />
        <span>Send message</span>
      </button>

      <button className="flex items-center gap-2 px-4 py-2 bg-purple-700 text-white rounded-lg w-full justify-center">
        <AnimatedRocketIcon size={20} trigger="hover" />
        <span>Deploy now</span>
      </button>

      <div className="flex items-center gap-3 p-4 rounded-lg bg-amber-50 border border-amber-200">
        <AnimatedBellIcon size={24} trigger="always" className="text-amber-500" />
        <span className="text-sm text-amber-700">You have 5 unread notifications</span>
      </div>

      <div className="flex items-center gap-3 p-4 rounded-lg bg-green-50 border border-green-200">
        <AnimatedCheckCircleIcon size={24} trigger="always" className="text-green-500" />
        <span className="text-sm text-green-700">Changes saved successfully!</span>
      </div>

      <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-100 border border-slate-200">
        <AnimatedSettingsIcon size={24} trigger="always" className="text-slate-500" />
        <span className="text-sm text-slate-600">Processing your request...</span>
      </div>
    </div>
  ),
};

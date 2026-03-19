import type { Meta, StoryObj } from "@storybook/react-vite";
import { Icon } from "./icon";
import type { IconAnimation } from "./icon";

const meta = {
  title: "Data Display/Icon",
  component: Icon,
  tags: ["autodocs"],
  argTypes: {
    name: { control: "text" },
    size: { control: "select", options: ["sm", "md", "lg", "xl"] },
    filled: { control: "boolean" },
    animation: {
      control: "select",
      options: [undefined, "spin", "pulse", "bounce", "wiggle", "shake", "ping", "tada", "float", "rubber-band", "fade-in", "scale-in", "slide-up", "draw"],
    },
    animationTrigger: {
      control: "select",
      options: ["always", "hover", "group-hover"],
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Renders an icon by string name via the 3-tier resolution system (IconProvider → built-in SVGs → Material Symbols font fallback). Supports CSS-only animations via `animation` + `animationTrigger` props. See **Icons / Icon Gallery** for the full browsable catalog.",
      },
    },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { name: "home", size: "lg" },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-end gap-4">
      <Icon {...args} name="star" size="sm" />
      <Icon {...args} name="star" size="md" />
      <Icon {...args} name="star" size="lg" />
      <Icon {...args} name="star" size="xl" />
    </div>
  ),
};

export const Colors: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <Icon {...args} name="heart" size="lg" className="text-red-500" />
      <Icon {...args} name="check-circle" size="lg" className="text-green-500" />
      <Icon {...args} name="alert-triangle" size="lg" className="text-amber-500" />
      <Icon {...args} name="info" size="lg" className="text-blue-500" />
      <Icon {...args} name="star" size="lg" className="text-purple-500" />
    </div>
  ),
};

// ── Animation Stories ──

const animations: { name: string; icon: string; animation: IconAnimation; color: string }[] = [
  { name: "Spin", icon: "loader", animation: "spin", color: "text-blue-500" },
  { name: "Pulse", icon: "heart", animation: "pulse", color: "text-red-500" },
  { name: "Bounce", icon: "arrow-down", animation: "bounce", color: "text-green-500" },
  { name: "Wiggle", icon: "bell", animation: "wiggle", color: "text-amber-500" },
  { name: "Shake", icon: "alert-triangle", animation: "shake", color: "text-red-600" },
  { name: "Ping", icon: "circle-dot", animation: "ping", color: "text-blue-400" },
  { name: "Tada", icon: "sparkles", animation: "tada", color: "text-yellow-500" },
  { name: "Float", icon: "cloud", animation: "float", color: "text-sky-400" },
  { name: "Rubber Band", icon: "rocket", animation: "rubber-band", color: "text-purple-500" },
];

export const Animations: Story = {
  args: { name: "heart", size: "xl" },
  render: (args) => (
    <div className="space-y-6">
      <p className="text-sm text-slate-600">
        All animations are CSS-only, GPU-accelerated (transform + opacity), and respect prefers-reduced-motion.
      </p>
      <div className="grid grid-cols-3 gap-8">
        {animations.map(({ name, icon, animation, color }) => (
          <div key={name} className="flex flex-col items-center gap-3 p-4 rounded-xl border border-slate-200">
            <Icon
              {...args}
              name={icon}
              size="xl"
              animation={animation}
              className={color}
            />
            <div className="text-center">
              <span className="text-sm font-medium text-slate-700">{name}</span>
              <code className="block text-xs text-slate-400 mt-0.5">animation=&quot;{animation}&quot;</code>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};

const entryAnimations: { name: string; icon: string; animation: IconAnimation }[] = [
  { name: "Fade In", icon: "star", animation: "fade-in" },
  { name: "Scale In", icon: "check-circle", animation: "scale-in" },
  { name: "Slide Up", icon: "arrow-up", animation: "slide-up" },
  { name: "Draw", icon: "heart", animation: "draw" },
];

export const EntryAnimations: Story = {
  args: { name: "star", size: "xl" },
  render: (args) => (
    <div className="space-y-6">
      <p className="text-sm text-slate-600">
        Entry animations play once when the icon appears. Toggle the key to replay.
      </p>
      <div className="grid grid-cols-4 gap-8">
        {entryAnimations.map(({ name, icon, animation }) => (
          <div key={name} className="flex flex-col items-center gap-3 p-4 rounded-xl border border-slate-200">
            <Icon
              {...args}
              name={icon}
              size="xl"
              animation={animation}
              className="text-slate-700"
            />
            <div className="text-center">
              <span className="text-sm font-medium text-slate-700">{name}</span>
              <code className="block text-xs text-slate-400 mt-0.5">animation=&quot;{animation}&quot;</code>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const HoverAnimations: Story = {
  args: { name: "heart", size: "xl" },
  render: (args) => (
    <div className="space-y-6">
      <p className="text-sm text-slate-600">
        Hover over each icon to see the animation. Uses animationTrigger=&quot;hover&quot;.
      </p>
      <div className="grid grid-cols-4 gap-8">
        {(["wiggle", "pulse", "bounce", "tada", "shake", "rubber-band", "spin", "float"] as const).map((anim) => (
          <div key={anim} className="flex flex-col items-center gap-3 p-4 rounded-xl border border-slate-200 cursor-pointer">
            <Icon
              {...args}
              name={anim === "spin" ? "loader" : anim === "wiggle" ? "bell" : anim === "float" ? "cloud" : anim === "shake" ? "alert-triangle" : "star"}
              size="xl"
              animation={anim}
              animationTrigger="hover"
              className="text-slate-700"
            />
            <code className="text-xs text-slate-400">{anim}</code>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const RealWorldExamples: Story = {
  args: { name: "heart", size: "lg" },
  render: () => (
    <div className="space-y-8">
      <div className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 border border-blue-200">
        <Icon name="loader" size="lg" animation="spin" className="text-blue-500" />
        <span className="text-sm text-blue-700">Loading your data...</span>
      </div>

      <div className="flex items-center gap-3 p-4 rounded-lg bg-green-50 border border-green-200">
        <Icon name="check-circle" size="lg" animation="scale-in" className="text-green-500" />
        <span className="text-sm text-green-700">Payment successful!</span>
      </div>

      <div className="flex items-center gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
        <Icon name="alert-triangle" size="lg" animation="shake" className="text-red-500" />
        <span className="text-sm text-red-700">Connection lost</span>
      </div>

      <button className="group flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg">
        <Icon name="rocket" size="md" animation="bounce" animationTrigger="group-hover" />
        <span>Launch Project</span>
      </button>

      <button className="group flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg">
        <Icon name="heart" size="md" animation="pulse" animationTrigger="group-hover" />
        <span>Like</span>
      </button>

      <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
        <Icon name="bell" size="lg" animation="wiggle" className="text-amber-500" />
        <span className="text-sm text-amber-700">3 new notifications</span>
      </div>
    </div>
  ),
};

export const MaterialSymbolsFallback: Story = {
  args: {
    name: "deployed_code",
    size: "xl",
  },
};

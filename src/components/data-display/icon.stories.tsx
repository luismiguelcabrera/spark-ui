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
      <Icon {...args} name="heart" size="lg" className="text-destructive" />
      <Icon {...args} name="check-circle" size="lg" className="text-success" />
      <Icon {...args} name="alert-triangle" size="lg" className="text-warning" />
      <Icon {...args} name="info" size="lg" className="text-primary" />
      <Icon {...args} name="star" size="lg" className="text-accent" />
    </div>
  ),
};

// ── Animation Stories ──

const animations: { name: string; icon: string; animation: IconAnimation; color: string }[] = [
  { name: "Spin", icon: "loader", animation: "spin", color: "text-primary" },
  { name: "Pulse", icon: "heart", animation: "pulse", color: "text-destructive" },
  { name: "Bounce", icon: "arrow-down", animation: "bounce", color: "text-success" },
  { name: "Wiggle", icon: "bell", animation: "wiggle", color: "text-warning" },
  { name: "Shake", icon: "alert-triangle", animation: "shake", color: "text-destructive" },
  { name: "Ping", icon: "circle-dot", animation: "ping", color: "text-primary" },
  { name: "Tada", icon: "sparkles", animation: "tada", color: "text-yellow-500" },
  { name: "Float", icon: "cloud", animation: "float", color: "text-sky-400" },
  { name: "Rubber Band", icon: "rocket", animation: "rubber-band", color: "text-accent" },
];

export const Animations: Story = {
  args: { name: "heart", size: "xl" },
  render: (args) => (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        All animations are CSS-only, GPU-accelerated (transform + opacity), and respect prefers-reduced-motion.
      </p>
      <div className="grid grid-cols-3 gap-8">
        {animations.map(({ name, icon, animation, color }) => (
          <div key={name} className="flex flex-col items-center gap-3 p-4 rounded-xl border border-muted">
            <Icon
              {...args}
              name={icon}
              size="xl"
              animation={animation}
              className={color}
            />
            <div className="text-center">
              <span className="text-sm font-medium text-navy-text">{name}</span>
              <code className="block text-xs text-muted-foreground mt-0.5">animation=&quot;{animation}&quot;</code>
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
      <p className="text-sm text-muted-foreground">
        Entry animations play once when the icon appears. Toggle the key to replay.
      </p>
      <div className="grid grid-cols-4 gap-8">
        {entryAnimations.map(({ name, icon, animation }) => (
          <div key={name} className="flex flex-col items-center gap-3 p-4 rounded-xl border border-muted">
            <Icon
              {...args}
              name={icon}
              size="xl"
              animation={animation}
              className="text-navy-text"
            />
            <div className="text-center">
              <span className="text-sm font-medium text-navy-text">{name}</span>
              <code className="block text-xs text-muted-foreground mt-0.5">animation=&quot;{animation}&quot;</code>
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
      <p className="text-sm text-muted-foreground">
        Hover over each icon to see the animation. Uses animationTrigger=&quot;hover&quot;.
      </p>
      <div className="grid grid-cols-4 gap-8">
        {(["wiggle", "pulse", "bounce", "tada", "shake", "rubber-band", "spin", "float"] as const).map((anim) => (
          <div key={anim} className="flex flex-col items-center gap-3 p-4 rounded-xl border border-muted cursor-pointer">
            <Icon
              {...args}
              name={anim === "spin" ? "loader" : anim === "wiggle" ? "bell" : anim === "float" ? "cloud" : anim === "shake" ? "alert-triangle" : "star"}
              size="xl"
              animation={anim}
              animationTrigger="hover"
              className="text-navy-text"
            />
            <code className="text-xs text-muted-foreground">{anim}</code>
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
      <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/10 border border-primary/20">
        <Icon name="loader" size="lg" animation="spin" className="text-primary" />
        <span className="text-sm text-primary">Loading your data...</span>
      </div>

      <div className="flex items-center gap-3 p-4 rounded-lg bg-success/10 border border-success/20">
        <Icon name="check-circle" size="lg" animation="scale-in" className="text-success" />
        <span className="text-sm text-success">Payment successful!</span>
      </div>

      <div className="flex items-center gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
        <Icon name="alert-triangle" size="lg" animation="shake" className="text-destructive" />
        <span className="text-sm text-destructive">Connection lost</span>
      </div>

      <button className="group flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg">
        <Icon name="rocket" size="md" animation="bounce" animationTrigger="group-hover" />
        <span>Launch Project</span>
      </button>

      <button className="group flex items-center gap-2 px-4 py-2 bg-destructive text-white rounded-lg">
        <Icon name="heart" size="md" animation="pulse" animationTrigger="group-hover" />
        <span>Like</span>
      </button>

      <div className="flex items-center gap-2 p-3 rounded-lg bg-warning/10 border border-warning/20">
        <Icon name="bell" size="lg" animation="wiggle" className="text-warning" />
        <span className="text-sm text-warning">3 new notifications</span>
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

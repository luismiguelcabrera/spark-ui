import type { Meta, StoryObj } from "@storybook/react-vite";
import { DefaultsProvider, useDefaults } from "./defaults-provider";

const meta = {
  title: "Layout/DefaultsProvider",
  component: DefaultsProvider,
  tags: ["autodocs"],
} satisfies Meta<typeof DefaultsProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

// Demo consumer that reads defaults
function DemoButton({
  variant,
  size,
  children,
}: {
  variant?: string;
  size?: string;
  children: React.ReactNode;
}) {
  const defaults = useDefaults<{ variant?: string; size?: string }>("Button");
  const resolvedVariant = variant ?? defaults.variant ?? "solid";
  const resolvedSize = size ?? defaults.size ?? "md";

  const variantClasses: Record<string, string> = {
    solid: "bg-primary text-white",
    outline: "border border-primary text-primary bg-transparent",
    ghost: "text-primary bg-transparent hover:bg-primary/10",
  };
  const sizeClasses: Record<string, string> = {
    sm: "px-2 py-1 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      type="button"
      className={`rounded-lg font-medium ${variantClasses[resolvedVariant] ?? ""} ${sizeClasses[resolvedSize] ?? ""}`}
    >
      {children} ({resolvedVariant}/{resolvedSize})
    </button>
  );
}

export const BasicUsage: Story = {
  args: {
    defaults: { Button: { variant: "outline", size: "sm" } },
    children: null,
  },
  render: (args) => (
    <DefaultsProvider defaults={args.defaults}>
      <div className="flex gap-4 items-center">
        <DemoButton>Uses Defaults</DemoButton>
        <DemoButton variant="solid" size="lg">
          Overrides
        </DemoButton>
      </div>
    </DefaultsProvider>
  ),
};

export const GhostTheme: Story = {
  args: {
    defaults: { Button: { variant: "ghost", size: "md" } },
    children: null,
  },
  render: (args) => (
    <DefaultsProvider defaults={args.defaults}>
      <div className="flex gap-4 items-center">
        <DemoButton>Action A</DemoButton>
        <DemoButton>Action B</DemoButton>
        <DemoButton>Action C</DemoButton>
      </div>
    </DefaultsProvider>
  ),
};

export const NestedProviders: Story = {
  args: {
    defaults: { Button: { variant: "solid", size: "lg" } },
    children: null,
  },
  render: () => (
    <div className="space-y-4">
      <DefaultsProvider defaults={{ Button: { variant: "solid", size: "lg" } }}>
        <div className="flex gap-4 items-center">
          <span className="text-xs text-slate-400 font-mono w-24">Outer:</span>
          <DemoButton>Outer Button</DemoButton>
        </div>
        <DefaultsProvider defaults={{ Button: { variant: "outline", size: "sm" } }}>
          <div className="flex gap-4 items-center mt-3">
            <span className="text-xs text-slate-400 font-mono w-24">Inner:</span>
            <DemoButton>Inner Button</DemoButton>
          </div>
        </DefaultsProvider>
      </DefaultsProvider>
    </div>
  ),
};

export const NoProvider: Story = {
  name: "Without Provider (Fallback)",
  args: {
    defaults: {},
    children: null,
  },
  render: () => (
    <div className="flex gap-4 items-center">
      <DemoButton>No Provider</DemoButton>
    </div>
  ),
};

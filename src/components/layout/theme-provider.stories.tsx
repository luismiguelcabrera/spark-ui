import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThemeProvider, useTheme } from "./theme-provider";

const meta = {
  title: "Layout/ThemeProvider",
  component: ThemeProvider,
  tags: ["autodocs"],
  argTypes: {
    defaultTheme: {
      control: "select",
      options: ["light", "dark", "system"],
    },
  },
} satisfies Meta<typeof ThemeProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

function ThemeDisplay() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  return (
    <div className="space-y-4 p-4 bg-white border border-slate-200 rounded-xl">
      <div className="space-y-2">
        <p className="text-sm text-slate-600">
          <strong>Theme:</strong> {theme}
        </p>
        <p className="text-sm text-slate-600">
          <strong>Resolved:</strong> {resolvedTheme}
        </p>
      </div>
      <div className="flex gap-2">
        {(["light", "dark", "system"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTheme(t)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              theme === t
                ? "bg-primary text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}

export const Default: Story = {
  render: () => (
    <ThemeProvider defaultTheme="light" storageKey="storybook-theme">
      <ThemeDisplay />
    </ThemeProvider>
  ),
};

export const DarkMode: Story = {
  render: () => (
    <ThemeProvider defaultTheme="dark" storageKey="storybook-theme-dark">
      <ThemeDisplay />
    </ThemeProvider>
  ),
};

export const SystemPreference: Story = {
  render: () => (
    <ThemeProvider defaultTheme="system" storageKey="storybook-theme-system">
      <ThemeDisplay />
    </ThemeProvider>
  ),
};

export const CustomColors: Story = {
  render: () => (
    <ThemeProvider
      defaultTheme="light"
      storageKey="storybook-theme-colors"
      colors={{ primary: "#7c3aed", accent: "#f59e0b" }}
    >
      <div className="space-y-4 p-4 bg-white border border-slate-200 rounded-xl">
        <p className="text-sm text-slate-600">
          Custom primary (purple) and accent (amber) colors via the <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">colors</code> prop.
        </p>
        <div className="flex gap-3">
          <div className="w-16 h-16 rounded-lg bg-primary flex items-center justify-center text-white text-xs font-medium">
            Primary
          </div>
          <div className="w-16 h-16 rounded-lg bg-accent flex items-center justify-center text-white text-xs font-medium">
            Accent
          </div>
        </div>
      </div>
    </ThemeProvider>
  ),
};

export const CustomRadius: Story = {
  render: () => (
    <ThemeProvider
      defaultTheme="light"
      storageKey="storybook-theme-radius"
      radius="1rem"
    >
      <div className="space-y-4 p-4 bg-white border border-slate-200 rounded-xl">
        <p className="text-sm text-slate-600">
          Custom border-radius override via the <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">radius</code> prop.
        </p>
        <div className="flex gap-3">
          <div className="w-20 h-20 bg-primary/10 border border-primary/20 rounded-[var(--radius)] flex items-center justify-center text-xs text-primary">
            1rem
          </div>
        </div>
      </div>
    </ThemeProvider>
  ),
};

export const RuntimeColorChange: Story = {
  render: () => {
    function ColorChanger() {
      const { setColors } = useTheme();
      const [hue, setHue] = useState(210);

      const handleChange = (newHue: number) => {
        setHue(newHue);
        setColors({ primary: `hsl(${newHue}, 70%, 50%)` });
      };

      return (
        <div className="space-y-4 p-4 bg-white border border-slate-200 rounded-xl">
          <p className="text-sm text-slate-600">
            Use <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">setColors</code> to change theme colors at runtime.
          </p>
          <div>
            <label className="text-sm text-slate-600 block mb-1">Primary Hue: {hue}</label>
            <input
              type="range"
              min="0"
              max="360"
              value={hue}
              onChange={(e) => handleChange(Number(e.target.value))}
              className="w-64"
            />
          </div>
          <div className="w-20 h-20 rounded-lg bg-primary flex items-center justify-center text-white text-xs">
            Primary
          </div>
        </div>
      );
    }

    return (
      <ThemeProvider defaultTheme="light" storageKey="storybook-theme-runtime">
        <ColorChanger />
      </ThemeProvider>
    );
  },
};

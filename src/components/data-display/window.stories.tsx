import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Window } from "./window";

const meta = {
  title: "Data Display/Window",
  component: Window,
  tags: ["autodocs"],
} satisfies Meta<typeof Window>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Window {...args} defaultValue="a">
      <Window.Item value="a">
        <div className="p-6 bg-blue-50 rounded-lg text-blue-800 font-medium">
          Panel A — Welcome!
        </div>
      </Window.Item>
      <Window.Item value="b">
        <div className="p-6 bg-green-50 rounded-lg text-green-800 font-medium">
          Panel B — Settings
        </div>
      </Window.Item>
      <Window.Item value="c">
        <div className="p-6 bg-purple-50 rounded-lg text-purple-800 font-medium">
          Panel C — Profile
        </div>
      </Window.Item>
    </Window>
  ),
};

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState("first");
    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          {["first", "second", "third"].map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setValue(v)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                value === v
                  ? "bg-primary text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
        <Window {...args} value={value} onValueChange={setValue}>
          <Window.Item value="first">
            <div className="p-6 border rounded-lg">First panel content</div>
          </Window.Item>
          <Window.Item value="second">
            <div className="p-6 border rounded-lg">Second panel content</div>
          </Window.Item>
          <Window.Item value="third">
            <div className="p-6 border rounded-lg">Third panel content</div>
          </Window.Item>
        </Window>
      </div>
    );
  },
};

export const TwoItems: Story = {
  render: (args) => {
    const [value, setValue] = useState("login");
    return (
      <div className="max-w-md space-y-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setValue("login")}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium ${
              value === "login" ? "bg-primary text-white" : "bg-slate-100"
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => setValue("signup")}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium ${
              value === "signup" ? "bg-primary text-white" : "bg-slate-100"
            }`}
          >
            Sign Up
          </button>
        </div>
        <Window {...args} value={value} onValueChange={setValue}>
          <Window.Item value="login">
            <div className="p-6 border rounded-lg">
              <h3 className="font-semibold mb-2">Welcome back</h3>
              <p className="text-sm text-slate-600">Enter your credentials to continue.</p>
            </div>
          </Window.Item>
          <Window.Item value="signup">
            <div className="p-6 border rounded-lg">
              <h3 className="font-semibold mb-2">Create account</h3>
              <p className="text-sm text-slate-600">Fill in the form to get started.</p>
            </div>
          </Window.Item>
        </Window>
      </div>
    );
  },
};

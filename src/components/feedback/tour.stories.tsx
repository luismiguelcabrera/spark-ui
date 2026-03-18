import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Tour, type TourStep } from "./tour";

const meta = {
  title: "Feedback/Tour",
  component: Tour,
  tags: ["autodocs"],
  argTypes: {
    mask: { control: "boolean" },
    arrow: { control: "boolean" },
    closable: { control: "boolean" },
  },
} satisfies Meta<typeof Tour>;

export default meta;
type Story = StoryObj<typeof meta>;

// -- Basic Tour (no targets, centered) --

const basicSteps: TourStep[] = [
  {
    title: "Welcome to Our App",
    description:
      "This tour will walk you through the main features of the application.",
    cover: (
      <div className="h-32 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-white text-lg font-bold">
        Welcome!
      </div>
    ),
  },
  {
    title: "Create Your Profile",
    description:
      "Start by setting up your profile with your name, photo, and bio.",
  },
  {
    title: "Explore the Dashboard",
    description: "The dashboard gives you a quick overview of all your activity and metrics.",
  },
  {
    title: "Ready to Go!",
    description:
      "You're all set. Click Finish to start using the app.",
  },
];

export const Basic: Story = {
  args: {
    steps: basicSteps,
    open: true,
    mask: true,
    arrow: true,
    closable: true,
  },
};

// -- Interactive Tour --

export const Interactive: Story = {
  args: {
    steps: basicSteps,
    mask: true,
    arrow: true,
    closable: true,
  },
  render: function Render(args) {
    const [open, setOpen] = useState(false);

    return (
      <div className="p-8">
        <button
          className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg"
          onClick={() => setOpen(true)}
        >
          Start Tour
        </button>
        <Tour
          {...args}
          open={open}
          onOpenChange={setOpen}
          onFinish={() => {
            setOpen(false);
            alert("Tour finished!");
          }}
          onClose={() => setOpen(false)}
        />
      </div>
    );
  },
};

// -- Tour with element targets --

export const WithTargets: Story = {
  args: {
    steps: [],
    mask: true,
    arrow: true,
    closable: true,
  },
  render: function Render(args) {
    const [open, setOpen] = useState(false);

    const steps: TourStep[] = [
      {
        target: "#tour-btn-1",
        title: "Upload Button",
        description: "Click here to upload your files.",
        placement: "bottom",
      },
      {
        target: "#tour-input-1",
        title: "Search Field",
        description: "Use this field to search for anything.",
        placement: "bottom",
      },
      {
        target: "#tour-btn-2",
        title: "Settings",
        description: "Access your account settings here.",
        placement: "left",
      },
    ];

    return (
      <div className="p-8 min-h-[400px]">
        <div className="flex items-center gap-4 mb-8">
          <button
            id="tour-btn-1"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg"
          >
            Upload
          </button>
          <input
            id="tour-input-1"
            className="px-4 py-2 text-sm border border-slate-200 rounded-lg"
            placeholder="Search..."
          />
          <button
            id="tour-btn-2"
            className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg"
          >
            Settings
          </button>
        </div>

        <button
          className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg"
          onClick={() => setOpen(true)}
        >
          Start Guided Tour
        </button>

        <Tour
          {...args}
          steps={steps}
          open={open}
          onOpenChange={setOpen}
          onClose={() => setOpen(false)}
          onFinish={() => setOpen(false)}
        />
      </div>
    );
  },
};

// -- Without Mask --

export const WithoutMask: Story = {
  args: {
    steps: basicSteps,
    open: true,
    mask: false,
    arrow: true,
    closable: true,
  },
};

// -- Non-closable --

export const NonClosable: Story = {
  args: {
    steps: basicSteps,
    open: true,
    mask: true,
    arrow: true,
    closable: false,
  },
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import { SpeedDial } from "./speed-dial";
import type { SpeedDialAction } from "./speed-dial";

const meta = {
  title: "Feedback/SpeedDial",
  component: SpeedDial,
  tags: ["autodocs"],
  argTypes: {
    position: {
      control: "select",
      options: ["bottom-right", "bottom-left", "top-right", "top-left"],
    },
    direction: {
      control: "select",
      options: ["up", "down", "left", "right"],
    },
    color: {
      control: "select",
      options: [
        "primary",
        "secondary",
        "accent",
        "destructive",
        "success",
        "warning",
      ],
    },
    shape: {
      control: "select",
      options: ["circle", "rounded"],
    },
    icon: { control: "text" },
    backdrop: { control: "boolean" },
    fixed: { control: "boolean" },
  },
} satisfies Meta<typeof SpeedDial>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultActions: SpeedDialAction[] = [
  { icon: "edit", label: "Edit", onClick: () => {} },
  { icon: "content_copy", label: "Copy", onClick: () => {} },
  { icon: "share", label: "Share", onClick: () => {} },
  { icon: "delete", label: "Delete", onClick: () => {} },
];

export const Default: Story = {
  args: {
    actions: defaultActions,
    fixed: false,
  },
  render: (args) => (
    <div className="relative h-80">
      <SpeedDial {...args} className="absolute bottom-6 right-6" />
    </div>
  ),
};

export const SecondaryColor: Story = {
  args: {
    actions: defaultActions,
    color: "secondary",
    fixed: false,
  },
  render: (args) => (
    <div className="relative h-80">
      <SpeedDial {...args} className="absolute bottom-6 right-6" />
    </div>
  ),
};

export const AccentColor: Story = {
  args: {
    actions: defaultActions,
    color: "accent",
    fixed: false,
  },
  render: (args) => (
    <div className="relative h-80">
      <SpeedDial {...args} className="absolute bottom-6 right-6" />
    </div>
  ),
};

export const DestructiveColor: Story = {
  args: {
    actions: defaultActions,
    color: "destructive",
    fixed: false,
  },
  render: (args) => (
    <div className="relative h-80">
      <SpeedDial {...args} className="absolute bottom-6 right-6" />
    </div>
  ),
};

export const SuccessColor: Story = {
  args: {
    actions: defaultActions,
    color: "success",
    fixed: false,
  },
  render: (args) => (
    <div className="relative h-80">
      <SpeedDial {...args} className="absolute bottom-6 right-6" />
    </div>
  ),
};

export const WarningColor: Story = {
  args: {
    actions: defaultActions,
    color: "warning",
    fixed: false,
  },
  render: (args) => (
    <div className="relative h-80">
      <SpeedDial {...args} className="absolute bottom-6 right-6" />
    </div>
  ),
};

export const RoundedShape: Story = {
  args: {
    actions: defaultActions,
    shape: "rounded",
    fixed: false,
  },
  render: (args) => (
    <div className="relative h-80">
      <SpeedDial {...args} className="absolute bottom-6 right-6" />
    </div>
  ),
};

export const WithBackdrop: Story = {
  args: {
    actions: defaultActions,
    backdrop: true,
    fixed: false,
  },
  render: (args) => (
    <div className="relative h-80">
      <p className="p-4 text-sm text-slate-500">
        Click the FAB to see the backdrop overlay.
      </p>
      <SpeedDial {...args} className="absolute bottom-6 right-6" />
    </div>
  ),
};

export const DirectionDown: Story = {
  args: {
    actions: defaultActions,
    direction: "down",
    fixed: false,
  },
  render: (args) => (
    <div className="relative h-96">
      <SpeedDial {...args} className="absolute top-6 right-6" />
    </div>
  ),
};

export const DirectionLeft: Story = {
  args: {
    actions: defaultActions,
    direction: "left",
    fixed: false,
  },
  render: (args) => (
    <div className="relative h-80">
      <SpeedDial {...args} className="absolute bottom-6 right-6" />
    </div>
  ),
};

export const DirectionRight: Story = {
  args: {
    actions: defaultActions,
    direction: "right",
    fixed: false,
  },
  render: (args) => (
    <div className="relative h-80">
      <SpeedDial {...args} className="absolute bottom-6 left-6" />
    </div>
  ),
};

export const CustomIcon: Story = {
  args: {
    actions: [
      { icon: "image", label: "Upload Image", onClick: () => {} },
      { icon: "description", label: "Upload File", onClick: () => {} },
      { icon: "photo_camera", label: "Take Photo", onClick: () => {} },
    ],
    icon: "upload",
    fixed: false,
  },
  render: (args) => (
    <div className="relative h-80">
      <SpeedDial {...args} className="absolute bottom-6 right-6" />
    </div>
  ),
};

export const WithDisabledAction: Story = {
  args: {
    actions: [
      { icon: "edit", label: "Edit", onClick: () => {} },
      { icon: "share", label: "Share", onClick: () => {} },
      {
        icon: "delete",
        label: "Delete",
        onClick: () => {},
        disabled: true,
      },
    ],
    fixed: false,
  },
  render: (args) => (
    <div className="relative h-80">
      <SpeedDial {...args} className="absolute bottom-6 right-6" />
    </div>
  ),
};

export const AllColors: Story = {
  args: {
    actions: defaultActions,
    fixed: false,
  },
  render: (args) => (
    <div className="flex flex-wrap gap-32 p-8">
      {(
        [
          "primary",
          "secondary",
          "accent",
          "destructive",
          "success",
          "warning",
        ] as const
      ).map((c) => (
        <div key={c} className="relative h-80 w-32">
          <p className="text-xs font-medium text-slate-500 mb-2 text-center">
            {c}
          </p>
          <SpeedDial
            {...args}
            color={c}
            className="absolute bottom-6 left-1/2 -translate-x-1/2"
          />
        </div>
      ))}
    </div>
  ),
};

export const RoundedWithBackdrop: Story = {
  args: {
    actions: defaultActions,
    shape: "rounded",
    backdrop: true,
    color: "destructive",
    fixed: false,
  },
  render: (args) => (
    <div className="relative h-80">
      <p className="p-4 text-sm text-slate-500">
        Rounded shape with backdrop and destructive color.
      </p>
      <SpeedDial {...args} className="absolute bottom-6 right-6" />
    </div>
  ),
};

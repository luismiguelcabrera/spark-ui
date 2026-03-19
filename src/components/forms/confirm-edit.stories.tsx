import type { Meta, StoryObj } from "@storybook/react-vite";
import { ConfirmEdit } from "./confirm-edit";

const meta = {
  title: "Forms/ConfirmEdit",
  component: ConfirmEdit,
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof ConfirmEdit>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { value: "Click to edit this text" },
};

export const CustomButtons: Story = {
  args: { value: "Editable value", confirmText: "OK", cancelText: "Discard" },
};

export const WithCustomDisplay: Story = {
  args: {
    value: "Jane Doe",
    renderDisplay: (val: string) => (
      <span className="text-lg font-bold text-secondary">{val}</span>
    ),
  },
};

export const Disabled: Story = {
  args: { value: "Cannot edit this", disabled: true },
};

export const WithOnChange: Story = {
  render: (args) => (
    <div className="space-y-4">
      <p className="text-xs text-slate-500">Click the text to edit, then Save or Cancel.</p>
      <ConfirmEdit
        {...args}
        value="Edit me"
        onChange={(val) => console.log("Changed to:", val)}
      />
    </div>
  ),
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import { Textarea } from "./textarea";

const meta = {
  title: "Forms/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  argTypes: {
    autoResize: { control: "boolean" },
    minRows: { control: { type: "number", min: 1, max: 20 } },
    maxRows: { control: { type: "number", min: 1, max: 50 } },
    error: { control: "text" },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { placeholder: "Write your message..." },
};

export const WithError: Story = {
  args: {
    placeholder: "Write your message...",
    error: "This field is required",
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "Disabled textarea",
    disabled: true,
    defaultValue: "This textarea is disabled.",
  },
};

export const AutoResize: Story = {
  args: {
    autoResize: true,
    placeholder: "Start typing and the textarea will grow...",
    minRows: 3,
  },
};

export const AutoResizeWithMaxRows: Story = {
  args: {
    autoResize: true,
    placeholder: "This textarea grows up to 8 rows, then scrolls...",
    minRows: 3,
    maxRows: 8,
  },
};

export const AutoResizeMinRows5: Story = {
  args: {
    autoResize: true,
    placeholder: "Starts with 5 rows minimum...",
    minRows: 5,
  },
};

export const Gallery: Story = {
  render: (args) => (
    <div className="flex flex-col gap-6 max-w-md">
      <div>
        <p className="text-sm font-medium text-slate-600 mb-2">Default (resizable)</p>
        <Textarea {...args} placeholder="Default resizable textarea" />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-600 mb-2">Auto-resize</p>
        <Textarea
          {...args}
          autoResize
          placeholder="Type here to see auto-resize in action..."
        />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-600 mb-2">
          Auto-resize with max 5 rows
        </p>
        <Textarea
          {...args}
          autoResize
          maxRows={5}
          placeholder="Grows up to 5 rows then scrolls..."
        />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-600 mb-2">With error</p>
        <Textarea
          {...args}
          error="Please enter a longer description"
          placeholder="Description..."
        />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-600 mb-2">Disabled</p>
        <Textarea {...args} disabled defaultValue="Cannot edit this" />
      </div>
    </div>
  ),
};

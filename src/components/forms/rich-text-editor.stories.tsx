import type { Meta, StoryObj } from "@storybook/react-vite";
import { RichTextEditor } from "./rich-text-editor";

const meta = {
  title: "Forms/RichTextEditor",
  component: RichTextEditor,
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    minHeight: { control: "number" },
    maxHeight: { control: "number" },
    placeholder: { control: "text" },
  },
  args: {
    placeholder: "Start writing...",
  },
} satisfies Meta<typeof RichTextEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomToolbar: Story = {
  args: {
    toolbar: [
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "separator",
      "heading",
      "bulletList",
      "orderedList",
      "separator",
      "link",
    ],
    placeholder: "Custom toolbar...",
  },
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    defaultValue:
      "<h2>Read Only Content</h2><p>This editor is in <strong>read-only</strong> mode. You can see the content but cannot edit it.</p><ul><li>Item one</li><li>Item two</li></ul>",
  },
};

export const MinimalToolbar: Story = {
  args: {
    toolbar: ["bold", "italic", "separator", "link"],
    placeholder: "Simple editor with minimal toolbar...",
    minHeight: 120,
  },
};

export const Gallery: Story = {
  render: (args) => (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-slate-600 mb-2">
          Default (full toolbar)
        </p>
        <RichTextEditor {...args} placeholder="Full featured editor..." />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-600 mb-2">
          Minimal toolbar
        </p>
        <RichTextEditor
          {...args}
          toolbar={["bold", "italic", "separator", "link"]}
          placeholder="Simple editor..."
          minHeight={120}
        />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-600 mb-2">
          With content
        </p>
        <RichTextEditor
          {...args}
          defaultValue="<h2>Hello World</h2><p>This is a <strong>rich text</strong> editor with some initial content.</p><blockquote>A wise quote goes here.</blockquote>"
        />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-600 mb-2">Disabled</p>
        <RichTextEditor
          {...args}
          disabled
          defaultValue="<p>This editor is disabled.</p>"
        />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-600 mb-2">Read-only</p>
        <RichTextEditor
          {...args}
          readOnly
          defaultValue="<p>This editor is read-only.</p>"
        />
      </div>
    </div>
  ),
};

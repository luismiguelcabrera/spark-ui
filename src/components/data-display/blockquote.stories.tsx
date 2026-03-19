import type { Meta, StoryObj } from "@storybook/react-vite";
import { Blockquote } from "./blockquote";

const meta = {
  title: "Data Display/Blockquote",
  component: Blockquote,
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "select",
      options: ["default", "primary", "success", "warning", "destructive"],
    },
    author: { control: "text" },
    cite: { control: "text" },
  },
} satisfies Meta<typeof Blockquote>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "The only way to do great work is to love what you do.",
  },
};

export const WithAuthor: Story = {
  args: {
    children: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
  },
};

export const WithCitation: Story = {
  args: {
    children: "In the middle of difficulty lies opportunity.",
    author: "Albert Einstein",
    cite: "https://example.com",
  },
};

export const Primary: Story = {
  args: {
    children: "Innovation distinguishes between a leader and a follower.",
    author: "Steve Jobs",
    color: "primary",
  },
};

export const Success: Story = {
  args: {
    children: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    color: "success",
  },
};

export const Warning: Story = {
  args: {
    children: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
    author: "Nelson Mandela",
    color: "warning",
  },
};

export const Destructive: Story = {
  args: {
    children: "Move fast and break things.",
    author: "Mark Zuckerberg",
    color: "destructive",
  },
};

export const AllColors: Story = {
  render: (args) => (
    <div className="space-y-4">
      {(["default", "primary", "success", "warning", "destructive"] as const).map((color) => (
        <Blockquote key={color} {...args} color={color} author={`Author (${color})`}>
          This is a blockquote with the &ldquo;{color}&rdquo; color variant.
        </Blockquote>
      ))}
    </div>
  ),
};

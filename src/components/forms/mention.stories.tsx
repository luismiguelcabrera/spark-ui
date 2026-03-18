import type { Meta, StoryObj } from "@storybook/react-vite";
import { Mention, type MentionOption } from "./mention";

const teamMembers: MentionOption[] = [
  { value: "alice", label: "Alice Johnson", description: "Engineering Lead", avatar: "https://i.pravatar.cc/40?u=alice" },
  { value: "bob", label: "Bob Smith", description: "Senior Designer", avatar: "https://i.pravatar.cc/40?u=bob" },
  { value: "carol", label: "Carol Williams", description: "Product Manager", avatar: "https://i.pravatar.cc/40?u=carol" },
  { value: "dave", label: "Dave Brown", description: "Frontend Engineer", avatar: "https://i.pravatar.cc/40?u=dave" },
  { value: "eve", label: "Eve Davis", description: "Backend Engineer", avatar: "https://i.pravatar.cc/40?u=eve" },
  { value: "frank", label: "Frank Miller", description: "DevOps", avatar: "https://i.pravatar.cc/40?u=frank" },
];

const tagsOptions: MentionOption[] = [
  { value: "bug", label: "bug", description: "Something isn't working" },
  { value: "feature", label: "feature", description: "New feature request" },
  { value: "docs", label: "docs", description: "Documentation improvement" },
  { value: "refactor", label: "refactor", description: "Code cleanup" },
  { value: "test", label: "test", description: "Testing related" },
];

const meta = {
  title: "Forms/Mention",
  component: Mention,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    trigger: { control: "text" },
    multiline: { control: "boolean" },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    options: teamMembers,
    placeholder: "Type @ to mention someone...",
  },
} satisfies Meta<typeof Mention>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Multiline: Story = {
  args: {
    multiline: true,
    rows: 4,
    placeholder: "Write a comment, use @ to mention...",
  },
};

export const CustomTrigger: Story = {
  args: {
    trigger: "#",
    options: tagsOptions,
    placeholder: "Type # to add a tag...",
  },
};

export const WithAvatars: Story = {
  args: {
    options: teamMembers,
    placeholder: "Mention a team member...",
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    placeholder: "Type @ to search (loading)...",
  },
};

export const Gallery: Story = {
  render: (args) => (
    <div className="space-y-6 max-w-md">
      <div>
        <p className="text-sm font-medium text-slate-600 mb-2">Small</p>
        <Mention {...args} size="sm" placeholder="Small mention input..." />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-600 mb-2">Medium (default)</p>
        <Mention {...args} size="md" placeholder="Medium mention input..." />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-600 mb-2">Large</p>
        <Mention {...args} size="lg" placeholder="Large mention input..." />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-600 mb-2">Multiline</p>
        <Mention {...args} multiline rows={3} placeholder="Multiline mention..." />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-600 mb-2">Disabled</p>
        <Mention {...args} disabled placeholder="Disabled..." />
      </div>
    </div>
  ),
};

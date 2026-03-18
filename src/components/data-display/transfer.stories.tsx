import type { Meta, StoryObj } from "@storybook/react-vite";
import { Transfer, type TransferItem } from "./transfer";

const meta = {
  title: "Data Display/Transfer",
  component: Transfer,
  tags: ["autodocs"],
  argTypes: {
    searchable: { control: "boolean" },
    showSelectAll: { control: "boolean" },
    disabled: { control: "boolean" },
    listHeight: { control: { type: "number", min: 150, max: 600 } },
  },
} satisfies Meta<typeof Transfer>;

export default meta;
type Story = StoryObj<typeof meta>;

const languages: TransferItem[] = [
  { key: "js", label: "JavaScript", description: "Dynamic, interpreted language" },
  { key: "ts", label: "TypeScript", description: "Typed superset of JavaScript" },
  { key: "py", label: "Python", description: "General-purpose scripting" },
  { key: "rs", label: "Rust", description: "Systems programming" },
  { key: "go", label: "Go", description: "Concurrent, compiled language" },
  { key: "java", label: "Java", description: "Object-oriented, JVM-based" },
  { key: "cpp", label: "C++", description: "High-performance systems" },
  { key: "rb", label: "Ruby", description: "Dynamic, object-oriented" },
  { key: "swift", label: "Swift", description: "Apple ecosystem" },
  { key: "kt", label: "Kotlin", description: "Modern JVM language" },
];

const teamMembers: TransferItem[] = [
  { key: "alice", label: "Alice Johnson", description: "Engineering" },
  { key: "bob", label: "Bob Smith", description: "Design" },
  { key: "carol", label: "Carol White", description: "Product" },
  { key: "dave", label: "Dave Brown", description: "Engineering" },
  { key: "eve", label: "Eve Davis", description: "QA" },
  { key: "frank", label: "Frank Miller", description: "Engineering", disabled: true },
  { key: "grace", label: "Grace Lee", description: "Design" },
  { key: "hank", label: "Hank Wilson", description: "DevOps" },
];

export const Default: Story = {
  args: {
    dataSource: languages,
  },
  render: (args) => (
    <div className="max-w-2xl mx-auto p-4">
      <Transfer {...args} />
    </div>
  ),
};

export const WithSearch: Story = {
  args: {
    dataSource: languages,
    searchable: true,
  },
  render: (args) => (
    <div className="max-w-2xl mx-auto p-4">
      <Transfer {...args} />
    </div>
  ),
};

export const WithDefaultTarget: Story = {
  args: {
    dataSource: languages,
    defaultTargetKeys: ["js", "ts", "py"],
    searchable: true,
  },
  render: (args) => (
    <div className="max-w-2xl mx-auto p-4">
      <Transfer {...args} />
    </div>
  ),
};

export const CustomTitles: Story = {
  args: {
    dataSource: teamMembers,
    titles: ["Available Members", "Selected Members"],
    searchable: true,
    showSelectAll: true,
  },
  render: (args) => (
    <div className="max-w-2xl mx-auto p-4">
      <Transfer {...args} />
    </div>
  ),
};

export const WithDisabledItems: Story = {
  args: {
    dataSource: teamMembers,
    titles: ["Team", "Project"],
    searchable: true,
  },
  render: (args) => (
    <div className="max-w-2xl mx-auto p-4">
      <Transfer {...args} />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    dataSource: languages,
    defaultTargetKeys: ["js"],
    disabled: true,
  },
  render: (args) => (
    <div className="max-w-2xl mx-auto p-4">
      <Transfer {...args} />
    </div>
  ),
};

export const CompactHeight: Story = {
  args: {
    dataSource: languages,
    listHeight: 180,
    searchable: true,
  },
  render: (args) => (
    <div className="max-w-2xl mx-auto p-4">
      <Transfer {...args} />
    </div>
  ),
};

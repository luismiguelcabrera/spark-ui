import type { Meta, StoryObj } from "@storybook/react-vite";
import { Terminal } from "./terminal";
import type { TerminalLine } from "./terminal";

const sampleLines: TerminalLine[] = [
  { type: "input", content: "npm install @spark-ui/core" },
  { type: "output", content: "added 42 packages in 3.2s" },
  { type: "input", content: "npm run build" },
  { type: "output", content: "Building project..." },
  { type: "output", content: "Build completed successfully!" },
  { type: "info", content: "Output: dist/index.js (42.3 KB)" },
];

const errorLines: TerminalLine[] = [
  { type: "input", content: "git push origin main" },
  { type: "error", content: "error: failed to push some refs to 'origin'" },
  { type: "error", content: "hint: Updates were rejected because the remote contains work" },
  { type: "error", content: "hint: that you do not have locally." },
  { type: "input", content: "git pull --rebase origin main" },
  { type: "output", content: "Successfully rebased and updated refs/heads/main." },
  { type: "input", content: "git push origin main" },
  { type: "info", content: "Everything up-to-date" },
];

const deployLines: TerminalLine[] = [
  { type: "input", content: "deploy --production" },
  { type: "output", content: "Deploying to production..." },
  { type: "info", content: "[1/4] Building application" },
  { type: "info", content: "[2/4] Running tests" },
  { type: "info", content: "[3/4] Uploading assets" },
  { type: "info", content: "[4/4] Updating DNS" },
  { type: "output", content: "Deployment complete!" },
  { type: "output", content: "URL: https://app.example.com" },
];

const meta = {
  title: "Data Display/Terminal",
  component: Terminal,
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text" },
    prompt: { control: "text" },
    interactive: { control: "boolean" },
  },
} satisfies Meta<typeof Terminal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    lines: sampleLines,
    title: "Terminal",
  },
};

export const WithErrors: Story = {
  args: {
    lines: errorLines,
    title: "git-terminal",
  },
};

export const DeploymentLog: Story = {
  args: {
    lines: deployLines,
    title: "deploy.sh",
  },
};

export const Interactive: Story = {
  args: {
    lines: [
      { type: "output", content: "Welcome to Spark Shell v1.0" },
      { type: "info", content: "Type a command and press Enter" },
    ],
    interactive: true,
    title: "Interactive Terminal",
  },
};

export const CustomPrompt: Story = {
  args: {
    lines: [
      { type: "input", content: "SELECT * FROM users LIMIT 5;" },
      { type: "output", content: "| id | name    | email            |" },
      { type: "output", content: "|----|---------|------------------|" },
      { type: "output", content: "| 1  | Alice   | alice@example.com|" },
      { type: "output", content: "| 2  | Bob     | bob@example.com  |" },
      { type: "info", content: "2 rows returned" },
    ],
    prompt: "sql> ",
    title: "PostgreSQL",
  },
};

export const MixedPrompts: Story = {
  args: {
    lines: [
      { type: "input", content: "ssh user@server.example.com", prompt: "local $ " },
      { type: "output", content: "Connected to server.example.com" },
      { type: "input", content: "ls -la", prompt: "remote $ " },
      { type: "output", content: "drwxr-xr-x  5 user  staff  160 Jan  1 12:00 ." },
      { type: "output", content: "-rw-r--r--  1 user  staff  420 Jan  1 12:00 app.js" },
      { type: "input", content: "exit", prompt: "remote $ " },
      { type: "info", content: "Connection closed." },
    ],
    title: "SSH Session",
  },
};

export const EmptyTerminal: Story = {
  args: {
    lines: [],
    interactive: true,
    title: "bash",
  },
};

export const Gallery: Story = {
  render: (args) => (
    <div className="space-y-6 max-w-2xl">
      <Terminal {...args} lines={sampleLines} title="npm" className="max-w-lg" />
      <Terminal {...args} lines={errorLines} title="git" className="max-w-lg" />
      <Terminal {...args} lines={deployLines} title="deploy" className="max-w-lg" />
    </div>
  ),
};

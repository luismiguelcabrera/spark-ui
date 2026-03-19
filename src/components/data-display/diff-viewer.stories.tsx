import type { Meta, StoryObj } from "@storybook/react-vite";
import { DiffViewer } from "./diff-viewer";

const meta = {
  title: "Data Display/DiffViewer",
  component: DiffViewer,
  tags: ["autodocs"],
  argTypes: {
    showLineNumbers: { control: "boolean" },
    title: { control: "text" },
    language: { control: "text" },
  },
} satisfies Meta<typeof DiffViewer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    lines: [
      { type: "unchanged", content: "function greet(name) {" },
      { type: "removed", content: '  return "Hello, " + name;' },
      { type: "added", content: "  return `Hello, ${name}!`;" },
      { type: "unchanged", content: "}" },
    ],
  },
};

export const WithTitle: Story = {
  args: {
    title: "src/utils.ts",
    language: "typescript",
    lines: [
      { type: "unchanged", content: "import { cn } from './lib/utils';" },
      { type: "unchanged", content: "" },
      { type: "removed", content: "export function formatDate(date: Date): string {" },
      { type: "removed", content: '  return date.toLocaleDateString("en-US");' },
      { type: "removed", content: "}" },
      { type: "added", content: "export function formatDate(date: Date, locale = 'en-US'): string {" },
      { type: "added", content: "  return date.toLocaleDateString(locale, {" },
      { type: "added", content: "    year: 'numeric'," },
      { type: "added", content: "    month: 'long'," },
      { type: "added", content: "    day: 'numeric'," },
      { type: "added", content: "  });" },
      { type: "added", content: "}" },
    ],
  },
};

export const NoLineNumbers: Story = {
  args: {
    showLineNumbers: false,
    lines: [
      { type: "unchanged", content: "const config = {" },
      { type: "removed", content: '  theme: "light",' },
      { type: "added", content: '  theme: "dark",' },
      { type: "unchanged", content: "};" },
    ],
  },
};

export const AllAdded: Story = {
  args: {
    title: "new-file.ts",
    language: "typescript",
    lines: [
      { type: "added", content: 'import { useState } from "react";' },
      { type: "added", content: "" },
      { type: "added", content: "export function useToggle(initial = false) {" },
      { type: "added", content: "  const [value, setValue] = useState(initial);" },
      { type: "added", content: "  const toggle = () => setValue((v) => !v);" },
      { type: "added", content: "  return [value, toggle] as const;" },
      { type: "added", content: "}" },
    ],
  },
};

export const AllRemoved: Story = {
  args: {
    title: "deprecated.ts",
    language: "typescript",
    lines: [
      { type: "removed", content: "// This file is no longer needed" },
      { type: "removed", content: "export const LEGACY_API = '/api/v1';" },
      { type: "removed", content: "export const OLD_TOKEN = 'abc123';" },
    ],
  },
};

export const LargeDiff: Story = {
  args: {
    title: "package.json",
    language: "json",
    lines: [
      { type: "unchanged", content: "{" },
      { type: "unchanged", content: '  "name": "my-app",' },
      { type: "removed", content: '  "version": "1.0.0",' },
      { type: "added", content: '  "version": "1.1.0",' },
      { type: "unchanged", content: '  "dependencies": {' },
      { type: "removed", content: '    "react": "^18.2.0",' },
      { type: "added", content: '    "react": "^19.0.0",' },
      { type: "removed", content: '    "react-dom": "^18.2.0",' },
      { type: "added", content: '    "react-dom": "^19.0.0",' },
      { type: "unchanged", content: '    "tailwindcss": "^4.0.0"' },
      { type: "unchanged", content: "  }," },
      { type: "added", content: '  "devDependencies": {' },
      { type: "added", content: '    "vitest": "^3.0.0"' },
      { type: "added", content: "  }," },
      { type: "unchanged", content: "}" },
    ],
  },
};

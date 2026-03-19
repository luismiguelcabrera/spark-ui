import type { Meta, StoryObj } from "@storybook/react-vite";
import { CodeInput } from "./code-input";

const meta = {
  title: "Forms/CodeInput",
  component: CodeInput,
  tags: ["autodocs"],
  argTypes: {
    language: {
      control: "select",
      options: ["json", "javascript", "html", "css"],
    },
    lineNumbers: { control: "boolean" },
    readOnly: { control: "boolean" },
    disabled: { control: "boolean" },
    error: { control: "text" },
    tabSize: { control: { type: "number", min: 1, max: 8 } },
    wrap: { control: "boolean" },
    minLines: { control: { type: "number", min: 1, max: 30 } },
    maxLines: { control: { type: "number", min: 1, max: 50 } },
  },
} satisfies Meta<typeof CodeInput>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleJSON = `{
  "name": "spark-ui",
  "version": "1.0.0",
  "dependencies": {
    "react": "^19.0.0",
    "tailwindcss": "^4.0.0"
  },
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "test": "vitest"
  }
}`;

const sampleJS = `import { useState, useEffect } from "react";

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export default useDebounce;`;

export const Default: Story = {
  args: {
    language: "json",
    defaultValue: sampleJSON,
  },
};

export const JavaScript: Story = {
  args: {
    language: "javascript",
    defaultValue: sampleJS,
  },
};

export const NoLineNumbers: Story = {
  args: {
    language: "json",
    defaultValue: sampleJSON,
    lineNumbers: false,
  },
};

export const ReadOnly: Story = {
  args: {
    language: "json",
    defaultValue: sampleJSON,
    readOnly: true,
    label: "Read-only configuration",
  },
};

export const Disabled: Story = {
  args: {
    language: "json",
    defaultValue: sampleJSON,
    disabled: true,
  },
};

export const WithError: Story = {
  args: {
    language: "json",
    defaultValue: '{ "name": }',
    error: "Unexpected token } in JSON at position 10",
  },
};

export const CustomHighlight: Story = {
  args: {
    defaultValue: "SELECT id, name FROM users WHERE active = true;",
    highlight: (code: string) =>
      code.replace(
        /\b(SELECT|FROM|WHERE|AND|OR|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|TABLE|INTO|VALUES|SET|JOIN|ON|AS|IN|NOT|NULL|TRUE|FALSE|LIKE|ORDER|BY|GROUP|HAVING|LIMIT|OFFSET)\b/gi,
        '<span class="text-blue-400 font-bold">$1</span>'
      ),
    label: "SQL Query (custom highlighter)",
  },
};

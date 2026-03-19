import type { Meta, StoryObj } from "@storybook/react-vite";
import { InlineCode, CodeBlock } from "./code";

const inlineMeta = {
  title: "Data Display/Code/InlineCode",
  component: InlineCode,
  tags: ["autodocs"],
} satisfies Meta<typeof InlineCode>;

export default inlineMeta;
type InlineStory = StoryObj<typeof inlineMeta>;

export const Inline: InlineStory = {
  args: { children: "npm install spark-ui" },
};

export const InlineInSentence: InlineStory = {
  render: (args) => (
    <p className="text-slate-700">
      Run <InlineCode {...args}>pnpm build</InlineCode> to compile the project, then use{" "}
      <InlineCode {...args}>pnpm test</InlineCode> to verify everything works.
    </p>
  ),
};

export const InlineVariable: InlineStory = {
  args: { children: "const x = 42" },
};

/* ------------------------------------------------------------------ */
/* CodeBlock stories exported from same file                           */
/* ------------------------------------------------------------------ */

const _blockMeta = {
  title: "Data Display/Code/CodeBlock",
  component: CodeBlock,
  tags: ["autodocs"],
  argTypes: {
    language: { control: "text" },
    showLineNumbers: { control: "boolean" },
  },
} satisfies Meta<typeof CodeBlock>;

type BlockStory = StoryObj<typeof _blockMeta>;

export const Block: BlockStory = {
  args: {
    children: `function greet(name: string) {\n  return \`Hello, \${name}!\`;\n}`,
    language: "typescript",
  },
};

export const BlockWithLineNumbers: BlockStory = {
  args: {
    language: "javascript",
    showLineNumbers: true,
    children: (
      <>
        <span>{"const express = require('express');"}</span>
        <span>{"const app = express();"}</span>
        <span>{""}</span>
        <span>{"app.get('/', (req, res) => {"}</span>
        <span>{"  res.send('Hello World!');"}</span>
        <span>{"});"}</span>
        <span>{""}</span>
        <span>{"app.listen(3000);"}</span>
      </>
    ),
  },
};

export const BlockNoLanguage: BlockStory = {
  args: {
    children: "$ pnpm install\n$ pnpm build\n$ pnpm test",
  },
};

export const BlockCSS: BlockStory = {
  args: {
    language: "css",
    children: `.button {\n  background: var(--color-primary);\n  border-radius: 8px;\n  padding: 0.5rem 1rem;\n  color: white;\n}`,
  },
};

export const BlockJSON: BlockStory = {
  args: {
    language: "json",
    children: `{\n  "name": "spark-ui",\n  "version": "1.0.0",\n  "dependencies": {\n    "react": "^19.0.0",\n    "tailwindcss": "^4.0.0"\n  }\n}`,
  },
};

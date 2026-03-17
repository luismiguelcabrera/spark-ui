import type { Meta } from "@storybook/react-vite";
import { Heading } from "./heading";
import { Text } from "./text";
import { InlineCode, CodeBlock } from "./code";
import { Kbd } from "./kbd";
import { Highlight } from "./highlight";
import { Blockquote } from "./blockquote";
import { Prose } from "./prose";

export default {
  title: "Data Display/Typography",
  tags: ["autodocs"],
} as Meta;

// --- Heading ---

export const Headings = {
  render: () => (
    <div className="space-y-4">
      <Heading size="4xl">Heading 4XL</Heading>
      <Heading size="3xl">Heading 3XL</Heading>
      <Heading size="2xl">Heading 2XL</Heading>
      <Heading size="xl">Heading XL (default)</Heading>
      <Heading size="lg">Heading LG</Heading>
      <Heading size="md">Heading MD</Heading>
      <Heading size="sm">Heading SM</Heading>
      <Heading size="xs">Heading XS</Heading>
    </div>
  ),
};

export const HeadingWeights = {
  render: () => (
    <div className="space-y-3">
      <Heading size="2xl" weight="normal">Normal Weight</Heading>
      <Heading size="2xl" weight="medium">Medium Weight</Heading>
      <Heading size="2xl" weight="semibold">Semibold Weight</Heading>
      <Heading size="2xl" weight="bold">Bold Weight (default)</Heading>
      <Heading size="2xl" weight="extrabold">Extrabold Weight</Heading>
      <Heading size="2xl" weight="black">Black Weight</Heading>
    </div>
  ),
};

// --- Text ---

export const TextVariants = {
  render: () => (
    <div className="space-y-3">
      <Text size="xl" weight="bold">Extra Large Bold</Text>
      <Text size="lg" color="primary">Large Primary</Text>
      <Text size="md">Medium Default</Text>
      <Text size="sm" color="muted">Small Muted</Text>
      <Text size="xs" color="subtle">Extra Small Subtle</Text>
      <Text color="success">Success Text</Text>
      <Text color="destructive">Destructive Text</Text>
      <Text color="warning">Warning Text</Text>
      <Text truncate className="max-w-xs">
        This is a very long text that will be truncated because of the max-width
        constraint applied to it
      </Text>
    </div>
  ),
};

export const TextLeading = {
  render: () => (
    <div className="space-y-6 max-w-md">
      {(["tight", "normal", "relaxed", "loose"] as const).map((leading) => (
        <div key={leading}>
          <Text size="xs" color="subtle" weight="semibold" className="mb-1 uppercase tracking-wider">
            leading=&quot;{leading}&quot;
          </Text>
          <Text leading={leading}>
            The quick brown fox jumps over the lazy dog. This sentence demonstrates
            how different line heights affect the readability of multi-line text.
          </Text>
        </div>
      ))}
    </div>
  ),
};

export const TextAlignment = {
  render: () => (
    <div className="space-y-4 max-w-md border border-slate-200 rounded-xl p-4">
      <Text align="left" color="muted">Left aligned (default)</Text>
      <Text align="center" color="muted">Center aligned</Text>
      <Text align="right" color="muted">Right aligned</Text>
      <Text align="justify" color="muted">
        Justified text stretches to fill the entire width of its container,
        creating even left and right edges for a clean, formal appearance.
      </Text>
    </div>
  ),
};

// --- Code ---

export const CodeExamples = {
  render: () => (
    <div className="space-y-6">
      <div>
        <Text size="sm" color="muted" className="mb-2">Inline code:</Text>
        <Text>
          Use <InlineCode>npm install spark-ui</InlineCode> to install the
          library.
        </Text>
      </div>
      <div>
        <Text size="sm" color="muted" className="mb-2">Code block:</Text>
        <CodeBlock language="tsx">{`import { Button } from "spark-ui";

function App() {
  return <Button color="primary">Click me</Button>;
}`}</CodeBlock>
      </div>
    </div>
  ),
};

export const CodeBlockWithLineNumbers = {
  render: () => (
    <CodeBlock language="ts" showLineNumbers>
      {`const greet = (name: string) => {
  console.log(\`Hello, \${name}!\`);
};

greet("World");`}
    </CodeBlock>
  ),
};

// --- Kbd ---

export const KeyboardShortcuts = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Text size="sm">Copy:</Text>
        <Kbd keys={["Cmd", "C"]} />
      </div>
      <div className="flex items-center gap-2">
        <Text size="sm">Paste:</Text>
        <Kbd keys={["Cmd", "V"]} />
      </div>
      <div className="flex items-center gap-2">
        <Text size="sm">Search:</Text>
        <Kbd keys={["Cmd", "K"]} />
      </div>
      <div className="flex items-center gap-2">
        <Text size="sm">Save:</Text>
        <Kbd keys={["Cmd", "S"]} />
      </div>
      <div className="flex items-center gap-2">
        <Text size="sm">Submit:</Text>
        <Kbd>Enter</Kbd>
      </div>
      <div className="flex items-center gap-2">
        <Text size="sm">Undo:</Text>
        <Kbd keys={["Ctrl", "Z"]} />
      </div>
    </div>
  ),
};

// --- Highlight ---

export const HighlightColors = {
  render: () => (
    <div className="space-y-3">
      <Text>
        This has a <Highlight color="yellow">yellow highlight</Highlight> in it.
      </Text>
      <Text>
        This has a <Highlight color="green">green highlight</Highlight> in it.
      </Text>
      <Text>
        This has a <Highlight color="blue">blue highlight</Highlight> in it.
      </Text>
      <Text>
        This has a <Highlight color="pink">pink highlight</Highlight> in it.
      </Text>
      <Text>
        This has a <Highlight color="purple">purple highlight</Highlight> in it.
      </Text>
      <Text>
        This has a <Highlight color="orange">orange highlight</Highlight> in it.
      </Text>
    </div>
  ),
};

// --- Blockquote ---

export const Blockquotes = {
  render: () => (
    <div className="space-y-6 max-w-lg">
      <Blockquote author="Albert Einstein">
        Imagination is more important than knowledge.
      </Blockquote>
      <Blockquote color="primary" author="Steve Jobs">
        Stay hungry, stay foolish.
      </Blockquote>
      <Blockquote color="success">
        The best way to predict the future is to create it.
      </Blockquote>
      <Blockquote color="warning" author="Anonymous">
        Move fast and break things.
      </Blockquote>
      <Blockquote color="destructive">
        Not all who wander are lost, but some definitely are.
      </Blockquote>
    </div>
  ),
};

// --- Prose ---

export const ProseContent = {
  render: () => (
    <Prose>
      <h1>Getting Started with Spark UI</h1>
      <p>
        Spark UI is a modern React component library built with TypeScript,
        Tailwind CSS, and CVA.
      </p>
      <h2>Installation</h2>
      <p>Install via your preferred package manager:</p>
      <pre>
        <code>npm install spark-ui</code>
      </pre>
      <h3>Quick Start</h3>
      <p>Import the components you need and the theme CSS:</p>
      <blockquote>
        Spark UI components are fully tree-shakeable, so only the components you
        import are included in your bundle.
      </blockquote>
      <ul>
        <li>60+ production-ready components</li>
        <li>Full TypeScript support</li>
        <li>WCAG AA accessible</li>
        <li>Dark mode support</li>
      </ul>
      <hr />
      <p>
        Read the <strong>full documentation</strong> for more details.
      </p>
    </Prose>
  ),
};

export const ProseSizes = {
  render: () => (
    <div className="space-y-8">
      {(["sm", "md", "lg", "full"] as const).map((size) => (
        <div key={size}>
          <Text size="xs" color="subtle" weight="semibold" className="mb-2 uppercase tracking-wider">
            size=&quot;{size}&quot;
          </Text>
          <Prose size={size} className="bg-slate-50 p-4 rounded-xl">
            <h2>Prose Size: {size}</h2>
            <p>
              This demonstrates how the prose container adjusts its max-width
              based on the size prop. The content inside flows naturally within
              the constrained width.
            </p>
          </Prose>
        </div>
      ))}
    </div>
  ),
};

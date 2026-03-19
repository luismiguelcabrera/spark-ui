import type { Meta, StoryObj } from "@storybook/react-vite";
import { Prose } from "./prose";

const meta = {
  title: "Data Display/Prose",
  component: Prose,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg", "xl", "full"] },
  },
} satisfies Meta<typeof Prose>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <h1>Getting Started with Spark UI</h1>
        <p>
          Spark UI is a modern React component library built with TypeScript, Tailwind CSS, and
          class-variance-authority. It provides a comprehensive set of accessible, themeable components.
        </p>
        <h2>Installation</h2>
        <p>Install the package using your preferred package manager:</p>
        <pre>pnpm add spark-ui</pre>
        <h3>Quick Start</h3>
        <p>
          Import the components you need and start building. All components are tree-shakeable and
          support both controlled and uncontrolled modes.
        </p>
      </>
    ),
  },
};

export const WithLists: Story = {
  args: {
    children: (
      <>
        <h2>Features</h2>
        <ul>
          <li>Fully accessible (WCAG AA compliant)</li>
          <li>Tree-shakeable exports</li>
          <li>TypeScript-first API</li>
          <li>Customizable with CSS variables</li>
          <li>Dark mode support</li>
        </ul>
        <h2>Steps</h2>
        <ol>
          <li>Install the library</li>
          <li>Wrap your app with ThemeProvider</li>
          <li>Import and use components</li>
          <li>Customize as needed</li>
        </ol>
      </>
    ),
  },
};

export const WithBlockquote: Story = {
  args: {
    children: (
      <>
        <h2>Philosophy</h2>
        <p>Our approach to component design is grounded in simplicity and composability.</p>
        <blockquote>
          Good design is as little design as possible. Less, but better, because it concentrates on
          the essential aspects, and the products are not burdened with non-essentials.
        </blockquote>
        <p>We believe every component should be intuitive to use and easy to customize.</p>
      </>
    ),
  },
};

export const WithCode: Story = {
  args: {
    children: (
      <>
        <h2>Usage Example</h2>
        <p>
          Import the <code>Button</code> component and use it in your JSX:
        </p>
        <pre>{`import { Button } from "spark-ui";\n\nfunction App() {\n  return <Button color="primary">Click me</Button>;\n}`}</pre>
      </>
    ),
  },
};

export const SmallSize: Story = {
  args: {
    size: "sm",
    children: (
      <>
        <h2>Small Prose</h2>
        <p>This prose container uses the small max-width variant for narrow columns.</p>
        <p>It works well in sidebars or narrow layouts.</p>
      </>
    ),
  },
};

export const LargeSize: Story = {
  args: {
    size: "lg",
    children: (
      <>
        <h2>Large Prose</h2>
        <p>
          This prose container uses the large max-width for wider content areas. It gives
          more room for text to breathe and is suitable for main content columns.
        </p>
      </>
    ),
  },
};

export const FullWidth: Story = {
  args: {
    size: "full",
    children: (
      <>
        <h2>Full Width Prose</h2>
        <p>
          This variant removes the max-width constraint, allowing the prose to span the entire width
          of its container.
        </p>
      </>
    ),
  },
};

export const Article: Story = {
  args: {
    children: (
      <>
        <h1>Building Accessible Components</h1>
        <p>
          Accessibility is not an afterthought in Spark UI. Every component is built with WCAG AA
          compliance in mind from the start.
        </p>
        <h2>Keyboard Navigation</h2>
        <p>
          All interactive components support full keyboard navigation. Users can tab through
          focusable elements, use arrow keys for navigation within composite widgets, and activate
          actions with Enter or Space.
        </p>
        <h3>Focus Management</h3>
        <p>
          We use visible focus indicators that meet contrast requirements. The focus ring adapts to
          the component color for visual consistency.
        </p>
        <h2>Screen Reader Support</h2>
        <p>
          Proper ARIA attributes are applied throughout. Components announce their state changes and
          provide meaningful labels for assistive technology.
        </p>
        <ul>
          <li>Dynamic content uses live regions</li>
          <li>Modals trap focus and restore it on close</li>
          <li>Loading states use <code>aria-busy</code></li>
          <li>Toggles announce their checked state</li>
        </ul>
        <hr />
        <p>
          <strong>Want to learn more?</strong> Check out our accessibility guide in the documentation.
        </p>
      </>
    ),
  },
};

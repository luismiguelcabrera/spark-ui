import type { Meta, StoryObj } from "@storybook/react-vite";
import { Accordion } from "./accordion";

const meta = {
  title: "Navigation/Accordion",
  component: Accordion,
  tags: ["autodocs"],
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Legacy: Story = {
  args: {
    items: [
      { title: "What is Spark UI?", content: "A React component library built with Tailwind CSS." },
      {
        title: "How do I install it?",
        content: "Run pnpm add spark-ui in your project.",
        defaultOpen: true,
      },
      { title: "Is it accessible?", content: "Yes, we follow WAI-ARIA patterns." },
    ],
  },
};

export const Compound: Story = {
  render: () => (
    <Accordion defaultValue={["faq1"]}>
      <Accordion.Item value="faq1" title="Question 1">
        Answer to question 1.
      </Accordion.Item>
      <Accordion.Item value="faq2" title="Question 2">
        Answer to question 2.
      </Accordion.Item>
    </Accordion>
  ),
};

export const Bordered: Story = {
  args: {
    variant: "bordered",
    items: [
      { title: "Section A", content: "Content A" },
      { title: "Section B", content: "Content B" },
    ],
  },
};

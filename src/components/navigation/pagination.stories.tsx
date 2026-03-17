import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pagination } from "./pagination";

const meta = {
  title: "Navigation/Pagination",
  component: Pagination,
  tags: ["autodocs"],
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Simple: Story = {
  args: { total: 100, pageSize: 10, defaultCurrent: 1 },
};

export const Numbered: Story = {
  args: { total: 250, pageSize: 25, defaultCurrent: 3, variant: "numbered" },
};

export const LastPage: Story = {
  args: { total: 50, pageSize: 10, defaultCurrent: 5 },
};

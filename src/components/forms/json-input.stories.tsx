import type { Meta, StoryObj } from "@storybook/react-vite";
import { JsonInput } from "./json-input";

const meta = {
  title: "Forms/JsonInput",
  component: JsonInput,
  tags: ["autodocs"],
  argTypes: {
    formatOnBlur: { control: "boolean" },
    validateOnChange: { control: "boolean" },
    showFormatButton: { control: "boolean" },
    showCopyButton: { control: "boolean" },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    error: { control: "text" },
    label: { control: "text" },
  },
} satisfies Meta<typeof JsonInput>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleJSON = JSON.stringify(
  {
    name: "John Doe",
    email: "john@example.com",
    age: 30,
    active: true,
    roles: ["admin", "editor"],
    address: {
      street: "123 Main St",
      city: "Springfield",
      state: "IL",
    },
  },
  null,
  2
);

export const Default: Story = {
  args: {
    defaultValue: sampleJSON,
  },
};

export const Empty: Story = {
  args: {},
};

export const InvalidJSON: Story = {
  args: {
    defaultValue: "{ invalid json }",
  },
};

export const WithLabel: Story = {
  args: {
    label: "API Response Body",
    defaultValue: sampleJSON,
  },
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    defaultValue: sampleJSON,
    label: "Read-only config",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: sampleJSON,
  },
};

export const WithCustomValidator: Story = {
  args: {
    defaultValue: JSON.stringify({ count: 5 }, null, 2),
    label: "Requires 'name' field",
    validationSchema: (json: unknown) => {
      const obj = json as Record<string, unknown>;
      if (!obj.name) return "'name' field is required";
      if (typeof obj.name !== "string") return "'name' must be a string";
      return null;
    },
  },
};

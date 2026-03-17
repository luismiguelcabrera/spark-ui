import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  InputLeftElement,
  InputRightElement,
} from "./input-group";
import { Input } from "./input";
import { Icon } from "../data-display/icon";
import { Button } from "./button";

const meta = {
  title: "Forms/InputGroup",
  component: InputGroup,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
} satisfies Meta<typeof InputGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <InputGroup {...args}>
      <InputLeftAddon>https://</InputLeftAddon>
      <Input placeholder="example.com" />
    </InputGroup>
  ),
};

export const WithRightAddon: Story = {
  render: (args) => (
    <InputGroup {...args}>
      <Input placeholder="username" />
      <InputRightAddon>@gmail.com</InputRightAddon>
    </InputGroup>
  ),
};

export const BothAddons: Story = {
  render: (args) => (
    <InputGroup {...args}>
      <InputLeftAddon>https://</InputLeftAddon>
      <Input placeholder="mysite" />
      <InputRightAddon>.com</InputRightAddon>
    </InputGroup>
  ),
};

export const CurrencyInput: Story = {
  render: (args) => (
    <InputGroup {...args}>
      <InputLeftAddon>$</InputLeftAddon>
      <Input placeholder="0.00" type="number" />
      <InputRightAddon>USD</InputRightAddon>
    </InputGroup>
  ),
};

export const WithLeftIcon: Story = {
  name: "Left Element (Icon)",
  render: (args) => (
    <InputGroup {...args}>
      <div className="relative flex-1">
        <InputLeftElement>
          <Icon name="search" size="md" className="text-slate-400" />
        </InputLeftElement>
        <Input placeholder="Search..." className="pl-11" />
      </div>
    </InputGroup>
  ),
};

export const WithRightIcon: Story = {
  name: "Right Element (Icon)",
  render: (args) => (
    <InputGroup {...args}>
      <div className="relative flex-1">
        <Input placeholder="Enter email" className="pr-11" />
        <InputRightElement>
          <Icon name="check-circle" size="md" className="text-green-500" />
        </InputRightElement>
      </div>
    </InputGroup>
  ),
};

export const WithClickableElement: Story = {
  name: "Clickable Right Element",
  render: (args) => (
    <InputGroup {...args}>
      <div className="relative flex-1">
        <Input placeholder="Enter password" type="password" className="pr-12" />
        <InputRightElement clickable>
          <button
            type="button"
            className="text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Toggle visibility"
          >
            <Icon name="eye" size="md" />
          </button>
        </InputRightElement>
      </div>
    </InputGroup>
  ),
};

export const AddonWithButton: Story = {
  render: (args) => (
    <InputGroup {...args}>
      <Input placeholder="Search..." />
      <Button variant="solid" color="primary" className="rounded-l-none">
        Search
      </Button>
    </InputGroup>
  ),
};

export const SmallSize: Story = {
  args: { size: "sm" },
  render: (args) => (
    <InputGroup {...args}>
      <InputLeftAddon size="sm">$</InputLeftAddon>
      <Input placeholder="Amount" className="h-9 text-xs" />
      <InputRightAddon size="sm">.00</InputRightAddon>
    </InputGroup>
  ),
};

export const LargeSize: Story = {
  args: { size: "lg" },
  render: (args) => (
    <InputGroup {...args}>
      <InputLeftAddon size="lg">https://</InputLeftAddon>
      <Input placeholder="example.com" className="h-14 text-base" />
    </InputGroup>
  ),
};

export const Gallery: Story = {
  render: (args) => (
    <div className="flex flex-col gap-6 max-w-md">
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase mb-2">URL Input</p>
        <InputGroup {...args}>
          <InputLeftAddon>https://</InputLeftAddon>
          <Input placeholder="example.com" />
        </InputGroup>
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Email</p>
        <InputGroup {...args}>
          <Input placeholder="username" />
          <InputRightAddon>@company.com</InputRightAddon>
        </InputGroup>
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Currency</p>
        <InputGroup {...args}>
          <InputLeftAddon>$</InputLeftAddon>
          <Input placeholder="0.00" type="number" />
          <InputRightAddon>USD</InputRightAddon>
        </InputGroup>
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Search with Icon</p>
        <div className="relative">
          <InputLeftElement>
            <Icon name="search" size="md" className="text-slate-400" />
          </InputLeftElement>
          <Input placeholder="Search anything..." className="pl-11" />
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase mb-2">With Button</p>
        <InputGroup {...args}>
          <Input placeholder="Enter code" />
          <Button variant="solid" color="primary" className="rounded-l-none">
            Apply
          </Button>
        </InputGroup>
      </div>
    </div>
  ),
};

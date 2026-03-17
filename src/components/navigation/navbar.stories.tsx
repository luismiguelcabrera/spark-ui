import type { Meta, StoryObj } from "@storybook/react";
import { Navbar, NavbarLink } from "./navbar";
import { Button } from "../forms/button";

const meta = {
  title: "Navigation/Navbar",
  component: Navbar,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["default", "bordered", "floating", "transparent"] },
    sticky: { control: "boolean" },
  },
} satisfies Meta<typeof Navbar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    sticky: false,
    logo: <span className="text-lg font-bold text-primary">SparkUI</span>,
    actions: <Button size="sm">Sign In</Button>,
  },
  render: (args) => (
    <Navbar {...args}>
      <NavbarLink href="#" active>Home</NavbarLink>
      <NavbarLink href="#">Products</NavbarLink>
      <NavbarLink href="#">Pricing</NavbarLink>
      <NavbarLink href="#">Docs</NavbarLink>
    </Navbar>
  ),
};

export const Floating: Story = {
  args: {
    variant: "floating",
    sticky: false,
    logo: <span className="text-lg font-bold text-primary">SparkUI</span>,
    actions: <Button size="sm">Sign In</Button>,
  },
  render: (args) => (
    <div className="bg-slate-50 p-4 rounded-xl">
      <Navbar {...args}>
        <NavbarLink href="#" active>Home</NavbarLink>
        <NavbarLink href="#">About</NavbarLink>
        <NavbarLink href="#">Contact</NavbarLink>
      </Navbar>
    </div>
  ),
};

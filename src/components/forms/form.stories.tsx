import type { Meta, StoryObj } from "@storybook/react-vite";
import { useForm } from "react-hook-form";
import { Form } from "./form";
import { FormField } from "./form-field";
import { Button } from "./button";

const meta = {
  title: "Forms/Form",
  component: Form,
  tags: ["autodocs"],
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

type LoginFields = { email: string; password: string };

export const Default: Story = {
  render: () => {
    const form = useForm<LoginFields>({ defaultValues: { email: "", password: "" } });
    return (
      <Form form={form} onSubmit={(data) => alert(JSON.stringify(data))} className="space-y-4 max-w-sm">
        <FormField label="Email" type="email" placeholder="you@example.com" {...form.register("email")} />
        <FormField label="Password" type="password" placeholder="********" {...form.register("password")} />
        <Button type="submit" variant="solid" color="primary">Sign in</Button>
      </Form>
    );
  },
};

type SignupFields = { name: string; email: string; role: string };

export const WithValidation: Story = {
  render: () => {
    const form = useForm<SignupFields>({ defaultValues: { name: "", email: "", role: "" } });
    return (
      <Form form={form} onSubmit={(data) => alert(JSON.stringify(data))} className="space-y-4 max-w-sm">
        <FormField
          label="Name"
          placeholder="John Doe"
          error={form.formState.errors.name?.message}
          {...form.register("name", { required: "Name is required" })}
        />
        <FormField
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={form.formState.errors.email?.message}
          {...form.register("email", { required: "Email is required" })}
        />
        <Button type="submit" variant="solid" color="primary">Sign up</Button>
      </Form>
    );
  },
};

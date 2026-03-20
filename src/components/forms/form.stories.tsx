import type { Meta, StoryObj } from "@storybook/react-vite";
import { Form } from "./form";
import { useForm } from "../../hooks/use-form";
import { useFieldArray } from "../../hooks/use-field-array";
import { Input } from "./input";
import { Select } from "./select";
import { Switch } from "./switch";
import { Button } from "./button";
import { Alert } from "../feedback/alert";

const meta = {
  title: "Forms/Form",
  component: Form,
  tags: ["autodocs"],
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── 1. Basic Login ──

export const BasicLogin: Story = {
  render: () => {
    const form = useForm({ initialValues: { email: "", password: "" } });
    return (
      <Form
        form={form}
        onSubmit={(values) => alert(JSON.stringify(values, null, 2))}
        className="space-y-4 max-w-sm"
        aria-label="login"
      >
        <Form.Field name="email" label="Email" rules={{ required: true }}>
          <Input type="email" placeholder="you@example.com" />
        </Form.Field>
        <Form.Field name="password" label="Password" rules={{ required: true, minLength: 8 }}>
          <Input type="password" placeholder="••••••••" />
        </Form.Field>
        <Form.Submit>Sign in</Form.Submit>
      </Form>
    );
  },
};

// ── 2. With Validation ──

export const WithValidation: Story = {
  render: () => {
    const form = useForm({ initialValues: { name: "", email: "", age: "" } });
    return (
      <Form form={form} className="space-y-4 max-w-sm" aria-label="validation">
        <Form.Field name="name" label="Name" rules={{ required: true, minLength: 2 }}>
          <Input placeholder="John" />
        </Form.Field>
        <Form.Field
          name="email"
          label="Email"
          rules={{ required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }}
        >
          <Input type="email" placeholder="john@example.com" />
        </Form.Field>
        <Form.Field name="age" label="Age" rules={{ required: "Age is required", min: 18, max: 120 }}>
          <Input type="number" placeholder="25" />
        </Form.Field>
        <Form.Submit>Submit</Form.Submit>
      </Form>
    );
  },
};

// ── 3. Server Errors ──

export const ServerErrors: Story = {
  render: () => {
    const form = useForm({ initialValues: { email: "taken@example.com" } });
    return (
      <Form
        form={form}
        onSubmit={async () => ({
          fieldErrors: { email: "This email is already registered" },
          formError: "Signup failed. Please try again.",
        })}
        className="space-y-4 max-w-sm"
        aria-label="server-errors"
      >
        <Form.Error>
          {(error) => <Alert variant="error">{error}</Alert>}
        </Form.Error>
        <Form.Field name="email" label="Email">
          <Input />
        </Form.Field>
        <Form.Submit>Sign up</Form.Submit>
      </Form>
    );
  },
};

// ── 4. Render Prop ──

export const RenderProp: Story = {
  render: () => {
    const form = useForm({ initialValues: { notify: false } });
    return (
      <Form
        form={form}
        onSubmit={(values) => alert(JSON.stringify(values))}
        className="space-y-4 max-w-sm"
        aria-label="render-prop"
      >
        <Form.Field name="notify" label="Email notifications">
          {(field) => (
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              aria-label="Toggle notifications"
            />
          )}
        </Form.Field>
        <Form.Submit>Save</Form.Submit>
      </Form>
    );
  },
};

// ── 5. Conditional Fields ──

export const ConditionalFields: Story = {
  render: () => {
    const form = useForm({ initialValues: { plan: "free", company: "" } });
    return (
      <Form
        form={form}
        onSubmit={(values) => alert(JSON.stringify(values))}
        className="space-y-4 max-w-sm"
        aria-label="conditional"
      >
        <Form.Field name="plan" label="Plan">
          <Select
            options={[
              { label: "Free", value: "free" },
              { label: "Pro", value: "pro" },
              { label: "Enterprise", value: "enterprise" },
            ]}
          />
        </Form.Field>
        <Form.If name="plan" oneOf={["pro", "enterprise"]}>
          <Form.Field name="company" label="Company name" rules={{ required: true }}>
            <Input placeholder="Acme Inc." />
          </Form.Field>
        </Form.If>
        <Form.Submit>Continue</Form.Submit>
      </Form>
    );
  },
};

// ── 6. Watch Preview ──

export const WatchPreview: Story = {
  render: () => {
    const form = useForm({ initialValues: { name: "", color: "#3b82f6" } });
    return (
      <div className="flex gap-8">
        <Form
          form={form}
          className="space-y-4 w-64"
          aria-label="watch-preview"
        >
          <Form.Field name="name" label="Badge name">
            <Input placeholder="VIP" />
          </Form.Field>
          <Form.Field name="color" label="Color">
            <Input type="color" />
          </Form.Field>
        </Form>
        <div className="flex items-center">
          <Form.Watch name={["name", "color"]}>
            {(values: Record<string, string>) => (
              <span
                className="px-3 py-1 rounded-full text-white text-sm font-semibold"
                style={{ backgroundColor: values.color || "#3b82f6" }}
              >
                {values.name || "Preview"}
              </span>
            )}
          </Form.Watch>
        </div>
      </div>
    );
  },
};

// ── 7. Field Array ──

export const FieldArrayInvoice: Story = {
  render: () => {
    const form = useForm({
      initialValues: { items: [{ name: "", price: "" }] },
    });
    const { fields, append, remove } = useFieldArray(form, "items");
    return (
      <Form
        form={form}
        onSubmit={(values) => alert(JSON.stringify(values, null, 2))}
        className="space-y-4 max-w-md"
        aria-label="invoice"
      >
        {fields.map((field) => (
          <div key={field.id} className="flex gap-2 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium">Item</label>
              <Input {...field.getFieldProps("name")} placeholder="Service" />
            </div>
            <div className="w-24">
              <label className="text-sm font-medium">Price</label>
              <Input {...field.getFieldProps("price")} type="number" placeholder="0" />
            </div>
            <Button type="button" variant="ghost" size="sm" onClick={() => remove(field.index)}>
              ✕
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => append({ name: "", price: "" })}>
          Add item
        </Button>
        <Form.Submit>Submit invoice</Form.Submit>
      </Form>
    );
  },
};

// ── 8. Multi-Step ──

export const MultiStep: Story = {
  render: () => {
    const form = useForm({ initialValues: { name: "", email: "", card: "" } });
    return (
      <Form
        form={form}
        onSubmit={(values) => alert(JSON.stringify(values, null, 2))}
        className="max-w-sm"
        aria-label="wizard"
      >
        <Form.Steps showStepper>
          <Form.Step title="Account" fields={["name", "email"]}>
            <div className="space-y-4 mt-4">
              <Form.Field name="name" label="Name" rules={{ required: true }}>
                <Input />
              </Form.Field>
              <Form.Field name="email" label="Email" rules={{ required: true }}>
                <Input type="email" />
              </Form.Field>
            </div>
          </Form.Step>
          <Form.Step title="Payment" fields={["card"]}>
            <div className="space-y-4 mt-4">
              <Form.Field name="card" label="Card number" rules={{ required: true }}>
                <Input placeholder="4242 4242 4242 4242" />
              </Form.Field>
            </div>
          </Form.Step>
        </Form.Steps>
      </Form>
    );
  },
};

// ── 9. Error Summary ──

export const ErrorSummary: Story = {
  render: () => {
    const form = useForm({ initialValues: { email: "", name: "", phone: "" } });
    return (
      <Form form={form} className="space-y-4 max-w-sm" aria-label="error-summary">
        <Form.ErrorSummary />
        <Form.Field name="email" label="Email" rules={{ required: true }}>
          <Input />
        </Form.Field>
        <Form.Field name="name" label="Name" rules={{ required: true, minLength: 2 }}>
          <Input />
        </Form.Field>
        <Form.Field name="phone" label="Phone" rules={{ required: true }}>
          <Input />
        </Form.Field>
        <Form.Submit>Submit</Form.Submit>
      </Form>
    );
  },
};

// ── 10. Field Group ──

export const FieldGroup: Story = {
  render: () => {
    const form = useForm({
      initialValues: { street: "", city: "", zip: "" },
    });
    return (
      <Form
        form={form}
        onSubmit={(values) => alert(JSON.stringify(values, null, 2))}
        className="space-y-4 max-w-sm"
        aria-label="group"
      >
        <Form.Group legend="Shipping address" description="Where should we deliver?">
          <Form.Field name="street" label="Street" rules={{ required: true }}>
            <Input placeholder="123 Main St" />
          </Form.Field>
          <Form.Field name="city" label="City" rules={{ required: true }}>
            <Input placeholder="New York" />
          </Form.Field>
          <Form.Field name="zip" label="Zip" rules={{ required: true }}>
            <Input placeholder="10001" />
          </Form.Field>
        </Form.Group>
        <Form.Submit>Save address</Form.Submit>
      </Form>
    );
  },
};

// ── 11. Character Counter ──

export const CharacterCounter: Story = {
  render: () => {
    const form = useForm({ initialValues: { bio: "" } });
    return (
      <Form form={form} className="space-y-4 max-w-sm" aria-label="counter">
        <Form.Field
          name="bio"
          label="Bio"
          rules={{ maxLength: 160 }}
          showCounter
        >
          <Input placeholder="Tell us about yourself..." />
        </Form.Field>
        <Form.Submit>Save</Form.Submit>
      </Form>
    );
  },
};

// ── 12. Debug Panel ──

export const DebugPanel: Story = {
  render: () => {
    const form = useForm({ initialValues: { name: "", agree: false } });
    return (
      <Form form={form} className="space-y-4 max-w-sm" aria-label="debug">
        <Form.Field name="name" label="Name" rules={{ required: true }}>
          <Input />
        </Form.Field>
        <Form.Field name="agree" label="I agree to terms">
          {(field) => (
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              aria-label="Agree"
            />
          )}
        </Form.Field>
        <Form.Submit>Submit</Form.Submit>
        <Form.Debug />
      </Form>
    );
  },
};

// ── 13. Reset Confirm ──

export const ResetConfirm: Story = {
  render: () => {
    const form = useForm({ initialValues: { name: "", email: "" } });
    return (
      <Form form={form} className="space-y-4 max-w-sm" aria-label="reset">
        <Form.Field name="name" label="Name">
          <Input placeholder="John" />
        </Form.Field>
        <Form.Field name="email" label="Email">
          <Input placeholder="john@example.com" />
        </Form.Field>
        <div className="flex gap-2">
          <Form.Submit>Save</Form.Submit>
          <Form.Reset confirm="Are you sure? All changes will be lost.">
            Reset
          </Form.Reset>
        </div>
      </Form>
    );
  },
};

// ── 14. Transform Values ──

export const TransformValues: Story = {
  render: () => {
    const form = useForm({
      initialValues: { username: "", email: "" },
      transform: {
        email: (v: string) => v.trim().toLowerCase(),
      },
    });
    return (
      <Form
        form={form}
        onSubmit={(values) => alert(JSON.stringify(values, null, 2))}
        className="space-y-4 max-w-sm"
        aria-label="transform"
      >
        <Form.Field
          name="username"
          label="Username"
          transform={(v: string) => v.toLowerCase().replace(/\s/g, "")}
        >
          <Input placeholder="johndoe" />
        </Form.Field>
        <Form.Field name="email" label="Email">
          <Input placeholder="JOHN@EXAMPLE.COM" />
        </Form.Field>
        <Form.Submit>Submit</Form.Submit>
        <p className="text-xs text-slate-500">
          Username auto-lowercases. Email trims + lowercases on submit.
        </p>
      </Form>
    );
  },
};

// ── 15. Custom Error Rendering ──

export const CustomErrorRendering: Story = {
  render: () => {
    const form = useForm({ initialValues: { email: "", password: "" } });
    return (
      <Form
        form={form}
        onSubmit={async () => ({ formError: "Invalid credentials" })}
        className="space-y-4 max-w-sm"
        aria-label="custom-errors"
      >
        <Form.Error>
          {(error) => (
            <Alert variant="error" title="Login failed" dismissible>
              {error}
            </Alert>
          )}
        </Form.Error>
        <Form.Field name="email" label="Email" rules={{ required: true }} hideError>
          <Input />
        </Form.Field>
        <Form.Message name="email" className="text-orange-600" />
        <Form.Field name="password" label="Password" rules={{ required: true }} hideError>
          <Input type="password" />
        </Form.Field>
        <Form.Message name="password" className="text-orange-600" />
        <Form.Submit>Login</Form.Submit>
      </Form>
    );
  },
};

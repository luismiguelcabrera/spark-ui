import type { Meta, StoryObj } from "@storybook/react-vite";
import { Form } from "./form";
import { useForm } from "../../hooks/use-form";
import { Input } from "./input";
import { Select } from "./select";
import { Switch } from "./switch";
import { Button } from "./button";
import { useFormSteps } from "./form-steps-context";

const meta = {
  title: "Forms/Form",
  component: Form,
  tags: ["autodocs"],
  argTypes: {
    focusFirstError: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <div className="max-w-md mx-auto p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── 1. BasicLogin ──

function BasicLoginExample() {
  const form = useForm({
    initialValues: { email: "", password: "" },
  });

  return (
    <Form
      form={form}
      onSubmit={(values) => {
        alert(`Login: ${values.email}`);
      }}
      className="flex flex-col gap-4"
    >
      <Form.Field
        name="email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        rules={{ required: true }}
      />
      <Form.Field
        name="password"
        label="Password"
        type="password"
        placeholder="Enter your password"
        rules={{ required: true }}
      />
      <Form.Submit>Log in</Form.Submit>
    </Form>
  );
}

export const BasicLogin: Story = {
  render: () => <BasicLoginExample />,
};

// ── 2. WithValidation ──

function WithValidationExample() {
  const form = useForm({
    initialValues: { name: "", email: "", age: "" },
  });

  return (
    <Form
      form={form}
      onSubmit={(values) => {
        alert(JSON.stringify(values, null, 2));
      }}
      className="flex flex-col gap-4"
    >
      <Form.Field
        name="name"
        label="Name"
        placeholder="John Doe"
        rules={{
          required: "Name is required",
          minLength: { value: 2, message: "Name must be at least 2 characters" },
        }}
      />
      <Form.Field
        name="email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        rules={{
          required: "Email is required",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Please enter a valid email address",
          },
        }}
      />
      <Form.Field
        name="age"
        label="Age"
        type="number"
        placeholder="25"
        rules={{
          required: "Age is required",
          min: { value: 18, message: "You must be at least 18 years old" },
          max: { value: 120, message: "Age must be 120 or less" },
        }}
      />
      <Form.Submit>Register</Form.Submit>
    </Form>
  );
}

export const WithValidation: Story = {
  render: () => <WithValidationExample />,
};

// ── 3. ServerErrors ──

function ServerErrorsExample() {
  const form = useForm({
    initialValues: { username: "", email: "" },
  });

  return (
    <Form
      form={form}
      onSubmit={async (values) => {
        // Simulate a server response with errors
        await new Promise((r) => setTimeout(r, 800));

        if (values.username === "admin") {
          return {
            fieldErrors: { username: "This username is already taken" },
          };
        }

        return {
          fieldErrors: { email: "An account with this email already exists" },
          formError: "Registration failed. Please fix the errors below.",
        };
      }}
      className="flex flex-col gap-4"
    >
      <Form.Error />
      <Form.Field
        name="username"
        label="Username"
        placeholder='Try "admin"'
        rules={{ required: true }}
      />
      <Form.Field
        name="email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        rules={{ required: true }}
      />
      <Form.Submit>Create Account</Form.Submit>
    </Form>
  );
}

export const ServerErrors: Story = {
  render: () => <ServerErrorsExample />,
};

// ── 4. RenderProp ──

function RenderPropExample() {
  const form = useForm({
    initialValues: { name: "", notifications: false },
  });

  return (
    <Form
      form={form}
      onSubmit={(values) => {
        alert(JSON.stringify(values, null, 2));
      }}
      className="flex flex-col gap-4"
    >
      <Form.Field name="name" label="Name" placeholder="Your name" rules={{ required: true }} />
      <Form.Field name="notifications" label="Enable Notifications">
        {(field) => (
          <Switch
            checked={field.value}
            onCheckedChange={(checked) => field.onChange(checked)}
          />
        )}
      </Form.Field>
      <Form.Watch name="notifications">
        {(enabled) =>
          enabled && (
            <p className="text-sm text-green-700 bg-green-50 rounded-lg p-3">
              You will receive email notifications for important updates.
            </p>
          )
        }
      </Form.Watch>
      <Form.Submit>Save Preferences</Form.Submit>
    </Form>
  );
}

export const RenderProp: Story = {
  render: () => <RenderPropExample />,
};

// ── 5. ConditionalFields ──

function ConditionalFieldsExample() {
  const form = useForm({
    initialValues: { contactMethod: "", email: "", phone: "", address: "" },
  });

  return (
    <Form
      form={form}
      onSubmit={(values) => {
        alert(JSON.stringify(values, null, 2));
      }}
      className="flex flex-col gap-4"
    >
      <Form.Field name="contactMethod" label="Preferred Contact Method">
        <Select aria-label="Contact method">
          <option value="">Select a method...</option>
          <option value="email">Email</option>
          <option value="phone">Phone</option>
          <option value="mail">Mail</option>
        </Select>
      </Form.Field>

      <Form.If name="contactMethod" is="email">
        <Form.Field
          name="email"
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          rules={{ required: "Email is required when contact method is email" }}
        />
      </Form.If>

      <Form.If name="contactMethod" is="phone">
        <Form.Field
          name="phone"
          label="Phone Number"
          type="tel"
          placeholder="(555) 123-4567"
          rules={{ required: "Phone is required when contact method is phone" }}
        />
      </Form.If>

      <Form.If name="contactMethod" is="mail">
        <Form.Field
          name="address"
          label="Mailing Address"
          placeholder="123 Main St, City, State"
          rules={{ required: "Address is required when contact method is mail" }}
        />
      </Form.If>

      <Form.Submit>Submit</Form.Submit>
    </Form>
  );
}

export const ConditionalFields: Story = {
  render: () => <ConditionalFieldsExample />,
};

// ── 6. WatchPreview ──

function WatchPreviewExample() {
  const form = useForm({
    initialValues: { firstName: "", lastName: "", role: "developer" },
  });

  return (
    <Form
      form={form}
      onSubmit={(values) => {
        alert(JSON.stringify(values, null, 2));
      }}
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col gap-4">
        <Form.Field name="firstName" label="First Name" placeholder="Jane" />
        <Form.Field name="lastName" label="Last Name" placeholder="Doe" />
        <Form.Field name="role" label="Role">
          <Select aria-label="Role">
            <option value="developer">Developer</option>
            <option value="designer">Designer</option>
            <option value="manager">Manager</option>
          </Select>
        </Form.Field>
      </div>

      <Form.Watch>
        {(values) => (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Live Preview
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                {(values.firstName?.[0] ?? "").toUpperCase()}
                {(values.lastName?.[0] ?? "").toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-slate-800">
                  {values.firstName || "First"} {values.lastName || "Last"}
                </p>
                <p className="text-xs text-slate-500 capitalize">{values.role}</p>
              </div>
            </div>
          </div>
        )}
      </Form.Watch>

      <Form.Submit>Save Profile</Form.Submit>
    </Form>
  );
}

export const WatchPreview: Story = {
  render: () => <WatchPreviewExample />,
};

// ── 7. FieldArrayInvoice ──

function FieldArrayInvoiceExample() {
  const form = useForm({
    initialValues: {
      invoiceNumber: "",
      items: [{ name: "", price: "" }],
    },
  });

  return (
    <Form
      form={form}
      onSubmit={(values) => {
        alert(JSON.stringify(values, null, 2));
      }}
      className="flex flex-col gap-4"
    >
      <Form.Field
        name="invoiceNumber"
        label="Invoice Number"
        placeholder="INV-001"
        rules={{ required: true }}
      />

      <Form.FieldArray name="items">
        {({ fields, append, remove }) => (
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-slate-700">Line Items</p>
            {fields.map((field) => (
              <div key={field.id} className="flex items-end gap-2">
                <div className="flex-1">
                  <label className="text-xs text-slate-600 mb-1 block">Item Name</label>
                  <Input
                    placeholder="Item name"
                    {...field.getFieldProps("name")}
                    aria-label={`Item ${field.index + 1} name`}
                  />
                </div>
                <div className="w-28">
                  <label className="text-xs text-slate-600 mb-1 block">Price</label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    {...field.getFieldProps("price")}
                    aria-label={`Item ${field.index + 1} price`}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(field.index)}
                  disabled={fields.length <= 1}
                  aria-label={`Remove item ${field.index + 1}`}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => append({ name: "", price: "" })}
              className="self-start"
            >
              + Add Item
            </Button>
          </div>
        )}
      </Form.FieldArray>

      <Form.Watch name="items">
        {(items: Array<{ name: string; price: string }>) => {
          const total = (items ?? []).reduce(
            (sum, item) => sum + (parseFloat(item.price) || 0),
            0,
          );
          return (
            <div className="flex justify-between text-sm font-semibold border-t pt-3">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          );
        }}
      </Form.Watch>

      <Form.Submit>Send Invoice</Form.Submit>
    </Form>
  );
}

export const FieldArrayInvoice: Story = {
  render: () => <FieldArrayInvoiceExample />,
};

// ── 8. MultiStep ──

function StepNavigation() {
  const { isFirst, isLast, next, prev, currentStep, totalSteps } = useFormSteps();

  return (
    <div className="flex items-center justify-between pt-4 border-t border-slate-200 mt-4">
      <Button variant="outline" size="sm" onClick={prev} disabled={isFirst}>
        Back
      </Button>
      <span className="text-xs text-slate-500">
        Step {currentStep + 1} of {totalSteps}
      </span>
      {isLast ? (
        <Form.Submit>Complete</Form.Submit>
      ) : (
        <Button size="sm" onClick={() => void next()}>
          Next
        </Button>
      )}
    </div>
  );
}

function MultiStepExample() {
  const form = useForm({
    initialValues: { firstName: "", lastName: "", email: "", company: "" },
  });

  return (
    <Form
      form={form}
      onSubmit={(values) => {
        alert(JSON.stringify(values, null, 2));
      }}
      className="flex flex-col gap-4"
    >
      <Form.Steps showStepper>
        <Form.Step title="Personal Info" fields={["firstName", "lastName"]}>
          <div className="flex flex-col gap-4">
            <Form.Field
              name="firstName"
              label="First Name"
              placeholder="Jane"
              rules={{ required: "First name is required" }}
            />
            <Form.Field
              name="lastName"
              label="Last Name"
              placeholder="Doe"
              rules={{ required: "Last name is required" }}
            />
          </div>
          <StepNavigation />
        </Form.Step>

        <Form.Step title="Work Info" fields={["email", "company"]}>
          <div className="flex flex-col gap-4">
            <Form.Field
              name="email"
              label="Work Email"
              type="email"
              placeholder="jane@company.com"
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email",
                },
              }}
            />
            <Form.Field
              name="company"
              label="Company"
              placeholder="Acme Corp"
              rules={{ required: "Company is required" }}
            />
          </div>
          <StepNavigation />
        </Form.Step>
      </Form.Steps>
    </Form>
  );
}

export const MultiStep: Story = {
  render: () => <MultiStepExample />,
};

// ── 9. ErrorSummary ──

function ErrorSummaryExample() {
  const form = useForm({
    initialValues: { name: "", email: "", phone: "" },
  });

  return (
    <Form
      form={form}
      focusFirstError
      onSubmit={(values) => {
        alert(JSON.stringify(values, null, 2));
      }}
      className="flex flex-col gap-4"
    >
      <Form.ErrorSummary />
      <Form.Field
        name="name"
        label="Full Name"
        placeholder="Jane Doe"
        rules={{ required: "Full name is required" }}
      />
      <Form.Field
        name="email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        rules={{
          required: "Email address is required",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Email format is invalid",
          },
        }}
      />
      <Form.Field
        name="phone"
        label="Phone"
        type="tel"
        placeholder="(555) 123-4567"
        rules={{ required: "Phone number is required" }}
      />
      <p className="text-xs text-slate-500">
        Submit with empty fields to see the error summary appear above.
      </p>
      <Form.Submit>Submit</Form.Submit>
    </Form>
  );
}

export const ErrorSummary: Story = {
  render: () => <ErrorSummaryExample />,
};

// ── 10. FieldGroup ──

function FieldGroupExample() {
  const form = useForm({
    initialValues: { name: "", street: "", city: "", zip: "" },
  });

  return (
    <Form
      form={form}
      onSubmit={(values) => {
        alert(JSON.stringify(values, null, 2));
      }}
      className="flex flex-col gap-4"
    >
      <Form.Field
        name="name"
        label="Full Name"
        placeholder="Jane Doe"
        rules={{ required: true }}
      />

      <Form.Group legend="Address" description="Enter your shipping address">
        <Form.Field
          name="street"
          label="Street"
          placeholder="123 Main St"
          rules={{ required: "Street is required" }}
        />
        <div className="flex gap-3">
          <Form.Field
            name="city"
            label="City"
            placeholder="San Francisco"
            rules={{ required: "City is required" }}
            className="flex-1"
          />
          <Form.Field
            name="zip"
            label="ZIP Code"
            placeholder="94102"
            rules={{
              required: "ZIP is required",
              pattern: {
                value: /^\d{5}(-\d{4})?$/,
                message: "Enter a valid ZIP code",
              },
            }}
            className="w-32"
          />
        </div>
      </Form.Group>

      <Form.Submit>Save Address</Form.Submit>
    </Form>
  );
}

export const FieldGroup: Story = {
  render: () => <FieldGroupExample />,
};

// ── 11. CharacterCounter ──

function CharacterCounterExample() {
  const form = useForm({
    initialValues: { bio: "", username: "" },
  });

  return (
    <Form
      form={form}
      onSubmit={(values) => {
        alert(JSON.stringify(values, null, 2));
      }}
      className="flex flex-col gap-4"
    >
      <Form.Field
        name="username"
        label="Username"
        placeholder="jane_doe"
        showCounter
        rules={{
          required: "Username is required",
          minLength: { value: 3, message: "At least 3 characters" },
          maxLength: { value: 20, message: "At most 20 characters" },
        }}
      />
      <Form.Field
        name="bio"
        label="Bio"
        placeholder="Tell us about yourself..."
        showCounter
        rules={{
          maxLength: { value: 160, message: "Bio must be 160 characters or fewer" },
        }}
      />
      <Form.Submit>Update Profile</Form.Submit>
    </Form>
  );
}

export const CharacterCounter: Story = {
  render: () => <CharacterCounterExample />,
};

// ── 12. DebugPanel ──

function DebugPanelExample() {
  const form = useForm({
    initialValues: { email: "", password: "", remember: false },
  });

  return (
    <Form
      form={form}
      onSubmit={(values) => {
        alert(JSON.stringify(values, null, 2));
      }}
      className="flex flex-col gap-4"
    >
      <Form.Field
        name="email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        rules={{ required: true }}
      />
      <Form.Field
        name="password"
        label="Password"
        type="password"
        rules={{ required: true, minLength: 8 }}
      />
      <Form.Field name="remember" label="Remember me">
        {(field) => (
          <Switch
            checked={field.value}
            onCheckedChange={(checked) => field.onChange(checked)}
          />
        )}
      </Form.Field>
      <div className="flex gap-2">
        <Form.Submit>Log in</Form.Submit>
        <Form.Reset />
      </div>
      <Form.Debug />
    </Form>
  );
}

export const DebugPanel: Story = {
  render: () => <DebugPanelExample />,
};

// ── 13. ResetConfirm ──

function ResetConfirmExample() {
  const form = useForm({
    initialValues: { title: "", description: "" },
  });

  return (
    <Form
      form={form}
      onSubmit={(values) => {
        alert(JSON.stringify(values, null, 2));
      }}
      className="flex flex-col gap-4"
    >
      <Form.Field
        name="title"
        label="Title"
        placeholder="My awesome post"
        rules={{ required: true }}
      />
      <Form.Field
        name="description"
        label="Description"
        placeholder="Write a description..."
      />
      <div className="flex gap-2">
        <Form.Submit>Publish</Form.Submit>
        <Form.Reset confirm="You have unsaved changes. Are you sure you want to reset?" />
      </div>
      <p className="text-xs text-slate-500">
        Fill in the fields, then click Reset to see the confirmation dialog.
      </p>
    </Form>
  );
}

export const ResetConfirm: Story = {
  render: () => <ResetConfirmExample />,
};

// ── 14. TransformValues ──

function TransformValuesExample() {
  const form = useForm({
    initialValues: { email: "", tag: "" },
  });

  return (
    <Form
      form={form}
      onSubmit={(values) => {
        alert(
          `Submitted (transforms applied on store):\n${JSON.stringify(values, null, 2)}`,
        );
      }}
      className="flex flex-col gap-4"
    >
      <Form.Field
        name="email"
        label="Email"
        placeholder="YourEmail@Example.COM"
        description="Automatically lowercased and trimmed as you type"
        transform={(value: string) => value.toLowerCase().trim()}
        rules={{ required: true }}
      />
      <Form.Field
        name="tag"
        label="Tag"
        placeholder="  My Tag  "
        description="Whitespace is trimmed as you type"
        transform={(value: string) => value.trim()}
        rules={{ required: true }}
      />
      <Form.Watch>
        {(values) => (
          <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-xs font-mono">
            <p className="font-semibold text-slate-500 mb-1">Stored values:</p>
            <pre>{JSON.stringify(values, null, 2)}</pre>
          </div>
        )}
      </Form.Watch>
      <Form.Submit>Submit</Form.Submit>
    </Form>
  );
}

export const TransformValues: Story = {
  render: () => <TransformValuesExample />,
};

// ── 15. CustomErrorRendering ──

function CustomErrorRenderingExample() {
  const form = useForm({
    initialValues: { username: "", email: "" },
  });

  return (
    <Form
      form={form}
      onSubmit={async () => {
        await new Promise((r) => setTimeout(r, 300));
        return { formError: "Unable to create account. The server is unavailable." };
      }}
      className="flex flex-col gap-4"
    >
      {/* Form-level error with render prop */}
      <Form.Error>
        {(error) => (
          <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3">
            <span className="text-red-600 text-lg leading-none mt-0.5">!</span>
            <div>
              <p className="text-sm font-semibold text-red-800">Server Error</p>
              <p className="text-xs text-red-700 mt-0.5">{error}</p>
            </div>
          </div>
        )}
      </Form.Error>

      {/* Field with hideError + custom Form.Message */}
      <div className="flex flex-col gap-1">
        <Form.Field
          name="username"
          label="Username"
          placeholder="Choose a username"
          hideError
          rules={{
            required: "Username cannot be empty",
            minLength: { value: 3, message: "Username needs at least 3 characters" },
          }}
        />
        <Form.Message
          name="username"
          className="text-xs text-orange-600 font-medium bg-orange-50 rounded px-2 py-1"
        />
      </div>

      <Form.Field
        name="email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        rules={{
          required: "Email is required",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Please provide a valid email",
          },
        }}
      />

      <Form.Submit>Create Account</Form.Submit>
    </Form>
  );
}

export const CustomErrorRendering: Story = {
  render: () => <CustomErrorRenderingExample />,
};

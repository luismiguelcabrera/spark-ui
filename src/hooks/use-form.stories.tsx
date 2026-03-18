import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { useForm } from "./use-form";
import { FieldLabel } from "../components/forms/field-label";
import { FieldDescription } from "../components/forms/field-description";
import { FieldError } from "../components/forms/field-error";

// Wrapper component so Storybook has something to bind to
function FormDemo() {
  return <div />;
}

const meta = {
  title: "Hooks/useForm",
  component: FormDemo,
  tags: ["autodocs"],
} satisfies Meta<typeof FormDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Login Form ──

function LoginFormExample() {
  const form = useForm({
    initialValues: { email: "", password: "" },
    onSubmit: async (values) => {
      await new Promise((r) => setTimeout(r, 1000));
      alert(`Logged in as ${values.email}`);
    },
  });

  const emailProps = form.register("email", {
    required: "Email is required",
    pattern: { value: /^.+@.+\..+$/, message: "Invalid email format" },
  });

  const passwordProps = form.register("password", {
    required: "Password is required",
    minLength: { value: 8, message: "Password must be at least 8 characters" },
  });

  return (
    <form
      onSubmit={form.handleSubmit}
      className="flex flex-col gap-4 max-w-sm"
    >
      <div>
        <FieldLabel htmlFor="email" required>
          Email
        </FieldLabel>
        <input
          id="email"
          type="email"
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          {...emailProps}
        />
        <FieldError>{form.errors.email}</FieldError>
      </div>

      <div>
        <FieldLabel htmlFor="password" required>
          Password
        </FieldLabel>
        <input
          id="password"
          type="password"
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          {...passwordProps}
        />
        <FieldError>{form.errors.password}</FieldError>
      </div>

      <button
        type="submit"
        disabled={form.isSubmitting}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {form.isSubmitting ? "Logging in..." : "Log in"}
      </button>

      <pre className="mt-2 rounded bg-gray-50 p-3 text-xs">
        {JSON.stringify(
          { values: form.values, errors: form.errors, touched: form.touched, dirty: form.dirty },
          null,
          2,
        )}
      </pre>
    </form>
  );
}

export const LoginForm: Story = {
  render: () => <LoginFormExample />,
};

// ── Registration Form ──

function RegistrationFormExample() {
  const form = useForm({
    initialValues: { name: "", email: "", password: "", confirmPassword: "", age: 0 },
    validate: (values) => {
      const errors: Record<string, string> = {};
      if (values.password !== values.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }
      return errors;
    },
    onSubmit: async (values) => {
      await new Promise((r) => setTimeout(r, 500));
      alert(`Registered: ${values.name}`);
    },
  });

  return (
    <form
      onSubmit={form.handleSubmit}
      className="flex flex-col gap-4 max-w-sm"
    >
      <div>
        <FieldLabel htmlFor="reg-name" required>Name</FieldLabel>
        <input
          id="reg-name"
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          {...form.register("name", { required: "Name is required" })}
        />
        <FieldError>{form.errors.name}</FieldError>
      </div>

      <div>
        <FieldLabel htmlFor="reg-email" required>Email</FieldLabel>
        <input
          id="reg-email"
          type="email"
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          {...form.register("email", {
            required: "Email is required",
            pattern: { value: /^.+@.+\..+$/, message: "Invalid email" },
          })}
        />
        <FieldError>{form.errors.email}</FieldError>
      </div>

      <div>
        <FieldLabel htmlFor="reg-age">Age</FieldLabel>
        <FieldDescription>Must be 18 or older</FieldDescription>
        <input
          id="reg-age"
          type="number"
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          {...form.register("age", {
            min: { value: 18, message: "Must be at least 18" },
            max: { value: 120, message: "Must be at most 120" },
          })}
        />
        <FieldError>{form.errors.age}</FieldError>
      </div>

      <div>
        <FieldLabel htmlFor="reg-password" required>Password</FieldLabel>
        <input
          id="reg-password"
          type="password"
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          {...form.register("password", {
            required: "Password is required",
            minLength: { value: 8, message: "At least 8 characters" },
          })}
        />
        <FieldError>{form.errors.password}</FieldError>
      </div>

      <div>
        <FieldLabel htmlFor="reg-confirm" required>Confirm Password</FieldLabel>
        <input
          id="reg-confirm"
          type="password"
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          {...form.register("confirmPassword", { required: "Please confirm" })}
        />
        <FieldError>{form.errors.confirmPassword}</FieldError>
      </div>

      <button
        type="submit"
        disabled={form.isSubmitting}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {form.isSubmitting ? "Registering..." : "Register"}
      </button>
    </form>
  );
}

export const RegistrationForm: Story = {
  render: () => <RegistrationFormExample />,
};

// ── Async Validation ──

function AsyncValidationExample() {
  const [log, setLog] = useState<string[]>([]);

  const form = useForm({
    initialValues: { username: "" },
    onSubmit: async (values) => {
      setLog((prev) => [...prev, `Submitted: ${values.username}`]);
    },
  });

  return (
    <form onSubmit={form.handleSubmit} className="flex flex-col gap-4 max-w-sm">
      <div>
        <FieldLabel htmlFor="async-username" required>Username</FieldLabel>
        <FieldDescription>Try &quot;admin&quot; or &quot;root&quot; (taken)</FieldDescription>
        <input
          id="async-username"
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          {...form.register("username", {
            required: "Username is required",
            minLength: { value: 3, message: "At least 3 characters" },
            validate: async (val: string) => {
              await new Promise((r) => setTimeout(r, 500));
              const taken = ["admin", "root", "test"];
              return taken.includes(val.toLowerCase())
                ? "Username is already taken"
                : true;
            },
          })}
        />
        <FieldError>{form.errors.username}</FieldError>
      </div>

      <button
        type="submit"
        disabled={form.isSubmitting}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        Check & Submit
      </button>

      {log.length > 0 && (
        <div className="rounded bg-green-50 p-3 text-xs text-green-800">
          {log.map((entry, i) => (
            <div key={i}>{entry}</div>
          ))}
        </div>
      )}
    </form>
  );
}

export const AsyncValidation: Story = {
  render: () => <AsyncValidationExample />,
};

// ── Gallery: Full integration with field primitives ──

function GalleryExample() {
  const form = useForm({
    initialValues: { fullName: "", email: "", bio: "" },
    validateOnChange: true,
    onSubmit: (values) => alert(JSON.stringify(values, null, 2)),
  });

  return (
    <form onSubmit={form.handleSubmit} className="flex flex-col gap-5 max-w-md">
      <div>
        <FieldLabel htmlFor="gallery-name" required>Full Name</FieldLabel>
        <FieldDescription>As it appears on your ID</FieldDescription>
        <input
          id="gallery-name"
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          {...form.register("fullName", { required: "Name is required" })}
        />
        <FieldError>{form.errors.fullName}</FieldError>
      </div>

      <div>
        <FieldLabel htmlFor="gallery-email" required>Email</FieldLabel>
        <input
          id="gallery-email"
          type="email"
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          {...form.register("email", {
            required: "Email required",
            pattern: { value: /^.+@.+\..+$/, message: "Invalid email" },
          })}
        />
        <FieldError>{form.errors.email}</FieldError>
      </div>

      <div>
        <FieldLabel htmlFor="gallery-bio">Bio</FieldLabel>
        <FieldDescription>Max 255 characters</FieldDescription>
        <textarea
          id="gallery-bio"
          rows={3}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          {...form.register("bio", {
            maxLength: { value: 255, message: "Max 255 characters" },
          })}
        />
        <FieldError>{form.errors.bio}</FieldError>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Submit
        </button>
        <button
          type="button"
          onClick={() => form.reset()}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Reset
        </button>
      </div>

      <div className="flex gap-4 text-xs text-gray-500">
        <span>dirty: {String(form.dirty)}</span>
        <span>valid: {String(form.isValid)}</span>
      </div>
    </form>
  );
}

export const Gallery: Story = {
  render: () => <GalleryExample />,
};

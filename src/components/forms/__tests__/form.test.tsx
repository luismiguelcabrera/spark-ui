import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Form } from "../form";
import { FormField } from "../form-field";
import { FormMessage } from "../form-message";
import { useForm } from "../../../hooks/use-form";
import { zodResolver } from "../../../lib/resolvers";
import { Input } from "../input";
import { Switch } from "../switch";
import { Alert } from "../../feedback/alert";
import { LocaleContext } from "../../../lib/locale";
import { defaultMessages } from "../../../lib/default-messages";

// ── Helpers ──

function BasicForm({
  onSubmit = vi.fn(),
}: {
  onSubmit?: (values: { email: string; password: string }) => void;
}) {
  const form = useForm({
    initialValues: { email: "", password: "" },
  });
  return (
    <Form form={form} onSubmit={onSubmit} aria-label="login form">
      <Form.Field name="email" label="Email" rules={{ required: true }}>
        <Input placeholder="you@example.com" />
      </Form.Field>
      <Form.Field
        name="password"
        label="Password"
        rules={{ required: true, minLength: 8 }}
      >
        <Input type="password" placeholder="Password" />
      </Form.Field>
      <Form.Submit>Sign in</Form.Submit>
    </Form>
  );
}

// ── Tests ──

describe("Form (compound)", () => {
  it("renders a form element with noValidate", () => {
    render(<BasicForm />);
    expect(screen.getByRole("form")).toBeInTheDocument();
    expect(screen.getByRole("form")).toHaveAttribute("novalidate");
  });

  it("has displayName", () => {
    expect(Form.displayName).toBe("Form");
  });

  it("renders children and labels", () => {
    render(<BasicForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
  });

  it("auto-binds value and onChange to child Input", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<BasicForm onSubmit={onSubmit} />);

    await user.type(screen.getByPlaceholderText("you@example.com"), "a@b.com");
    await user.type(screen.getByPlaceholderText("Password"), "12345678");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        email: "a@b.com",
        password: "12345678",
      });
    });
  });

  it("shows validation errors with shorthand rules", async () => {
    const user = userEvent.setup();
    render(<BasicForm />);

    // Submit empty
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    await waitFor(() => {
      expect(screen.getByText("Email is required")).toBeInTheDocument();
      expect(screen.getByText("Password is required")).toBeInTheDocument();
    });
  });

  it("shows minLength error", async () => {
    const user = userEvent.setup();
    render(<BasicForm />);

    await user.type(screen.getByPlaceholderText("you@example.com"), "a@b.com");
    await user.type(screen.getByPlaceholderText("Password"), "short");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    await waitFor(() => {
      expect(
        screen.getByText("Must be at least 8 characters"),
      ).toBeInTheDocument();
    });
  });

  it("handles server errors from onSubmit return value", async () => {
    const user = userEvent.setup();
    function ServerErrorForm() {
      const form = useForm({ initialValues: { email: "test@example.com" } });
      return (
        <Form
          form={form}
          onSubmit={async () => ({
            fieldErrors: { email: "Already taken" },
            formError: "Signup failed",
          })}
          aria-label="signup form"
        >
          <Form.Error />
          <Form.Field name="email" label="Email">
            <Input />
          </Form.Field>
          <Form.Submit>Sign up</Form.Submit>
        </Form>
      );
    }

    render(<ServerErrorForm />);
    await user.click(screen.getByRole("button", { name: "Sign up" }));

    await waitFor(() => {
      expect(screen.getByText("Signup failed")).toBeInTheDocument();
      expect(screen.getByText("Already taken")).toBeInTheDocument();
    });
  });

  it("supports render prop for non-standard components", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    function RenderPropForm() {
      const form = useForm({ initialValues: { notify: false } });
      return (
        <Form form={form} onSubmit={onSubmit} aria-label="settings form">
          <Form.Field name="notify" label="Notifications">
            {(field) => (
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                aria-label="Notifications toggle"
              />
            )}
          </Form.Field>
          <Form.Submit>Save</Form.Submit>
        </Form>
      );
    }

    render(<RenderPropForm />);

    // Toggle the switch
    const toggle = screen.getByRole("switch");
    await user.click(toggle);
    await user.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ notify: true });
    });
  });

  it("supports locale override for validation messages", async () => {
    const user = userEvent.setup();

    const esMessages = {
      ...defaultMessages,
      "form.required": "{label} es obligatorio",
    };

    function SpanishForm() {
      const form = useForm({ initialValues: { name: "" } });
      return (
        <LocaleContext.Provider
          value={{ locale: "es", messages: esMessages, isRtl: false, dir: "ltr" }}
        >
          <Form form={form} aria-label="form">
            <Form.Field name="name" label="Nombre" rules={{ required: true }}>
              <Input />
            </Form.Field>
            <Form.Submit>Enviar</Form.Submit>
          </Form>
        </LocaleContext.Provider>
      );
    }

    render(<SpanishForm />);
    await user.click(screen.getByRole("button", { name: "Enviar" }));

    await waitFor(() => {
      expect(screen.getByText("Nombre es obligatorio")).toBeInTheDocument();
    });
  });

  it("standalone FormField without Form context works (backward compat)", () => {
    render(
      <FormField label="Name" error="Required">
        <input />
      </FormField>,
    );
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Required")).toBeInTheDocument();
  });

  it("Form.Error renders nothing when no error", () => {
    function NoErrorForm() {
      const form = useForm({ initialValues: { x: "" } });
      return (
        <Form form={form} aria-label="form">
          <Form.Error data-testid="form-error" />
          <Form.Submit>Go</Form.Submit>
        </Form>
      );
    }
    render(<NoErrorForm />);
    expect(screen.queryByTestId("form-error")).not.toBeInTheDocument();
  });

  it("Form.Submit disables when disableWhenInvalid and form has errors", async () => {
    const user = userEvent.setup();

    function InvalidForm() {
      const form = useForm({ initialValues: { name: "" } });
      return (
        <Form form={form} aria-label="form">
          <Form.Field name="name" label="Name" rules={{ required: true }}>
            <Input />
          </Form.Field>
          <Form.Submit disableWhenInvalid>Go</Form.Submit>
        </Form>
      );
    }

    render(<InvalidForm />);

    // Submit once to trigger validation errors
    await user.click(screen.getByRole("button", { name: "Go" }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Go" })).toBeDisabled();
    });
  });

  it("action prop performs fetch and handles success", async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: 1 }),
    });
    vi.stubGlobal("fetch", mockFetch);

    function ActionForm() {
      const form = useForm({ initialValues: { email: "a@b.com" } });
      return (
        <Form
          form={form}
          action="/api/signup"
          onSuccess={onSuccess}
          aria-label="action form"
        >
          <Form.Field name="email" label="Email">
            <Input />
          </Form.Field>
          <Form.Submit>Go</Form.Submit>
        </Form>
      );
    }

    render(<ActionForm />);
    await user.click(screen.getByRole("button", { name: "Go" }));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/signup", expect.objectContaining({
        method: "POST",
      }));
      expect(onSuccess).toHaveBeenCalledWith({ id: 1 });
    });

    vi.unstubAllGlobals();
  });

  it("action prop handles server errors", async () => {
    const user = userEvent.setup();
    const onError = vi.fn();

    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () =>
        Promise.resolve({
          fieldErrors: { email: "Taken" },
          formError: "Failed",
        }),
    });
    vi.stubGlobal("fetch", mockFetch);

    function ActionErrorForm() {
      const form = useForm({ initialValues: { email: "a@b.com" } });
      return (
        <Form
          form={form}
          action="/api/signup"
          onError={onError}
          aria-label="action error form"
        >
          <Form.Error />
          <Form.Field name="email" label="Email">
            <Input />
          </Form.Field>
          <Form.Submit>Go</Form.Submit>
        </Form>
      );
    }

    render(<ActionErrorForm />);
    await user.click(screen.getByRole("button", { name: "Go" }));

    await waitFor(() => {
      expect(screen.getByText("Failed")).toBeInTheDocument();
      expect(screen.getByText("Taken")).toBeInTheDocument();
      expect(onError).toHaveBeenCalled();
    });

    vi.unstubAllGlobals();
  });

  it("merges className on Form root", () => {
    function ClassForm() {
      const form = useForm({ initialValues: {} });
      return (
        <Form form={form} className="my-form" aria-label="form">
          <div>content</div>
        </Form>
      );
    }
    render(<ClassForm />);
    expect(screen.getByRole("form")).toHaveClass("my-form");
  });

  // ── Form.Error render prop ──

  it("Form.Error renders plain text by default", async () => {
    const user = userEvent.setup();
    function ErrorForm() {
      const form = useForm({ initialValues: { email: "a@b.com" } });
      return (
        <Form
          form={form}
          onSubmit={async () => ({ formError: "Something went wrong" })}
          aria-label="form"
        >
          <Form.Error />
          <Form.Submit>Go</Form.Submit>
        </Form>
      );
    }
    render(<ErrorForm />);
    await user.click(screen.getByRole("button", { name: "Go" }));

    await waitFor(() => {
      const errorEl = screen.getByRole("alert");
      expect(errorEl).toHaveTextContent("Something went wrong");
      expect(errorEl.tagName).toBe("P");
    });
  });

  it("Form.Error supports render prop for custom rendering", async () => {
    const user = userEvent.setup();
    function CustomErrorForm() {
      const form = useForm({ initialValues: { email: "a@b.com" } });
      return (
        <Form
          form={form}
          onSubmit={async () => ({ formError: "Server down" })}
          aria-label="form"
        >
          <Form.Error>
            {(error) => (
              <Alert variant="error" data-testid="custom-alert">
                Custom: {error}
              </Alert>
            )}
          </Form.Error>
          <Form.Submit>Go</Form.Submit>
        </Form>
      );
    }
    render(<CustomErrorForm />);
    await user.click(screen.getByRole("button", { name: "Go" }));

    await waitFor(() => {
      const alert = screen.getByTestId("custom-alert");
      expect(alert).toHaveTextContent("Custom: Server down");
    });
  });

  // ── hideError ──

  it("Form.Field hides built-in error when hideError is set", async () => {
    const user = userEvent.setup();
    function HideErrorForm() {
      const form = useForm({ initialValues: { name: "" } });
      return (
        <Form form={form} aria-label="form">
          <Form.Field name="name" label="Name" rules={{ required: true }} hideError>
            <Input placeholder="Name" />
          </Form.Field>
          <Form.Submit>Go</Form.Submit>
        </Form>
      );
    }
    render(<HideErrorForm />);
    await user.click(screen.getByRole("button", { name: "Go" }));

    await waitFor(() => {
      // Error should NOT appear in the field
      expect(screen.queryByText("Name is required")).not.toBeInTheDocument();
    });
  });

  it("Form.Field with hideError + Form.Message shows error elsewhere", async () => {
    const user = userEvent.setup();
    function CustomErrorLocationForm() {
      const form = useForm({ initialValues: { name: "" } });
      return (
        <Form form={form} aria-label="form">
          <Form.Field name="name" label="Name" rules={{ required: true }} hideError>
            <Input placeholder="Name" />
          </Form.Field>
          <div data-testid="custom-error-zone">
            <Form.Message name="name" />
          </div>
          <Form.Submit>Go</Form.Submit>
        </Form>
      );
    }
    render(<CustomErrorLocationForm />);
    await user.click(screen.getByRole("button", { name: "Go" }));

    await waitFor(() => {
      const zone = screen.getByTestId("custom-error-zone");
      expect(zone).toHaveTextContent("Name is required");
    });
  });

  it("Form.Field with hideError + render prop gives error in field props", async () => {
    const user = userEvent.setup();
    function RenderPropErrorForm() {
      const form = useForm({ initialValues: { email: "" } });
      return (
        <Form form={form} aria-label="form">
          <Form.Field name="email" label="Email" rules={{ required: true }} hideError>
            {(field) => (
              <>
                <Input value={field.value} onChange={field.onChange} placeholder="Email" />
                {field.error && (
                  <span data-testid="my-error" className="text-orange-500">
                    {field.error}
                  </span>
                )}
              </>
            )}
          </Form.Field>
          <Form.Submit>Go</Form.Submit>
        </Form>
      );
    }
    render(<RenderPropErrorForm />);
    await user.click(screen.getByRole("button", { name: "Go" }));

    await waitFor(() => {
      const customError = screen.getByTestId("my-error");
      expect(customError).toHaveTextContent("Email is required");
      expect(customError).toHaveClass("text-orange-500");
    });
  });

  // ── Resolver / schema validation ──

  it("supports resolver for schema-based validation", async () => {
    const user = userEvent.setup();

    // Mock a zod-like schema
    const mockSchema = {
      safeParse: (data: { email: string; age: string }) => {
        const issues = [];
        if (!data.email.includes("@")) {
          issues.push({ path: ["email"], message: "Invalid email" });
        }
        if (!data.age) {
          issues.push({ path: ["age"], message: "Age required" });
        }
        return issues.length > 0
          ? { success: false, error: { issues } }
          : { success: true };
      },
    };

    function ResolverForm() {
      const form = useForm({
        initialValues: { email: "bad", age: "" },
        resolver: zodResolver(mockSchema),
      });
      return (
        <Form form={form} aria-label="form">
          <Form.Field name="email" label="Email">
            <Input placeholder="Email" />
          </Form.Field>
          <Form.Field name="age" label="Age">
            <Input placeholder="Age" />
          </Form.Field>
          <Form.Submit>Go</Form.Submit>
        </Form>
      );
    }

    render(<ResolverForm />);
    await user.click(screen.getByRole("button", { name: "Go" }));

    await waitFor(() => {
      expect(screen.getByText("Invalid email")).toBeInTheDocument();
      expect(screen.getByText("Age required")).toBeInTheDocument();
    });
  });

  it("resolver errors clear when values become valid", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    const mockSchema = {
      safeParse: (data: { name: string }) => {
        if (!data.name) {
          return { success: false, error: { issues: [{ path: ["name"], message: "Required" }] } };
        }
        return { success: true };
      },
    };

    function ClearingForm() {
      const form = useForm({
        initialValues: { name: "" },
        resolver: zodResolver(mockSchema),
      });
      return (
        <Form form={form} onSubmit={onSubmit} aria-label="form">
          <Form.Field name="name" label="Name">
            <Input placeholder="Name" />
          </Form.Field>
          <Form.Submit>Go</Form.Submit>
        </Form>
      );
    }

    render(<ClearingForm />);
    await user.click(screen.getByRole("button", { name: "Go" }));

    await waitFor(() => {
      expect(screen.getByText("Required")).toBeInTheDocument();
    });

    // Fix the value and resubmit
    await user.type(screen.getByPlaceholderText("Name"), "John");
    await user.click(screen.getByRole("button", { name: "Go" }));

    await waitFor(() => {
      expect(screen.queryByText("Required")).not.toBeInTheDocument();
      expect(onSubmit).toHaveBeenCalledWith({ name: "John" });
    });
  });

  it("field-level rules take priority over resolver for same field", async () => {
    const user = userEvent.setup();

    const mockSchema = {
      safeParse: (data: { name: string }) => {
        if (!data.name) {
          return { success: false, error: { issues: [{ path: ["name"], message: "Schema says required" }] } };
        }
        return { success: true };
      },
    };

    function PriorityForm() {
      const form = useForm({
        initialValues: { name: "" },
        resolver: zodResolver(mockSchema),
      });
      return (
        <Form form={form} aria-label="form">
          <Form.Field name="name" label="Name" rules={{ required: "Field says required" }}>
            <Input />
          </Form.Field>
          <Form.Submit>Go</Form.Submit>
        </Form>
      );
    }

    render(<PriorityForm />);
    await user.click(screen.getByRole("button", { name: "Go" }));

    await waitFor(() => {
      // Field-level rule should win since it's checked first
      expect(screen.getByText("Field says required")).toBeInTheDocument();
      expect(screen.queryByText("Schema says required")).not.toBeInTheDocument();
    });
  });
});

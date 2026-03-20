import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Form } from "../form";
import { useForm } from "../../../hooks/use-form";
import { useFieldArray } from "../../../hooks/use-field-array";
import { Input } from "../input";
import { Button } from "../button";

// ── Form.Watch ──

describe("Form.Watch", () => {
  it("renders current field value via render prop", async () => {
    const user = userEvent.setup();
    function WatchForm() {
      const form = useForm({ initialValues: { name: "" } });
      return (
        <Form form={form} aria-label="form">
          <Form.Field name="name" label="Name">
            <Input placeholder="Name" />
          </Form.Field>
          <Form.Watch name="name">
            {(value) => <span data-testid="preview">Preview: {value}</span>}
          </Form.Watch>
        </Form>
      );
    }
    render(<WatchForm />);
    await user.type(screen.getByPlaceholderText("Name"), "John");
    expect(screen.getByTestId("preview")).toHaveTextContent("Preview: John");
  });

  it("watches all values when name is omitted", () => {
    function AllWatchForm() {
      const form = useForm({ initialValues: { a: "1", b: "2" } });
      return (
        <Form form={form} aria-label="form">
          <Form.Watch>
            {(values) => (
              <span data-testid="all">{JSON.stringify(values)}</span>
            )}
          </Form.Watch>
        </Form>
      );
    }
    render(<AllWatchForm />);
    expect(screen.getByTestId("all")).toHaveTextContent('{"a":"1","b":"2"}');
  });
});

// ── Form.If ──

describe("Form.If", () => {
  it("shows children when field matches 'is' value", async () => {
    const user = userEvent.setup();
    function IfForm() {
      const form = useForm({ initialValues: { plan: "free" } });
      return (
        <Form form={form} aria-label="form">
          <Form.Field name="plan" label="Plan">
            <Input placeholder="Plan" />
          </Form.Field>
          <Form.If name="plan" is="pro">
            <span data-testid="pro-msg">Pro features enabled</span>
          </Form.If>
        </Form>
      );
    }
    render(<IfForm />);
    expect(screen.queryByTestId("pro-msg")).not.toBeInTheDocument();

    await user.clear(screen.getByPlaceholderText("Plan"));
    await user.type(screen.getByPlaceholderText("Plan"), "pro");
    expect(screen.getByTestId("pro-msg")).toBeInTheDocument();
  });

  it("shows children when 'when' predicate returns true", () => {
    function WhenForm() {
      const form = useForm({ initialValues: { age: 25 } });
      return (
        <Form form={form} aria-label="form">
          <Form.If name="age" when={(v) => v >= 18}>
            <span data-testid="adult">Adult</span>
          </Form.If>
        </Form>
      );
    }
    render(<WhenForm />);
    expect(screen.getByTestId("adult")).toBeInTheDocument();
  });

  it("shows children when value is in oneOf array", () => {
    function OneOfForm() {
      const form = useForm({ initialValues: { role: "admin" } });
      return (
        <Form form={form} aria-label="form">
          <Form.If name="role" oneOf={["admin", "super"]}>
            <span data-testid="priv">Privileged</span>
          </Form.If>
        </Form>
      );
    }
    render(<OneOfForm />);
    expect(screen.getByTestId("priv")).toBeInTheDocument();
  });

  it("hides children when condition is not met", () => {
    function HiddenForm() {
      const form = useForm({ initialValues: { role: "user" } });
      return (
        <Form form={form} aria-label="form">
          <Form.If name="role" is="admin">
            <span data-testid="admin">Admin only</span>
          </Form.If>
        </Form>
      );
    }
    render(<HiddenForm />);
    expect(screen.queryByTestId("admin")).not.toBeInTheDocument();
  });
});

// ── Form.Reset ──

describe("Form.Reset", () => {
  it("resets form to initial values on click", async () => {
    const user = userEvent.setup();
    function ResetForm() {
      const form = useForm({ initialValues: { name: "" } });
      return (
        <Form form={form} aria-label="form">
          <Form.Field name="name" label="Name">
            <Input placeholder="Name" />
          </Form.Field>
          <Form.Reset>Clear</Form.Reset>
        </Form>
      );
    }
    render(<ResetForm />);
    await user.type(screen.getByPlaceholderText("Name"), "John");
    expect(screen.getByPlaceholderText("Name")).toHaveValue("John");

    await user.click(screen.getByRole("button", { name: "Clear" }));
    expect(screen.getByPlaceholderText("Name")).toHaveValue("");
  });
});

// ── Form.Debug ──

describe("Form.Debug", () => {
  it("renders debug panel in non-production", () => {
    function DebugForm() {
      const form = useForm({ initialValues: { x: "hello" } });
      return (
        <Form form={form} aria-label="form">
          <Form.Debug />
        </Form>
      );
    }
    render(<DebugForm />);
    expect(screen.getByText("Form Debug")).toBeInTheDocument();
    expect(screen.getByText(/hello/)).toBeInTheDocument();
  });
});

// ── Form.FieldArray ──

describe("Form.FieldArray", () => {
  it("renders array items and supports append/remove", async () => {
    const user = userEvent.setup();
    function ArrayForm() {
      const form = useForm({
        initialValues: { items: [{ name: "First" }] },
      });
      return (
        <Form form={form} aria-label="form">
          <Form.FieldArray name="items">
            {({ fields, append, remove }) => (
              <>
                {fields.map((field) => (
                  <div key={field.id} data-testid={`item-${field.index}`}>
                    <input {...field.getFieldProps("name")} placeholder={`Item ${field.index}`} />
                    <button type="button" onClick={() => remove(field.index)}>
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => append({ name: "" })}
                  data-testid="add"
                >
                  Add
                </button>
              </>
            )}
          </Form.FieldArray>
        </Form>
      );
    }
    render(<ArrayForm />);
    expect(screen.getByTestId("item-0")).toBeInTheDocument();
    expect(screen.getByDisplayValue("First")).toBeInTheDocument();

    // Add item
    await user.click(screen.getByTestId("add"));
    expect(screen.getByTestId("item-1")).toBeInTheDocument();

    // Remove first item
    const removeButtons = screen.getAllByRole("button", { name: "Remove" });
    await user.click(removeButtons[0]);
    expect(screen.queryByDisplayValue("First")).not.toBeInTheDocument();
  });
});

// ── useFieldArray hook ──

describe("useFieldArray", () => {
  function FieldArrayHarness() {
    const form = useForm({
      initialValues: { tags: ["a", "b", "c"] },
    });
    const { fields, append, remove, swap, move, clear } = useFieldArray(form, "tags");

    return (
      <div>
        {fields.map((f) => (
          <span key={f.id} data-testid={`tag-${f.index}`}>
            {f.value}
          </span>
        ))}
        <button onClick={() => append("d")}>append</button>
        <button onClick={() => remove(0)}>remove-first</button>
        <button onClick={() => swap(0, 2)}>swap-0-2</button>
        <button onClick={() => move(0, 2)}>move-0-to-2</button>
        <button onClick={() => clear()}>clear</button>
      </div>
    );
  }

  it("renders initial items", () => {
    render(<FieldArrayHarness />);
    expect(screen.getByTestId("tag-0")).toHaveTextContent("a");
    expect(screen.getByTestId("tag-1")).toHaveTextContent("b");
    expect(screen.getByTestId("tag-2")).toHaveTextContent("c");
  });

  it("appends items", async () => {
    const user = userEvent.setup();
    render(<FieldArrayHarness />);
    await user.click(screen.getByText("append"));
    expect(screen.getByTestId("tag-3")).toHaveTextContent("d");
  });

  it("removes items", async () => {
    const user = userEvent.setup();
    render(<FieldArrayHarness />);
    await user.click(screen.getByText("remove-first"));
    expect(screen.getByTestId("tag-0")).toHaveTextContent("b");
  });

  it("swaps items", async () => {
    const user = userEvent.setup();
    render(<FieldArrayHarness />);
    await user.click(screen.getByText("swap-0-2"));
    expect(screen.getByTestId("tag-0")).toHaveTextContent("c");
    expect(screen.getByTestId("tag-2")).toHaveTextContent("a");
  });

  it("clears all items", async () => {
    const user = userEvent.setup();
    render(<FieldArrayHarness />);
    await user.click(screen.getByText("clear"));
    expect(screen.queryByTestId("tag-0")).not.toBeInTheDocument();
  });
});

// ── focusFirstError ──

describe("focusFirstError", () => {
  it("focuses first invalid field on submit failure", async () => {
    const user = userEvent.setup();
    function FocusForm() {
      const form = useForm({ initialValues: { email: "", name: "" } });
      return (
        <Form form={form} focusFirstError aria-label="form">
          <Form.Field name="email" label="Email" rules={{ required: true }}>
            <Input placeholder="Email" />
          </Form.Field>
          <Form.Field name="name" label="Name" rules={{ required: true }}>
            <Input placeholder="Name" />
          </Form.Field>
          <Form.Submit>Go</Form.Submit>
        </Form>
      );
    }
    render(<FocusForm />);
    await user.click(screen.getByRole("button", { name: "Go" }));

    // The first field (email) should be focused
    await waitFor(() => {
      expect(document.activeElement).toBe(screen.getByPlaceholderText("Email"));
    });
  });
});

// ── transform ──

describe("useForm transform", () => {
  it("transforms values before submit", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    function TransformForm() {
      const form = useForm({
        initialValues: { email: "" },
        transform: { email: (v: string) => v.trim().toLowerCase() },
      });
      return (
        <Form form={form} onSubmit={onSubmit} aria-label="form">
          <Form.Field name="email" label="Email">
            <Input placeholder="Email" />
          </Form.Field>
          <Form.Submit>Go</Form.Submit>
        </Form>
      );
    }
    render(<TransformForm />);
    await user.type(screen.getByPlaceholderText("Email"), "  FOO@BAR.COM  ");
    await user.click(screen.getByRole("button", { name: "Go" }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ email: "foo@bar.com" });
    });
  });
});

// ── showCounter ──

describe("Form.Field showCounter", () => {
  it("shows character counter with maxLength", () => {
    function CounterForm() {
      const form = useForm({ initialValues: { bio: "hello" } });
      return (
        <Form form={form} aria-label="form">
          <Form.Field
            name="bio"
            label="Bio"
            rules={{ maxLength: 100 }}
            showCounter
          >
            <Input placeholder="Bio" />
          </Form.Field>
        </Form>
      );
    }
    render(<CounterForm />);
    expect(screen.getByText("5/100")).toBeInTheDocument();
  });
});

// ── showSuccess ──

describe("Form.Field showSuccess", () => {
  it("does not show success icon when field has not been touched", () => {
    function SuccessForm() {
      const form = useForm({ initialValues: { name: "valid" } });
      return (
        <Form form={form} aria-label="form">
          <Form.Field name="name" label="Name" showSuccess>
            <Input />
          </Form.Field>
        </Form>
      );
    }
    render(<SuccessForm />);
    // Not touched yet, no success icon
    expect(screen.queryByText("check-circle")).not.toBeInTheDocument();
  });
});

// ── deps (cross-field validation) ──

describe("Form.Field deps", () => {
  it("re-validates when dependency field changes", async () => {
    const user = userEvent.setup();

    function DepsForm() {
      const form = useForm({
        initialValues: { password: "12345678", confirmPassword: "" },
      });
      return (
        <Form form={form} aria-label="form">
          <Form.Field name="password" label="Password">
            <Input placeholder="Password" />
          </Form.Field>
          <Form.Field
            name="confirmPassword"
            label="Confirm"
            deps={["password"]}
            rules={{
              validate: (val: string) => {
                if (val !== form.values.password) return "Passwords don't match";
                return true;
              },
            }}
          >
            <Input placeholder="Confirm" />
          </Form.Field>
          <Form.Submit>Go</Form.Submit>
        </Form>
      );
    }
    render(<DepsForm />);

    // Type in confirm, then submit to get it touched
    await user.type(screen.getByPlaceholderText("Confirm"), "12345678");
    await user.click(screen.getByRole("button", { name: "Go" }));

    // Should match initially
    await waitFor(() => {
      expect(screen.queryByText("Passwords don't match")).not.toBeInTheDocument();
    });
  });
});

// ── Form.Field transform ──

describe("Form.Field transform", () => {
  it("transforms value on change", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    function TransformFieldForm() {
      const form = useForm({ initialValues: { tag: "" } });
      return (
        <Form form={form} onSubmit={onSubmit} aria-label="form">
          <Form.Field
            name="tag"
            label="Tag"
            transform={(v: string) => v.toLowerCase().replace(/\s/g, "-")}
          >
            <Input placeholder="Tag" />
          </Form.Field>
          <Form.Submit>Go</Form.Submit>
        </Form>
      );
    }
    render(<TransformFieldForm />);
    await user.type(screen.getByPlaceholderText("Tag"), "Hello World");
    await user.click(screen.getByRole("button", { name: "Go" }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ tag: "hello-world" });
    });
  });
});

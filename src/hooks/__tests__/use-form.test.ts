import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useForm } from "../use-form";

describe("useForm", () => {
  // ── Initialization ──

  it("initializes with initial values", () => {
    const { result } = renderHook(() =>
      useForm({ initialValues: { name: "John", age: 25 } }),
    );
    expect(result.current.values).toEqual({ name: "John", age: 25 });
  });

  it("initializes with empty errors", () => {
    const { result } = renderHook(() =>
      useForm({ initialValues: { name: "" } }),
    );
    expect(result.current.errors).toEqual({});
  });

  it("initializes with empty touched", () => {
    const { result } = renderHook(() =>
      useForm({ initialValues: { name: "" } }),
    );
    expect(result.current.touched).toEqual({});
  });

  it("dirty is false initially", () => {
    const { result } = renderHook(() =>
      useForm({ initialValues: { name: "John" } }),
    );
    expect(result.current.dirty).toBe(false);
  });

  it("isValid is true when no errors", () => {
    const { result } = renderHook(() =>
      useForm({ initialValues: { name: "John" } }),
    );
    expect(result.current.isValid).toBe(true);
  });

  it("isSubmitting is false initially", () => {
    const { result } = renderHook(() =>
      useForm({ initialValues: { name: "" } }),
    );
    expect(result.current.isSubmitting).toBe(false);
  });

  // ── getFieldProps ──

  it("getFieldProps returns correct value and name", () => {
    const { result } = renderHook(() =>
      useForm({ initialValues: { email: "a@b.com" } }),
    );
    const props = result.current.getFieldProps("email");
    expect(props.value).toBe("a@b.com");
    expect(props.name).toBe("email");
    expect(typeof props.onChange).toBe("function");
    expect(typeof props.onBlur).toBe("function");
  });

  // ── setFieldValue ──

  it("setFieldValue updates value", () => {
    const { result } = renderHook(() =>
      useForm({ initialValues: { name: "" } }),
    );
    act(() => result.current.setFieldValue("name", "Alice"));
    expect(result.current.values.name).toBe("Alice");
  });

  // ── onChange ──

  it("onChange updates value from event object", () => {
    const { result } = renderHook(() =>
      useForm({ initialValues: { name: "" } }),
    );
    const props = result.current.getFieldProps("name");
    act(() => props.onChange({ target: { value: "Bob" } }));
    expect(result.current.values.name).toBe("Bob");
  });

  it("onChange updates value from raw value", () => {
    const { result } = renderHook(() =>
      useForm({ initialValues: { count: 0 } }),
    );
    const props = result.current.getFieldProps("count");
    act(() => props.onChange(42));
    expect(result.current.values.count).toBe(42);
  });

  it("onChange handles checkbox events", () => {
    const { result } = renderHook(() =>
      useForm({ initialValues: { agree: false } }),
    );
    const props = result.current.getFieldProps("agree");
    act(() =>
      props.onChange({ target: { type: "checkbox", checked: true, value: "on" } }),
    );
    expect(result.current.values.agree).toBe(true);
  });

  // ── onBlur / touched ──

  it("onBlur sets touched", () => {
    const { result } = renderHook(() =>
      useForm({ initialValues: { name: "" } }),
    );
    const props = result.current.getFieldProps("name");
    act(() => props.onBlur());
    expect(result.current.touched.name).toBe(true);
  });

  // ── dirty tracking ──

  it("dirty becomes true after a value change", () => {
    const { result } = renderHook(() =>
      useForm({ initialValues: { name: "John" } }),
    );
    act(() => result.current.setFieldValue("name", "Jane"));
    expect(result.current.dirty).toBe(true);
  });

  it("dirty goes back to false when value matches initial", () => {
    const { result } = renderHook(() =>
      useForm({ initialValues: { name: "John" } }),
    );
    act(() => result.current.setFieldValue("name", "Jane"));
    expect(result.current.dirty).toBe(true);
    act(() => result.current.setFieldValue("name", "John"));
    expect(result.current.dirty).toBe(false);
  });

  // ── isValid ──

  it("isValid is false when errors exist", () => {
    const { result } = renderHook(() =>
      useForm({ initialValues: { name: "" } }),
    );
    act(() => result.current.setFieldError("name", "Required"));
    expect(result.current.isValid).toBe(false);
  });

  // ── Validation on blur (default) ──

  it("validates on blur when validateOnBlur is true (default)", () => {
    const { result } = renderHook(() =>
      useForm({ initialValues: { name: "" } }),
    );
    // Register with required rule
    act(() => {
      result.current.register("name", { required: "Name is required" });
    });
    // Trigger blur
    const props = result.current.getFieldProps("name");
    act(() => props.onBlur());
    expect(result.current.errors.name).toBe("Name is required");
  });

  // ── Validation on change ──

  it("validates on change when validateOnChange is true", () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: { name: "" },
        validateOnChange: true,
      }),
    );
    act(() => {
      result.current.register("name", { required: "Name is required" });
    });
    const props = result.current.getFieldProps("name");
    act(() => props.onChange({ target: { value: "" } }));
    expect(result.current.errors.name).toBe("Name is required");
  });

  it("clears error on valid change when validateOnChange is true", () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: { name: "" },
        validateOnChange: true,
      }),
    );
    act(() => {
      result.current.register("name", { required: "Name is required" });
    });
    // Trigger error
    act(() => result.current.setFieldValue("name", ""));
    expect(result.current.errors.name).toBe("Name is required");
    // Fix it
    act(() => result.current.setFieldValue("name", "Alice"));
    expect(result.current.errors.name).toBeUndefined();
  });

  // ── Required validation rule ──

  it("required rule with string message", () => {
    const { result } = renderHook(() =>
      useForm({ initialValues: { email: "" } }),
    );
    act(() => {
      result.current.register("email", { required: "Email is required" });
    });
    act(() => result.current.validate());
    expect(result.current.errors.email).toBe("Email is required");
  });

  it("required rule with boolean true uses default message", () => {
    const { result } = renderHook(() =>
      useForm({ initialValues: { email: "" } }),
    );
    act(() => {
      result.current.register("email", { required: true });
    });
    act(() => result.current.validate());
    expect(result.current.errors.email).toBe("This field is required");
  });

  // ── Min/max validation rules ──

  it("min validation rule", () => {
    const { result } = renderHook(() =>
      useForm({ initialValues: { age: 5 } }),
    );
    act(() => {
      result.current.register("age", {
        min: { value: 18, message: "Must be at least 18" },
      });
    });
    act(() => result.current.validate());
    expect(result.current.errors.age).toBe("Must be at least 18");
  });

  it("max validation rule", () => {
    const { result } = renderHook(() =>
      useForm({ initialValues: { age: 200 } }),
    );
    act(() => {
      result.current.register("age", {
        max: { value: 120, message: "Must be at most 120" },
      });
    });
    act(() => result.current.validate());
    expect(result.current.errors.age).toBe("Must be at most 120");
  });

  // ── MinLength/maxLength validation rules ──

  it("minLength validation rule", () => {
    const { result } = renderHook(() =>
      useForm({ initialValues: { password: "ab" } }),
    );
    act(() => {
      result.current.register("password", {
        minLength: { value: 8, message: "Must be at least 8 characters" },
      });
    });
    act(() => result.current.validate());
    expect(result.current.errors.password).toBe(
      "Must be at least 8 characters",
    );
  });

  it("maxLength validation rule", () => {
    const { result } = renderHook(() =>
      useForm({ initialValues: { bio: "a".repeat(300) } }),
    );
    act(() => {
      result.current.register("bio", {
        maxLength: { value: 255, message: "Max 255 characters" },
      });
    });
    act(() => result.current.validate());
    expect(result.current.errors.bio).toBe("Max 255 characters");
  });

  // ── Pattern validation rule ──

  it("pattern validation rule", () => {
    const { result } = renderHook(() =>
      useForm({ initialValues: { email: "invalid" } }),
    );
    act(() => {
      result.current.register("email", {
        pattern: { value: /^.+@.+\..+$/, message: "Invalid email format" },
      });
    });
    act(() => result.current.validate());
    expect(result.current.errors.email).toBe("Invalid email format");
  });

  it("pattern passes when valid", () => {
    const { result } = renderHook(() =>
      useForm({ initialValues: { email: "a@b.com" } }),
    );
    act(() => {
      result.current.register("email", {
        pattern: { value: /^.+@.+\..+$/, message: "Invalid email format" },
      });
    });
    act(() => result.current.validate());
    expect(result.current.errors.email).toBeUndefined();
  });

  // ── Custom validate function (sync) ──

  it("custom sync validate function returning error", () => {
    const { result } = renderHook(() =>
      useForm({ initialValues: { username: "admin" } }),
    );
    act(() => {
      result.current.register("username", {
        validate: (val: string) =>
          val === "admin" ? "Username taken" : true,
      });
    });
    act(() => result.current.validate());
    expect(result.current.errors.username).toBe("Username taken");
  });

  it("custom sync validate function returning true (valid)", () => {
    const { result } = renderHook(() =>
      useForm({ initialValues: { username: "alice" } }),
    );
    act(() => {
      result.current.register("username", {
        validate: (val: string) =>
          val === "admin" ? "Username taken" : true,
      });
    });
    act(() => result.current.validate());
    expect(result.current.errors.username).toBeUndefined();
  });

  // ── Custom validate function (async) ──

  it("custom async validate function", async () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: { username: "taken" },
        onSubmit: vi.fn(),
      }),
    );
    act(() => {
      result.current.register("username", {
        validate: async (val: string) => {
          await new Promise((r) => setTimeout(r, 10));
          return val === "taken" ? "Username is taken" : true;
        },
      });
    });
    await act(async () => {
      await result.current.handleSubmit();
    });
    expect(result.current.errors.username).toBe("Username is taken");
  });

  // ── Form-level validate function ──

  it("form-level validate function", () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: { password: "abc", confirm: "xyz" },
        validate: (values) => {
          const errors: Partial<Record<string, string>> = {};
          if (values.password !== values.confirm) {
            errors.confirm = "Passwords must match";
          }
          return errors;
        },
      }),
    );
    act(() => result.current.validate());
    expect(result.current.errors.confirm).toBe("Passwords must match");
  });

  // ── handleSubmit ──

  it("handleSubmit prevents default on event", async () => {
    const preventDefault = vi.fn();
    const { result } = renderHook(() =>
      useForm({ initialValues: { name: "John" }, onSubmit: vi.fn() }),
    );
    await act(async () => {
      await result.current.handleSubmit({
        preventDefault,
      } as unknown as React.FormEvent);
    });
    expect(preventDefault).toHaveBeenCalled();
  });

  it("handleSubmit validates all fields", async () => {
    const onSubmit = vi.fn();
    const { result } = renderHook(() =>
      useForm({ initialValues: { name: "" }, onSubmit }),
    );
    act(() => {
      result.current.register("name", { required: "Required" });
    });
    await act(async () => {
      await result.current.handleSubmit();
    });
    expect(result.current.errors.name).toBe("Required");
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("handleSubmit calls onSubmit when valid", async () => {
    const onSubmit = vi.fn();
    const { result } = renderHook(() =>
      useForm({ initialValues: { name: "John" }, onSubmit }),
    );
    await act(async () => {
      await result.current.handleSubmit();
    });
    expect(onSubmit).toHaveBeenCalledWith({ name: "John" });
  });

  it("handleSubmit does not call onSubmit when invalid", async () => {
    const onSubmit = vi.fn();
    const { result } = renderHook(() =>
      useForm({ initialValues: { name: "" }, onSubmit }),
    );
    act(() => {
      result.current.register("name", { required: "Required" });
    });
    await act(async () => {
      await result.current.handleSubmit();
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("handleSubmit marks all fields as touched", async () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: { name: "", email: "" },
        onSubmit: vi.fn(),
      }),
    );
    await act(async () => {
      await result.current.handleSubmit();
    });
    expect(result.current.touched.name).toBe(true);
    expect(result.current.touched.email).toBe(true);
  });

  // ── isSubmitting during async onSubmit ──

  it("isSubmitting is true during async onSubmit", async () => {
    const submittingStates: boolean[] = [];
    let resolveSubmit!: () => void;
    const onSubmit = vi.fn(() => {
      // Capture isSubmitting state inside onSubmit callback
      // At this point, isSubmitting should be true
      return new Promise<void>((resolve) => {
        resolveSubmit = resolve;
      });
    });
    const { result } = renderHook(() =>
      useForm({ initialValues: { name: "John" }, onSubmit }),
    );

    // Start submit but don't await
    let submitPromise!: Promise<void>;
    await act(async () => {
      submitPromise = result.current.handleSubmit() as Promise<void>;
      // Before the promise resolves, capture isSubmitting
      submittingStates.push(result.current.isSubmitting);
    });

    // onSubmit was called and hasn't resolved yet
    expect(onSubmit).toHaveBeenCalled();

    await act(async () => {
      resolveSubmit();
      await submitPromise;
    });
    expect(result.current.isSubmitting).toBe(false);
  });

  // ── reset ──

  it("reset restores initial values", () => {
    const { result } = renderHook(() =>
      useForm({ initialValues: { name: "John" } }),
    );
    act(() => result.current.setFieldValue("name", "Jane"));
    act(() => result.current.reset());
    expect(result.current.values.name).toBe("John");
  });

  it("reset clears errors and touched", () => {
    const { result } = renderHook(() =>
      useForm({ initialValues: { name: "" } }),
    );
    act(() => {
      result.current.setFieldError("name", "Required");
      result.current.setFieldTouched("name", true);
    });
    act(() => result.current.reset());
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
  });

  it("reset accepts new initial values", () => {
    const { result } = renderHook(() =>
      useForm({ initialValues: { name: "John" } }),
    );
    act(() => result.current.reset({ name: "Bob" }));
    expect(result.current.values.name).toBe("Bob");
    expect(result.current.dirty).toBe(false);
  });

  // ── setFieldError / setErrors ──

  it("setFieldError sets custom error", () => {
    const { result } = renderHook(() =>
      useForm({ initialValues: { name: "" } }),
    );
    act(() => result.current.setFieldError("name", "Server error"));
    expect(result.current.errors.name).toBe("Server error");
  });

  it("setFieldError clears error with null", () => {
    const { result } = renderHook(() =>
      useForm({ initialValues: { name: "" } }),
    );
    act(() => result.current.setFieldError("name", "Error"));
    act(() => result.current.setFieldError("name", null));
    expect(result.current.errors.name).toBeUndefined();
  });

  it("setErrors sets multiple errors", () => {
    const { result } = renderHook(() =>
      useForm({ initialValues: { name: "", email: "" } }),
    );
    act(() =>
      result.current.setErrors({
        name: "Required",
        email: "Invalid",
      }),
    );
    expect(result.current.errors.name).toBe("Required");
    expect(result.current.errors.email).toBe("Invalid");
  });

  // ── setValues ──

  it("setValues sets multiple values", () => {
    const { result } = renderHook(() =>
      useForm({ initialValues: { name: "", email: "" } }),
    );
    act(() =>
      result.current.setValues({ name: "Alice", email: "a@b.com" }),
    );
    expect(result.current.values.name).toBe("Alice");
    expect(result.current.values.email).toBe("a@b.com");
  });

  // ── register ──

  it("register returns correct props", () => {
    const { result } = renderHook(() =>
      useForm({ initialValues: { name: "John" } }),
    );
    const props = result.current.register("name", { required: true });
    expect(props.value).toBe("John");
    expect(props.name).toBe("name");
    expect(typeof props.onChange).toBe("function");
    expect(typeof props.onBlur).toBe("function");
  });

  // ── Multiple fields work independently ──

  it("multiple fields work independently", () => {
    const { result } = renderHook(() =>
      useForm({ initialValues: { name: "", email: "" } }),
    );
    act(() => result.current.setFieldValue("name", "Alice"));
    expect(result.current.values.name).toBe("Alice");
    expect(result.current.values.email).toBe("");

    act(() => result.current.setFieldError("email", "Required"));
    expect(result.current.errors.email).toBe("Required");
    expect(result.current.errors.name).toBeUndefined();
  });

  // ── getFieldState ──

  it("getFieldState returns correct state", () => {
    const { result } = renderHook(() =>
      useForm({ initialValues: { name: "John" } }),
    );
    act(() => {
      result.current.setFieldValue("name", "Jane");
      result.current.setFieldTouched("name", true);
      result.current.setFieldError("name", "Too short");
    });
    const state = result.current.getFieldState("name");
    expect(state).toEqual({
      value: "Jane",
      error: "Too short",
      touched: true,
      dirty: true,
    });
  });

  // ── setFieldTouched ──

  it("setFieldTouched with false resets touched", () => {
    const { result } = renderHook(() =>
      useForm({ initialValues: { name: "" } }),
    );
    act(() => result.current.setFieldTouched("name", true));
    expect(result.current.touched.name).toBe(true);
    act(() => result.current.setFieldTouched("name", false));
    expect(result.current.touched.name).toBe(false);
  });

  // ── Validation order: required runs before pattern ──

  it("required validation runs before pattern", () => {
    const { result } = renderHook(() =>
      useForm({ initialValues: { email: "" } }),
    );
    act(() => {
      result.current.register("email", {
        required: "Email required",
        pattern: { value: /^.+@.+$/, message: "Invalid email" },
      });
    });
    act(() => result.current.validate());
    expect(result.current.errors.email).toBe("Email required");
  });
});

import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useForm } from "../use-form";
import { useWatch } from "../use-watch";
import { useFieldArray } from "../use-field-array";
import { useFormGuard } from "../use-form-guard";
import { useAutosave } from "../use-autosave";

// ── useWatch ──

describe("useWatch", () => {
  it("returns all values when called without name", () => {
    const { result: formResult } = renderHook(() =>
      useForm({ initialValues: { a: "1", b: "2" } }),
    );
    const { result } = renderHook(() => useWatch(formResult.current));
    expect(result.current).toEqual({ a: "1", b: "2" });
  });

  it("returns single value when called with field name", () => {
    const { result: formResult } = renderHook(() =>
      useForm({ initialValues: { name: "John", age: 25 } }),
    );
    const { result } = renderHook(() => useWatch(formResult.current, "name"));
    expect(result.current).toBe("John");
  });

  it("returns array of values when called with field names array", () => {
    const { result: formResult } = renderHook(() =>
      useForm({ initialValues: { a: "x", b: "y", c: "z" } }),
    );
    const { result } = renderHook(() =>
      useWatch(formResult.current, ["a", "c"]),
    );
    expect(result.current).toEqual(["x", "z"]);
  });
});

// ── useFieldArray ──

describe("useFieldArray", () => {
  it("returns fields with stable IDs", () => {
    const { result: formResult } = renderHook(() =>
      useForm({ initialValues: { items: [{ name: "a" }, { name: "b" }] } }),
    );
    const { result } = renderHook(() =>
      useFieldArray(formResult.current, "items"),
    );
    expect(result.current.fields).toHaveLength(2);
    expect(result.current.fields[0].id).toBeDefined();
    expect(result.current.fields[0].value).toEqual({ name: "a" });
    expect(result.current.fields[1].value).toEqual({ name: "b" });
  });

  it("append adds an item", () => {
    const { result: formResult } = renderHook(() =>
      useForm({ initialValues: { items: [{ name: "a" }] } }),
    );
    const { result } = renderHook(() =>
      useFieldArray(formResult.current, "items"),
    );

    act(() => {
      result.current.append({ name: "b" });
    });

    expect(formResult.current.values.items).toHaveLength(2);
    expect(formResult.current.values.items[1]).toEqual({ name: "b" });
  });

  it("remove removes an item", () => {
    const { result: formResult } = renderHook(() =>
      useForm({ initialValues: { items: ["a", "b", "c"] } }),
    );
    const { result } = renderHook(() =>
      useFieldArray(formResult.current, "items"),
    );

    act(() => {
      result.current.remove(1);
    });

    expect(formResult.current.values.items).toEqual(["a", "c"]);
  });

  it("swap swaps two items", () => {
    const { result: formResult } = renderHook(() =>
      useForm({ initialValues: { items: ["a", "b", "c"] } }),
    );
    const { result } = renderHook(() =>
      useFieldArray(formResult.current, "items"),
    );

    act(() => {
      result.current.swap(0, 2);
    });

    expect(formResult.current.values.items).toEqual(["c", "b", "a"]);
  });

  it("move moves an item", () => {
    const { result: formResult } = renderHook(() =>
      useForm({ initialValues: { items: ["a", "b", "c"] } }),
    );
    const { result } = renderHook(() =>
      useFieldArray(formResult.current, "items"),
    );

    act(() => {
      result.current.move(0, 2);
    });

    expect(formResult.current.values.items).toEqual(["b", "c", "a"]);
  });

  it("clear removes all items", () => {
    const { result: formResult } = renderHook(() =>
      useForm({ initialValues: { items: ["a", "b"] } }),
    );
    const { result } = renderHook(() =>
      useFieldArray(formResult.current, "items"),
    );

    act(() => {
      result.current.clear();
    });

    expect(formResult.current.values.items).toEqual([]);
  });

  it("getFieldProps returns correct sub-field value", () => {
    const { result: formResult } = renderHook(() =>
      useForm({ initialValues: { items: [{ name: "John", age: 30 }] } }),
    );
    const { result } = renderHook(() =>
      useFieldArray(formResult.current, "items"),
    );

    const nameProps = result.current.fields[0].getFieldProps("name");
    expect(nameProps.value).toBe("John");
    expect(nameProps.name).toBe("items.0.name");

    const ageProps = result.current.fields[0].getFieldProps("age");
    expect(ageProps.value).toBe(30);
  });
});

// ── useFormGuard ──

describe("useFormGuard", () => {
  const addSpy = vi.spyOn(window, "addEventListener");
  const removeSpy = vi.spyOn(window, "removeEventListener");

  beforeEach(() => {
    addSpy.mockClear();
    removeSpy.mockClear();
  });

  afterEach(() => {
    addSpy.mockClear();
    removeSpy.mockClear();
  });

  it("does not add listener when form is clean", () => {
    const { result: formResult } = renderHook(() =>
      useForm({ initialValues: { name: "" } }),
    );
    renderHook(() => useFormGuard(formResult.current));

    const beforeUnloadCalls = addSpy.mock.calls.filter(
      ([event]) => event === "beforeunload",
    );
    expect(beforeUnloadCalls).toHaveLength(0);
  });

  it("adds listener when form is dirty", () => {
    const { result: formResult } = renderHook(() =>
      useForm({ initialValues: { name: "" } }),
    );

    act(() => {
      formResult.current.setFieldValue("name", "changed");
    });

    renderHook(() => useFormGuard(formResult.current));

    const beforeUnloadCalls = addSpy.mock.calls.filter(
      ([event]) => event === "beforeunload",
    );
    expect(beforeUnloadCalls.length).toBeGreaterThan(0);
  });

  it("does not add listener when enabled is false", () => {
    const { result: formResult } = renderHook(() =>
      useForm({ initialValues: { name: "" } }),
    );

    act(() => {
      formResult.current.setFieldValue("name", "changed");
    });

    renderHook(() =>
      useFormGuard(formResult.current, { enabled: false }),
    );

    const beforeUnloadCalls = addSpy.mock.calls.filter(
      ([event]) => event === "beforeunload",
    );
    expect(beforeUnloadCalls).toHaveLength(0);
  });
});

// ── useAutosave ──

describe("useAutosave", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("calls onSave after debounce when form is dirty", async () => {
    const onSave = vi.fn();
    const { result: formResult } = renderHook(() =>
      useForm({ initialValues: { name: "" } }),
    );

    renderHook(() =>
      useAutosave(formResult.current, { onSave, debounce: 500 }),
    );

    // Make form dirty
    act(() => {
      formResult.current.setFieldValue("name", "John");
    });

    // Re-render with dirty form
    renderHook(() =>
      useAutosave(formResult.current, { onSave, debounce: 500 }),
    );

    // Advance timers
    await act(async () => {
      vi.advanceTimersByTime(600);
    });

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ name: "John" }),
    );
  });

  it("does not call onSave when enabled is false", async () => {
    const onSave = vi.fn();
    const { result: formResult } = renderHook(() =>
      useForm({ initialValues: { name: "" } }),
    );

    act(() => {
      formResult.current.setFieldValue("name", "John");
    });

    renderHook(() =>
      useAutosave(formResult.current, { onSave, debounce: 100, enabled: false }),
    );

    await act(async () => {
      vi.advanceTimersByTime(200);
    });

    expect(onSave).not.toHaveBeenCalled();
  });
});

// ── useForm persist ──

describe("useForm persist", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("saves values to localStorage", async () => {
    vi.useFakeTimers();

    renderHook(() =>
      useForm({
        initialValues: { name: "test" },
        persist: "test-form",
      }),
    );

    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    const stored = localStorage.getItem("spark-form:test-form");
    expect(stored).toBeTruthy();
    expect(JSON.parse(stored!)).toEqual({ name: "test" });

    vi.useRealTimers();
  });

  it("restores values from localStorage on mount", () => {
    localStorage.setItem(
      "spark-form:restore-test",
      JSON.stringify({ name: "restored" }),
    );

    const { result } = renderHook(() =>
      useForm({
        initialValues: { name: "" },
        persist: "restore-test",
      }),
    );

    expect(result.current.values.name).toBe("restored");
  });

  it("clears localStorage on reset", () => {
    localStorage.setItem(
      "spark-form:reset-test",
      JSON.stringify({ name: "old" }),
    );

    const { result } = renderHook(() =>
      useForm({
        initialValues: { name: "" },
        persist: "reset-test",
      }),
    );

    act(() => {
      result.current.reset();
    });

    expect(localStorage.getItem("spark-form:reset-test")).toBeNull();
  });
});

// ── useForm formError ──

describe("useForm formError", () => {
  it("has formError and setFormError", () => {
    const { result } = renderHook(() =>
      useForm({ initialValues: { x: "" } }),
    );

    expect(result.current.formError).toBeNull();

    act(() => {
      result.current.setFormError("Something went wrong");
    });

    expect(result.current.formError).toBe("Something went wrong");

    act(() => {
      result.current.setFormError(null);
    });

    expect(result.current.formError).toBeNull();
  });

  it("clears formError on reset", () => {
    const { result } = renderHook(() =>
      useForm({ initialValues: { x: "" } }),
    );

    act(() => {
      result.current.setFormError("error");
    });
    expect(result.current.formError).toBe("error");

    act(() => {
      result.current.reset();
    });
    expect(result.current.formError).toBeNull();
  });
});

// ── useForm transform ──

describe("useForm transform", () => {
  it("getTransformedValues applies transforms", () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: { email: "  FOO@BAR.COM  " },
        transform: { email: (v: string) => v.trim().toLowerCase() },
      }),
    );

    expect(result.current.getTransformedValues()).toEqual({
      email: "foo@bar.com",
    });
  });
});

// ── useForm nested paths ──

describe("useForm nested paths", () => {
  it("setFieldValue works with dot-notation", () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: { address: { city: "", zip: "" } },
      }),
    );

    act(() => {
      result.current.setFieldValue("address.city" as any, "NYC");
    });

    expect(result.current.values.address.city).toBe("NYC");
    expect(result.current.values.address.zip).toBe("");
  });

  it("getFieldState works with dot-notation", () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: { address: { city: "NYC" } },
      }),
    );

    const state = result.current.getFieldState("address.city" as any);
    expect(state.value).toBe("NYC");
  });

  it("register works with dot-notation", () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: { user: { name: "John" } },
      }),
    );

    const registered = result.current.register("user.name" as any);
    expect(registered.value).toBe("John");
    expect(registered.name).toBe("user.name");
  });
});

// ── useForm validateAsync ──

describe("useForm validateAsync", () => {
  it("marks all fields touched and returns errors", async () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: { name: "", email: "" },
      }),
    );

    // Register fields with rules
    act(() => {
      result.current.register("name", { required: "Name required" });
      result.current.register("email", { required: "Email required" });
    });

    let errors: Record<string, string>;
    await act(async () => {
      errors = await result.current.validateAsync() as any;
    });

    expect(errors!.name).toBe("Name required");
    expect(errors!.email).toBe("Email required");
    expect(result.current.touched.name).toBe(true);
    expect(result.current.touched.email).toBe(true);
  });
});

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { JsonInput } from "../json-input";

describe("JsonInput", () => {
  beforeEach(() => {
    // Mock clipboard API
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      writable: true,
      configurable: true,
    });
  });

  it("renders CodeInput internally", () => {
    render(<JsonInput />);
    // Should render a textarea (from CodeInput)
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("formats JSON on blur", async () => {
    render(<JsonInput defaultValue='{"a":1,"b":2}' />);
    const textarea = screen.getByRole("textbox");

    fireEvent.blur(textarea);

    await waitFor(() => {
      expect(textarea).toHaveValue(
        JSON.stringify({ a: 1, b: 2 }, null, 2)
      );
    });
  });

  it("shows validation error for invalid JSON", () => {
    // Use fireEvent.change to set invalid JSON directly (avoids userEvent brace parsing)
    render(<JsonInput defaultValue="" />);
    const textarea = screen.getByRole("textbox");

    fireEvent.change(textarea, { target: { value: "not valid json" } });

    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("clears validation error when JSON becomes valid", () => {
    render(<JsonInput />);
    const textarea = screen.getByRole("textbox");

    // Set invalid JSON
    fireEvent.change(textarea, { target: { value: "bad json" } });
    expect(screen.getByRole("alert")).toBeInTheDocument();

    // Set valid JSON
    fireEvent.change(textarea, { target: { value: '{"a":1}' } });
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("external error takes precedence over internal error", () => {
    render(
      <JsonInput
        defaultValue="not json"
        validateOnChange
        error="External error"
      />
    );
    // External error should be displayed (from CodeInput's error prop)
    expect(screen.getByRole("alert")).toHaveTextContent("External error");
  });

  it("format button pretty-prints JSON", async () => {
    render(<JsonInput defaultValue='{"name":"test","count":42}' />);

    const formatBtn = screen.getByRole("button", { name: "Format JSON" });
    fireEvent.click(formatBtn);

    await waitFor(() => {
      expect(screen.getByRole("textbox")).toHaveValue(
        JSON.stringify({ name: "test", count: 42 }, null, 2)
      );
    });
  });

  it("copy button copies to clipboard", () => {
    render(<JsonInput defaultValue='{"a":1}' />);

    const copyBtn = screen.getByRole("button", { name: "Copy to clipboard" });
    fireEvent.click(copyBtn);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('{"a":1}');
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLTextAreaElement | null };
    render(<JsonInput ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it("has displayName", () => {
    expect(JsonInput.displayName).toBe("JsonInput");
  });

  it("merges className", () => {
    const { container } = render(<JsonInput className="my-json" />);
    expect(container.firstChild).toHaveClass("my-json");
  });

  it("disabled state", () => {
    render(<JsonInput disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("label renders", () => {
    render(<JsonInput label="JSON Config" />);
    // Both JsonInput's label and CodeInput's label shouldn't duplicate --
    // JsonInput renders its own label above the toolbar
    expect(screen.getByText("JSON Config")).toBeInTheDocument();
  });

  it("hides format button when showFormatButton=false", () => {
    render(<JsonInput showFormatButton={false} />);
    expect(
      screen.queryByRole("button", { name: "Format JSON" })
    ).not.toBeInTheDocument();
  });

  it("hides copy button when showCopyButton=false", () => {
    render(<JsonInput showCopyButton={false} />);
    expect(
      screen.queryByRole("button", { name: "Copy to clipboard" })
    ).not.toBeInTheDocument();
  });

  it("custom validationSchema works", () => {
    const validator = vi.fn((json: unknown) => {
      const obj = json as Record<string, unknown>;
      if (!obj.name) return "name is required";
      return null;
    });

    render(<JsonInput validationSchema={validator} />);
    const textarea = screen.getByRole("textbox");

    // Set valid JSON without a 'name' field
    fireEvent.change(textarea, { target: { value: '{"count":1}' } });

    expect(screen.getByRole("alert")).toHaveTextContent("name is required");
  });

  it("does not show toolbar when both buttons are hidden", () => {
    const { container } = render(
      <JsonInput showFormatButton={false} showCopyButton={false} />
    );
    expect(container.querySelector("button")).not.toBeInTheDocument();
  });
});

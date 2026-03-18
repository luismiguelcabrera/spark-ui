import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { NativeSelect } from "../native-select";

const defaultOptions = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
];

describe("NativeSelect", () => {
  // ── Rendering ──

  it("renders a select element", { timeout: 30000 }, () => {
    render(<NativeSelect options={defaultOptions} />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("renders all options", () => {
    render(<NativeSelect options={defaultOptions} />);
    expect(screen.getAllByRole("option")).toHaveLength(3);
  });

  it("renders option labels", () => {
    render(<NativeSelect options={defaultOptions} />);
    expect(screen.getByText("Apple")).toBeInTheDocument();
    expect(screen.getByText("Banana")).toBeInTheDocument();
    expect(screen.getByText("Cherry")).toBeInTheDocument();
  });

  it("uses value as label when label is not provided", () => {
    const options = [{ value: "raw-value" }];
    render(<NativeSelect options={options} />);
    expect(screen.getByText("raw-value")).toBeInTheDocument();
  });

  // ── Placeholder ──

  it("renders placeholder as disabled option", () => {
    render(<NativeSelect options={defaultOptions} placeholder="Select a fruit" />);
    const placeholder = screen.getByText("Select a fruit");
    expect(placeholder).toBeInTheDocument();
    expect(placeholder).toBeDisabled();
  });

  it("renders placeholder option with empty value", () => {
    render(<NativeSelect options={defaultOptions} placeholder="Select..." />);
    const placeholderOpt = screen.getByText("Select...");
    expect(placeholderOpt).toHaveAttribute("value", "");
  });

  // ── Controlled value ──

  it("displays controlled value", () => {
    render(<NativeSelect options={defaultOptions} value="banana" />);
    expect(screen.getByRole("combobox")).toHaveValue("banana");
  });

  it("calls onChange with new value", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<NativeSelect options={defaultOptions} value="apple" onChange={onChange} />);
    await user.selectOptions(screen.getByRole("combobox"), "cherry");
    expect(onChange).toHaveBeenCalledWith("cherry");
  });

  // ── Uncontrolled ──

  it("works as uncontrolled with defaultValue", () => {
    render(<NativeSelect options={defaultOptions} defaultValue="banana" />);
    expect(screen.getByRole("combobox")).toHaveValue("banana");
  });

  it("updates value on change in uncontrolled mode", async () => {
    const user = userEvent.setup();
    render(<NativeSelect options={defaultOptions} defaultValue="apple" />);
    await user.selectOptions(screen.getByRole("combobox"), "cherry");
    expect(screen.getByRole("combobox")).toHaveValue("cherry");
  });

  // ── Disabled options ──

  it("disables individual options", () => {
    const options = [
      { value: "a", label: "A" },
      { value: "b", label: "B", disabled: true },
    ];
    render(<NativeSelect options={options} />);
    expect(screen.getByText("B")).toBeDisabled();
  });

  // ── Size variants ──

  it.each([
    ["sm", "h-9"],
    ["md", "h-11"],
    ["lg", "h-12"],
  ] as const)("applies %s size", (size, expectedClass) => {
    render(<NativeSelect options={defaultOptions} size={size} />);
    expect(screen.getByRole("combobox").className).toContain(expectedClass);
  });

  it("defaults to md size", () => {
    render(<NativeSelect options={defaultOptions} />);
    expect(screen.getByRole("combobox").className).toContain("h-11");
  });

  // ── Variant styles ──

  it.each([
    ["outline", "border"],
    ["filled", "bg-slate-100"],
    ["unstyled", "bg-transparent"],
  ] as const)("applies %s variant", (variant, expectedClass) => {
    render(<NativeSelect options={defaultOptions} variant={variant} />);
    expect(screen.getByRole("combobox").className).toContain(expectedClass);
  });

  it("defaults to outline variant", () => {
    render(<NativeSelect options={defaultOptions} />);
    const cls = screen.getByRole("combobox").className;
    expect(cls).toContain("border");
    expect(cls).toContain("bg-slate-50");
  });

  // ── Disabled state ──

  it("disables the select when disabled", () => {
    render(<NativeSelect options={defaultOptions} disabled />);
    expect(screen.getByRole("combobox")).toBeDisabled();
  });

  // ── Error state ──

  it("displays error message", () => {
    render(<NativeSelect options={defaultOptions} error="This field is required" />);
    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("sets aria-invalid when error is present", () => {
    render(<NativeSelect options={defaultOptions} error="Required" />);
    expect(screen.getByRole("combobox")).toHaveAttribute("aria-invalid", "true");
  });

  it("does not set aria-invalid when no error", () => {
    render(<NativeSelect options={defaultOptions} />);
    expect(screen.getByRole("combobox")).not.toHaveAttribute("aria-invalid");
  });

  it("renders error as alert role", () => {
    render(<NativeSelect options={defaultOptions} error="Oops" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Oops");
  });

  it("applies error styling", () => {
    render(<NativeSelect options={defaultOptions} error="Bad" />);
    expect(screen.getByRole("combobox").className).toContain("border-red-300");
  });

  // ── Label & Description ──

  it("renders label", () => {
    render(<NativeSelect options={defaultOptions} label="Fruit" />);
    expect(screen.getByText("Fruit")).toBeInTheDocument();
  });

  it("associates label with select via htmlFor", () => {
    render(<NativeSelect options={defaultOptions} label="Fruit" id="fruit-select" />);
    const label = screen.getByText("Fruit");
    expect(label).toHaveAttribute("for", "fruit-select");
    expect(screen.getByRole("combobox")).toHaveAttribute("id", "fruit-select");
  });

  it("renders description", () => {
    render(<NativeSelect options={defaultOptions} description="Pick your favorite" />);
    expect(screen.getByText("Pick your favorite")).toBeInTheDocument();
  });

  it("links description via aria-describedby", () => {
    render(<NativeSelect options={defaultOptions} description="Help text" />);
    const select = screen.getByRole("combobox");
    const describedBy = select.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    const descriptionEl = document.getElementById(describedBy!.split(" ")[0]);
    expect(descriptionEl).toHaveTextContent("Help text");
  });

  // ── Ref forwarding ──

  it("forwards ref", () => {
    const ref = { current: null as HTMLSelectElement | null };
    render(<NativeSelect ref={ref} options={defaultOptions} />);
    expect(ref.current).toBeInstanceOf(HTMLSelectElement);
  });

  // ── className merging ──

  it("merges custom className on the select", () => {
    render(<NativeSelect options={defaultOptions} className="custom-class" />);
    expect(screen.getByRole("combobox")).toHaveClass("custom-class");
  });

  // ── Label disabled opacity ──

  it("applies opacity to label when disabled", () => {
    render(<NativeSelect options={defaultOptions} label="Fruit" disabled />);
    expect(screen.getByText("Fruit").className).toContain("opacity-50");
  });
});

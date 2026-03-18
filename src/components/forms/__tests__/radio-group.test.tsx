import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { RadioGroup } from "../radio-group";

const options = [
  { label: "Option A", value: "a" },
  { label: "Option B", value: "b" },
  { label: "Option C", value: "c" },
];

describe("RadioGroup", () => {
  it("renders all options", () => {
    render(<RadioGroup options={options} />);
    expect(screen.getByText("Option A")).toBeInTheDocument();
    expect(screen.getByText("Option B")).toBeInTheDocument();
    expect(screen.getByText("Option C")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<RadioGroup ref={ref} options={options} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  it("has displayName", () => {
    expect(RadioGroup.displayName).toBe("RadioGroup");
  });

  it("merges className", () => {
    render(<RadioGroup options={options} className="custom" />);
    expect(screen.getByRole("radiogroup")).toHaveClass("custom");
  });

  it("has role='radiogroup'", () => {
    render(<RadioGroup options={options} />);
    expect(screen.getByRole("radiogroup")).toBeInTheDocument();
  });

  it("renders radio inputs for each option", () => {
    render(<RadioGroup options={options} name="test" />);
    expect(screen.getAllByRole("radio")).toHaveLength(3);
  });

  it("selects defaultValue", () => {
    render(<RadioGroup options={options} defaultValue="b" name="test" />);
    const radios = screen.getAllByRole("radio");
    expect(radios[1]).toBeChecked();
  });

  it("calls onValueChange when an option is clicked", () => {
    const onValueChange = vi.fn();
    render(<RadioGroup options={options} onValueChange={onValueChange} name="test" />);
    fireEvent.click(screen.getByText("Option B"));
    expect(onValueChange).toHaveBeenCalledWith("b");
  });

  it("renders card variant with descriptions", () => {
    const cardOptions = [
      { label: "Card A", value: "a", description: "Description A" },
      { label: "Card B", value: "b", description: "Description B" },
    ];
    render(<RadioGroup options={cardOptions} variant="card" />);
    expect(screen.getByText("Description A")).toBeInTheDocument();
    expect(screen.getByText("Description B")).toBeInTheDocument();
  });

  it("supports horizontal orientation", () => {
    render(<RadioGroup options={options} orientation="horizontal" />);
    expect(screen.getByRole("radiogroup")).toHaveClass("flex-row");
  });
});

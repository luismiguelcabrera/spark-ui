import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { axe, toHaveNoViolations } from "jest-axe";
import { RadioCardGroup } from "../radio-card";

expect.extend(toHaveNoViolations);

const defaultOptions = [
  { value: "a", title: "Option A" },
  { value: "b", title: "Option B" },
  { value: "c", title: "Option C" },
];

describe("RadioCardGroup", () => {
  it("renders with role=radiogroup", () => {
    render(<RadioCardGroup options={defaultOptions} />);
    expect(screen.getByRole("radiogroup")).toBeInTheDocument();
  });

  it("renders all options as radio cards", () => {
    render(<RadioCardGroup options={defaultOptions} />);
    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(3);
  });

  it("displays titles", () => {
    render(<RadioCardGroup options={defaultOptions} />);
    expect(screen.getByText("Option A")).toBeInTheDocument();
    expect(screen.getByText("Option B")).toBeInTheDocument();
    expect(screen.getByText("Option C")).toBeInTheDocument();
  });

  it("displays descriptions when provided", () => {
    const opts = [
      { value: "a", title: "A", description: "First choice" },
    ];
    render(<RadioCardGroup options={opts} />);
    expect(screen.getByText("First choice")).toBeInTheDocument();
  });

  it("selects an option on click", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<RadioCardGroup options={defaultOptions} onChange={onChange} />);
    await user.click(screen.getByText("Option B"));
    expect(onChange).toHaveBeenCalledWith("b");
  });

  it("only allows one selection at a time", async () => {
    const user = userEvent.setup();
    render(<RadioCardGroup options={defaultOptions} defaultValue="a" />);
    const radios = screen.getAllByRole("radio");
    expect(radios[0]).toHaveAttribute("aria-checked", "true");
    expect(radios[1]).toHaveAttribute("aria-checked", "false");
    await user.click(radios[1]);
    expect(radios[0]).toHaveAttribute("aria-checked", "false");
    expect(radios[1]).toHaveAttribute("aria-checked", "true");
  });

  it("selects on Space key", () => {
    const onChange = vi.fn();
    render(<RadioCardGroup options={defaultOptions} onChange={onChange} />);
    const radios = screen.getAllByRole("radio");
    fireEvent.keyDown(radios[1], { key: " " });
    expect(onChange).toHaveBeenCalledWith("b");
  });

  it("navigates with ArrowRight key", () => {
    const onChange = vi.fn();
    render(<RadioCardGroup options={defaultOptions} defaultValue="a" onChange={onChange} />);
    const radios = screen.getAllByRole("radio");
    fireEvent.keyDown(radios[0], { key: "ArrowRight" });
    expect(onChange).toHaveBeenCalledWith("b");
  });

  it("navigates with ArrowLeft key (wraps around)", () => {
    const onChange = vi.fn();
    render(<RadioCardGroup options={defaultOptions} defaultValue="a" onChange={onChange} />);
    const radios = screen.getAllByRole("radio");
    fireEvent.keyDown(radios[0], { key: "ArrowLeft" });
    expect(onChange).toHaveBeenCalledWith("c");
  });

  it("navigates with ArrowDown key", () => {
    const onChange = vi.fn();
    render(<RadioCardGroup options={defaultOptions} defaultValue="a" onChange={onChange} />);
    const radios = screen.getAllByRole("radio");
    fireEvent.keyDown(radios[0], { key: "ArrowDown" });
    expect(onChange).toHaveBeenCalledWith("b");
  });

  it("skips disabled options during keyboard navigation", () => {
    const onChange = vi.fn();
    const opts = [
      { value: "a", title: "A" },
      { value: "b", title: "B", disabled: true },
      { value: "c", title: "C" },
    ];
    render(<RadioCardGroup options={opts} defaultValue="a" onChange={onChange} />);
    const radios = screen.getAllByRole("radio");
    fireEvent.keyDown(radios[0], { key: "ArrowRight" });
    expect(onChange).toHaveBeenCalledWith("c");
  });

  it("does not select disabled option on click", () => {
    const onChange = vi.fn();
    const opts = [
      { value: "a", title: "A" },
      { value: "b", title: "B", disabled: true },
    ];
    render(<RadioCardGroup options={opts} onChange={onChange} />);
    fireEvent.click(screen.getAllByRole("radio")[1]);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("works in controlled mode", () => {
    const { rerender } = render(
      <RadioCardGroup options={defaultOptions} value="a" />,
    );
    expect(screen.getAllByRole("radio")[0]).toHaveAttribute("aria-checked", "true");
    rerender(<RadioCardGroup options={defaultOptions} value="b" />);
    expect(screen.getAllByRole("radio")[1]).toHaveAttribute("aria-checked", "true");
  });

  it("renders in vertical orientation", () => {
    render(<RadioCardGroup options={defaultOptions} orientation="vertical" />);
    const group = screen.getByRole("radiogroup");
    expect(group.className).toContain("flex-col");
  });

  it("renders in horizontal orientation (default)", () => {
    render(<RadioCardGroup options={defaultOptions} />);
    const group = screen.getByRole("radiogroup");
    expect(group.className).toContain("flex-row");
  });

  it.each(["sm", "md", "lg"] as const)("renders at %s size", (size) => {
    render(<RadioCardGroup options={defaultOptions} size={size} />);
    expect(screen.getAllByRole("radio")).toHaveLength(3);
  });

  it.each(["primary", "secondary", "success"] as const)(
    "renders with %s color",
    (color) => {
      render(<RadioCardGroup options={defaultOptions} color={color} defaultValue="a" />);
      expect(screen.getAllByRole("radio")[0]).toHaveAttribute("aria-checked", "true");
    },
  );

  it("renders hidden radio inputs for form compatibility", () => {
    const { container } = render(
      <RadioCardGroup options={defaultOptions} name="plan" defaultValue="a" />,
    );
    const inputs = container.querySelectorAll("input[type='radio']");
    expect(inputs).toHaveLength(3);
    expect(inputs[0]).toHaveAttribute("name", "plan");
  });

  it("renders icon when provided as string", () => {
    const opts = [{ value: "a", title: "A", icon: "star" }];
    const { container } = render(<RadioCardGroup options={opts} />);
    // Icon resolves "star" to built-in SVG via registry
    const svg = container.querySelector("svg[aria-hidden='true']");
    expect(svg).toBeInTheDocument();
  });

  it("renders icon when provided as ReactNode", () => {
    const opts = [
      { value: "a", title: "A", icon: <span data-testid="icon">*</span> },
    ];
    render(<RadioCardGroup options={opts} />);
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<RadioCardGroup options={defaultOptions} className="my-class" />);
    expect(screen.getByRole("radiogroup")).toHaveClass("my-class");
  });

  it("disables all options when group disabled", () => {
    const onChange = vi.fn();
    render(<RadioCardGroup options={defaultOptions} disabled onChange={onChange} />);
    fireEvent.click(screen.getAllByRole("radio")[0]);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <RadioCardGroup options={defaultOptions} defaultValue="a" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no accessibility violations with descriptions", async () => {
    const opts = [
      { value: "a", title: "A", description: "First" },
      { value: "b", title: "B", description: "Second" },
    ];
    const { container } = render(<RadioCardGroup options={opts} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

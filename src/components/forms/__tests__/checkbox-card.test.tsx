import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { axe, toHaveNoViolations } from "jest-axe";
import { CheckboxCard } from "../checkbox-card";

expect.extend(toHaveNoViolations);

describe("CheckboxCard", () => {
  it("renders with role=checkbox", () => {
    render(<CheckboxCard title="Option A" />);
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("displays the title", () => {
    render(<CheckboxCard title="Premium Plan" />);
    expect(screen.getByText("Premium Plan")).toBeInTheDocument();
  });

  it("displays the description", () => {
    render(<CheckboxCard title="Plan" description="Best value" />);
    expect(screen.getByText("Best value")).toBeInTheDocument();
  });

  it("defaults to unchecked", () => {
    render(<CheckboxCard title="Option A" />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-checked", "false");
  });

  it("toggles on click", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<CheckboxCard title="Option A" onChange={onChange} />);
    await user.click(screen.getByRole("checkbox"));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("toggles off when already checked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<CheckboxCard title="Option A" defaultChecked onChange={onChange} />);
    await user.click(screen.getByRole("checkbox"));
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it("toggles on Space key", () => {
    const onChange = vi.fn();
    render(<CheckboxCard title="Option A" onChange={onChange} />);
    fireEvent.keyDown(screen.getByRole("checkbox"), { key: " " });
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("toggles on Enter key", () => {
    const onChange = vi.fn();
    render(<CheckboxCard title="Option A" onChange={onChange} />);
    fireEvent.keyDown(screen.getByRole("checkbox"), { key: "Enter" });
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("does not toggle when disabled", async () => {
    const onChange = vi.fn();
    render(<CheckboxCard title="Option A" disabled onChange={onChange} />);
    // pointer-events-none prevents userEvent clicks, so use fireEvent
    fireEvent.click(screen.getByRole("checkbox"));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("has hidden input for form compatibility", () => {
    const { container } = render(<CheckboxCard title="Option A" value="a" defaultChecked />);
    const input = container.querySelector("input[type='checkbox']") as HTMLInputElement;
    expect(input).toBeTruthy();
    expect(input.value).toBe("a");
    expect(input.checked).toBe(true);
  });

  it("works in controlled mode", () => {
    render(<CheckboxCard title="Option A" checked={true} />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-checked", "true");
  });

  it.each(["sm", "md", "lg"] as const)("renders at %s size", (size) => {
    render(<CheckboxCard title="Option" size={size} />);
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it.each(["primary", "secondary", "success"] as const)(
    "renders with %s color",
    (color) => {
      render(<CheckboxCard title="Option" color={color} defaultChecked />);
      expect(screen.getByRole("checkbox")).toBeInTheDocument();
    },
  );

  it("renders children", () => {
    render(
      <CheckboxCard title="Option A">
        <span data-testid="child">Extra</span>
      </CheckboxCard>,
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("renders string icon", () => {
    const { container } = render(<CheckboxCard title="Option" icon="star" />);
    // Icon component renders as a <span> with material-symbols-outlined class
    const iconSpan = container.querySelector(".material-symbols-outlined");
    expect(iconSpan).toBeInTheDocument();
    expect(iconSpan?.textContent).toBe("star");
  });

  it("renders ReactNode icon", () => {
    render(
      <CheckboxCard title="Option" icon={<span data-testid="custom-icon">*</span>} />,
    );
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });

  it("accepts custom className", () => {
    const { container } = render(<CheckboxCard title="Option" className="my-class" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("my-class");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<CheckboxCard title="Option A" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no accessibility violations when checked", async () => {
    const { container } = render(<CheckboxCard title="Option A" defaultChecked />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

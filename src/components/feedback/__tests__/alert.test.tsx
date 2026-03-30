import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Alert } from "../alert";

describe("Alert", () => {
  it("renders with default variant", () => {
    render(<Alert>Default alert message</Alert>);
    const alert = screen.getByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveClass("bg-blue-50");
    expect(screen.getByText("Default alert message")).toBeInTheDocument();
  });

  it.each([
    ["info", "bg-blue-50"],
    ["success", "bg-green-50"],
    ["warning", "bg-amber-50"],
    ["error", "bg-red-50"],
  ] as const)("renders %s variant with correct styles", (variant, expectedClass) => {
    render(<Alert variant={variant}>Content</Alert>);
    expect(screen.getByRole("alert")).toHaveClass(expectedClass);
  });

  it("renders title when provided", () => {
    render(<Alert title="Heads up">Description text</Alert>);
    expect(screen.getByText("Heads up")).toBeInTheDocument();
  });

  it("renders children as description", () => {
    render(<Alert>This is a description</Alert>);
    expect(screen.getByText("This is a description")).toBeInTheDocument();
  });

  it("shows dismiss button when dismissible is true", () => {
    render(<Alert dismissible>Content</Alert>);
    expect(screen.getByRole("button", { name: "Dismiss" })).toBeInTheDocument();
  });

  it("does not show dismiss button when dismissible is false", () => {
    render(<Alert>Content</Alert>);
    expect(screen.queryByRole("button", { name: "Dismiss" })).not.toBeInTheDocument();
  });

  it("calls onDismiss when dismiss button is clicked", () => {
    const onDismiss = vi.fn();
    render(<Alert dismissible onDismiss={onDismiss}>Content</Alert>);
    fireEvent.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<Alert ref={ref}>Content</Alert>);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  it("merges className", () => {
    render(<Alert className="custom-class">Content</Alert>);
    const alert = screen.getByRole("alert");
    expect(alert).toHaveClass("custom-class");
    // Should still have base classes
    expect(alert).toHaveClass("flex");
  });

  it("has role='alert'", () => {
    render(<Alert>Content</Alert>);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("renders custom icon name", () => {
    render(<Alert icon="star">Content</Alert>);
    // The alert should render without error with a custom icon
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("renders title and description together", () => {
    render(
      <Alert title="Important" variant="warning">
        Please read this carefully.
      </Alert>
    );
    expect(screen.getByText("Important")).toBeInTheDocument();
    expect(screen.getByText("Please read this carefully.")).toBeInTheDocument();
  });

  it("spreads additional HTML attributes", () => {
    render(<Alert data-testid="my-alert">Content</Alert>);
    expect(screen.getByTestId("my-alert")).toBeInTheDocument();
  });
});

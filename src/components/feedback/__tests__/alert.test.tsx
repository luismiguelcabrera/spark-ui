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

  // === New feature tests: fill prop ===

  describe("fill prop", () => {
    it("defaults to flat fill style", () => {
      render(<Alert>Content</Alert>);
      const alert = screen.getByRole("alert");
      expect(alert).toHaveClass("bg-blue-50");
    });

    it.each([
      ["info", "tonal", "bg-blue-100"],
      ["success", "tonal", "bg-green-100"],
      ["warning", "tonal", "bg-amber-100"],
      ["error", "tonal", "bg-red-100"],
    ] as const)("renders %s variant with tonal fill", (variant, fill, expectedClass) => {
      render(<Alert variant={variant} fill={fill}>Content</Alert>);
      expect(screen.getByRole("alert")).toHaveClass(expectedClass);
    });

    it.each([
      ["info", "outlined", "bg-transparent"],
      ["success", "outlined", "bg-transparent"],
      ["warning", "outlined", "bg-transparent"],
      ["error", "outlined", "bg-transparent"],
    ] as const)("renders %s variant with outlined fill", (variant, fill, expectedClass) => {
      render(<Alert variant={variant} fill={fill}>Content</Alert>);
      expect(screen.getByRole("alert")).toHaveClass(expectedClass);
    });
  });

  // === New feature tests: border prop ===

  describe("border prop", () => {
    it("does not show border by default", () => {
      render(<Alert>Content</Alert>);
      const alert = screen.getByRole("alert");
      expect(alert).not.toHaveClass("border-t-4");
      expect(alert).not.toHaveClass("border-b-4");
      expect(alert).not.toHaveClass("border-l-4");
      expect(alert).not.toHaveClass("border-r-4");
    });

    it.each([
      ["top", "border-t-4"],
      ["bottom", "border-b-4"],
      ["start", "border-l-4"],
      ["end", "border-r-4"],
    ] as const)("applies %s border", (side, expectedClass) => {
      render(<Alert border={side}>Content</Alert>);
      expect(screen.getByRole("alert")).toHaveClass(expectedClass);
    });

    it("applies the correct color for the border based on variant", () => {
      render(<Alert variant="error" border="start">Content</Alert>);
      expect(screen.getByRole("alert")).toHaveClass("border-red-500");
    });

    it("applies the correct color for success border", () => {
      render(<Alert variant="success" border="top">Content</Alert>);
      expect(screen.getByRole("alert")).toHaveClass("border-green-500");
    });
  });

  // === New feature tests: prominent prop ===

  describe("prominent prop", () => {
    it("defaults to non-prominent", () => {
      render(<Alert>Content</Alert>);
      const alert = screen.getByRole("alert");
      expect(alert).toHaveClass("p-4");
      expect(alert).not.toHaveClass("p-5");
    });

    it("applies larger padding when prominent", () => {
      render(<Alert prominent>Content</Alert>);
      const alert = screen.getByRole("alert");
      expect(alert).toHaveClass("p-5");
    });

    it("renders larger title text when prominent", () => {
      render(<Alert prominent title="Big Title">Content</Alert>);
      const title = screen.getByText("Big Title");
      expect(title).toHaveClass("text-base");
    });

    it("renders normal title text when not prominent", () => {
      render(<Alert title="Normal Title">Content</Alert>);
      const title = screen.getByText("Normal Title");
      expect(title).toHaveClass("text-sm");
    });
  });

  // === Combination tests ===

  it("combines border, fill, and prominent props", () => {
    render(
      <Alert variant="warning" fill="tonal" border="start" prominent>
        Combined features
      </Alert>
    );
    const alert = screen.getByRole("alert");
    expect(alert).toHaveClass("bg-amber-100"); // tonal
    expect(alert).toHaveClass("border-l-4"); // start border
    expect(alert).toHaveClass("border-amber-500"); // warning border color
    expect(alert).toHaveClass("p-5"); // prominent
  });
});

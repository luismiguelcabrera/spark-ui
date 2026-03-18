import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Result } from "../result";

describe("Result", () => {
  it("renders with title", () => {
    render(<Result status="success" title="Operation Successful" />);
    expect(screen.getByText("Operation Successful")).toBeInTheDocument();
  });

  it("renders subtitle when provided", () => {
    render(
      <Result
        status="error"
        title="Error"
        subtitle="Something went wrong. Please try again."
      />
    );
    expect(
      screen.getByText("Something went wrong. Please try again.")
    ).toBeInTheDocument();
  });

  it("has role='status'", () => {
    render(<Result status="info" title="Info" />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it.each([
    "success",
    "error",
    "warning",
    "info",
    "403",
    "404",
    "500",
  ] as const)("renders %s status variant without error", (status) => {
    const { container } = render(
      <Result status={status} title={`${status} title`} />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders custom icon when provided", () => {
    render(
      <Result
        status="success"
        title="Done"
        icon={<span data-testid="custom-icon">*</span>}
      />
    );
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });

  it("renders extra content (action buttons)", () => {
    render(
      <Result
        status="error"
        title="Error"
        extra={<button type="button">Retry</button>}
      />
    );
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });

  it("renders children content", () => {
    render(
      <Result status="info" title="Info">
        <p data-testid="child-content">Additional details here</p>
      </Result>
    );
    expect(screen.getByTestId("child-content")).toBeInTheDocument();
  });

  it("merges className", () => {
    const { container } = render(
      <Result status="success" title="Done" className="custom-class" />
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<Result ref={ref} status="success" title="Done" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("displays icon with correct color for success", () => {
    const { container } = render(
      <Result status="success" title="Success" />
    );
    const iconWrapper = container.querySelector(".bg-green-50");
    expect(iconWrapper).toBeInTheDocument();
  });

  it("displays icon with correct color for error", () => {
    const { container } = render(
      <Result status="error" title="Error" />
    );
    const iconWrapper = container.querySelector(".bg-red-50");
    expect(iconWrapper).toBeInTheDocument();
  });

  it("renders without subtitle", () => {
    const { container } = render(
      <Result status="success" title="Success" />
    );
    // Should not have a <p> subtitle element
    const paragraphs = container.querySelectorAll("p");
    expect(paragraphs.length).toBe(0);
  });

  it("renders without extra", () => {
    const { container } = render(
      <Result status="success" title="Success" />
    );
    expect(container.querySelectorAll("button").length).toBe(0);
  });
});

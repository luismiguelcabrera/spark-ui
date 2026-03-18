import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { LoadingOverlay } from "../loading-overlay";

describe("LoadingOverlay", () => {
  it("renders children without overlay when not visible", () => {
    render(
      <LoadingOverlay visible={false}>
        <p>Content</p>
      </LoadingOverlay>
    );
    expect(screen.getByText("Content")).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("renders overlay with status role when visible", () => {
    render(
      <LoadingOverlay visible>
        <p>Content</p>
      </LoadingOverlay>
    );
    // Both the overlay div and the Spinner inside have role="status"
    const statusElements = screen.getAllByRole("status");
    expect(statusElements.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(
      <LoadingOverlay ref={ref} visible>
        <p>Content</p>
      </LoadingOverlay>
    );
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  it("has displayName", () => {
    expect(LoadingOverlay.displayName).toBe("LoadingOverlay");
  });

  it("merges className", () => {
    const { container } = render(
      <LoadingOverlay visible className="custom-class">
        <p>Content</p>
      </LoadingOverlay>
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("displays label text and uses it as aria-label", () => {
    render(
      <LoadingOverlay visible label="Loading data...">
        <p>Content</p>
      </LoadingOverlay>
    );
    expect(screen.getByText("Loading data...")).toBeInTheDocument();
    // The overlay div (not the spinner) has the label
    const statusElements = screen.getAllByRole("status");
    const overlayDiv = statusElements.find((el) => el.tagName === "DIV");
    expect(overlayDiv).toHaveAttribute("aria-label", "Loading data...");
  });

  it("defaults aria-label to 'Loading'", () => {
    render(
      <LoadingOverlay visible>
        <p>Content</p>
      </LoadingOverlay>
    );
    const statusElements = screen.getAllByRole("status");
    const overlayDiv = statusElements.find((el) => el.tagName === "DIV");
    expect(overlayDiv).toHaveAttribute("aria-label", "Loading");
  });

  it("applies fullScreen fixed positioning", () => {
    render(
      <LoadingOverlay visible fullScreen>
        <p>Content</p>
      </LoadingOverlay>
    );
    const statusElements = screen.getAllByRole("status");
    const overlayDiv = statusElements.find((el) => el.tagName === "DIV");
    expect(overlayDiv).toHaveClass("fixed");
  });

  it("renders custom spinner", () => {
    render(
      <LoadingOverlay visible spinner={<div data-testid="custom-spinner" />}>
        <p>Content</p>
      </LoadingOverlay>
    );
    expect(screen.getByTestId("custom-spinner")).toBeInTheDocument();
  });
});

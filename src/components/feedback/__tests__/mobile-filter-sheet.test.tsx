import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { MobileFilterSheet } from "../mobile-filter-sheet";

describe("MobileFilterSheet", () => {
  it("has displayName", () => {
    expect(MobileFilterSheet.displayName).toBe("MobileFilterSheet");
  });

  it("renders trigger button", () => {
    render(
      <MobileFilterSheet label="Filters">
        <p>Filter content</p>
      </MobileFilterSheet>
    );
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByText("Filters")).toBeInTheDocument();
  });

  it("does not show dialog initially", () => {
    render(
      <MobileFilterSheet label="Filters">
        <p>Filter content</p>
      </MobileFilterSheet>
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens dialog when trigger is clicked", async () => {
    const user = userEvent.setup();
    render(
      <MobileFilterSheet label="Filters">
        <p>Filter content</p>
      </MobileFilterSheet>
    );
    await user.click(screen.getByRole("button", { name: /Filters/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Filter content")).toBeInTheDocument();
  });

  it("has aria-modal on dialog", async () => {
    const user = userEvent.setup();
    render(
      <MobileFilterSheet label="Filters">
        <p>Content</p>
      </MobileFilterSheet>
    );
    await user.click(screen.getByRole("button", { name: /Filters/i }));
    expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true");
  });

  it("displays active count badge", () => {
    render(
      <MobileFilterSheet label="Filters" activeCount={3}>
        <p>Content</p>
      </MobileFilterSheet>
    );
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("closes when close button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <MobileFilterSheet label="Filters">
        <p>Content</p>
      </MobileFilterSheet>
    );
    await user.click(screen.getByRole("button", { name: /Filters/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /close/i }));
    // Sheet uses exit animation — fire transitionEnd to unmount in jsdom
    const panel = screen.getByRole("dialog").querySelector("[class*=shadow-float]");
    if (panel) fireEvent.transitionEnd(panel);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("Section renders label and children", () => {
    const { container } = render(
      <MobileFilterSheet.Section label="Category">
        <span>Option</span>
      </MobileFilterSheet.Section>
    );
    expect(container).toHaveTextContent("Category");
    expect(container).toHaveTextContent("Option");
  });

  it("Pill renders with aria-pressed", () => {
    const onClick = vi.fn();
    render(<MobileFilterSheet.Pill active onClick={onClick}>Tag</MobileFilterSheet.Pill>);
    const pill = screen.getByRole("button", { name: "Tag" });
    expect(pill).toHaveAttribute("aria-pressed", "true");
  });
});

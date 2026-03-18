import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { TabFilter } from "../tab-filter";

const items = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Archived", value: "archived" },
];

describe("TabFilter", () => {
  it("renders all items as tabs", () => {
    render(<TabFilter items={items} />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs.length).toBeGreaterThanOrEqual(3);
  });

  it("has displayName", () => {
    expect(TabFilter.displayName).toBe("TabFilter");
  });

  it("merges className", () => {
    const { container } = render(<TabFilter items={items} className="custom" />);
    // className is applied to both mobile select wrapper and desktop wrapper
    const desktopWrapper = container.querySelector(".custom");
    expect(desktopWrapper).toBeInTheDocument();
  });

  it("renders a mobile select with options", () => {
    render(<TabFilter items={items} />);
    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(3);
  });

  it("mobile select has aria-label", () => {
    const { container } = render(<TabFilter items={items} />);
    const select = container.querySelector("select");
    expect(select).toHaveAttribute("aria-label", "Filter");
  });

  it("has role='tablist' on desktop", () => {
    render(<TabFilter items={items} />);
    expect(screen.getByRole("tablist")).toBeInTheDocument();
  });

  it("sets aria-selected on active tab", () => {
    render(<TabFilter items={items} defaultValue="active" />);
    const tabs = screen.getAllByRole("tab");
    const activeTab = tabs.find((t) => t.textContent === "Active")!;
    expect(activeTab).toHaveAttribute("aria-selected", "true");
  });

  it("calls onValueChange when a tab is clicked", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<TabFilter items={items} onValueChange={onValueChange} />);
    const tabs = screen.getAllByRole("tab");
    await user.click(tabs.find((t) => t.textContent === "Active")!);
    expect(onValueChange).toHaveBeenCalledWith("active");
  });

  it("defaults to first item", () => {
    render(<TabFilter items={items} />);
    const tabs = screen.getAllByRole("tab");
    const allTab = tabs.find((t) => t.textContent === "All")!;
    expect(allTab).toHaveAttribute("aria-selected", "true");
  });
});

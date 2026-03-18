import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { NotificationItem } from "../notification-item";

describe("NotificationItem", () => {
  it("renders title and timestamp", () => {
    render(<NotificationItem title="New message" timestamp="2m ago" />);
    expect(screen.getByText("New message")).toBeInTheDocument();
    expect(screen.getByText("2m ago")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<NotificationItem ref={ref} title="Test" timestamp="1m ago" />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  it("has displayName", () => {
    expect(NotificationItem.displayName).toBe("NotificationItem");
  });

  it("merges className", () => {
    render(
      <NotificationItem title="Test" timestamp="1m ago" className="custom-class" />
    );
    expect(screen.getByRole("article")).toHaveClass("custom-class");
  });

  it("has role='article'", () => {
    render(<NotificationItem title="Test" timestamp="1m" />);
    expect(screen.getByRole("article")).toBeInTheDocument();
  });

  it("includes 'Unread notification' in aria-label for unread state", () => {
    render(<NotificationItem title="Alert" timestamp="now" state="unread" />);
    expect(screen.getByRole("article")).toHaveAttribute(
      "aria-label",
      "Unread notification: Alert"
    );
  });

  it("does not include 'Unread' in aria-label for read state", () => {
    render(<NotificationItem title="Alert" timestamp="now" state="read" />);
    expect(screen.getByRole("article")).toHaveAttribute("aria-label", "Alert");
  });

  it("renders description when provided", () => {
    render(
      <NotificationItem
        title="Update"
        description="Your order shipped"
        timestamp="5m ago"
      />
    );
    expect(screen.getByText("Your order shipped")).toBeInTheDocument();
  });

  it("shows unread dot for unread state", () => {
    const { container } = render(
      <NotificationItem title="Test" timestamp="1m" state="unread" />
    );
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  });
});

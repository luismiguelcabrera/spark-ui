import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Sheet } from "../sheet";

describe("Sheet", () => {
  it("renders when open", () => {
    render(<Sheet open={true} onOpenChange={() => {}} title="Settings">Content</Sheet>);
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    render(<Sheet open={false} onOpenChange={() => {}} title="Settings">Content</Sheet>);
    expect(screen.queryByText("Settings")).not.toBeInTheDocument();
  });

  it("calls onOpenChange when close button clicked", () => {
    const onOpenChange = vi.fn();
    render(<Sheet open={true} onOpenChange={onOpenChange} title="Settings">Content</Sheet>);
    fireEvent.click(screen.getByLabelText("Close"));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("shows description", () => {
    render(<Sheet open={true} onOpenChange={() => {}} title="Settings" description="Manage your preferences">Content</Sheet>);
    expect(screen.getByText("Manage your preferences")).toBeInTheDocument();
  });

  it("shows footer", () => {
    render(<Sheet open={true} onOpenChange={() => {}} footer={<button>Save</button>}>Content</Sheet>);
    expect(screen.getByText("Save")).toBeInTheDocument();
  });

  it("has dialog role", () => {
    render(<Sheet open={true} onOpenChange={() => {}}>Content</Sheet>);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});

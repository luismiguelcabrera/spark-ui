import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AlertDialog } from "../alert-dialog";

describe("AlertDialog", () => {
  it("renders when open", () => {
    render(<AlertDialog open={true} onOpenChange={() => {}} title="Delete?" />);
    expect(screen.getByText("Delete?")).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    render(<AlertDialog open={false} onOpenChange={() => {}} title="Delete?" />);
    expect(screen.queryByText("Delete?")).not.toBeInTheDocument();
  });

  it("calls onConfirm when confirm button is clicked", () => {
    const onConfirm = vi.fn();
    render(<AlertDialog open={true} onOpenChange={() => {}} title="Delete?" onConfirm={onConfirm} />);
    fireEvent.click(screen.getByText("Confirm"));
    expect(onConfirm).toHaveBeenCalled();
  });

  it("calls onCancel and closes when cancel button is clicked", () => {
    const onCancel = vi.fn();
    const onOpenChange = vi.fn();
    render(<AlertDialog open={true} onOpenChange={onOpenChange} title="Delete?" onCancel={onCancel} />);
    fireEvent.click(screen.getByText("Cancel"));
    expect(onCancel).toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("shows description", () => {
    render(<AlertDialog open={true} onOpenChange={() => {}} title="Delete?" description="This action cannot be undone." />);
    expect(screen.getByText("This action cannot be undone.")).toBeInTheDocument();
  });

  it("has alertdialog role", () => {
    render(<AlertDialog open={true} onOpenChange={() => {}} title="Delete?" />);
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
  });
});

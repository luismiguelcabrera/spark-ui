import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { createRef } from "react";
import { ActionBar } from "../action-bar";

describe("ActionBar", () => {
  it("renders children when open", () => {
    render(
      <ActionBar open={true}>
        <button type="button">Delete</button>
      </ActionBar>,
    );
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    render(
      <ActionBar open={false}>
        <button type="button">Delete</button>
      </ActionBar>,
    );
    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
  });

  it("displays the selected count", () => {
    render(
      <ActionBar open={true} count={5}>
        <button type="button">Delete</button>
      </ActionBar>,
    );
    expect(screen.getByText("5 selected")).toBeInTheDocument();
  });

  it("has toolbar role", () => {
    render(
      <ActionBar open={true}>
        <button type="button">Action</button>
      </ActionBar>,
    );
    expect(screen.getByRole("toolbar")).toBeInTheDocument();
  });

  it("has correct aria-label with count", () => {
    render(
      <ActionBar open={true} count={3}>
        <button type="button">Action</button>
      </ActionBar>,
    );
    expect(screen.getByRole("toolbar")).toHaveAttribute(
      "aria-label",
      "3 items selected",
    );
  });

  it("has correct aria-label with count of 1 (singular)", () => {
    render(
      <ActionBar open={true} count={1}>
        <button type="button">Action</button>
      </ActionBar>,
    );
    expect(screen.getByRole("toolbar")).toHaveAttribute(
      "aria-label",
      "1 item selected",
    );
  });

  it("has default aria-label without count", () => {
    render(
      <ActionBar open={true}>
        <button type="button">Action</button>
      </ActionBar>,
    );
    expect(screen.getByRole("toolbar")).toHaveAttribute(
      "aria-label",
      "Action bar",
    );
  });

  it("renders close button when onClose is provided", () => {
    const onClose = vi.fn();
    render(
      <ActionBar open={true} onClose={onClose}>
        <button type="button">Action</button>
      </ActionBar>,
    );
    expect(screen.getByLabelText("Close action bar")).toBeInTheDocument();
  });

  it("does not render close button when onClose is not provided", () => {
    render(
      <ActionBar open={true}>
        <button type="button">Action</button>
      </ActionBar>,
    );
    expect(screen.queryByLabelText("Close action bar")).not.toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const onClose = vi.fn();
    render(
      <ActionBar open={true} onClose={onClose}>
        <button type="button">Action</button>
      </ActionBar>,
    );
    fireEvent.click(screen.getByLabelText("Close action bar"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Escape key is pressed", () => {
    const onClose = vi.fn();
    render(
      <ActionBar open={true} onClose={onClose}>
        <button type="button">Action</button>
      </ActionBar>,
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not call onClose on Escape when closed", () => {
    const onClose = vi.fn();
    render(
      <ActionBar open={false} onClose={onClose}>
        <button type="button">Action</button>
      </ActionBar>,
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).not.toHaveBeenCalled();
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <ActionBar ref={ref} open={true}>
        <button type="button">Action</button>
      </ActionBar>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("applies custom className", () => {
    render(
      <ActionBar open={true} className="custom-class">
        <button type="button">Action</button>
      </ActionBar>,
    );
    expect(screen.getByRole("toolbar")).toHaveClass("custom-class");
  });

  it("renders with position top", () => {
    render(
      <ActionBar open={true} position="top">
        <button type="button">Action</button>
      </ActionBar>,
    );
    expect(screen.getByRole("toolbar")).toHaveClass("top-4");
  });

  it("renders with default position bottom", () => {
    render(
      <ActionBar open={true}>
        <button type="button">Action</button>
      </ActionBar>,
    );
    expect(screen.getByRole("toolbar")).toHaveClass("bottom-4");
  });

  it("renders multiple action buttons", () => {
    render(
      <ActionBar open={true} count={2}>
        <button type="button">Archive</button>
        <button type="button">Delete</button>
        <button type="button">Move</button>
      </ActionBar>,
    );
    expect(screen.getByText("Archive")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
    expect(screen.getByText("Move")).toBeInTheDocument();
  });

  it("renders count of 0", () => {
    render(
      <ActionBar open={true} count={0}>
        <button type="button">Action</button>
      </ActionBar>,
    );
    expect(screen.getByText("0 selected")).toBeInTheDocument();
  });

  it("close button has type=button", () => {
    render(
      <ActionBar open={true} onClose={() => {}}>
        <button type="button">Action</button>
      </ActionBar>,
    );
    expect(screen.getByLabelText("Close action bar")).toHaveAttribute(
      "type",
      "button",
    );
  });
});

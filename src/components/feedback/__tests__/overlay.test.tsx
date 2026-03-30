import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Overlay } from "../overlay";

describe("Overlay", () => {
  it("renders when open is true", () => {
    render(
      <Overlay open={true} onOpenChange={() => {}}>
        <p>Content</p>
      </Overlay>,
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("does not render when open is false", () => {
    render(
      <Overlay open={false} onOpenChange={() => {}}>
        <p>Content</p>
      </Overlay>,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("has aria-modal attribute", () => {
    render(
      <Overlay open={true} onOpenChange={() => {}}>
        <p>Content</p>
      </Overlay>,
    );
    expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true");
  });

  it("renders scrim backdrop by default", () => {
    const { container } = render(
      <Overlay open={true} onOpenChange={() => {}}>
        <p>Content</p>
      </Overlay>,
    );
    const scrim = container.querySelector('[aria-hidden="true"]');
    expect(scrim).toBeInTheDocument();
    expect(scrim).toHaveClass("bg-black/40");
  });

  it("hides scrim when scrim is false", () => {
    const { container } = render(
      <Overlay open={true} onOpenChange={() => {}} scrim={false}>
        <p>Content</p>
      </Overlay>,
    );
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeInTheDocument();
  });

  it("applies backdrop blur when blur is true", () => {
    const { container } = render(
      <Overlay open={true} onOpenChange={() => {}} blur>
        <p>Content</p>
      </Overlay>,
    );
    const scrim = container.querySelector('[aria-hidden="true"]');
    expect(scrim).toHaveClass("backdrop-blur-sm");
  });

  it("does not apply blur by default", () => {
    const { container } = render(
      <Overlay open={true} onOpenChange={() => {}}>
        <p>Content</p>
      </Overlay>,
    );
    const scrim = container.querySelector('[aria-hidden="true"]');
    expect(scrim).not.toHaveClass("backdrop-blur-sm");
  });

  it("closes when backdrop is clicked (closeOnClick default true)", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { container } = render(
      <Overlay open={true} onOpenChange={onOpenChange}>
        <p>Content</p>
      </Overlay>,
    );
    const scrim = container.querySelector('[aria-hidden="true"]')!;
    await user.click(scrim);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("does not close when backdrop clicked and closeOnClick is false", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { container } = render(
      <Overlay open={true} onOpenChange={onOpenChange} closeOnClick={false}>
        <p>Content</p>
      </Overlay>,
    );
    const scrim = container.querySelector('[aria-hidden="true"]')!;
    await user.click(scrim);
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("closes on Escape key", () => {
    const onOpenChange = vi.fn();
    render(
      <Overlay open={true} onOpenChange={onOpenChange}>
        <p>Content</p>
      </Overlay>,
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("does not close on Escape when closeOnEscape is false", () => {
    const onOpenChange = vi.fn();
    render(
      <Overlay open={true} onOpenChange={onOpenChange} closeOnEscape={false}>
        <p>Content</p>
      </Overlay>,
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("forwards ref to the container div", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(
      <Overlay ref={ref} open={true} onOpenChange={() => {}}>
        <p>Content</p>
      </Overlay>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("merges className onto the container", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(
      <Overlay ref={ref} open={true} onOpenChange={() => {}} className="custom-overlay">
        <p>Content</p>
      </Overlay>,
    );
    expect(ref.current).toHaveClass("custom-overlay");
  });
});

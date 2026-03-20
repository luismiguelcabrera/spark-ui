import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createRef } from "react";
import { Signature } from "../signature";
import type { SignatureRef } from "../signature";

// ---- Canvas mock ----

const mockCtx = {
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  stroke: vi.fn(),
  clearRect: vi.fn(),
  scale: vi.fn(),
  drawImage: vi.fn(),
  fillRect: vi.fn(),
  fillText: vi.fn(),
  measureText: vi.fn(() => ({ width: 0 })),
  set strokeStyle(_v: string) {},
  set fillStyle(_v: string) {},
  set lineWidth(_v: number) {},
  set lineCap(_v: string) {},
  set lineJoin(_v: string) {},
};

beforeEach(() => {
  vi.clearAllMocks();

  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
    mockCtx as unknown as CanvasRenderingContext2D,
  );

  vi.spyOn(HTMLCanvasElement.prototype, "toDataURL").mockReturnValue(
    "data:image/png;base64,TEST",
  );
});

describe("Signature", () => {
  it("renders a canvas element", () => {
    const { container } = render(<Signature />);
    const canvas = container.querySelector("canvas");
    expect(canvas).toBeInTheDocument();
  });

  it("has correct width/height style", () => {
    const { container } = render(<Signature width={300} height={150} />);
    const canvas = container.querySelector("canvas") as HTMLCanvasElement;
    expect(canvas.style.width).toBe("300px");
    expect(canvas.style.height).toBe("150px");
  });

  it("forwards ref with imperative methods (clear, undo, toDataURL, isEmpty)", () => {
    const ref = createRef<SignatureRef>();
    render(<Signature ref={ref} />);
    expect(ref.current).toBeDefined();
    expect(typeof ref.current!.clear).toBe("function");
    expect(typeof ref.current!.undo).toBe("function");
    expect(typeof ref.current!.toDataURL).toBe("function");
    expect(typeof ref.current!.isEmpty).toBe("function");
  });

  it("isEmpty returns true initially", () => {
    const ref = createRef<SignatureRef>();
    render(<Signature ref={ref} />);
    expect(ref.current!.isEmpty()).toBe(true);
  });

  it("clear calls onChange with null", () => {
    const onChange = vi.fn();
    const ref = createRef<SignatureRef>();
    render(<Signature ref={ref} onChange={onChange} />);
    ref.current!.clear();
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it("disabled prevents interaction (pointer-events-none class)", () => {
    const { container } = render(<Signature disabled />);
    const canvas = container.querySelector("canvas");
    expect(canvas).toHaveClass("pointer-events-none");
  });

  it("has displayName", () => {
    expect(Signature.displayName).toBe("Signature");
  });

  it("merges className", () => {
    const { container } = render(<Signature className="custom-class" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveClass("flex", "flex-col", "gap-2", "custom-class");
  });

  it("error state shows border-destructive and error text with role=alert", () => {
    const { container } = render(<Signature error="Signature is required" />);
    const canvas = container.querySelector("canvas");
    expect(canvas).toHaveClass("border-destructive/50");
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Signature is required");
  });

  it("label renders", () => {
    render(<Signature label="Your signature" />);
    expect(screen.getByText("Your signature")).toBeInTheDocument();
  });

  it("renders undo and clear buttons", () => {
    render(<Signature />);
    expect(screen.getByLabelText("Undo")).toBeInTheDocument();
    expect(screen.getByLabelText("Clear signature")).toBeInTheDocument();
  });

  it("undo button is disabled when disabled prop true", () => {
    render(<Signature disabled />);
    expect(screen.getByLabelText("Undo")).toBeDisabled();
  });

  it("clear button is disabled when disabled prop true", () => {
    render(<Signature disabled />);
    expect(screen.getByLabelText("Clear signature")).toBeDisabled();
  });

  it("readOnly disables buttons", () => {
    render(<Signature readOnly />);
    expect(screen.getByLabelText("Undo")).toBeDisabled();
    expect(screen.getByLabelText("Clear signature")).toBeDisabled();
  });

  it("toDataURL returns mocked data URL", () => {
    const ref = createRef<SignatureRef>();
    render(<Signature ref={ref} />);
    expect(ref.current!.toDataURL()).toBe("data:image/png;base64,TEST");
  });

  it("shows placeholder text when empty", () => {
    render(<Signature />);
    expect(screen.getByText("Sign here")).toBeInTheDocument();
  });

  it("default width and height are applied", () => {
    const { container } = render(<Signature />);
    const canvas = container.querySelector("canvas") as HTMLCanvasElement;
    expect(canvas.style.width).toBe("400px");
    expect(canvas.style.height).toBe("200px");
  });
});

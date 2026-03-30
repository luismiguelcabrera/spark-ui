import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { DiffViewer } from "../diff-viewer";
import type { DiffLine } from "../diff-viewer";

const sampleLines: DiffLine[] = [
  { type: "unchanged", content: "const a = 1;" },
  { type: "removed", content: "const b = 2;" },
  { type: "added", content: "const b = 3;" },
];

describe("DiffViewer", () => {
  it("renders all diff lines", () => {
    render(<DiffViewer lines={sampleLines} />);
    expect(screen.getByText("const a = 1;")).toBeInTheDocument();
    expect(screen.getByText("const b = 2;")).toBeInTheDocument();
    expect(screen.getByText("const b = 3;")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<DiffViewer ref={ref} lines={sampleLines} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has displayName", () => {
    expect(DiffViewer.displayName).toBe("DiffViewer");
  });

  it("merges className", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<DiffViewer ref={ref} lines={sampleLines} className="custom-diff" />);
    expect(ref.current?.className).toContain("custom-diff");
    expect(ref.current?.className).toContain("rounded-xl");
  });

  it("renders title when provided", () => {
    render(<DiffViewer lines={sampleLines} title="Changes" />);
    expect(screen.getByText("Changes")).toBeInTheDocument();
  });

  it("renders language label when provided", () => {
    render(<DiffViewer lines={sampleLines} title="Changes" language="javascript" />);
    expect(screen.getByText("javascript")).toBeInTheDocument();
  });

  it("does not render title bar when title is not provided", () => {
    const { container } = render(<DiffViewer lines={sampleLines} />);
    // The title bar has border-b class
    const titleBar = container.querySelector(".border-b.border-slate-200");
    expect(titleBar).toBeNull();
  });

  it("shows line numbers by default", () => {
    render(<DiffViewer lines={[{ type: "unchanged", content: "line one" }]} />);
    // Line number "1" should appear
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("hides line numbers when showLineNumbers is false", () => {
    const { container } = render(
      <DiffViewer lines={[{ type: "unchanged", content: "line one" }]} showLineNumbers={false} />
    );
    // No line number elements (w-8 shrink-0 class elements)
    const lineNums = container.querySelectorAll(".w-8.shrink-0");
    expect(lineNums.length).toBe(0);
  });

  it("renders diff symbols (+, -, space)", () => {
    const { container } = render(<DiffViewer lines={sampleLines} />);
    const symbols = container.querySelectorAll(".w-4.shrink-0");
    const symbolTexts = Array.from(symbols).map((s) => s.textContent);
    expect(symbolTexts).toContain("+");
    expect(symbolTexts).toContain("-");
  });

  it("applies color coding to diff lines", () => {
    const { container } = render(<DiffViewer lines={sampleLines} />);
    const lines = container.querySelectorAll(".flex.px-4");
    const addedLine = Array.from(lines).find((el) => el.className.includes("bg-success"));
    const removedLine = Array.from(lines).find((el) => el.className.includes("bg-destructive"));
    expect(addedLine).toBeTruthy();
    expect(removedLine).toBeTruthy();
  });

  it("uses custom lineNumber when provided", () => {
    const lines: DiffLine[] = [{ type: "unchanged", content: "hello", lineNumber: 42 }];
    render(<DiffViewer lines={lines} />);
    expect(screen.getByText("42")).toBeInTheDocument();
  });
});

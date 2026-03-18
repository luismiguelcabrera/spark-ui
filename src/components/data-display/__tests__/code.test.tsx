import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { InlineCode, CodeBlock } from "../code";

describe("InlineCode", () => {
  it("renders children", () => {
    render(<InlineCode>const x = 1</InlineCode>);
    expect(screen.getByText("const x = 1")).toBeInTheDocument();
  });

  it("renders as a code element", () => {
    render(<InlineCode>code</InlineCode>);
    expect(screen.getByText("code").tagName).toBe("CODE");
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLElement | null };
    render(<InlineCode ref={ref}>code</InlineCode>);
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current?.tagName).toBe("CODE");
  });

  it("has displayName", () => {
    expect(InlineCode.displayName).toBe("InlineCode");
  });

  it("merges className", () => {
    render(<InlineCode className="custom-code">code</InlineCode>);
    const el = screen.getByText("code");
    expect(el.className).toContain("custom-code");
    expect(el.className).toContain("font-mono");
  });
});

describe("CodeBlock", () => {
  it("renders children inside a pre > code structure", () => {
    render(<CodeBlock>some code</CodeBlock>);
    const code = screen.getByText("some code");
    expect(code.tagName).toBe("CODE");
    expect(code.parentElement?.tagName).toBe("PRE");
  });

  it("forwards ref to the pre element", () => {
    const ref = { current: null as HTMLPreElement | null };
    render(<CodeBlock ref={ref}>code</CodeBlock>);
    expect(ref.current).toBeInstanceOf(HTMLPreElement);
  });

  it("has displayName", () => {
    expect(CodeBlock.displayName).toBe("CodeBlock");
  });

  it("merges className on the pre element", () => {
    const ref = { current: null as HTMLPreElement | null };
    render(<CodeBlock ref={ref} className="custom-pre">code</CodeBlock>);
    expect(ref.current?.className).toContain("custom-pre");
    expect(ref.current?.className).toContain("font-mono");
  });

  it("renders language label when provided", () => {
    render(<CodeBlock language="typescript">code</CodeBlock>);
    expect(screen.getByText("typescript")).toBeInTheDocument();
  });

  it("does not render language label when not provided", () => {
    const { container } = render(<CodeBlock>code</CodeBlock>);
    // The language label has a specific class
    const langLabel = container.querySelector(".uppercase.tracking-wider");
    expect(langLabel).toBeNull();
  });

  it("applies line number styles when showLineNumbers is true", () => {
    const ref = { current: null as HTMLPreElement | null };
    render(<CodeBlock ref={ref} showLineNumbers>code</CodeBlock>);
    expect(ref.current?.className).toContain("counter-reset");
  });
});

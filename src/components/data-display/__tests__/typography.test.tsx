import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Heading } from "../heading";
import { Text } from "../text";
import { InlineCode, CodeBlock } from "../code";
import { Kbd } from "../kbd";
import { Highlight } from "../highlight";
import { Blockquote } from "../blockquote";

describe("Heading", () => {
  it("renders with correct element based on size", () => {
    render(<Heading size="3xl">Title</Heading>);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Title");
  });

  it("renders with custom as prop", () => {
    render(<Heading as="h3">Title</Heading>);
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent("Title");
  });

  it("applies className", () => {
    render(<Heading className="custom">Title</Heading>);
    expect(screen.getByRole("heading")).toHaveClass("custom");
  });
});

describe("Text", () => {
  it("renders as paragraph by default", () => {
    render(<Text>Hello</Text>);
    expect(screen.getByText("Hello").tagName).toBe("P");
  });

  it("renders as custom element", () => {
    render(<Text as="span">Hello</Text>);
    expect(screen.getByText("Hello").tagName).toBe("SPAN");
  });

  it("applies size variant", () => {
    render(<Text size="lg">Hello</Text>);
    expect(screen.getByText("Hello")).toHaveClass("text-lg");
  });
});

describe("InlineCode", () => {
  it("renders code element", () => {
    render(<InlineCode>const x = 1</InlineCode>);
    expect(screen.getByText("const x = 1").tagName).toBe("CODE");
  });
});

describe("CodeBlock", () => {
  it("renders pre element", () => {
    const { container } = render(<CodeBlock>code here</CodeBlock>);
    expect(container.querySelector("pre")).toBeInTheDocument();
  });

  it("shows language label", () => {
    render(<CodeBlock language="typescript">code</CodeBlock>);
    expect(screen.getByText("typescript")).toBeInTheDocument();
  });
});

describe("Kbd", () => {
  it("renders kbd element", () => {
    render(<Kbd>Enter</Kbd>);
    expect(screen.getByText("Enter").tagName).toBe("KBD");
  });

  it("renders multiple keys", () => {
    render(<Kbd keys={["Ctrl", "C"]} />);
    expect(screen.getByText("Ctrl")).toBeInTheDocument();
    expect(screen.getByText("C")).toBeInTheDocument();
  });
});

describe("Highlight", () => {
  it("renders mark element", () => {
    render(<Highlight>important</Highlight>);
    expect(screen.getByText("important").tagName).toBe("MARK");
  });
});

describe("Blockquote", () => {
  it("renders blockquote element", () => {
    render(<Blockquote>A wise quote</Blockquote>);
    expect(screen.getByText("A wise quote")).toBeInTheDocument();
  });

  it("shows author", () => {
    render(<Blockquote author="Einstein">Quote</Blockquote>);
    expect(screen.getByText("— Einstein")).toBeInTheDocument();
  });
});

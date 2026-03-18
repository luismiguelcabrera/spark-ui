import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { createRef } from "react";
import { Link } from "../link";

describe("Link", () => {
  it("renders without error", () => {
    render(<Link href="/test">Click me</Link>);
    expect(screen.getByRole("link")).toBeInTheDocument();
  });

  it("renders children", () => {
    render(<Link href="/test">Link text</Link>);
    expect(screen.getByText("Link text")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLAnchorElement>();
    render(<Link ref={ref} href="/test">Link</Link>);
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
  });

  it("has displayName", () => {
    expect(Link.displayName).toBe("Link");
  });

  it("merges className", () => {
    render(<Link href="/test" className="custom-link">Link</Link>);
    expect(screen.getByRole("link")).toHaveClass("custom-link");
  });

  it("sets href attribute", () => {
    render(<Link href="/about">About</Link>);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/about");
  });

  it("opens external links in new tab", () => {
    render(<Link href="https://example.com" external>External</Link>);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("does not set target for non-external links", () => {
    render(<Link href="/internal">Internal</Link>);
    expect(screen.getByRole("link")).not.toHaveAttribute("target");
  });

  it.each(["default", "subtle", "muted", "nav", "unstyled"] as const)(
    "renders variant=%s without error",
    (variant) => {
      render(<Link href="/test" variant={variant}>Link</Link>);
      expect(screen.getByRole("link")).toBeInTheDocument();
    },
  );

  it.each(["xs", "sm", "md", "lg"] as const)(
    "renders size=%s without error",
    (size) => {
      render(<Link href="/test" size={size}>Link</Link>);
      expect(screen.getByRole("link")).toBeInTheDocument();
    },
  );
});

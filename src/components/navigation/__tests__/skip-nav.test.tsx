import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { createRef } from "react";
import { SkipNavLink, SkipNavContent } from "../skip-nav";

describe("SkipNavLink", () => {
  it("renders without error", () => {
    render(<SkipNavLink />);
    expect(screen.getByText("Skip to main content")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLAnchorElement>();
    render(<SkipNavLink ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
  });

  it("has displayName", () => {
    expect(SkipNavLink.displayName).toBe("SkipNavLink");
  });

  it("merges className", () => {
    render(<SkipNavLink className="custom-skip" />);
    expect(screen.getByText("Skip to main content")).toHaveClass("custom-skip");
  });

  it("targets #main-content by default", () => {
    render(<SkipNavLink />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "#main-content");
  });

  it("targets custom contentId", () => {
    render(<SkipNavLink contentId="custom-content" />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "#custom-content");
  });

  it("renders custom children", () => {
    render(<SkipNavLink>Jump to content</SkipNavLink>);
    expect(screen.getByText("Jump to content")).toBeInTheDocument();
  });

  it("renders as an anchor element", () => {
    render(<SkipNavLink />);
    expect(screen.getByRole("link").tagName).toBe("A");
  });
});

describe("SkipNavContent", () => {
  it("renders without error", () => {
    render(<SkipNavContent>Main content here</SkipNavContent>);
    expect(screen.getByText("Main content here")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(<SkipNavContent ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has displayName", () => {
    expect(SkipNavContent.displayName).toBe("SkipNavContent");
  });

  it("has id=main-content by default", () => {
    const { container } = render(<SkipNavContent />);
    expect(container.firstChild).toHaveAttribute("id", "main-content");
  });

  it("accepts custom id", () => {
    const { container } = render(<SkipNavContent id="custom-content" />);
    expect(container.firstChild).toHaveAttribute("id", "custom-content");
  });

  it("has tabIndex=-1 for programmatic focus", () => {
    const { container } = render(<SkipNavContent />);
    expect(container.firstChild).toHaveAttribute("tabindex", "-1");
  });
});

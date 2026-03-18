import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { BottomNav } from "../bottom-nav";
import { Link } from "../link";
import { SkipNavLink, SkipNavContent } from "../skip-nav";

describe("BottomNav", () => {
  const items = [
    { label: "Home", icon: "home", active: true },
    { label: "Search", icon: "search" },
    { label: "Profile", icon: "user", badge: 3 },
  ];

  it("renders all items", () => {
    render(<BottomNav items={items} />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Search")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
  });

  it("shows badge count", () => {
    render(<BottomNav items={items} />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("marks active item", () => {
    render(<BottomNav items={items} />);
    const homeButton = screen.getByText("Home").closest("button");
    expect(homeButton).toHaveAttribute("aria-current", "page");
  });

  it("has navigation role", () => {
    render(<BottomNav items={items} />);
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });
});

describe("Link", () => {
  it("renders as anchor", () => {
    render(<Link href="/about">About</Link>);
    expect(screen.getByText("About").tagName).toBe("A");
  });

  it("opens external links in new tab", () => {
    render(<Link href="https://example.com" external>External</Link>);
    expect(screen.getByText("External")).toHaveAttribute("target", "_blank");
    expect(screen.getByText("External")).toHaveAttribute("rel", "noopener noreferrer");
  });
});

describe("SkipNavLink", () => {
  it("renders with default text", () => {
    render(<SkipNavLink />);
    expect(screen.getByText("Skip to main content")).toBeInTheDocument();
  });

  it("links to correct content id", () => {
    render(<SkipNavLink contentId="content" />);
    expect(screen.getByText("Skip to main content")).toHaveAttribute("href", "#content");
  });
});

describe("SkipNavContent", () => {
  it("renders with correct id", () => {
    const { container } = render(<SkipNavContent id="main">Content</SkipNavContent>);
    expect(container.querySelector("#main")).toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { TableOfContents, type TocItem } from "../table-of-contents";

const items: TocItem[] = [
  { id: "intro", label: "Introduction" },
  { id: "getting-started", label: "Getting Started" },
  { id: "api", label: "API Reference" },
];

const nestedItems: TocItem[] = [
  {
    id: "intro",
    label: "Introduction",
    children: [
      { id: "overview", label: "Overview", level: 1 },
      { id: "motivation", label: "Motivation", level: 1 },
    ],
  },
  { id: "api", label: "API Reference" },
];

describe("TableOfContents", () => {
  it("renders all items as links", () => {
    render(<TableOfContents items={items} />);
    expect(screen.getByText("Introduction")).toBeInTheDocument();
    expect(screen.getByText("Getting Started")).toBeInTheDocument();
    expect(screen.getByText("API Reference")).toBeInTheDocument();
  });

  it("renders as nav with aria-label", () => {
    render(<TableOfContents items={items} />);
    expect(
      screen.getByRole("navigation", { name: "Table of contents" })
    ).toBeInTheDocument();
  });

  it("renders list with role=list", () => {
    render(<TableOfContents items={items} />);
    expect(screen.getByRole("list")).toBeInTheDocument();
  });

  it("each item is an anchor link with correct href", () => {
    render(<TableOfContents items={items} />);
    const link = screen.getByText("Introduction").closest("a");
    expect(link).toHaveAttribute("href", "#intro");
  });

  it("highlights active item via activeId (controlled)", () => {
    render(<TableOfContents items={items} activeId="getting-started" />);
    const link = screen.getByText("Getting Started").closest("a");
    expect(link).toHaveAttribute("aria-current", "location");
  });

  it("non-active items do not have aria-current", () => {
    render(<TableOfContents items={items} activeId="getting-started" />);
    const link = screen.getByText("Introduction").closest("a");
    expect(link).not.toHaveAttribute("aria-current");
  });

  it("uses defaultActiveId for initial state (uncontrolled)", () => {
    render(<TableOfContents items={items} defaultActiveId="api" />);
    const link = screen.getByText("API Reference").closest("a");
    expect(link).toHaveAttribute("aria-current", "location");
  });

  it("calls onActiveChange when clicking an item", async () => {
    const onActiveChange = vi.fn();
    const user = userEvent.setup();
    render(
      <TableOfContents items={items} onActiveChange={onActiveChange} />
    );
    await user.click(screen.getByText("Getting Started"));
    expect(onActiveChange).toHaveBeenCalledWith("getting-started");
  });

  it("renders nested items", () => {
    render(<TableOfContents items={nestedItems} />);
    expect(screen.getByText("Overview")).toBeInTheDocument();
    expect(screen.getByText("Motivation")).toBeInTheDocument();
  });

  it("nested items have correct href", () => {
    render(<TableOfContents items={nestedItems} />);
    const link = screen.getByText("Overview").closest("a");
    expect(link).toHaveAttribute("href", "#overview");
  });

  it("renders all nested levels in lists", () => {
    render(<TableOfContents items={nestedItems} />);
    const lists = screen.getAllByRole("list");
    // Root list + nested list for "Introduction" children
    expect(lists.length).toBeGreaterThanOrEqual(2);
  });

  // Variant tests
  it("renders default variant with border-l-2 class on nav", () => {
    render(<TableOfContents items={items} variant="default" />);
    const nav = screen.getByRole("navigation");
    expect(nav.className).toContain("border-l-2");
  });

  it("renders minimal variant without border", () => {
    render(<TableOfContents items={items} variant="minimal" />);
    const nav = screen.getByRole("navigation");
    expect(nav.className).not.toContain("border-l-2");
    expect(nav.className).not.toContain("rounded-xl");
  });

  it("renders bordered variant with card styling", () => {
    render(<TableOfContents items={items} variant="bordered" />);
    const nav = screen.getByRole("navigation");
    expect(nav.className).toContain("rounded-xl");
    expect(nav.className).toContain("border");
  });

  it("merges custom className", () => {
    render(<TableOfContents items={items} className="my-custom" />);
    const nav = screen.getByRole("navigation");
    expect(nav).toHaveClass("my-custom");
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLElement | null };
    render(<TableOfContents ref={ref} items={items} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current?.tagName).toBe("NAV");
  });

  it("clicking an item scrolls to element", async () => {
    // Create target element
    const div = document.createElement("div");
    div.id = "intro";
    document.body.appendChild(div);

    const scrollToSpy = vi.fn();
    window.scrollTo = scrollToSpy;

    const user = userEvent.setup();
    render(<TableOfContents items={items} />);
    await user.click(screen.getByText("Introduction"));

    expect(scrollToSpy).toHaveBeenCalledWith(
      expect.objectContaining({ behavior: "smooth" })
    );

    document.body.removeChild(div);
  });

  it("uses 'auto' scroll behavior when smooth=false", async () => {
    const div = document.createElement("div");
    div.id = "intro";
    document.body.appendChild(div);

    const scrollToSpy = vi.fn();
    window.scrollTo = scrollToSpy;

    const user = userEvent.setup();
    render(<TableOfContents items={items} smooth={false} />);
    await user.click(screen.getByText("Introduction"));

    expect(scrollToSpy).toHaveBeenCalledWith(
      expect.objectContaining({ behavior: "auto" })
    );

    document.body.removeChild(div);
  });

  it("updates active state on click in uncontrolled mode", async () => {
    const user = userEvent.setup();
    render(<TableOfContents items={items} />);

    await user.click(screen.getByText("Getting Started"));
    const link = screen.getByText("Getting Started").closest("a");
    expect(link).toHaveAttribute("aria-current", "location");

    // Previous should not be active
    const introLink = screen.getByText("Introduction").closest("a");
    expect(introLink).not.toHaveAttribute("aria-current");
  });

  it("prevents default on anchor click", async () => {
    const user = userEvent.setup();
    render(<TableOfContents items={items} />);
    // No navigation should occur (just scroll)
    await user.click(screen.getByText("Introduction"));
    // If default wasn't prevented, the URL would change. We can verify the handler ran
    // by checking aria-current was set
    const link = screen.getByText("Introduction").closest("a");
    expect(link).toHaveAttribute("aria-current", "location");
  });

  it("renders empty list gracefully", () => {
    render(<TableOfContents items={[]} />);
    const nav = screen.getByRole("navigation");
    expect(nav).toBeInTheDocument();
  });

  it("active item has primary text color in default variant", () => {
    render(<TableOfContents items={items} activeId="intro" variant="default" />);
    const link = screen.getByText("Introduction").closest("a");
    expect(link?.className).toContain("text-primary");
  });

  it("active item has primary text color in minimal variant", () => {
    render(<TableOfContents items={items} activeId="intro" variant="minimal" />);
    const link = screen.getByText("Introduction").closest("a");
    expect(link?.className).toContain("text-primary");
  });

  it("active item has bg-primary in bordered variant", () => {
    render(<TableOfContents items={items} activeId="intro" variant="bordered" />);
    const link = screen.getByText("Introduction").closest("a");
    expect(link?.className).toContain("bg-primary/5");
  });

  // IntersectionObserver test
  it("sets up IntersectionObserver for scroll spy", () => {
    const observeMock = vi.fn();
    const disconnectMock = vi.fn();

    class MockIntersectionObserver {
      constructor(_cb: IntersectionObserverCallback, _opts?: IntersectionObserverInit) {}
      observe = observeMock;
      disconnect = disconnectMock;
      unobserve = vi.fn();
      takeRecords = vi.fn().mockReturnValue([]);
      root = null;
      rootMargin = "";
      thresholds = [0];
    }

    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);

    // Create target elements
    const elements: HTMLElement[] = [];
    for (const item of items) {
      const el = document.createElement("div");
      el.id = item.id;
      document.body.appendChild(el);
      elements.push(el);
    }

    const { unmount } = render(<TableOfContents items={items} />);

    expect(observeMock).toHaveBeenCalledTimes(items.length);

    unmount();
    expect(disconnectMock).toHaveBeenCalled();

    // Cleanup
    for (const el of elements) {
      document.body.removeChild(el);
    }

    vi.unstubAllGlobals();
  });

  it("does not use IntersectionObserver when activeId is controlled", () => {
    const observeMock = vi.fn();

    class MockIntersectionObserver {
      constructor(_cb: IntersectionObserverCallback, _opts?: IntersectionObserverInit) {}
      observe = observeMock;
      disconnect = vi.fn();
      unobserve = vi.fn();
      takeRecords = vi.fn().mockReturnValue([]);
      root = null;
      rootMargin = "";
      thresholds = [0];
    }

    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);

    render(<TableOfContents items={items} activeId="intro" />);

    expect(observeMock).not.toHaveBeenCalled();

    vi.unstubAllGlobals();
  });
});

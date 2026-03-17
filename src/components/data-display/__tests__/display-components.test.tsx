import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeAll } from "vitest";

// Mock IntersectionObserver for InfiniteScroll
class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  constructor() {}
}

beforeAll(() => {
  (globalThis as Record<string, unknown>).IntersectionObserver = MockIntersectionObserver;

  // Mock matchMedia for Show component (uses useBreakpoint -> useMediaQuery)
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

import { EmptyState } from "../empty-state";
import { StatCard } from "../stat-card";
import { StatusDot } from "../status-dot";
import { UserCell } from "../user-cell";
import { Calendar } from "../calendar";
import { QrCode } from "../qr-code";
import { AvatarGroup } from "../avatar-group";
import { Chip } from "../chip";
import { DataTable } from "../data-table";
import { Icon } from "../icon";
import { MetadataGrid, MetadataItem } from "../metadata-grid";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "../collapsible";
import { InfiniteScroll } from "../infinite-scroll";
import { Show } from "../show";

// ── EmptyState ───────────────────────────────────────────────────

describe("EmptyState", () => {
  it("renders title", () => {
    render(<EmptyState title="No items found" />);
    expect(screen.getByText("No items found")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(
      <EmptyState
        title="No items"
        description="Try adjusting your search"
      />
    );
    expect(screen.getByText("Try adjusting your search")).toBeInTheDocument();
  });

  it("does not render description when absent", () => {
    render(<EmptyState title="No items" />);
    expect(screen.queryByText("Try adjusting")).not.toBeInTheDocument();
  });

  it("renders action slot", () => {
    render(
      <EmptyState title="Empty" action={<button>Add item</button>} />
    );
    expect(screen.getByRole("button", { name: "Add item" })).toBeInTheDocument();
  });

  it("merges className", () => {
    const { container } = render(
      <EmptyState title="Test" className="custom-empty" />
    );
    expect(container.firstChild).toHaveClass("custom-empty");
  });
});

// ── StatCard ─────────────────────────────────────────────────────

describe("StatCard", () => {
  it("renders label and value", () => {
    render(<StatCard icon="trending_up" label="Revenue" value="$12,400" />);
    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("$12,400")).toBeInTheDocument();
  });

  it("renders change text", () => {
    render(
      <StatCard icon="people" label="Users" value={1234} change="+12%" />
    );
    expect(screen.getByText("+12%")).toBeInTheDocument();
  });

  it("does not render change when absent", () => {
    render(<StatCard icon="people" label="Users" value={100} />);
    expect(screen.queryByText("+")).not.toBeInTheDocument();
  });

  it("merges className", () => {
    const { container } = render(
      <StatCard icon="star" label="Rating" value="4.5" className="custom" />
    );
    expect(container.firstChild).toHaveClass("custom");
  });
});

// ── StatusDot ────────────────────────────────────────────────────

describe("StatusDot", () => {
  it("renders a span element", () => {
    const { container } = render(<StatusDot />);
    expect(container.querySelector("span")).toBeInTheDocument();
  });

  it("applies color variant class", () => {
    const { container } = render(<StatusDot color="red" />);
    const dot = container.querySelector("span");
    expect(dot).toHaveClass("bg-red-500");
  });

  it("renders with pulse animation", () => {
    const { container } = render(<StatusDot pulse color="green" />);
    const pulseDot = container.querySelector(".animate-ping");
    expect(pulseDot).toBeInTheDocument();
  });

  it("does not render pulse when pulse is false", () => {
    const { container } = render(<StatusDot color="green" />);
    const pulseDot = container.querySelector(".animate-ping");
    expect(pulseDot).not.toBeInTheDocument();
  });

  it("merges className", () => {
    const { container } = render(<StatusDot className="custom-dot" />);
    const dot = container.querySelector("span");
    expect(dot).toHaveClass("custom-dot");
  });
});

// ── UserCell ─────────────────────────────────────────────────────

describe("UserCell", () => {
  it("renders name", () => {
    render(<UserCell name="John Doe" />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("renders subtitle when provided", () => {
    render(<UserCell name="Jane" subtitle="Engineer" />);
    expect(screen.getByText("Engineer")).toBeInTheDocument();
  });

  it("does not render subtitle when absent", () => {
    render(<UserCell name="Jane" />);
    expect(screen.queryByText("Engineer")).not.toBeInTheDocument();
  });

  it("renders avatar with alt text matching name", () => {
    render(<UserCell name="Alice" avatarSrc="/alice.jpg" />);
    expect(screen.getByAltText("Alice")).toBeInTheDocument();
  });

  it("merges className", () => {
    const { container } = render(
      <UserCell name="Test" className="custom-cell" />
    );
    expect(container.firstChild).toHaveClass("custom-cell");
  });
});

// ── Calendar ─────────────────────────────────────────────────────

describe("Calendar", () => {
  it("renders day labels", () => {
    render(<Calendar />);
    expect(screen.getByText("Sun")).toBeInTheDocument();
    expect(screen.getByText("Mon")).toBeInTheDocument();
    expect(screen.getByText("Sat")).toBeInTheDocument();
  });

  it("renders month and year in header", () => {
    render(<Calendar month="January" year={2024} />);
    expect(screen.getByText("January 2024")).toBeInTheDocument();
  });

  it("renders with auto mode (no days prop)", () => {
    render(<Calendar />);
    // Should render current month
    const now = new Date();
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];
    expect(
      screen.getByText(`${monthNames[now.getMonth()]} ${now.getFullYear()}`)
    ).toBeInTheDocument();
  });

  it("calls onSelect when a day is clicked in auto mode", () => {
    const onSelect = vi.fn();
    render(<Calendar onSelect={onSelect} />);
    fireEvent.click(screen.getByText("15"));
    expect(onSelect).toHaveBeenCalledWith(15);
  });

  it("navigates to next month", () => {
    render(<Calendar month="January" year={2024} />);
    const buttons = screen.getAllByRole("button");
    // Second button is the next month button
    fireEvent.click(buttons[1]);
    expect(screen.getByText("February 2024")).toBeInTheDocument();
  });
});

// ── QrCode ───────────────────────────────────────────────────────

describe("QrCode", () => {
  it("renders an image with the dataUrl", () => {
    render(<QrCode dataUrl="data:image/png;base64,abc" />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "data:image/png;base64,abc");
  });

  it("has default alt text", () => {
    render(<QrCode dataUrl="data:image/png;base64,abc" />);
    expect(screen.getByAltText("QR Code")).toBeInTheDocument();
  });

  it("accepts custom alt text", () => {
    render(<QrCode dataUrl="data:image/png;base64,abc" alt="Scan me" />);
    expect(screen.getByAltText("Scan me")).toBeInTheDocument();
  });

  it("accepts custom size", () => {
    render(<QrCode dataUrl="data:image/png;base64,abc" size={150} />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("width", "150");
    expect(img).toHaveAttribute("height", "150");
  });
});

// ── AvatarGroup ──────────────────────────────────────────────────

describe("AvatarGroup", () => {
  it("renders children", () => {
    render(
      <AvatarGroup>
        <span>A</span>
        <span>B</span>
        <span>C</span>
      </AvatarGroup>
    );
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
    expect(screen.getByText("C")).toBeInTheDocument();
  });

  it("shows overflow count when children exceed max", () => {
    render(
      <AvatarGroup max={2}>
        <span>A</span>
        <span>B</span>
        <span>C</span>
        <span>D</span>
      </AvatarGroup>
    );
    expect(screen.getByText("+2")).toBeInTheDocument();
    // Only first 2 should be visible
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
    expect(screen.queryByText("C")).not.toBeInTheDocument();
  });

  it("does not show overflow when children equal max", () => {
    render(
      <AvatarGroup max={3}>
        <span>A</span>
        <span>B</span>
        <span>C</span>
      </AvatarGroup>
    );
    expect(screen.queryByText("+")).not.toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(
      <AvatarGroup ref={ref}>
        <span>A</span>
      </AvatarGroup>
    );
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });
});

// ── Chip ─────────────────────────────────────────────────────────

describe("Chip", () => {
  it("renders children text", () => {
    render(<Chip>Active</Chip>);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("renders dismiss button when dismissible", () => {
    render(<Chip dismissible>Tag</Chip>);
    expect(screen.getByRole("button", { name: "Remove" })).toBeInTheDocument();
  });

  it("calls onDismiss when dismiss button is clicked", async () => {
    const onDismiss = vi.fn();
    render(
      <Chip dismissible onDismiss={onDismiss}>
        Tag
      </Chip>
    );
    fireEvent.click(screen.getByRole("button", { name: "Remove" }));
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it("does not show dismiss button when not dismissible", () => {
    render(<Chip>Tag</Chip>);
    expect(screen.queryByRole("button", { name: "Remove" })).not.toBeInTheDocument();
  });

  it("has role='button' when clickable", () => {
    render(<Chip clickable>Click me</Chip>);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("does not have role='button' when not clickable", () => {
    render(<Chip>Static</Chip>);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<Chip ref={ref}>Test</Chip>);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  it("handles disabled state", () => {
    const { container } = render(<Chip disabled>Disabled</Chip>);
    expect(container.firstChild).toHaveClass("opacity-50");
  });
});

// ── DataTable ────────────────────────────────────────────────────

describe("DataTable", () => {
  type Row = { id: number; name: string; email: string };

  const columns = [
    { key: "name", header: "Name", render: (row: Row) => row.name },
    { key: "email", header: "Email", render: (row: Row) => row.email },
  ];

  const data: Row[] = [
    { id: 1, name: "Alice", email: "alice@test.com" },
    { id: 2, name: "Bob", email: "bob@test.com" },
  ];

  it("renders column headers", () => {
    render(<DataTable columns={columns} data={data} />);
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("renders row data", () => {
    render(<DataTable columns={columns} data={data} />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("bob@test.com")).toBeInTheDocument();
  });

  it("shows empty state when data is empty", () => {
    render(
      <DataTable
        columns={columns}
        data={[]}
        emptyState={<span>No records</span>}
      />
    );
    expect(screen.getByText("No records")).toBeInTheDocument();
  });

  it("shows loading skeleton", () => {
    render(<DataTable columns={columns} data={[]} isLoading />);
    const { container } = render(
      <DataTable columns={columns} data={[]} isLoading />
    );
    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("renders header slot", () => {
    render(
      <DataTable
        columns={columns}
        data={data}
        header={<span>Filter bar</span>}
      />
    );
    expect(screen.getByText("Filter bar")).toBeInTheDocument();
  });
});

// ── Icon ─────────────────────────────────────────────────────────

describe("Icon", () => {
  it("renders with material symbols fallback for unknown icons", () => {
    render(<Icon name="unknown_icon_xyz" />);
    expect(screen.getByText("unknown_icon_xyz")).toBeInTheDocument();
  });

  it("applies className", () => {
    render(<Icon name="unknown_test" className="text-red-500" />);
    expect(screen.getByText("unknown_test")).toHaveClass("text-red-500");
  });

  it("applies filled class when filled prop is true", () => {
    render(<Icon name="unknown_filled" filled />);
    expect(screen.getByText("unknown_filled")).toHaveClass("icon-filled");
  });
});

// ── MetadataGrid & MetadataItem ──────────────────────────────────

describe("MetadataGrid", () => {
  it("renders children", () => {
    render(
      <MetadataGrid>
        <MetadataItem label="Status" value="Active" />
        <MetadataItem label="Role" value="Admin" />
      </MetadataGrid>
    );
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Role")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();
  });

  it("applies column count", () => {
    const { container } = render(
      <MetadataGrid columns={3}>
        <MetadataItem label="A" value="1" />
      </MetadataGrid>
    );
    expect(container.firstChild).toHaveClass("grid-cols-3");
  });

  it("defaults to 4 columns", () => {
    const { container } = render(
      <MetadataGrid>
        <MetadataItem label="A" value="1" />
      </MetadataGrid>
    );
    expect(container.firstChild).toHaveClass("grid-cols-4");
  });
});

describe("MetadataItem", () => {
  it("renders label and value", () => {
    render(<MetadataItem label="Created" value="2024-01-01" />);
    expect(screen.getByText("Created")).toBeInTheDocument();
    expect(screen.getByText("2024-01-01")).toBeInTheDocument();
  });
});

// ── Collapsible ──────────────────────────────────────────────────

describe("Collapsible", () => {
  it("renders with data-state attribute", () => {
    const { container } = render(
      <Collapsible>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent open={false}>Content</CollapsibleContent>
      </Collapsible>
    );
    expect(container.firstChild).toHaveAttribute("data-state", "closed");
  });

  it("sets data-state to open when defaultOpen is true", () => {
    const { container } = render(
      <Collapsible defaultOpen>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent open>Content</CollapsibleContent>
      </Collapsible>
    );
    expect(container.firstChild).toHaveAttribute("data-state", "open");
  });

  it("renders CollapsibleContent when open", () => {
    render(
      <Collapsible defaultOpen>
        <CollapsibleContent open>Hidden content</CollapsibleContent>
      </Collapsible>
    );
    expect(screen.getByText("Hidden content")).toBeInTheDocument();
  });

  it("does not render CollapsibleContent when closed", () => {
    render(
      <Collapsible>
        <CollapsibleContent open={false}>Hidden content</CollapsibleContent>
      </Collapsible>
    );
    expect(screen.queryByText("Hidden content")).not.toBeInTheDocument();
  });

  it("CollapsibleTrigger renders a button", () => {
    render(
      <Collapsible>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
      </Collapsible>
    );
    expect(screen.getByRole("button", { name: "Toggle" })).toBeInTheDocument();
  });

  it("forwards ref on Collapsible", () => {
    const ref = vi.fn();
    render(
      <Collapsible ref={ref}>
        <span>content</span>
      </Collapsible>
    );
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });
});

// ── InfiniteScroll ───────────────────────────────────────────────

describe("InfiniteScroll", () => {
  it("renders children", () => {
    render(
      <InfiniteScroll hasMore loading={false} onLoadMore={vi.fn()}>
        <div>Item 1</div>
        <div>Item 2</div>
      </InfiniteScroll>
    );
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
  });

  it("shows loading indicator when loading", () => {
    render(
      <InfiniteScroll hasMore loading onLoadMore={vi.fn()}>
        <div>Item</div>
      </InfiniteScroll>
    );
    // Default loader is a Spinner with role="status"
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("does not show loading indicator when not loading", () => {
    render(
      <InfiniteScroll hasMore loading={false} onLoadMore={vi.fn()}>
        <div>Item</div>
      </InfiniteScroll>
    );
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("shows end message when hasMore is false", () => {
    render(
      <InfiniteScroll
        hasMore={false}
        loading={false}
        onLoadMore={vi.fn()}
        endMessage="No more items"
      >
        <div>Item</div>
      </InfiniteScroll>
    );
    expect(screen.getByText("No more items")).toBeInTheDocument();
  });

  it("does not show end message when hasMore is true", () => {
    render(
      <InfiniteScroll
        hasMore
        loading={false}
        onLoadMore={vi.fn()}
        endMessage="No more items"
      >
        <div>Item</div>
      </InfiniteScroll>
    );
    expect(screen.queryByText("No more items")).not.toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(
      <InfiniteScroll ref={ref} hasMore loading={false} onLoadMore={vi.fn()}>
        <div>Item</div>
      </InfiniteScroll>
    );
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  it("renders custom loader", () => {
    render(
      <InfiniteScroll
        hasMore
        loading
        onLoadMore={vi.fn()}
        loader={<span>Loading more...</span>}
      >
        <div>Item</div>
      </InfiniteScroll>
    );
    expect(screen.getByText("Loading more...")).toBeInTheDocument();
  });
});

// ── Show ─────────────────────────────────────────────────────────

describe("Show", () => {
  it("renders children when 'when' is true", () => {
    render(<Show when={true}>Visible</Show>);
    expect(screen.getByText("Visible")).toBeInTheDocument();
  });

  it("does not render children when 'when' is false", () => {
    render(<Show when={false}>Hidden</Show>);
    expect(screen.queryByText("Hidden")).not.toBeInTheDocument();
  });

  it("renders fallback when 'when' is false", () => {
    render(
      <Show when={false} fallback={<span>Fallback</span>}>
        Content
      </Show>
    );
    expect(screen.getByText("Fallback")).toBeInTheDocument();
    expect(screen.queryByText("Content")).not.toBeInTheDocument();
  });

  it("renders children when no condition props are given", () => {
    render(<Show>Always visible</Show>);
    expect(screen.getByText("Always visible")).toBeInTheDocument();
  });
});

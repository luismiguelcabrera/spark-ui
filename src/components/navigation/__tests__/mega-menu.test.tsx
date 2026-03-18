import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { MegaMenu, type MegaMenuSection } from "../mega-menu";

const sections: MegaMenuSection[] = [
  {
    label: "Products",
    columns: [
      {
        title: "Software",
        items: [
          { label: "Analytics", href: "/analytics", description: "Track usage" },
          { label: "Automation", href: "/automation" },
        ],
      },
      {
        title: "Hardware",
        items: [
          { label: "Servers", href: "/servers" },
          { label: "Storage", href: "/storage" },
        ],
      },
    ],
  },
  {
    label: "Solutions",
    columns: [
      {
        items: [
          { label: "Enterprise", href: "/enterprise" },
          { label: "Startup", href: "/startup" },
        ],
      },
    ],
  },
];

const withIcons: MegaMenuSection[] = [
  {
    label: "Features",
    columns: [
      {
        items: [
          { label: "Dashboard", href: "/dash", icon: "dashboard" },
          { label: "Reports", href: "/reports", icon: "description" },
        ],
      },
    ],
  },
];

const withFooter: MegaMenuSection[] = [
  {
    label: "Resources",
    columns: [
      {
        items: [
          { label: "Docs", href: "/docs" },
          { label: "Blog", href: "/blog" },
        ],
      },
    ],
    footer: <div data-testid="footer-content">View all resources</div>,
  },
];

/**
 * Helper: open a section by hovering over its trigger button.
 * userEvent.hover triggers mouseenter which opens the panel.
 */
async function hoverOpen(user: ReturnType<typeof userEvent.setup>, label: string) {
  await user.hover(screen.getByText(label).closest("button")!);
}

describe("MegaMenu", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders all section labels", () => {
    render(<MegaMenu sections={sections} />);
    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("Solutions")).toBeInTheDocument();
  });

  it("renders as a nav with aria-label", () => {
    render(<MegaMenu sections={sections} />);
    expect(screen.getByRole("navigation", { name: "Main navigation" })).toBeInTheDocument();
  });

  it("has menubar role on trigger list", () => {
    render(<MegaMenu sections={sections} />);
    expect(screen.getByRole("menubar")).toBeInTheDocument();
  });

  it("section triggers have aria-haspopup and aria-expanded=false by default", () => {
    render(<MegaMenu sections={sections} />);
    const trigger = screen.getByText("Products").closest("button")!;
    expect(trigger).toHaveAttribute("aria-haspopup", "true");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("opens dropdown on hover", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<MegaMenu sections={sections} />);
    await hoverOpen(user, "Products");
    expect(screen.getByText("Products").closest("button")).toHaveAttribute(
      "aria-expanded",
      "true"
    );
    expect(screen.getByText("Analytics")).toBeInTheDocument();
  });

  it("renders column titles", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<MegaMenu sections={sections} />);
    await hoverOpen(user, "Products");
    expect(screen.getByText("Software")).toBeInTheDocument();
    expect(screen.getByText("Hardware")).toBeInTheDocument();
  });

  it("renders item descriptions", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<MegaMenu sections={sections} />);
    await hoverOpen(user, "Products");
    expect(screen.getByText("Track usage")).toBeInTheDocument();
  });

  it("renders items as links when href is provided", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<MegaMenu sections={sections} />);
    await hoverOpen(user, "Products");
    const link = screen.getByText("Analytics").closest("a");
    expect(link).toHaveAttribute("href", "/analytics");
  });

  it("opens dropdown on click (without hover)", () => {
    render(<MegaMenu sections={sections} />);
    const trigger = screen.getByText("Products").closest("button")!;
    // Use fireEvent.click which doesn't trigger mouseenter
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Analytics")).toBeInTheDocument();
  });

  it("toggles dropdown closed on second click (without hover)", () => {
    render(<MegaMenu sections={sections} />);
    const trigger = screen.getByText("Products").closest("button")!;
    fireEvent.click(trigger);
    expect(screen.getByText("Analytics")).toBeInTheDocument();
    fireEvent.click(trigger);
    expect(screen.queryByText("Analytics")).not.toBeInTheDocument();
  });

  it("closes dropdown when clicking an item", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<MegaMenu sections={sections} />);
    await hoverOpen(user, "Products");
    // Click an item - use fireEvent to avoid hover interactions
    fireEvent.click(screen.getByText("Analytics"));
    expect(screen.queryByText("Automation")).not.toBeInTheDocument();
  });

  it("closes on click outside", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <div>
        <MegaMenu sections={sections} />
        <div data-testid="outside">Outside</div>
      </div>
    );
    await hoverOpen(user, "Products");
    expect(screen.getByText("Analytics")).toBeInTheDocument();
    // mousedown outside triggers close
    fireEvent.mouseDown(screen.getByTestId("outside"));
    expect(screen.queryByText("Analytics")).not.toBeInTheDocument();
  });

  it("renders icons when provided", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<MegaMenu sections={withIcons} />);
    await hoverOpen(user, "Features");
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    // Icon renders as material icon text
    expect(screen.getByText("dashboard")).toBeInTheDocument();
  });

  it("renders footer when provided", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<MegaMenu sections={withFooter} />);
    await hoverOpen(user, "Resources");
    expect(screen.getByTestId("footer-content")).toBeInTheDocument();
  });

  it("merges custom className", () => {
    render(<MegaMenu sections={sections} className="custom-class" />);
    const nav = screen.getByRole("navigation");
    expect(nav).toHaveClass("custom-class");
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLElement | null };
    render(<MegaMenu ref={ref} sections={sections} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current?.tagName).toBe("NAV");
  });

  // Keyboard navigation tests
  it("opens dropdown with Enter key", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<MegaMenu sections={sections} />);
    const trigger = screen.getByText("Products").closest("button")!;
    trigger.focus();
    await user.keyboard("{Enter}");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("opens dropdown with Space key", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<MegaMenu sections={sections} />);
    const trigger = screen.getByText("Products").closest("button")!;
    trigger.focus();
    await user.keyboard(" ");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("closes dropdown with Escape key", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<MegaMenu sections={sections} />);
    const trigger = screen.getByText("Products").closest("button")!;
    trigger.focus();
    await user.keyboard("{Enter}");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    await user.keyboard("{Escape}");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("toggles closed with Enter key when already open", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<MegaMenu sections={sections} />);
    const trigger = screen.getByText("Products").closest("button")!;
    trigger.focus();
    await user.keyboard("{Enter}");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    await user.keyboard("{Enter}");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("ArrowRight moves to next section", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<MegaMenu sections={sections} />);
    const productsTrigger = screen.getByText("Products").closest("button")!;
    const solutionsTrigger = screen.getByText("Solutions").closest("button")!;
    productsTrigger.focus();
    await user.keyboard("{ArrowRight}");
    expect(solutionsTrigger).toHaveFocus();
  });

  it("ArrowLeft moves to previous section", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<MegaMenu sections={sections} />);
    const productsTrigger = screen.getByText("Products").closest("button")!;
    const solutionsTrigger = screen.getByText("Solutions").closest("button")!;
    solutionsTrigger.focus();
    await user.keyboard("{ArrowLeft}");
    expect(productsTrigger).toHaveFocus();
  });

  it("ArrowLeft wraps around from first to last section", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<MegaMenu sections={sections} />);
    const productsTrigger = screen.getByText("Products").closest("button")!;
    const solutionsTrigger = screen.getByText("Solutions").closest("button")!;
    productsTrigger.focus();
    await user.keyboard("{ArrowLeft}");
    expect(solutionsTrigger).toHaveFocus();
  });

  it("ArrowDown opens panel and moves focus into items", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<MegaMenu sections={sections} />);
    const trigger = screen.getByText("Products").closest("button")!;
    trigger.focus();
    await user.keyboard("{ArrowDown}");
    // Panel should be open and first item focused
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Analytics").closest("a")).toHaveFocus();
  });

  it("Escape from panel returns focus to trigger", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<MegaMenu sections={sections} />);
    const trigger = screen.getByText("Products").closest("button")!;
    trigger.focus();
    await user.keyboard("{ArrowDown}");
    // Now focused in panel
    await user.keyboard("{Escape}");
    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("ArrowDown/ArrowUp navigates items within panel", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<MegaMenu sections={sections} />);
    const trigger = screen.getByText("Products").closest("button")!;
    trigger.focus();
    await user.keyboard("{ArrowDown}");
    // First item focused
    expect(screen.getByText("Analytics").closest("a")).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByText("Automation").closest("a")).toHaveFocus();
    await user.keyboard("{ArrowUp}");
    expect(screen.getByText("Analytics").closest("a")).toHaveFocus();
  });

  it("ArrowUp from first item returns focus to trigger", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<MegaMenu sections={sections} />);
    const trigger = screen.getByText("Products").closest("button")!;
    trigger.focus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByText("Analytics").closest("a")).toHaveFocus();
    await user.keyboard("{ArrowUp}");
    expect(trigger).toHaveFocus();
  });

  it("renders items without href as buttons", async () => {
    const noHrefSections: MegaMenuSection[] = [
      {
        label: "Actions",
        columns: [
          {
            items: [{ label: "Do something" }],
          },
        ],
      },
    ];
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<MegaMenu sections={noHrefSections} />);
    await hoverOpen(user, "Actions");
    const item = screen.getByText("Do something").closest("button");
    expect(item).toBeInTheDocument();
    expect(item).toHaveAttribute("type", "button");
  });

  it("renders submenu with aria-label", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<MegaMenu sections={sections} />);
    await hoverOpen(user, "Products");
    expect(
      screen.getByRole("menu", { name: "Products submenu" })
    ).toBeInTheDocument();
  });

  it("section triggers have type=button", () => {
    render(<MegaMenu sections={sections} />);
    const trigger = screen.getByText("Products").closest("button")!;
    expect(trigger).toHaveAttribute("type", "button");
  });

  it("switches between sections on hover", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<MegaMenu sections={sections} />);
    await hoverOpen(user, "Products");
    expect(screen.getByText("Analytics")).toBeInTheDocument();
    await hoverOpen(user, "Solutions");
    expect(screen.queryByText("Analytics")).not.toBeInTheDocument();
    expect(screen.getByText("Enterprise")).toBeInTheDocument();
  });

  it("ArrowRight opens new section panel", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<MegaMenu sections={sections} />);
    const productsTrigger = screen.getByText("Products").closest("button")!;
    productsTrigger.focus();
    await user.keyboard("{Enter}");
    expect(screen.getByText("Analytics")).toBeInTheDocument();
    await user.keyboard("{ArrowRight}");
    // Solutions should now be open
    expect(screen.getByText("Enterprise")).toBeInTheDocument();
    expect(screen.queryByText("Analytics")).not.toBeInTheDocument();
  });
});

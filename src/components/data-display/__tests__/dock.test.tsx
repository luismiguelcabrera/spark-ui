import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Dock, type DockItem } from "../dock";

const sampleItems: DockItem[] = [
  { id: "finder", icon: "folder", label: "Finder", onClick: vi.fn() },
  { id: "safari", icon: "language", label: "Safari" },
  { id: "mail", icon: "mail", label: "Mail", badge: 5 },
  { id: "music", icon: "music_note", label: "Music", active: true },
];

// Helper to create fresh items with new vi.fn() per test
function createItems(): DockItem[] {
  return [
    { id: "finder", icon: "folder", label: "Finder", onClick: vi.fn() },
    { id: "safari", icon: "language", label: "Safari", onClick: vi.fn() },
    { id: "mail", icon: "mail", label: "Mail", badge: 5, onClick: vi.fn() },
    { id: "music", icon: "music_note", label: "Music", active: true, onClick: vi.fn() },
  ];
}

describe("Dock", () => {
  beforeEach(() => {
    // Mock matchMedia for SSR-safe tests
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

  it("renders without crashing", () => {
    const { container } = render(<Dock items={sampleItems} />);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it("renders all items", () => {
    render(<Dock items={sampleItems} />);
    expect(screen.getByLabelText("Finder")).toBeInTheDocument();
    expect(screen.getByLabelText("Safari")).toBeInTheDocument();
    expect(screen.getByLabelText("Mail")).toBeInTheDocument();
    expect(screen.getByLabelText("Music")).toBeInTheDocument();
  });

  describe("accessibility", () => {
    it("has role=toolbar", () => {
      render(<Dock items={sampleItems} />);
      expect(screen.getByRole("toolbar")).toBeInTheDocument();
    });

    it("has aria-label=Dock", () => {
      render(<Dock items={sampleItems} />);
      expect(screen.getByRole("toolbar")).toHaveAttribute(
        "aria-label",
        "Dock"
      );
    });

    it("has aria-orientation=horizontal for bottom position", () => {
      render(<Dock items={sampleItems} position="bottom" />);
      expect(screen.getByRole("toolbar")).toHaveAttribute(
        "aria-orientation",
        "horizontal"
      );
    });

    it("has aria-orientation=vertical for left position", () => {
      render(<Dock items={sampleItems} position="left" />);
      expect(screen.getByRole("toolbar")).toHaveAttribute(
        "aria-orientation",
        "vertical"
      );
    });

    it("has aria-orientation=vertical for right position", () => {
      render(<Dock items={sampleItems} position="right" />);
      expect(screen.getByRole("toolbar")).toHaveAttribute(
        "aria-orientation",
        "vertical"
      );
    });

    it("each item has aria-label", () => {
      render(<Dock items={sampleItems} />);
      sampleItems.forEach((item) => {
        expect(screen.getByLabelText(item.label)).toBeInTheDocument();
      });
    });

    it("first item has tabIndex=0 by default", () => {
      render(<Dock items={sampleItems} />);
      const firstButton = screen.getByLabelText("Finder");
      expect(firstButton).toHaveAttribute("tabindex", "0");
    });

    it("non-first items have tabIndex=-1 by default", () => {
      render(<Dock items={sampleItems} />);
      const secondButton = screen.getByLabelText("Safari");
      expect(secondButton).toHaveAttribute("tabindex", "-1");
    });
  });

  describe("keyboard navigation", () => {
    it("ArrowRight moves focus to next item (bottom position)", () => {
      const items = createItems();
      render(<Dock items={items} position="bottom" />);
      const toolbar = screen.getByRole("toolbar");

      // Focus first item
      screen.getByLabelText("Finder").focus();

      fireEvent.keyDown(toolbar, { key: "ArrowRight" });
      expect(document.activeElement).toBe(screen.getByLabelText("Safari"));
    });

    it("ArrowLeft moves focus to previous item (bottom position)", () => {
      const items = createItems();
      render(<Dock items={items} position="bottom" />);
      const toolbar = screen.getByRole("toolbar");

      // Focus first, then move right, then left
      screen.getByLabelText("Finder").focus();
      fireEvent.keyDown(toolbar, { key: "ArrowRight" });
      fireEvent.keyDown(toolbar, { key: "ArrowLeft" });
      expect(document.activeElement).toBe(screen.getByLabelText("Finder"));
    });

    it("ArrowDown moves focus in vertical (left) position", () => {
      const items = createItems();
      render(<Dock items={items} position="left" />);
      const toolbar = screen.getByRole("toolbar");

      screen.getByLabelText("Finder").focus();
      fireEvent.keyDown(toolbar, { key: "ArrowDown" });
      expect(document.activeElement).toBe(screen.getByLabelText("Safari"));
    });

    it("ArrowUp moves focus in vertical (left) position", () => {
      const items = createItems();
      render(<Dock items={items} position="left" />);
      const toolbar = screen.getByRole("toolbar");

      screen.getByLabelText("Finder").focus();
      fireEvent.keyDown(toolbar, { key: "ArrowDown" });
      fireEvent.keyDown(toolbar, { key: "ArrowUp" });
      expect(document.activeElement).toBe(screen.getByLabelText("Finder"));
    });

    it("wraps focus from last to first", () => {
      const items = createItems();
      render(<Dock items={items} position="bottom" />);
      const toolbar = screen.getByRole("toolbar");

      screen.getByLabelText("Finder").focus();
      // Move right 4 times to wrap
      fireEvent.keyDown(toolbar, { key: "ArrowRight" });
      fireEvent.keyDown(toolbar, { key: "ArrowRight" });
      fireEvent.keyDown(toolbar, { key: "ArrowRight" });
      fireEvent.keyDown(toolbar, { key: "ArrowRight" });
      expect(document.activeElement).toBe(screen.getByLabelText("Finder"));
    });

    it("Enter activates the focused item", () => {
      const items = createItems();
      render(<Dock items={items} position="bottom" />);
      const toolbar = screen.getByRole("toolbar");

      screen.getByLabelText("Finder").focus();
      fireEvent.keyDown(toolbar, { key: "Enter" });
      expect(items[0].onClick).toHaveBeenCalledTimes(1);
    });

    it("Space activates the focused item", () => {
      const items = createItems();
      render(<Dock items={items} position="bottom" />);
      const toolbar = screen.getByRole("toolbar");

      screen.getByLabelText("Finder").focus();
      fireEvent.keyDown(toolbar, { key: " " });
      expect(items[0].onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("badge", () => {
    it("renders badge when provided", () => {
      render(<Dock items={sampleItems} />);
      expect(screen.getByText("5")).toBeInTheDocument();
    });

    it("does not render badge when not provided", () => {
      const items: DockItem[] = [
        { id: "test", icon: "star", label: "Test" },
      ];
      render(<Dock items={items} />);
      const button = screen.getByLabelText("Test");
      const badge = button.querySelector('[class*="bg-red"]');
      expect(badge).not.toBeInTheDocument();
    });

    it("renders string badge", () => {
      const items: DockItem[] = [
        { id: "test", icon: "star", label: "Test", badge: "new" },
      ];
      render(<Dock items={items} />);
      expect(screen.getByText("new")).toBeInTheDocument();
    });
  });

  describe("active indicator", () => {
    it("renders active dot for active items", () => {
      const { container } = render(<Dock items={sampleItems} />);
      // Music item is active — should have a dot
      const dots = container.querySelectorAll(".bg-slate-600");
      expect(dots.length).toBeGreaterThan(0);
    });
  });

  describe("onClick", () => {
    it("calls onClick when item button is clicked", () => {
      const items = createItems();
      render(<Dock items={items} />);
      fireEvent.click(screen.getByLabelText("Finder"));
      expect(items[0].onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("position", () => {
    it.each(["bottom", "left", "right"] as const)(
      "renders in %s position",
      (pos) => {
        const { container } = render(
          <Dock items={sampleItems} position={pos} />
        );
        expect(container.firstElementChild).toBeInTheDocument();
      }
    );
  });

  describe("magnification", () => {
    it("defaults to magnification enabled", () => {
      const { container } = render(<Dock items={sampleItems} />);
      // Buttons should have transition class when magnification is on
      const buttons = container.querySelectorAll("button");
      buttons.forEach((btn) => {
        expect(btn.className).toContain("transition-transform");
      });
    });

    it("disables transition when magnification=false", () => {
      const { container } = render(
        <Dock items={sampleItems} magnification={false} />
      );
      const buttons = container.querySelectorAll("button");
      buttons.forEach((btn) => {
        expect(btn.className).toContain("transition-none");
      });
    });
  });

  describe("className merging", () => {
    it("accepts and merges custom className", () => {
      const { container } = render(
        <Dock items={sampleItems} className="my-dock-class" />
      );
      expect(container.firstElementChild).toHaveClass("my-dock-class");
    });
  });

  describe("ref forwarding", () => {
    it("forwards ref to outer div", () => {
      const ref = { current: null as HTMLDivElement | null };
      render(<Dock items={sampleItems} ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe("ReactNode icon", () => {
    it("renders ReactNode icons", () => {
      const items: DockItem[] = [
        {
          id: "custom",
          icon: <svg data-testid="custom-icon" />,
          label: "Custom",
        },
      ];
      render(<Dock items={items} />);
      expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
    });
  });
});

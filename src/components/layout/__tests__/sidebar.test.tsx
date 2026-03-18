/* eslint-disable react-hooks/globals -- test pattern: capture context via render */
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Sidebar, SidebarNavGroup, SidebarNavItem } from "../sidebar";
import { SidebarProvider, useSidebar } from "../sidebar-context";
import { createRef } from "react";

// ---------------------------------------------------------------------------
// Helper: wrap component in SidebarProvider
// ---------------------------------------------------------------------------

function Wrapper({
  children,
  defaultCollapsed,
}: {
  children: React.ReactNode;
  defaultCollapsed?: boolean;
}) {
  return (
    <SidebarProvider defaultCollapsed={defaultCollapsed}>
      {children}
    </SidebarProvider>
  );
}

// ---------------------------------------------------------------------------
// useSidebar hook
// ---------------------------------------------------------------------------

describe("useSidebar", () => {
  it("throws when used outside SidebarProvider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    function Bad() {
      useSidebar();
      return null;
    }
    expect(() => render(<Bad />)).toThrow(
      "useSidebar must be used within SidebarProvider"
    );
    spy.mockRestore();
  });

  it("returns context with correct shape", () => {
    let ctx: ReturnType<typeof useSidebar> | null = null;
    function Reader() {
      ctx = useSidebar();
      return null;
    }
    render(
      <Wrapper>
        <Reader />
      </Wrapper>
    );
    expect(ctx).toBeDefined();
    expect(ctx!.isCollapsed).toBe(false);
    expect(ctx!.isOpen).toBe(false);
    expect(typeof ctx!.open).toBe("function");
    expect(typeof ctx!.close).toBe("function");
    expect(typeof ctx!.toggleCollapse).toBe("function");
  });

  it("respects defaultCollapsed", () => {
    let ctx: ReturnType<typeof useSidebar> | null = null;
    function Reader() {
      ctx = useSidebar();
      return null;
    }
    render(
      <Wrapper defaultCollapsed>
        <Reader />
      </Wrapper>
    );
    expect(ctx!.isCollapsed).toBe(true);
  });

  it("toggleCollapse flips state", () => {
    let ctx: ReturnType<typeof useSidebar> | null = null;
    function Reader() {
      ctx = useSidebar();
      return (
        <button onClick={ctx.toggleCollapse} data-testid="toggle">
          toggle
        </button>
      );
    }
    render(
      <Wrapper>
        <Reader />
      </Wrapper>
    );
    expect(ctx!.isCollapsed).toBe(false);
    fireEvent.click(screen.getByTestId("toggle"));
    expect(ctx!.isCollapsed).toBe(true);
    fireEvent.click(screen.getByTestId("toggle"));
    expect(ctx!.isCollapsed).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Sidebar root
// ---------------------------------------------------------------------------

describe("Sidebar", () => {
  it("renders as aside element", () => {
    const ref = createRef<HTMLElement>();
    render(
      <Wrapper>
        <Sidebar ref={ref}>content</Sidebar>
      </Wrapper>
    );
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current!.tagName).toBe("ASIDE");
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLElement>();
    render(
      <Wrapper>
        <Sidebar ref={ref}>content</Sidebar>
      </Wrapper>
    );
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  it("accepts and merges className", () => {
    const ref = createRef<HTMLElement>();
    render(
      <Wrapper>
        <Sidebar ref={ref} className="custom-class">content</Sidebar>
      </Wrapper>
    );
    expect(ref.current).toHaveClass("custom-class");
  });

  it("renders logo when provided", () => {
    render(
      <Wrapper>
        <Sidebar logo={<span data-testid="logo">Logo</span>}>content</Sidebar>
      </Wrapper>
    );
    expect(screen.getByTestId("logo")).toBeInTheDocument();
  });

  it("renders footer when provided", () => {
    render(
      <Wrapper>
        <Sidebar footer={<span>Footer text</span>}>content</Sidebar>
      </Wrapper>
    );
    expect(screen.getByText("Footer text")).toBeInTheDocument();
  });

  it("renders children in nav element", () => {
    render(
      <Wrapper>
        <Sidebar>
          <span data-testid="child">nav content</span>
        </Sidebar>
      </Wrapper>
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("renders collapse toggle button when collapsible", () => {
    render(
      <Wrapper>
        <Sidebar collapsible>content</Sidebar>
      </Wrapper>
    );
    expect(
      screen.getByRole("button", { name: /collapse sidebar/i })
    ).toBeInTheDocument();
  });

  it("does not render collapse toggle when not collapsible", () => {
    render(
      <Wrapper>
        <Sidebar>content</Sidebar>
      </Wrapper>
    );
    expect(
      screen.queryByRole("button", { name: /collapse sidebar/i })
    ).not.toBeInTheDocument();
  });

  it("collapse toggle label changes when collapsed", () => {
    render(
      <Wrapper defaultCollapsed>
        <Sidebar collapsible>content</Sidebar>
      </Wrapper>
    );
    expect(
      screen.getByRole("button", { name: /expand sidebar/i })
    ).toBeInTheDocument();
  });

  it("renders mobile backdrop", () => {
    const { container } = render(
      <Wrapper>
        <Sidebar>content</Sidebar>
      </Wrapper>
    );
    const backdrop = container.querySelector('[aria-hidden="true"]');
    expect(backdrop).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// SidebarNavGroup
// ---------------------------------------------------------------------------

describe("SidebarNavGroup", () => {
  it("renders children with optional label", () => {
    render(
      <Wrapper>
        <SidebarNavGroup label="Section">
          <div>item</div>
        </SidebarNavGroup>
      </Wrapper>
    );
    expect(screen.getByText("Section")).toBeInTheDocument();
    expect(screen.getByText("item")).toBeInTheDocument();
  });

  it("renders without label", () => {
    render(
      <Wrapper>
        <SidebarNavGroup>
          <div>item only</div>
        </SidebarNavGroup>
      </Wrapper>
    );
    expect(screen.getByText("item only")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Wrapper>
        <SidebarNavGroup ref={ref}>
          <div>item</div>
        </SidebarNavGroup>
      </Wrapper>
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("merges className", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Wrapper>
        <SidebarNavGroup ref={ref} className="custom-group">
          <div>item</div>
        </SidebarNavGroup>
      </Wrapper>
    );
    expect(ref.current).toHaveClass("custom-group");
  });
});

// ---------------------------------------------------------------------------
// SidebarNavItem
// ---------------------------------------------------------------------------

describe("SidebarNavItem", () => {
  it("renders a link with label", () => {
    render(
      <Wrapper>
        <SidebarNavItem label="Home" href="/home" />
      </Wrapper>
    );
    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("renders with icon", () => {
    render(
      <Wrapper>
        <SidebarNavItem icon="dashboard" label="Dashboard" />
      </Wrapper>
    );
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("dashboard")).toBeInTheDocument();
  });

  it("sets aria-current='page' when active", () => {
    const { container } = render(
      <Wrapper>
        <SidebarNavItem label="Active" active href="/active" />
      </Wrapper>
    );
    const link = container.querySelector('[aria-current="page"]');
    expect(link).toBeInTheDocument();
  });

  it("does not set aria-current when not active", () => {
    const { container } = render(
      <Wrapper>
        <SidebarNavItem label="Inactive" href="/inactive" />
      </Wrapper>
    );
    const link = container.querySelector('[aria-current]');
    expect(link).toBeNull();
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLAnchorElement>();
    render(
      <Wrapper>
        <SidebarNavItem ref={ref} label="Ref" href="/ref" />
      </Wrapper>
    );
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
  });

  it("merges className", () => {
    const ref = createRef<HTMLAnchorElement>();
    render(
      <Wrapper>
        <SidebarNavItem ref={ref} label="Styled" href="/styled" className="custom-item" />
      </Wrapper>
    );
    expect(ref.current).toHaveClass("custom-item");
  });
});

// ---------------------------------------------------------------------------
// displayName checks
// ---------------------------------------------------------------------------

describe("displayName", () => {
  it.each([
    ["Sidebar", Sidebar],
    ["SidebarNavGroup", SidebarNavGroup],
    ["SidebarNavItem", SidebarNavItem],
  ] as const)("%s has correct displayName", (name, component) => {
    expect((component as { displayName?: string }).displayName).toBe(name);
  });
});

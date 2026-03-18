import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  Sidebar,
  SidebarProvider,
  useSidebar,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarSeparator,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarNavGroup,
  SidebarNavItem,
} from "../sidebar";
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
      "useSidebar must be used within a SidebarProvider"
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
    expect(ctx!.collapsed).toBe(false);
    expect(ctx!.mobile).toBe(false);
    expect(typeof ctx!.setCollapsed).toBe("function");
    expect(typeof ctx!.toggleCollapsed).toBe("function");
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
    expect(ctx!.collapsed).toBe(true);
  });

  it("toggleCollapsed flips state", () => {
    let ctx: ReturnType<typeof useSidebar> | null = null;
    function Reader() {
      ctx = useSidebar();
      return (
        <button onClick={ctx.toggleCollapsed} data-testid="toggle">
          toggle
        </button>
      );
    }
    render(
      <Wrapper>
        <Reader />
      </Wrapper>
    );
    expect(ctx!.collapsed).toBe(false);
    fireEvent.click(screen.getByTestId("toggle"));
    expect(ctx!.collapsed).toBe(true);
    fireEvent.click(screen.getByTestId("toggle"));
    expect(ctx!.collapsed).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Sidebar root
// ---------------------------------------------------------------------------

describe("Sidebar", () => {
  it("renders with role=navigation and aria-label", () => {
    render(
      <Wrapper>
        <Sidebar>content</Sidebar>
      </Wrapper>
    );
    const nav = screen.getByRole("navigation");
    expect(nav).toHaveAttribute("aria-label", "Sidebar");
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLElement>();
    render(
      <Wrapper>
        <Sidebar ref={ref}>content</Sidebar>
      </Wrapper>
    );
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current!.tagName).toBe("ASIDE");
  });

  it("accepts and merges className", () => {
    render(
      <Wrapper>
        <Sidebar className="custom-class">content</Sidebar>
      </Wrapper>
    );
    expect(screen.getByRole("navigation")).toHaveClass("custom-class");
  });

  it("sets data-collapsed when collapsible + collapsed", () => {
    render(
      <Wrapper defaultCollapsed>
        <Sidebar collapsible>content</Sidebar>
      </Wrapper>
    );
    expect(screen.getByRole("navigation")).toHaveAttribute(
      "data-collapsed",
      "true"
    );
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
});

// ---------------------------------------------------------------------------
// SidebarHeader
// ---------------------------------------------------------------------------

describe("SidebarHeader", () => {
  it("renders children", () => {
    render(
      <Wrapper>
        <SidebarHeader>Logo Here</SidebarHeader>
      </Wrapper>
    );
    expect(screen.getByText("Logo Here")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Wrapper>
        <SidebarHeader ref={ref}>Header</SidebarHeader>
      </Wrapper>
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("merges className", () => {
    render(
      <Wrapper>
        <SidebarHeader className="my-header">H</SidebarHeader>
      </Wrapper>
    );
    expect(screen.getByText("H").closest("div")).toHaveClass("my-header");
  });
});

// ---------------------------------------------------------------------------
// SidebarFooter
// ---------------------------------------------------------------------------

describe("SidebarFooter", () => {
  it("renders children", () => {
    render(
      <Wrapper>
        <SidebarFooter>Footer Text</SidebarFooter>
      </Wrapper>
    );
    expect(screen.getByText("Footer Text")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Wrapper>
        <SidebarFooter ref={ref}>F</SidebarFooter>
      </Wrapper>
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

// ---------------------------------------------------------------------------
// SidebarContent
// ---------------------------------------------------------------------------

describe("SidebarContent", () => {
  it("renders scrollable area with children", () => {
    render(
      <Wrapper>
        <SidebarContent data-testid="content">Nav Items</SidebarContent>
      </Wrapper>
    );
    const el = screen.getByTestId("content");
    expect(el).toHaveClass("overflow-y-auto");
    expect(el).toHaveTextContent("Nav Items");
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Wrapper>
        <SidebarContent ref={ref}>C</SidebarContent>
      </Wrapper>
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

// ---------------------------------------------------------------------------
// SidebarGroup / SidebarGroupLabel / SidebarGroupContent
// ---------------------------------------------------------------------------

describe("SidebarGroup", () => {
  it("renders as wrapper div", () => {
    render(
      <Wrapper>
        <SidebarGroup data-testid="grp">children</SidebarGroup>
      </Wrapper>
    );
    expect(screen.getByTestId("grp")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Wrapper>
        <SidebarGroup ref={ref}>G</SidebarGroup>
      </Wrapper>
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe("SidebarGroupLabel", () => {
  it("renders label text", () => {
    render(
      <Wrapper>
        <SidebarGroupLabel>Main</SidebarGroupLabel>
      </Wrapper>
    );
    expect(screen.getByText("Main")).toBeInTheDocument();
  });

  it("hides when sidebar is collapsed", () => {
    render(
      <Wrapper defaultCollapsed>
        <SidebarGroupLabel>Hidden Label</SidebarGroupLabel>
      </Wrapper>
    );
    expect(screen.queryByText("Hidden Label")).not.toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <Wrapper>
        <SidebarGroupLabel ref={ref}>Label</SidebarGroupLabel>
      </Wrapper>
    );
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });
});

describe("SidebarGroupContent", () => {
  it("renders children in flex column", () => {
    render(
      <Wrapper>
        <SidebarGroupContent data-testid="gc">Items</SidebarGroupContent>
      </Wrapper>
    );
    const el = screen.getByTestId("gc");
    expect(el).toHaveClass("flex", "flex-col");
    expect(el).toHaveTextContent("Items");
  });
});

// ---------------------------------------------------------------------------
// SidebarSeparator
// ---------------------------------------------------------------------------

describe("SidebarSeparator", () => {
  it("renders an hr element", () => {
    render(
      <Wrapper>
        <SidebarSeparator data-testid="sep" />
      </Wrapper>
    );
    expect(screen.getByTestId("sep").tagName).toBe("HR");
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLHRElement>();
    render(
      <Wrapper>
        <SidebarSeparator ref={ref} />
      </Wrapper>
    );
    expect(ref.current).toBeInstanceOf(HTMLHRElement);
  });
});

// ---------------------------------------------------------------------------
// SidebarMenu / SidebarMenuItem
// ---------------------------------------------------------------------------

describe("SidebarMenu", () => {
  it("renders a ul element", () => {
    render(
      <Wrapper>
        <SidebarMenu data-testid="menu">
          <li>item</li>
        </SidebarMenu>
      </Wrapper>
    );
    expect(screen.getByTestId("menu").tagName).toBe("UL");
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLUListElement>();
    render(
      <Wrapper>
        <SidebarMenu ref={ref}>
          <li>item</li>
        </SidebarMenu>
      </Wrapper>
    );
    expect(ref.current).toBeInstanceOf(HTMLUListElement);
  });
});

describe("SidebarMenuItem", () => {
  it("renders a li element", () => {
    render(
      <Wrapper>
        <SidebarMenu>
          <SidebarMenuItem data-testid="mi">child</SidebarMenuItem>
        </SidebarMenu>
      </Wrapper>
    );
    expect(screen.getByTestId("mi").tagName).toBe("LI");
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLLIElement>();
    render(
      <Wrapper>
        <SidebarMenu>
          <SidebarMenuItem ref={ref}>child</SidebarMenuItem>
        </SidebarMenu>
      </Wrapper>
    );
    expect(ref.current).toBeInstanceOf(HTMLLIElement);
  });
});

// ---------------------------------------------------------------------------
// SidebarMenuButton
// ---------------------------------------------------------------------------

describe("SidebarMenuButton", () => {
  it("renders a button with text", () => {
    render(
      <Wrapper>
        <SidebarMenuButton>Dashboard</SidebarMenuButton>
      </Wrapper>
    );
    expect(
      screen.getByRole("button", { name: "Dashboard" })
    ).toBeInTheDocument();
  });

  it("renders with icon string", () => {
    render(
      <Wrapper>
        <SidebarMenuButton icon="home">Home</SidebarMenuButton>
      </Wrapper>
    );
    expect(screen.getByRole("button", { name: "Home" })).toBeInTheDocument();
  });

  it("sets aria-current=page when active", () => {
    render(
      <Wrapper>
        <SidebarMenuButton active>Active Item</SidebarMenuButton>
      </Wrapper>
    );
    expect(screen.getByRole("button", { name: "Active Item" })).toHaveAttribute(
      "aria-current",
      "page"
    );
  });

  it("does not set aria-current when not active", () => {
    render(
      <Wrapper>
        <SidebarMenuButton>Inactive</SidebarMenuButton>
      </Wrapper>
    );
    expect(
      screen.getByRole("button", { name: "Inactive" })
    ).not.toHaveAttribute("aria-current");
  });

  it("is disabled when disabled prop is passed", () => {
    render(
      <Wrapper>
        <SidebarMenuButton disabled>Disabled</SidebarMenuButton>
      </Wrapper>
    );
    expect(screen.getByRole("button", { name: "Disabled" })).toBeDisabled();
  });

  it("handles click events", () => {
    const onClick = vi.fn();
    render(
      <Wrapper>
        <SidebarMenuButton onClick={onClick}>Click Me</SidebarMenuButton>
      </Wrapper>
    );
    fireEvent.click(screen.getByRole("button", { name: "Click Me" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Wrapper>
        <SidebarMenuButton ref={ref}>Ref</SidebarMenuButton>
      </Wrapper>
    );
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("shows tooltip in collapsed mode", () => {
    render(
      <Wrapper defaultCollapsed>
        <SidebarMenuButton icon="home">Dashboard</SidebarMenuButton>
      </Wrapper>
    );
    expect(screen.getByRole("tooltip")).toHaveTextContent("Dashboard");
  });

  it("sets aria-label in collapsed mode for string children", () => {
    render(
      <Wrapper defaultCollapsed>
        <SidebarMenuButton icon="home">Dashboard</SidebarMenuButton>
      </Wrapper>
    );
    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-label",
      "Dashboard"
    );
  });

  it("merges className", () => {
    render(
      <Wrapper>
        <SidebarMenuButton className="custom-btn">Styled</SidebarMenuButton>
      </Wrapper>
    );
    expect(screen.getByRole("button", { name: "Styled" })).toHaveClass(
      "custom-btn"
    );
  });

  it("renders ReactNode icon", () => {
    render(
      <Wrapper>
        <SidebarMenuButton icon={<span data-testid="custom-icon">*</span>}>
          Custom
        </SidebarMenuButton>
      </Wrapper>
    );
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });

  it("supports asChild rendering", () => {
    render(
      <Wrapper>
        <SidebarMenuButton asChild>
          <a href="/page">Link</a>
        </SidebarMenuButton>
      </Wrapper>
    );
    // When asChild, renders a span wrapper with the link inside
    expect(screen.getByText("Link")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// SidebarMenuSub / SidebarMenuSubItem / SidebarMenuSubButton
// ---------------------------------------------------------------------------

describe("SidebarMenuSub", () => {
  it("renders a ul with role=group", () => {
    render(
      <Wrapper>
        <SidebarMenuSub data-testid="sub">
          <li>sub item</li>
        </SidebarMenuSub>
      </Wrapper>
    );
    const el = screen.getByTestId("sub");
    expect(el.tagName).toBe("UL");
    expect(el).toHaveAttribute("role", "group");
  });

  it("has aria-expanded", () => {
    render(
      <Wrapper>
        <SidebarMenuSub data-testid="sub" open>
          <li>item</li>
        </SidebarMenuSub>
      </Wrapper>
    );
    expect(screen.getByTestId("sub")).toHaveAttribute("aria-expanded", "true");
  });

  it("hides when open=false", () => {
    render(
      <Wrapper>
        <SidebarMenuSub data-testid="sub" open={false}>
          <li>hidden</li>
        </SidebarMenuSub>
      </Wrapper>
    );
    expect(screen.getByTestId("sub")).toHaveClass("hidden");
  });

  it("returns null when sidebar is collapsed", () => {
    render(
      <Wrapper defaultCollapsed>
        <SidebarMenuSub data-testid="sub">
          <li>gone</li>
        </SidebarMenuSub>
      </Wrapper>
    );
    expect(screen.queryByTestId("sub")).not.toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLUListElement>();
    render(
      <Wrapper>
        <SidebarMenuSub ref={ref}>
          <li>item</li>
        </SidebarMenuSub>
      </Wrapper>
    );
    expect(ref.current).toBeInstanceOf(HTMLUListElement);
  });
});

describe("SidebarMenuSubItem", () => {
  it("renders a li element", () => {
    render(
      <Wrapper>
        <SidebarMenuSub>
          <SidebarMenuSubItem data-testid="si">child</SidebarMenuSubItem>
        </SidebarMenuSub>
      </Wrapper>
    );
    expect(screen.getByTestId("si").tagName).toBe("LI");
  });
});

describe("SidebarMenuSubButton", () => {
  it("renders a button", () => {
    render(
      <Wrapper>
        <SidebarMenuSubButton>Sub Action</SidebarMenuSubButton>
      </Wrapper>
    );
    expect(
      screen.getByRole("button", { name: "Sub Action" })
    ).toBeInTheDocument();
  });

  it("sets aria-current=page when active", () => {
    render(
      <Wrapper>
        <SidebarMenuSubButton active>Active Sub</SidebarMenuSubButton>
      </Wrapper>
    );
    expect(
      screen.getByRole("button", { name: "Active Sub" })
    ).toHaveAttribute("aria-current", "page");
  });

  it("is disabled when disabled prop is passed", () => {
    render(
      <Wrapper>
        <SidebarMenuSubButton disabled>Disabled Sub</SidebarMenuSubButton>
      </Wrapper>
    );
    expect(
      screen.getByRole("button", { name: "Disabled Sub" })
    ).toBeDisabled();
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Wrapper>
        <SidebarMenuSubButton ref={ref}>Ref</SidebarMenuSubButton>
      </Wrapper>
    );
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("handles click events", () => {
    const onClick = vi.fn();
    render(
      <Wrapper>
        <SidebarMenuSubButton onClick={onClick}>Click</SidebarMenuSubButton>
      </Wrapper>
    );
    fireEvent.click(screen.getByRole("button", { name: "Click" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

// ---------------------------------------------------------------------------
// Legacy sub-components
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
});

describe("SidebarNavItem", () => {
  it("renders a link with label", () => {
    render(
      <Wrapper>
        <SidebarNavItem label="Home" href="/home" />
      </Wrapper>
    );
    const link = screen.getByText("Home").closest("a");
    expect(link).toHaveAttribute("href", "/home");
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

  it("applies active styles", () => {
    render(
      <Wrapper>
        <SidebarNavItem label="Active" active />
      </Wrapper>
    );
    // Active item gets nav-item-active class
    const link = screen.getByText("Active").closest("a");
    expect(link).toHaveClass("nav-item-active");
  });
});

// ---------------------------------------------------------------------------
// Integration: full sidebar composition
// ---------------------------------------------------------------------------

describe("Sidebar composition", () => {
  it("renders a complete sidebar with all sub-components", () => {
    render(
      <Wrapper>
        <Sidebar>
          <SidebarHeader>My App</SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Main</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton icon="home" active>
                      Dashboard
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton icon="settings">
                      Settings
                    </SidebarMenuButton>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton active>
                          General
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarSeparator />
          </SidebarContent>
          <SidebarFooter>User Info</SidebarFooter>
        </Sidebar>
      </Wrapper>
    );

    expect(screen.getByText("My App")).toBeInTheDocument();
    expect(screen.getByText("Main")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Dashboard" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Settings" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "General" })
    ).toBeInTheDocument();
    expect(screen.getByText("User Info")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// displayName checks
// ---------------------------------------------------------------------------

describe("displayName", () => {
  it.each([
    ["SidebarProvider", SidebarProvider],
    ["Sidebar", Sidebar],
    ["SidebarHeader", SidebarHeader],
    ["SidebarFooter", SidebarFooter],
    ["SidebarContent", SidebarContent],
    ["SidebarGroup", SidebarGroup],
    ["SidebarGroupLabel", SidebarGroupLabel],
    ["SidebarGroupContent", SidebarGroupContent],
    ["SidebarSeparator", SidebarSeparator],
    ["SidebarMenu", SidebarMenu],
    ["SidebarMenuItem", SidebarMenuItem],
    ["SidebarMenuButton", SidebarMenuButton],
    ["SidebarMenuSub", SidebarMenuSub],
    ["SidebarMenuSubItem", SidebarMenuSubItem],
    ["SidebarMenuSubButton", SidebarMenuSubButton],
    ["SidebarNavGroup", SidebarNavGroup],
    ["SidebarNavItem", SidebarNavItem],
  ] as const)("%s has correct displayName", (name, component) => {
    expect((component as { displayName?: string }).displayName).toBe(name);
  });
});

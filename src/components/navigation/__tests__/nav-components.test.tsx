import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

// Mock next/link since Breadcrumb imports it
vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

import { Breadcrumb } from "../breadcrumb";
import { Stepper } from "../stepper";
import { Menubar } from "../menubar";
import { NavigationMenu } from "../navigation-menu";
import { BottomNav } from "../bottom-nav";
import { Link } from "../link";
import { SkipNavLink, SkipNavContent } from "../skip-nav";

// ── Breadcrumb ───────────────────────────────────────────────────

describe("Breadcrumb", () => {
  const items = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "Widget" },
  ];

  it("renders as a <nav> element", () => {
    render(<Breadcrumb items={items} />);
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("renders all breadcrumb items", () => {
    render(<Breadcrumb items={items} />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("Widget")).toBeInTheDocument();
  });

  it("renders items with href as links", () => {
    render(<Breadcrumb items={items} />);
    const homeLink = screen.getByText("Home");
    expect(homeLink.tagName).toBe("A");
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("renders last item (no href) as plain text", () => {
    render(<Breadcrumb items={items} />);
    const lastItem = screen.getByText("Widget");
    expect(lastItem.tagName).toBe("SPAN");
  });

  it("merges className", () => {
    render(<Breadcrumb items={items} className="custom-breadcrumb" />);
    expect(screen.getByRole("navigation")).toHaveClass("custom-breadcrumb");
  });
});

// ── Stepper ──────────────────────────────────────────────────────

describe("Stepper", () => {
  const steps = [
    { label: "Account" },
    { label: "Profile", description: "Fill in details" },
    { label: "Review" },
  ];

  it("renders all step labels", () => {
    render(<Stepper steps={steps} activeStep={0} />);
    expect(screen.getByText("Account")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Review")).toBeInTheDocument();
  });

  it("renders step descriptions", () => {
    render(<Stepper steps={steps} activeStep={1} />);
    expect(screen.getByText("Fill in details")).toBeInTheDocument();
  });

  it("renders step numbers", () => {
    render(<Stepper steps={steps} activeStep={0} />);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("marks completed steps with a check icon (no number)", () => {
    render(<Stepper steps={steps} activeStep={2} />);
    // Steps 0 and 1 are complete, so numbers 1 and 2 should not be visible
    expect(screen.queryByText("1")).not.toBeInTheDocument();
    expect(screen.queryByText("2")).not.toBeInTheDocument();
    // Step 3 is active and should show number 3
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("merges className", () => {
    const { container } = render(
      <Stepper steps={steps} activeStep={0} className="custom-stepper" />
    );
    expect(container.firstChild).toHaveClass("custom-stepper");
  });
});

// ── Menubar ──────────────────────────────────────────────────────

describe("Menubar", () => {
  const menus = [
    {
      label: "File",
      items: [
        { label: "New", shortcut: "Ctrl+N", onClick: vi.fn() },
        { label: "Open", onClick: vi.fn() },
        { separator: true as const },
        { label: "Exit", danger: true },
      ],
    },
    {
      label: "Edit",
      items: [{ label: "Undo", shortcut: "Ctrl+Z" }],
    },
  ];

  it("renders with role='menubar'", () => {
    render(<Menubar menus={menus} />);
    expect(screen.getByRole("menubar")).toBeInTheDocument();
  });

  it("renders menu trigger labels", () => {
    render(<Menubar menus={menus} />);
    expect(screen.getByText("File")).toBeInTheDocument();
    expect(screen.getByText("Edit")).toBeInTheDocument();
  });

  it("triggers have role='menuitem' and aria-haspopup", () => {
    render(<Menubar menus={menus} />);
    const triggers = screen.getAllByRole("menuitem");
    expect(triggers.length).toBeGreaterThanOrEqual(2);
    expect(triggers[0]).toHaveAttribute("aria-haspopup", "true");
  });

  it("opens menu on click", async () => {
    const user = userEvent.setup();
    render(<Menubar menus={menus} />);
    await user.click(screen.getByText("File"));
    expect(screen.getByText("New")).toBeInTheDocument();
    expect(screen.getByText("Open")).toBeInTheDocument();
  });

  it("renders shortcuts in menu items", async () => {
    const user = userEvent.setup();
    render(<Menubar menus={menus} />);
    await user.click(screen.getByText("File"));
    expect(screen.getByText("Ctrl+N")).toBeInTheDocument();
  });

  it("sets aria-expanded on active trigger", async () => {
    const user = userEvent.setup();
    render(<Menubar menus={menus} />);
    const fileTrigger = screen.getByText("File");
    expect(fileTrigger).toHaveAttribute("aria-expanded", "false");
    await user.click(fileTrigger);
    expect(fileTrigger).toHaveAttribute("aria-expanded", "true");
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<Menubar menus={menus} ref={ref} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });
});

// ── NavigationMenu ───────────────────────────────────────────────

describe("NavigationMenu", () => {
  const items = [
    { label: "Home", href: "/", active: true },
    { label: "About", href: "/about" },
    {
      label: "Products",
      children: [
        { label: "Widget", href: "/products/widget", description: "A fancy widget" },
        { label: "Gadget", href: "/products/gadget" },
      ],
    },
  ];

  it("renders as a <nav> element", () => {
    render(<NavigationMenu items={items} />);
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("renders all top-level items", () => {
    render(<NavigationMenu items={items} />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Products")).toBeInTheDocument();
  });

  it("renders active item with aria-current='page'", () => {
    render(<NavigationMenu items={items} />);
    expect(screen.getByText("Home")).toHaveAttribute("aria-current", "page");
  });

  it("renders items without children as links", () => {
    render(<NavigationMenu items={items} />);
    expect(screen.getByText("Home").tagName).toBe("A");
    expect(screen.getByText("About").tagName).toBe("A");
  });

  it("renders items with children as buttons with aria-haspopup", () => {
    render(<NavigationMenu items={items} />);
    const productsBtn = screen.getByText("Products").closest("button");
    expect(productsBtn).toHaveAttribute("aria-haspopup", "true");
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<NavigationMenu items={items} ref={ref} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLElement));
  });
});

// ── BottomNav ────────────────────────────────────────────────────

describe("BottomNav", () => {
  const navItems = [
    { label: "Home", icon: "home", active: true },
    { label: "Search", icon: "search" },
    { label: "Profile", icon: "person", badge: 3 },
    { label: "Settings", icon: "settings", disabled: true },
  ];

  it("renders with role='navigation'", () => {
    render(<BottomNav items={navItems} />);
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("has aria-label", () => {
    render(<BottomNav items={navItems} />);
    expect(screen.getByRole("navigation")).toHaveAttribute(
      "aria-label",
      "Bottom navigation"
    );
  });

  it("renders all items with labels", () => {
    render(<BottomNav items={navItems} />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Search")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("marks active item with aria-current='page'", () => {
    render(<BottomNav items={navItems} />);
    const homeButton = screen.getByText("Home").closest("button");
    expect(homeButton).toHaveAttribute("aria-current", "page");
  });

  it("renders badge count", () => {
    render(<BottomNav items={navItems} />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("does not show labels when showLabels is false", () => {
    render(<BottomNav items={navItems} showLabels={false} />);
    expect(screen.queryByText("Home")).not.toBeInTheDocument();
  });

  it("renders as links when href is provided", () => {
    const linkItems = [
      { label: "Home", icon: "home", href: "/" },
      { label: "About", icon: "info", href: "/about" },
    ];
    render(<BottomNav items={linkItems} />);
    const homeLink = screen.getByText("Home").closest("a");
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<BottomNav items={navItems} ref={ref} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLElement));
  });
});

// ── Link ─────────────────────────────────────────────────────────

describe("Link", () => {
  it("renders an anchor element", () => {
    render(<Link href="/page">Click here</Link>);
    const link = screen.getByText("Click here");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/page");
  });

  it("opens in new tab when external", () => {
    render(
      <Link href="https://example.com" external>
        External
      </Link>
    );
    const link = screen.getByText("External");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("does not open in new tab when not external", () => {
    render(<Link href="/page">Internal</Link>);
    const link = screen.getByText("Internal");
    expect(link).not.toHaveAttribute("target");
  });

  it("merges className", () => {
    render(
      <Link href="/page" className="custom-link">
        Styled
      </Link>
    );
    expect(screen.getByText("Styled")).toHaveClass("custom-link");
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(
      <Link href="/page" ref={ref}>
        Ref test
      </Link>
    );
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLAnchorElement));
  });
});

// ── SkipNav ──────────────────────────────────────────────────────

describe("SkipNavLink", () => {
  it("renders an anchor element", () => {
    render(<SkipNavLink />);
    const link = screen.getByText("Skip to main content");
    expect(link.tagName).toBe("A");
  });

  it("links to #main-content by default", () => {
    render(<SkipNavLink />);
    expect(screen.getByText("Skip to main content")).toHaveAttribute(
      "href",
      "#main-content"
    );
  });

  it("accepts custom contentId", () => {
    render(<SkipNavLink contentId="app-content" />);
    expect(screen.getByText("Skip to main content")).toHaveAttribute(
      "href",
      "#app-content"
    );
  });

  it("accepts custom children", () => {
    render(<SkipNavLink>Skip navigation</SkipNavLink>);
    expect(screen.getByText("Skip navigation")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<SkipNavLink ref={ref} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLAnchorElement));
  });
});

describe("SkipNavContent", () => {
  it("renders a div with id='main-content' by default", () => {
    render(<SkipNavContent>Main</SkipNavContent>);
    const el = screen.getByText("Main");
    expect(el).toHaveAttribute("id", "main-content");
  });

  it("accepts custom id", () => {
    render(<SkipNavContent id="app-content">Content</SkipNavContent>);
    expect(screen.getByText("Content")).toHaveAttribute("id", "app-content");
  });

  it("has tabIndex=-1 for programmatic focus", () => {
    render(<SkipNavContent>Content</SkipNavContent>);
    expect(screen.getByText("Content")).toHaveAttribute("tabindex", "-1");
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<SkipNavContent ref={ref}>Content</SkipNavContent>);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });
});

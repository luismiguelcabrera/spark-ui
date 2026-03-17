import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

// Mock next/link since Sidebar imports it
vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

import { AppShell, AppShellHeader, AppShellContent } from "../app-shell";
import { Sidebar, SidebarNavGroup, SidebarNavItem } from "../sidebar";
import { AuthLayout } from "../auth-layout";
import { Portal } from "../portal";
import { Resizable } from "../resizable";
import { ScrollArea } from "../scroll-area";

// ── AppShell ─────────────────────────────────────────────────────

describe("AppShell", () => {
  it("renders children", () => {
    render(
      <AppShell>
        <div>Main content</div>
      </AppShell>
    );
    expect(screen.getByText("Main content")).toBeInTheDocument();
  });

  it("renders sidebar slot", () => {
    render(
      <AppShell sidebar={<div>Sidebar</div>}>
        <div>Content</div>
      </AppShell>
    );
    expect(screen.getByText("Sidebar")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("merges className", () => {
    const { container } = render(
      <AppShell className="custom-shell">
        <div>Content</div>
      </AppShell>
    );
    expect(container.firstChild).toHaveClass("custom-shell");
  });
});

describe("AppShellHeader", () => {
  it("renders as a header element", () => {
    render(
      <AppShell>
        <AppShellHeader>Header content</AppShellHeader>
      </AppShell>
    );
    expect(screen.getByText("Header content")).toBeInTheDocument();
    expect(screen.getByText("Header content").closest("header")).toBeInTheDocument();
  });

  it("merges className", () => {
    render(
      <AppShell>
        <AppShellHeader className="custom-header">Header</AppShellHeader>
      </AppShell>
    );
    expect(screen.getByText("Header").closest("header")).toHaveClass("custom-header");
  });
});

describe("AppShellContent", () => {
  it("renders as a main element", () => {
    render(
      <AppShell>
        <AppShellContent>Page content</AppShellContent>
      </AppShell>
    );
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByText("Page content")).toBeInTheDocument();
  });

  it("merges className", () => {
    render(
      <AppShell>
        <AppShellContent className="custom-content">Content</AppShellContent>
      </AppShell>
    );
    expect(screen.getByRole("main")).toHaveClass("custom-content");
  });
});

// ── Sidebar ──────────────────────────────────────────────────────

describe("Sidebar", () => {
  it("renders as an aside element", () => {
    render(
      <AppShell sidebar={<Sidebar>Nav items</Sidebar>}>
        <div>Content</div>
      </AppShell>
    );
    const aside = screen.getByText("Nav items").closest("aside");
    expect(aside).toBeInTheDocument();
  });

  it("renders logo slot", () => {
    render(
      <AppShell
        sidebar={
          <Sidebar logo={<span>Logo</span>}>
            <div>Nav</div>
          </Sidebar>
        }
      >
        <div>Content</div>
      </AppShell>
    );
    expect(screen.getByText("Logo")).toBeInTheDocument();
  });

  it("renders footer slot", () => {
    render(
      <AppShell
        sidebar={
          <Sidebar footer={<span>Footer</span>}>
            <div>Nav</div>
          </Sidebar>
        }
      >
        <div>Content</div>
      </AppShell>
    );
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });

  it("renders children", () => {
    render(
      <AppShell
        sidebar={
          <Sidebar>
            <div>Navigation items</div>
          </Sidebar>
        }
      >
        <div>Content</div>
      </AppShell>
    );
    expect(screen.getByText("Navigation items")).toBeInTheDocument();
  });
});

describe("SidebarNavGroup", () => {
  it("renders group label", () => {
    render(
      <AppShell
        sidebar={
          <Sidebar>
            <SidebarNavGroup label="Main">
              <div>Item</div>
            </SidebarNavGroup>
          </Sidebar>
        }
      >
        <div>Content</div>
      </AppShell>
    );
    expect(screen.getByText("Main")).toBeInTheDocument();
  });

  it("renders children", () => {
    render(
      <AppShell
        sidebar={
          <Sidebar>
            <SidebarNavGroup>
              <div>Group child</div>
            </SidebarNavGroup>
          </Sidebar>
        }
      >
        <div>Content</div>
      </AppShell>
    );
    expect(screen.getByText("Group child")).toBeInTheDocument();
  });
});

describe("SidebarNavItem", () => {
  it("renders as a link with label", () => {
    render(
      <AppShell
        sidebar={
          <Sidebar>
            <SidebarNavItem label="Dashboard" href="/dashboard" icon="dashboard" />
          </Sidebar>
        }
      >
        <div>Content</div>
      </AppShell>
    );
    const link = screen.getByText("Dashboard").closest("a");
    expect(link).toHaveAttribute("href", "/dashboard");
  });

  it("renders icon text", () => {
    render(
      <AppShell
        sidebar={
          <Sidebar>
            <SidebarNavItem label="Settings" icon="settings" />
          </Sidebar>
        }
      >
        <div>Content</div>
      </AppShell>
    );
    expect(screen.getByText("settings")).toBeInTheDocument();
  });
});

// ── AuthLayout ───────────────────────────────────────────────────

describe("AuthLayout", () => {
  it("renders left panel", () => {
    render(
      <AuthLayout leftPanel={<div>Brand image</div>}>
        <div>Login form</div>
      </AuthLayout>
    );
    expect(screen.getByText("Brand image")).toBeInTheDocument();
  });

  it("renders children (form content)", () => {
    render(
      <AuthLayout leftPanel={<div>Left</div>}>
        <div>Sign in form</div>
      </AuthLayout>
    );
    expect(screen.getByText("Sign in form")).toBeInTheDocument();
  });

  it("renders topAction when provided", () => {
    render(
      <AuthLayout
        leftPanel={<div>Left</div>}
        topAction={<button>Sign Up</button>}
      >
        <div>Form</div>
      </AuthLayout>
    );
    expect(screen.getByRole("button", { name: "Sign Up" })).toBeInTheDocument();
  });

  it("renders footer when provided", () => {
    render(
      <AuthLayout
        leftPanel={<div>Left</div>}
        footer={<p>Terms and conditions</p>}
      >
        <div>Form</div>
      </AuthLayout>
    );
    expect(screen.getByText("Terms and conditions")).toBeInTheDocument();
  });

  it("merges className", () => {
    const { container } = render(
      <AuthLayout leftPanel={<div>Left</div>} className="custom-auth">
        <div>Form</div>
      </AuthLayout>
    );
    expect(container.firstChild).toHaveClass("custom-auth");
  });
});

// ── Portal ───────────────────────────────────────────────────────

describe("Portal", () => {
  it("renders children into document.body", () => {
    render(
      <Portal>
        <div data-testid="portal-content">Portal content</div>
      </Portal>
    );
    expect(screen.getByTestId("portal-content")).toBeInTheDocument();
    // Should be in body, not in the render container
    expect(document.body.querySelector("[data-testid='portal-content']")).toBeInTheDocument();
  });

  it("renders children into custom container", () => {
    const container = document.createElement("div");
    container.id = "portal-target";
    document.body.appendChild(container);

    render(
      <Portal container={container}>
        <div data-testid="custom-portal">Custom portal</div>
      </Portal>
    );
    expect(
      container.querySelector("[data-testid='custom-portal']")
    ).toBeInTheDocument();

    document.body.removeChild(container);
  });
});

// ── Resizable ────────────────────────────────────────────────────

describe("Resizable", () => {
  it("renders children", () => {
    render(
      <Resizable>
        <div>Resizable content</div>
      </Resizable>
    );
    expect(screen.getByText("Resizable content")).toBeInTheDocument();
  });

  it("renders with default size", () => {
    const { container } = render(
      <Resizable defaultSize={250}>
        <div>Content</div>
      </Resizable>
    );
    const sizeDiv = container.querySelector("[style]");
    expect(sizeDiv).toHaveStyle({ width: "250px" });
  });

  it("renders vertical direction", () => {
    const { container } = render(
      <Resizable direction="vertical" defaultSize={200}>
        <div>Content</div>
      </Resizable>
    );
    const sizeDiv = container.querySelector("[style]");
    expect(sizeDiv).toHaveStyle({ height: "200px" });
  });

  it("renders resize handle", () => {
    const { container } = render(
      <Resizable>
        <div>Content</div>
      </Resizable>
    );
    const handle = container.querySelector(".cursor-col-resize");
    expect(handle).toBeInTheDocument();
  });

  it("renders vertical resize handle", () => {
    const { container } = render(
      <Resizable direction="vertical">
        <div>Content</div>
      </Resizable>
    );
    const handle = container.querySelector(".cursor-row-resize");
    expect(handle).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(
      <Resizable ref={ref}>
        <div>Content</div>
      </Resizable>
    );
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });
});

// ── ScrollArea ───────────────────────────────────────────────────

describe("ScrollArea", () => {
  it("renders children", () => {
    render(
      <ScrollArea>
        <div>Scrollable content</div>
      </ScrollArea>
    );
    expect(screen.getByText("Scrollable content")).toBeInTheDocument();
  });

  it("applies maxHeight style", () => {
    const { container } = render(
      <ScrollArea maxHeight={300}>
        <div>Content</div>
      </ScrollArea>
    );
    expect(container.firstChild).toHaveStyle({ maxHeight: "300px" });
  });

  it("applies string maxHeight", () => {
    const { container } = render(
      <ScrollArea maxHeight="50vh">
        <div>Content</div>
      </ScrollArea>
    );
    expect(container.firstChild).toHaveStyle({ maxHeight: "50vh" });
  });

  it("applies hidden scrollbar class", () => {
    const { container } = render(
      <ScrollArea scrollbar="hidden">
        <div>Content</div>
      </ScrollArea>
    );
    expect(container.firstChild).toHaveClass("scrollbar-none");
  });

  it("applies vertical orientation class", () => {
    const { container } = render(
      <ScrollArea orientation="vertical">
        <div>Content</div>
      </ScrollArea>
    );
    expect(container.firstChild).toHaveClass("overflow-x-hidden");
  });

  it("merges className", () => {
    const { container } = render(
      <ScrollArea className="custom-scroll">
        <div>Content</div>
      </ScrollArea>
    );
    expect(container.firstChild).toHaveClass("custom-scroll");
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(
      <ScrollArea ref={ref}>
        <div>Content</div>
      </ScrollArea>
    );
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });
});

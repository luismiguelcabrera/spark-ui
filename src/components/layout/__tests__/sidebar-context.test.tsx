import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SidebarProvider, useSidebar } from "../sidebar-context";

function TestConsumer() {
  const { isOpen, open, close, isCollapsed, toggleCollapse } = useSidebar();
  return (
    <div>
      <span data-testid="is-open">{String(isOpen)}</span>
      <span data-testid="is-collapsed">{String(isCollapsed)}</span>
      <button onClick={open}>Open</button>
      <button onClick={close}>Close</button>
      <button onClick={toggleCollapse}>Toggle</button>
    </div>
  );
}

describe("SidebarProvider", () => {
  it("renders children", () => {
    render(
      <SidebarProvider>
        <div>Sidebar content</div>
      </SidebarProvider>,
    );
    expect(screen.getByText("Sidebar content")).toBeInTheDocument();
  });

  it("provides default context values", () => {
    render(
      <SidebarProvider>
        <TestConsumer />
      </SidebarProvider>,
    );
    expect(screen.getByTestId("is-open")).toHaveTextContent("false");
    expect(screen.getByTestId("is-collapsed")).toHaveTextContent("false");
  });

  it("supports defaultCollapsed prop", () => {
    render(
      <SidebarProvider defaultCollapsed>
        <TestConsumer />
      </SidebarProvider>,
    );
    expect(screen.getByTestId("is-collapsed")).toHaveTextContent("true");
  });

  it("toggles collapse state", () => {
    render(
      <SidebarProvider>
        <TestConsumer />
      </SidebarProvider>,
    );
    expect(screen.getByTestId("is-collapsed")).toHaveTextContent("false");
    fireEvent.click(screen.getByText("Toggle"));
    expect(screen.getByTestId("is-collapsed")).toHaveTextContent("true");
    fireEvent.click(screen.getByText("Toggle"));
    expect(screen.getByTestId("is-collapsed")).toHaveTextContent("false");
  });

  it("opens sidebar", () => {
    render(
      <SidebarProvider>
        <TestConsumer />
      </SidebarProvider>,
    );
    expect(screen.getByTestId("is-open")).toHaveTextContent("false");
    fireEvent.click(screen.getByText("Open"));
    expect(screen.getByTestId("is-open")).toHaveTextContent("true");
  });

  it("closes sidebar", () => {
    render(
      <SidebarProvider>
        <TestConsumer />
      </SidebarProvider>,
    );
    fireEvent.click(screen.getByText("Open"));
    expect(screen.getByTestId("is-open")).toHaveTextContent("true");
    fireEvent.click(screen.getByText("Close"));
    expect(screen.getByTestId("is-open")).toHaveTextContent("false");
  });
});

describe("useSidebar", () => {
  it("throws when used outside SidebarProvider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<TestConsumer />)).toThrow(
      "useSidebar must be used within SidebarProvider",
    );
    spy.mockRestore();
  });
});

// Need vi import for the spy
import { vi } from "vitest";

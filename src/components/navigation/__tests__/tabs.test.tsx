import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Tabs } from "../tabs";

describe("Tabs (legacy API)", () => {
  const tabs = [
    { label: "Tab 1", value: "t1" },
    { label: "Tab 2", value: "t2" },
    { label: "Tab 3", value: "t3" },
  ];

  it("renders all tab labels", () => {
    render(<Tabs tabs={tabs} />);
    expect(screen.getByText("Tab 1")).toBeInTheDocument();
    expect(screen.getByText("Tab 2")).toBeInTheDocument();
    expect(screen.getByText("Tab 3")).toBeInTheDocument();
  });

  it("calls onValueChange on click", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Tabs tabs={tabs} onValueChange={onChange} />);
    await user.click(screen.getByText("Tab 2"));
    expect(onChange).toHaveBeenCalledWith("t2");
  });

  it("renders tablist role", () => {
    render(<Tabs tabs={tabs} />);
    expect(screen.getByRole("tablist")).toBeInTheDocument();
  });

  it("renders tab buttons with role='tab'", () => {
    render(<Tabs tabs={tabs} />);
    const allTabs = screen.getAllByRole("tab");
    expect(allTabs).toHaveLength(3);
  });

  it("sets aria-selected on active tab", async () => {
    const user = userEvent.setup();
    render(<Tabs tabs={tabs} />);
    await user.click(screen.getByText("Tab 2"));
    expect(screen.getByText("Tab 2")).toHaveAttribute("aria-selected", "true");
  });

  it("supports active tab from legacy active field", () => {
    const tabsWithActive = [
      { label: "Tab 1", value: "t1" },
      { label: "Tab 2", value: "t2", active: true },
    ];
    render(<Tabs tabs={tabsWithActive} />);
    expect(screen.getByText("Tab 2")).toHaveAttribute("aria-selected", "true");
  });

  it("renders tablist with border-b", () => {
    render(<Tabs tabs={tabs} />);
    expect(screen.getByRole("tablist")).toHaveClass("border-b");
  });
});

describe("Tabs (compound API)", () => {
  it("renders compound children", () => {
    render(
      <Tabs defaultValue="a">
        <Tabs.List>
          <Tabs.Tab value="a">First</Tabs.Tab>
          <Tabs.Tab value="b">Second</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="a">Panel A</Tabs.Panel>
        <Tabs.Panel value="b">Panel B</Tabs.Panel>
      </Tabs>,
    );
    expect(screen.getByText("Panel A")).toBeInTheDocument();
    expect(screen.queryByText("Panel B")).not.toBeInTheDocument();
  });

  it("switches panels on tab click", async () => {
    const user = userEvent.setup();
    render(
      <Tabs defaultValue="a">
        <Tabs.List>
          <Tabs.Tab value="a">First</Tabs.Tab>
          <Tabs.Tab value="b">Second</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="a">Panel A</Tabs.Panel>
        <Tabs.Panel value="b">Panel B</Tabs.Panel>
      </Tabs>,
    );
    await user.click(screen.getByText("Second"));
    expect(screen.queryByText("Panel A")).not.toBeInTheDocument();
    expect(screen.getByText("Panel B")).toBeInTheDocument();
  });

  it("renders tablist with border-b in compound mode", () => {
    render(
      <Tabs defaultValue="a">
        <Tabs.List>
          <Tabs.Tab value="a">Tab A</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="a">Content</Tabs.Panel>
      </Tabs>,
    );
    expect(screen.getByRole("tablist")).toHaveClass("border-b");
  });

  it("renders tabpanel with role='tabpanel'", () => {
    render(
      <Tabs defaultValue="a">
        <Tabs.List>
          <Tabs.Tab value="a">Tab A</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="a">Content A</Tabs.Panel>
      </Tabs>,
    );
    expect(screen.getByRole("tabpanel")).toBeInTheDocument();
  });

  it("sets aria-selected on the active compound tab", () => {
    render(
      <Tabs defaultValue="a">
        <Tabs.List>
          <Tabs.Tab value="a">Tab A</Tabs.Tab>
          <Tabs.Tab value="b">Tab B</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="a">Content A</Tabs.Panel>
      </Tabs>,
    );
    const activeTab = screen.getByRole("tab", { selected: true });
    expect(activeTab).toHaveTextContent("Tab A");
  });

  it("inactive tab has tabIndex=-1", () => {
    render(
      <Tabs defaultValue="a">
        <Tabs.List>
          <Tabs.Tab value="a">Tab A</Tabs.Tab>
          <Tabs.Tab value="b">Tab B</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="a">Content A</Tabs.Panel>
      </Tabs>,
    );
    expect(screen.getByText("Tab B")).toHaveAttribute("tabindex", "-1");
  });

  it("active tab has tabIndex=0", () => {
    render(
      <Tabs defaultValue="a">
        <Tabs.List>
          <Tabs.Tab value="a">Tab A</Tabs.Tab>
          <Tabs.Tab value="b">Tab B</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="a">Content A</Tabs.Panel>
      </Tabs>,
    );
    expect(screen.getByText("Tab A")).toHaveAttribute("tabindex", "0");
  });
});

describe("Tabs — keyboard navigation", () => {
  it("ArrowRight moves to next tab", async () => {
    const user = userEvent.setup();
    render(
      <Tabs defaultValue="a">
        <Tabs.List>
          <Tabs.Tab value="a">Tab A</Tabs.Tab>
          <Tabs.Tab value="b">Tab B</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="a">Content A</Tabs.Panel>
        <Tabs.Panel value="b">Content B</Tabs.Panel>
      </Tabs>,
    );
    screen.getByText("Tab A").focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByText("Content B")).toBeInTheDocument();
  });

  it("ArrowLeft moves to previous tab (wrapping)", async () => {
    const user = userEvent.setup();
    render(
      <Tabs defaultValue="a">
        <Tabs.List>
          <Tabs.Tab value="a">Tab A</Tabs.Tab>
          <Tabs.Tab value="b">Tab B</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="a">Content A</Tabs.Panel>
        <Tabs.Panel value="b">Content B</Tabs.Panel>
      </Tabs>,
    );
    screen.getByText("Tab A").focus();
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByText("Content B")).toBeInTheDocument();
  });
});

describe("Tabs — displayName", () => {
  it("Tabs has displayName", () => {
    expect(Tabs.displayName).toBe("Tabs");
  });

  it("Tabs.List has displayName", () => {
    expect(Tabs.List.displayName).toBe("TabsList");
  });

  it("Tabs.Tab has displayName", () => {
    expect(Tabs.Tab.displayName).toBe("Tab");
  });

  it("Tabs.Panel has displayName", () => {
    expect(Tabs.Panel.displayName).toBe("TabsPanel");
  });
});

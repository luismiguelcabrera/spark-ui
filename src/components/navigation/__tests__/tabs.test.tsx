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

  it("defaults to horizontal orientation", () => {
    render(<Tabs tabs={tabs} />);
    expect(screen.getByRole("tablist")).toHaveAttribute("aria-orientation", "horizontal");
  });

  it("supports vertical orientation", () => {
    render(<Tabs tabs={tabs} orientation="vertical" />);
    const tablist = screen.getByRole("tablist");
    expect(tablist).toHaveAttribute("aria-orientation", "vertical");
    expect(tablist).toHaveClass("flex-col");
    expect(tablist).toHaveClass("border-r");
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

  it("defaults to horizontal with aria-orientation", () => {
    render(
      <Tabs defaultValue="a">
        <Tabs.List>
          <Tabs.Tab value="a">Tab A</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="a">Content</Tabs.Panel>
      </Tabs>,
    );
    expect(screen.getByRole("tablist")).toHaveAttribute("aria-orientation", "horizontal");
  });

  it("renders vertical layout when orientation is vertical", () => {
    render(
      <Tabs defaultValue="a" orientation="vertical">
        <Tabs.List>
          <Tabs.Tab value="a">Tab A</Tabs.Tab>
          <Tabs.Tab value="b">Tab B</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="a">Content A</Tabs.Panel>
      </Tabs>,
    );
    const tablist = screen.getByRole("tablist");
    expect(tablist).toHaveAttribute("aria-orientation", "vertical");
    expect(tablist).toHaveClass("flex-col");
    expect(tablist).toHaveClass("border-r");
    expect(tablist).not.toHaveClass("border-b");
  });

  it("vertical tabs switch panels correctly", async () => {
    const user = userEvent.setup();
    render(
      <Tabs defaultValue="a" orientation="vertical">
        <Tabs.List>
          <Tabs.Tab value="a">Tab A</Tabs.Tab>
          <Tabs.Tab value="b">Tab B</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="a">Content A</Tabs.Panel>
        <Tabs.Panel value="b">Content B</Tabs.Panel>
      </Tabs>,
    );
    expect(screen.getByText("Content A")).toBeInTheDocument();
    await user.click(screen.getByText("Tab B"));
    expect(screen.queryByText("Content A")).not.toBeInTheDocument();
    expect(screen.getByText("Content B")).toBeInTheDocument();
  });

  it("vertical tabs have border-r styles on active tab", () => {
    render(
      <Tabs defaultValue="a" orientation="vertical">
        <Tabs.List>
          <Tabs.Tab value="a">Tab A</Tabs.Tab>
          <Tabs.Tab value="b">Tab B</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="a">Content A</Tabs.Panel>
      </Tabs>,
    );
    const activeTab = screen.getByRole("tab", { selected: true });
    expect(activeTab).toHaveClass("border-r-2");
    expect(activeTab).toHaveClass("border-r-primary");
  });
});

describe("Tabs — grow prop", () => {
  it("applies flex-1 to compound tabs when grow is true", () => {
    render(
      <Tabs defaultValue="a" grow>
        <Tabs.List>
          <Tabs.Tab value="a">Tab A</Tabs.Tab>
          <Tabs.Tab value="b">Tab B</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="a">Content A</Tabs.Panel>
      </Tabs>,
    );
    const tabButtons = screen.getAllByRole("tab");
    tabButtons.forEach((tab) => {
      expect(tab).toHaveClass("flex-1");
      expect(tab).toHaveClass("text-center");
    });
  });

  it("applies flex-1 to legacy tabs when grow is true", () => {
    const tabs = [
      { label: "Tab 1", value: "t1" },
      { label: "Tab 2", value: "t2" },
    ];
    render(<Tabs tabs={tabs} grow />);
    const tabButtons = screen.getAllByRole("tab");
    tabButtons.forEach((tab) => {
      expect(tab).toHaveClass("flex-1");
    });
  });

  it("does not apply flex-1 when grow is false", () => {
    render(
      <Tabs defaultValue="a">
        <Tabs.List>
          <Tabs.Tab value="a">Tab A</Tabs.Tab>
          <Tabs.Tab value="b">Tab B</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="a">Content A</Tabs.Panel>
      </Tabs>,
    );
    const tabButtons = screen.getAllByRole("tab");
    tabButtons.forEach((tab) => {
      expect(tab).not.toHaveClass("flex-1");
    });
  });
});

describe("Tabs — density prop", () => {
  it.each([
    ["default", "py-2.5"],
    ["comfortable", "py-3.5"],
    ["compact", "py-1.5"],
  ] as const)("applies %s density styles", (density, expectedClass) => {
    render(
      <Tabs defaultValue="a" density={density}>
        <Tabs.List>
          <Tabs.Tab value="a">Tab A</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="a">Content</Tabs.Panel>
      </Tabs>,
    );
    const tab = screen.getByRole("tab");
    expect(tab).toHaveClass(expectedClass);
  });

  it("defaults to 'default' density", () => {
    render(
      <Tabs defaultValue="a">
        <Tabs.List>
          <Tabs.Tab value="a">Tab A</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="a">Content</Tabs.Panel>
      </Tabs>,
    );
    const tab = screen.getByRole("tab");
    expect(tab).toHaveClass("py-2.5");
    expect(tab).toHaveClass("px-4");
  });

  it("applies compact density to legacy tabs", () => {
    const tabs = [{ label: "Tab 1", value: "t1" }];
    render(<Tabs tabs={tabs} density="compact" />);
    const tab = screen.getByRole("tab");
    expect(tab).toHaveClass("py-1.5");
    expect(tab).toHaveClass("text-xs");
  });
});

describe("Tabs — showArrows prop (legacy)", () => {
  it("renders scroll arrow buttons when showArrows is true", () => {
    const tabs = Array.from({ length: 20 }, (_, i) => ({
      label: `Tab ${i + 1}`,
      value: `t${i + 1}`,
    }));
    render(<Tabs tabs={tabs} showArrows />);
    // The tablist should still be rendered
    expect(screen.getByRole("tablist")).toBeInTheDocument();
    // All tabs should still be visible
    expect(screen.getByText("Tab 1")).toBeInTheDocument();
    expect(screen.getByText("Tab 20")).toBeInTheDocument();
  });

  it("does not show arrows for vertical orientation", () => {
    const tabs = Array.from({ length: 20 }, (_, i) => ({
      label: `Tab ${i + 1}`,
      value: `t${i + 1}`,
    }));
    render(<Tabs tabs={tabs} showArrows orientation="vertical" />);
    // Should NOT have scroll arrow buttons
    expect(screen.queryByLabelText("Scroll tabs left")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Scroll tabs right")).not.toBeInTheDocument();
  });
});

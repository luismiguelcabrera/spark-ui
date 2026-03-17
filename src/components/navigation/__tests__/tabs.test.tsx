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
});

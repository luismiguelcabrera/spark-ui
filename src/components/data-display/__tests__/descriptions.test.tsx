import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Descriptions, type DescriptionsItem } from "../descriptions";

const basicItems: DescriptionsItem[] = [
  { label: "Name", children: "John Doe" },
  { label: "Email", children: "john@example.com" },
  { label: "Phone", children: "+1 234 567 890" },
  { label: "Address", children: "123 Main St, City", span: 2 },
  { label: "Status", children: "Active" },
];

describe("Descriptions", () => {
  it("renders without error", () => {
    render(<Descriptions items={basicItems} />);
    expect(screen.getByText("Name:")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("renders all items with labels", () => {
    render(<Descriptions items={basicItems} />);
    expect(screen.getByText("Name:")).toBeInTheDocument();
    expect(screen.getByText("Email:")).toBeInTheDocument();
    expect(screen.getByText("Phone:")).toBeInTheDocument();
    expect(screen.getByText("Address:")).toBeInTheDocument();
    expect(screen.getByText("Status:")).toBeInTheDocument();
  });

  it("renders values", () => {
    render(<Descriptions items={basicItems} />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("+1 234 567 890")).toBeInTheDocument();
  });

  it("renders title when provided", () => {
    render(<Descriptions items={basicItems} title="User Details" />);
    expect(screen.getByText("User Details")).toBeInTheDocument();
  });

  it("does not render title when not provided", () => {
    render(<Descriptions items={basicItems} />);
    expect(screen.queryByText("User Details")).not.toBeInTheDocument();
  });

  describe("bordered mode", () => {
    it("renders as a table when bordered", () => {
      render(<Descriptions items={basicItems} bordered />);
      expect(screen.getByRole("table")).toBeInTheDocument();
    });

    it("renders title in bordered mode", () => {
      render(
        <Descriptions items={basicItems} bordered title="User Details" />
      );
      expect(screen.getByText("User Details")).toBeInTheDocument();
      expect(screen.getByRole("table")).toBeInTheDocument();
    });
  });

  describe("borderless mode", () => {
    it("uses grid layout (no table)", () => {
      const { container } = render(<Descriptions items={basicItems} />);
      expect(container.querySelector("table")).not.toBeInTheDocument();
    });

    it("renders dt/dd elements", () => {
      const { container } = render(<Descriptions items={basicItems} />);
      expect(container.querySelectorAll("dt").length).toBe(basicItems.length);
      expect(container.querySelectorAll("dd").length).toBe(basicItems.length);
    });
  });

  describe("column spans", () => {
    it("applies span in grid layout", () => {
      const { container } = render(
        <Descriptions items={basicItems} columns={3} />
      );
      // The Address item has span=2, so its container should have gridColumn: span 2
      const gridItems = container.querySelectorAll("[style]");
      const spanItem = Array.from(gridItems).find(
        (el) =>
          (el as HTMLElement).style.gridColumn === "span 2"
      );
      expect(spanItem).toBeTruthy();
    });
  });

  describe("colon prop", () => {
    it("shows colon by default", () => {
      render(<Descriptions items={basicItems} />);
      expect(screen.getByText("Name:")).toBeInTheDocument();
    });

    it("hides colon when colon=false", () => {
      render(<Descriptions items={basicItems} colon={false} />);
      expect(screen.queryByText("Name:")).not.toBeInTheDocument();
      expect(screen.getByText("Name")).toBeInTheDocument();
    });
  });

  describe("layout", () => {
    it("renders horizontal layout by default", () => {
      const { container } = render(<Descriptions items={basicItems} />);
      // In horizontal layout, dt/dd are in a flex row
      const flexItems = container.querySelectorAll(".flex.gap-2");
      expect(flexItems.length).toBeGreaterThan(0);
    });

    it("renders vertical layout", () => {
      const { container } = render(
        <Descriptions items={basicItems} layout="vertical" />
      );
      // In vertical layout, dd has mt-1
      const ddElements = container.querySelectorAll("dd");
      const hasVerticalSpacing = Array.from(ddElements).some((dd) =>
        dd.className.includes("mt-1")
      );
      expect(hasVerticalSpacing).toBe(true);
    });

    it("renders vertical bordered layout", () => {
      render(
        <Descriptions items={basicItems} bordered layout="vertical" />
      );
      // Should still render a table
      expect(screen.getByRole("table")).toBeInTheDocument();
    });
  });

  describe("sizes", () => {
    it.each(["sm", "md", "lg"] as const)("renders size %s", (sz) => {
      render(<Descriptions items={basicItems} size={sz} />);
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    it.each(["sm", "md", "lg"] as const)(
      "renders size %s in bordered mode",
      (sz) => {
        render(<Descriptions items={basicItems} size={sz} bordered />);
        expect(screen.getByRole("table")).toBeInTheDocument();
      }
    );
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<Descriptions ref={ref} items={basicItems} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("merges className", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(
      <Descriptions ref={ref} items={basicItems} className="custom-class" />
    );
    expect(ref.current).toHaveClass("custom-class");
  });

  it("merges className in bordered mode", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(
      <Descriptions
        ref={ref}
        items={basicItems}
        bordered
        className="bordered-custom"
      />
    );
    expect(ref.current).toHaveClass("bordered-custom");
  });

  it("handles empty items array", () => {
    const { container } = render(<Descriptions items={[]} />);
    expect(container.querySelectorAll("dt")).toHaveLength(0);
  });

  it("handles single item", () => {
    render(
      <Descriptions items={[{ label: "Only", children: "One item" }]} />
    );
    expect(screen.getByText("Only:")).toBeInTheDocument();
    expect(screen.getByText("One item")).toBeInTheDocument();
  });

  it("renders ReactNode children", () => {
    render(
      <Descriptions
        items={[
          {
            label: "Status",
            children: <span data-testid="status-badge">Active</span>,
          },
        ]}
      />
    );
    expect(screen.getByTestId("status-badge")).toBeInTheDocument();
  });
});

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { createRef } from "react";
import { OrganizationChart } from "../organization-chart";
import type { OrgNode } from "../organization-chart";

const sampleData: OrgNode = {
  id: "1",
  label: "CEO",
  title: "Chief Executive Officer",
  avatar: "https://example.com/ceo.jpg",
  children: [
    {
      id: "2",
      label: "CTO",
      title: "Chief Technology Officer",
      children: [
        { id: "4", label: "Dev Lead" },
        { id: "5", label: "QA Lead" },
      ],
    },
    {
      id: "3",
      label: "CFO",
      title: "Chief Financial Officer",
    },
  ],
};

describe("OrganizationChart", () => {
  it("renders the root node label", () => {
    render(<OrganizationChart data={sampleData} />);
    expect(screen.getByText("CEO")).toBeInTheDocument();
  });

  it("renders all descendant node labels", () => {
    render(<OrganizationChart data={sampleData} />);
    expect(screen.getByText("CTO")).toBeInTheDocument();
    expect(screen.getByText("CFO")).toBeInTheDocument();
    expect(screen.getByText("Dev Lead")).toBeInTheDocument();
    expect(screen.getByText("QA Lead")).toBeInTheDocument();
  });

  it("renders node titles", () => {
    render(<OrganizationChart data={sampleData} />);
    expect(screen.getByText("Chief Executive Officer")).toBeInTheDocument();
    expect(screen.getByText("Chief Technology Officer")).toBeInTheDocument();
    expect(screen.getByText("Chief Financial Officer")).toBeInTheDocument();
  });

  it("has figure role with aria-label on the root container", () => {
    render(<OrganizationChart data={sampleData} />);
    const figure = screen.getByRole("figure");
    expect(figure).toBeInTheDocument();
    expect(figure).toHaveAttribute("aria-label", "Organization chart");
  });

  it("renders aria-labels on node cards", () => {
    const { container } = render(<OrganizationChart data={sampleData} />);
    const nodes = container.querySelectorAll("[aria-label]");
    // At least root figure + 5 node cards
    expect(nodes.length).toBeGreaterThanOrEqual(5);
  });

  it("calls onNodeClick when a node is clicked", () => {
    const onNodeClick = vi.fn();
    render(<OrganizationChart data={sampleData} onNodeClick={onNodeClick} />);
    fireEvent.click(screen.getByText("CTO"));
    expect(onNodeClick).toHaveBeenCalledWith(
      expect.objectContaining({ id: "2", label: "CTO" }),
    );
  });

  it("calls onNodeClick on Enter key press", () => {
    const onNodeClick = vi.fn();
    render(<OrganizationChart data={sampleData} onNodeClick={onNodeClick} />);
    const cfoCard = screen.getByText("CFO").closest("[aria-label='CFO']")!;
    fireEvent.keyDown(cfoCard, { key: "Enter" });
    expect(onNodeClick).toHaveBeenCalledWith(
      expect.objectContaining({ id: "3", label: "CFO" }),
    );
  });

  it("calls onNodeClick on Space key press", () => {
    const onNodeClick = vi.fn();
    render(<OrganizationChart data={sampleData} onNodeClick={onNodeClick} />);
    const node = screen.getByText("CFO").closest("[aria-label='CFO']")!;
    fireEvent.keyDown(node, { key: " " });
    expect(onNodeClick).toHaveBeenCalledWith(
      expect.objectContaining({ id: "3", label: "CFO" }),
    );
  });

  it("nodes are focusable when onNodeClick is provided", () => {
    render(
      <OrganizationChart data={sampleData} onNodeClick={() => {}} />,
    );
    const node = screen.getByText("CEO").closest("[aria-label='CEO']")!;
    expect(node).toHaveAttribute("tabindex", "0");
  });

  it("nodes are not focusable when onNodeClick is not provided", () => {
    render(<OrganizationChart data={sampleData} />);
    const node = screen.getByText("CEO").closest("[aria-label='CEO']")!;
    expect(node).not.toHaveAttribute("tabindex");
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(<OrganizationChart ref={ref} data={sampleData} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("applies custom className", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <OrganizationChart ref={ref} data={sampleData} className="my-class" />,
    );
    expect(ref.current).toHaveClass("my-class");
  });

  it("applies nodeClassName to node cards", () => {
    render(
      <OrganizationChart
        data={{ id: "1", label: "Root" }}
        nodeClassName="node-custom"
      />,
    );
    const node = screen.getByText("Root").closest("[aria-label='Root']")!;
    expect(node).toHaveClass("node-custom");
  });

  it("renders single node without children", () => {
    const leaf: OrgNode = { id: "1", label: "Solo" };
    render(<OrganizationChart data={leaf} />);
    expect(screen.getByText("Solo")).toBeInTheDocument();
  });

  it("renders with horizontal direction", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <OrganizationChart
        ref={ref}
        data={sampleData}
        direction="horizontal"
      />,
    );
    expect(ref.current).toHaveClass("flex-row");
  });

  it("renders with vertical direction by default", () => {
    const ref = createRef<HTMLDivElement>();
    render(<OrganizationChart ref={ref} data={sampleData} />);
    expect(ref.current).toHaveClass("flex-col");
  });

  it("uses custom renderNode", () => {
    render(
      <OrganizationChart
        data={sampleData}
        renderNode={(node) => (
          <div data-testid={`custom-${node.id}`}>{node.label} Custom</div>
        )}
      />,
    );
    expect(screen.getByTestId("custom-1")).toBeInTheDocument();
    expect(screen.getByText("CEO Custom")).toBeInTheDocument();
    expect(screen.getByTestId("custom-2")).toBeInTheDocument();
  });

  it("renders connector lines as aria-hidden", () => {
    const { container } = render(<OrganizationChart data={sampleData} />);
    const hiddenDivs = container.querySelectorAll("[aria-hidden='true']");
    expect(hiddenDivs.length).toBeGreaterThan(0);
  });

  it("renders avatar when node has avatar", () => {
    render(<OrganizationChart data={sampleData} />);
    const img = screen.getByAltText("CEO");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "https://example.com/ceo.jpg");
  });

  it("does not render avatar when node has no avatar", () => {
    const data: OrgNode = { id: "1", label: "No Avatar" };
    render(<OrganizationChart data={data} />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("renders deeply nested nodes", () => {
    const deep: OrgNode = {
      id: "1",
      label: "Level 1",
      children: [
        {
          id: "2",
          label: "Level 2",
          children: [
            {
              id: "3",
              label: "Level 3",
              children: [{ id: "4", label: "Level 4" }],
            },
          ],
        },
      ],
    };
    render(<OrganizationChart data={deep} />);
    expect(screen.getByText("Level 1")).toBeInTheDocument();
    expect(screen.getByText("Level 2")).toBeInTheDocument();
    expect(screen.getByText("Level 3")).toBeInTheDocument();
    expect(screen.getByText("Level 4")).toBeInTheDocument();
  });
});

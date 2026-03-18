import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MetadataGrid, MetadataItem } from "../metadata-grid";

describe("MetadataGrid", () => {
  it("renders children", () => {
    render(
      <MetadataGrid>
        <MetadataItem label="Name" value="Alice" />
      </MetadataGrid>,
    );
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
  });

  it("renders as a dl element", () => {
    const { container } = render(
      <MetadataGrid>
        <MetadataItem label="Key" value="Val" />
      </MetadataGrid>,
    );
    expect(container.querySelector("dl")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLDListElement | null };
    render(
      <MetadataGrid ref={ref}>
        <MetadataItem label="Key" value="Val" />
      </MetadataGrid>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDListElement);
  });

  it("has correct displayName", () => {
    expect(MetadataGrid.displayName).toBe("MetadataGrid");
  });

  it("merges custom className", () => {
    const { container } = render(
      <MetadataGrid className="custom-class">
        <MetadataItem label="Key" value="Val" />
      </MetadataGrid>,
    );
    expect(container.querySelector("dl")!.className).toContain("custom-class");
  });

  it.each([2, 3, 4] as const)(
    "applies columns=%d grid class",
    (columns) => {
      const { container } = render(
        <MetadataGrid columns={columns}>
          <MetadataItem label="Key" value="Val" />
        </MetadataGrid>,
      );
      expect(container.querySelector("dl")!.className).toContain(`grid-cols-${columns}`);
    },
  );
});

describe("MetadataItem", () => {
  it("renders label and value", () => {
    render(<MetadataItem label="Status" value="Active" />);
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("renders label in dt and value in dd", () => {
    const { container } = render(<MetadataItem label="Email" value="test@example.com" />);
    expect(container.querySelector("dt")!.textContent).toBe("Email");
    expect(container.querySelector("dd")!.textContent).toBe("test@example.com");
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<MetadataItem ref={ref} label="Key" value="Val" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has correct displayName", () => {
    expect(MetadataItem.displayName).toBe("MetadataItem");
  });

  it("merges custom className", () => {
    const { container } = render(
      <MetadataItem label="Key" value="Val" className="extra" />,
    );
    expect(container.firstElementChild!.className).toContain("extra");
  });
});

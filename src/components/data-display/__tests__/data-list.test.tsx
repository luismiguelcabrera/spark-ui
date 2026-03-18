import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { DataList, DataListItem } from "../data-list";

describe("DataList", () => {
  it("renders as a dl element", () => {
    const ref = { current: null as HTMLDListElement | null };
    render(<DataList ref={ref}>items</DataList>);
    expect(ref.current).toBeInstanceOf(HTMLDListElement);
    expect(ref.current?.tagName).toBe("DL");
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLDListElement | null };
    render(<DataList ref={ref}>content</DataList>);
    expect(ref.current).toBeInstanceOf(HTMLDListElement);
  });

  it("has displayName", () => {
    expect(DataList.displayName).toBe("DataList");
  });

  it("merges className", () => {
    const ref = { current: null as HTMLDListElement | null };
    render(<DataList ref={ref} className="custom-dl">items</DataList>);
    expect(ref.current?.className).toContain("custom-dl");
  });

  it("renders vertical layout by default", () => {
    const ref = { current: null as HTMLDListElement | null };
    render(<DataList ref={ref}>items</DataList>);
    expect(ref.current?.className).toContain("space-y-3");
  });

  it("renders horizontal layout as a grid", () => {
    const ref = { current: null as HTMLDListElement | null };
    render(
      <DataList ref={ref} orientation="horizontal" cols={2}>
        items
      </DataList>
    );
    expect(ref.current?.className).toContain("grid");
    expect(ref.current?.className).toContain("grid-cols-2");
  });

  it.each([1, 2, 3, 4] as const)(
    "renders cols=%d in horizontal layout",
    (cols) => {
      const ref = { current: null as HTMLDListElement | null };
      render(
        <DataList ref={ref} orientation="horizontal" cols={cols}>
          items
        </DataList>
      );
      expect(ref.current?.className).toContain(`grid-cols-${cols}`);
    }
  );
});

describe("DataListItem", () => {
  it("renders label and value", () => {
    render(<DataListItem label="Name" value="Alice" />);
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
  });

  it("renders label as dt and value as dd", () => {
    render(<DataListItem label="Email" value="alice@test.com" />);
    expect(screen.getByText("Email").tagName).toBe("DT");
    expect(screen.getByText("alice@test.com").tagName).toBe("DD");
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<DataListItem ref={ref} label="Key" value="Val" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has displayName", () => {
    expect(DataListItem.displayName).toBe("DataListItem");
  });

  it("merges className", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<DataListItem ref={ref} label="Key" value="Val" className="custom-item" />);
    expect(ref.current?.className).toContain("custom-item");
  });

  it("renders column direction by default", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<DataListItem ref={ref} label="Key" value="Val" />);
    expect(ref.current?.className).toContain("flex-col");
  });

  it("renders row direction", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<DataListItem ref={ref} label="Key" value="Val" direction="row" />);
    expect(ref.current?.className).toContain("justify-between");
  });

  it("accepts ReactNode as value", () => {
    render(<DataListItem label="Status" value={<span data-testid="badge">Active</span>} />);
    expect(screen.getByTestId("badge")).toBeInTheDocument();
  });
});

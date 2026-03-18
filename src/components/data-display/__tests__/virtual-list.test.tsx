import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { VirtualList } from "../virtual-list";

const items = Array.from({ length: 1000 }, (_, i) => ({
  id: `item-${i}`,
  label: `Item ${i}`,
}));

const renderItem = (item: (typeof items)[number], index: number) => (
  <div className="px-4 py-2" data-testid={`item-${index}`}>
    {item.label}
  </div>
);

describe("VirtualList", () => {
  it("renders only visible items (not all 1000)", () => {
    const { container } = render(
      <VirtualList
        items={items}
        itemHeight={40}
        height={200}
        renderItem={renderItem}
      />,
    );
    // 200 / 40 = 5 visible + 3 overscan * 2 = 11 max items rendered
    const listItems = container.querySelectorAll('[role="listitem"]');
    expect(listItems.length).toBeLessThan(20);
    expect(listItems.length).toBeGreaterThan(0);
  });

  it("renders first items initially", () => {
    render(
      <VirtualList
        items={items}
        itemHeight={40}
        height={200}
        renderItem={renderItem}
      />,
    );
    expect(screen.getByText("Item 0")).toBeInTheDocument();
    expect(screen.getByText("Item 1")).toBeInTheDocument();
  });

  it("does not render items far down the list initially", () => {
    render(
      <VirtualList
        items={items}
        itemHeight={40}
        height={200}
        renderItem={renderItem}
      />,
    );
    expect(screen.queryByText("Item 500")).not.toBeInTheDocument();
    expect(screen.queryByText("Item 999")).not.toBeInTheDocument();
  });

  it("has role='list' on container", () => {
    render(
      <VirtualList
        items={items}
        itemHeight={40}
        height={200}
        renderItem={renderItem}
      />,
    );
    expect(screen.getByRole("list")).toBeInTheDocument();
  });

  it("has aria-label on container", () => {
    render(
      <VirtualList
        items={items}
        itemHeight={40}
        height={200}
        renderItem={renderItem}
      />,
    );
    expect(screen.getByLabelText("Virtual list")).toBeInTheDocument();
  });

  it("sets data-index on each rendered item", () => {
    const { container } = render(
      <VirtualList
        items={items}
        itemHeight={40}
        height={200}
        renderItem={renderItem}
      />,
    );
    const firstItem = container.querySelector('[role="listitem"]');
    expect(firstItem).toHaveAttribute("data-index", "0");
  });

  it("applies container height and width", () => {
    const { container } = render(
      <VirtualList
        items={items}
        itemHeight={40}
        height={300}
        width={500}
        renderItem={renderItem}
      />,
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.height).toBe("300px");
    expect(el.style.width).toBe("500px");
  });

  it("supports string width", () => {
    const { container } = render(
      <VirtualList
        items={items}
        itemHeight={40}
        height={200}
        width="100%"
        renderItem={renderItem}
      />,
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.width).toBe("100%");
  });

  it("creates a spacer with total height", () => {
    const { container } = render(
      <VirtualList
        items={items}
        itemHeight={40}
        height={200}
        renderItem={renderItem}
      />,
    );
    // Total: 1000 * 40 = 40000px
    const spacer = (container.firstChild as HTMLElement).firstChild as HTMLElement;
    expect(spacer.style.height).toBe("40000px");
  });

  it("positions items absolutely at correct offsets", () => {
    const { container } = render(
      <VirtualList
        items={items}
        itemHeight={50}
        height={200}
        renderItem={renderItem}
      />,
    );
    const listItems = container.querySelectorAll('[role="listitem"]');
    const first = listItems[0] as HTMLElement;
    expect(first.style.top).toBe("0px");
    expect(first.style.height).toBe("50px");

    if (listItems.length > 1) {
      const second = listItems[1] as HTMLElement;
      expect(second.style.top).toBe("50px");
    }
  });

  it("uses getKey for item keys when provided", () => {
    const getKey = vi.fn((item: (typeof items)[number]) => item.id);
    render(
      <VirtualList
        items={items.slice(0, 10)}
        itemHeight={40}
        height={200}
        renderItem={renderItem}
        getKey={getKey}
      />,
    );
    expect(getKey).toHaveBeenCalled();
  });

  it("merges className on container", () => {
    render(
      <VirtualList
        items={items}
        itemHeight={40}
        height={200}
        renderItem={renderItem}
        className="custom-scroll"
      />,
    );
    expect(screen.getByRole("list")).toHaveClass("custom-scroll");
  });

  it("forwards ref to the scroll container", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(
      <VirtualList
        ref={ref}
        items={items}
        itemHeight={40}
        height={200}
        renderItem={renderItem}
      />,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("renders empty list without error", () => {
    const { container } = render(
      <VirtualList
        items={[]}
        itemHeight={40}
        height={200}
        renderItem={() => <div>empty</div>}
      />,
    );
    const listItems = container.querySelectorAll('[role="listitem"]');
    expect(listItems.length).toBe(0);
  });

  it("respects overscan parameter", () => {
    const { container } = render(
      <VirtualList
        items={items}
        itemHeight={40}
        height={200}
        overscan={0}
        renderItem={renderItem}
      />,
    );
    // 200/40 = 5 visible + 1 for partial row coverage, 0 overscan = 6
    const listItems = container.querySelectorAll('[role="listitem"]');
    expect(listItems.length).toBe(6);
  });

  it("updates visible items on scroll", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(
      <VirtualList
        ref={ref}
        items={items}
        itemHeight={40}
        height={200}
        overscan={0}
        renderItem={renderItem}
      />,
    );

    // Simulate scroll to item 100 (offset 4000)
    Object.defineProperty(ref.current!, "scrollTop", { value: 4000, writable: true });
    fireEvent.scroll(ref.current!);

    // Should now show items around index 100
    expect(screen.getByText("Item 100")).toBeInTheDocument();
    expect(screen.queryByText("Item 0")).not.toBeInTheDocument();
  });
});

/* eslint-disable @typescript-eslint/no-explicit-any -- render function children pattern */
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "../collapsible";

describe("Collapsible", () => {
  it("renders children", () => {
    render(<Collapsible>Content</Collapsible>);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<Collapsible ref={ref}>Content</Collapsible>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has displayName", () => {
    expect(Collapsible.displayName).toBe("Collapsible");
  });

  it("merges className", () => {
    const { container } = render(<Collapsible className="custom-class">Content</Collapsible>);
    const el = container.firstElementChild as HTMLElement;
    expect(el.className).toContain("custom-class");
  });

  it("has data-state=closed by default", () => {
    const { container } = render(<Collapsible>Content</Collapsible>);
    const el = container.firstElementChild as HTMLElement;
    expect(el).toHaveAttribute("data-state", "closed");
  });

  it("has data-state=open when defaultOpen is true", () => {
    const { container } = render(<Collapsible defaultOpen>Content</Collapsible>);
    const el = container.firstElementChild as HTMLElement;
    expect(el).toHaveAttribute("data-state", "open");
  });

  it("has data-state=open when controlled open prop is true", () => {
    const { container } = render(<Collapsible open>Content</Collapsible>);
    const el = container.firstElementChild as HTMLElement;
    expect(el).toHaveAttribute("data-state", "open");
  });

  it("sets data-disabled when disabled", () => {
    const { container } = render(<Collapsible disabled>Content</Collapsible>);
    const el = container.firstElementChild as HTMLElement;
    expect(el).toHaveAttribute("data-disabled");
  });

  it("supports render function children with toggle", () => {
    const onOpenChange = vi.fn();
    render(
      <Collapsible onOpenChange={onOpenChange}>
        {(({ isOpen, toggle }: any) => (
          <>
            <button onClick={toggle}>Toggle</button>
            {isOpen && <div>Expanded content</div>}
          </>
        )) as any}
      </Collapsible>
    );

    expect(screen.queryByText("Expanded content")).not.toBeInTheDocument();
    fireEvent.click(screen.getByText("Toggle"));
    expect(screen.getByText("Expanded content")).toBeInTheDocument();
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("does not toggle when disabled", () => {
    const onOpenChange = vi.fn();
    render(
      <Collapsible disabled onOpenChange={onOpenChange}>
        {(({ isOpen, toggle }: any) => (
          <>
            <button onClick={toggle}>Toggle</button>
            {isOpen && <div>Expanded content</div>}
          </>
        )) as any}
      </Collapsible>
    );

    fireEvent.click(screen.getByText("Toggle"));
    expect(screen.queryByText("Expanded content")).not.toBeInTheDocument();
    expect(onOpenChange).not.toHaveBeenCalled();
  });
});

describe("CollapsibleTrigger", () => {
  it("renders as a button", () => {
    render(<CollapsibleTrigger>Toggle</CollapsibleTrigger>);
    const btn = screen.getByRole("button", { name: "Toggle" });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute("type", "button");
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(<CollapsibleTrigger ref={ref}>Toggle</CollapsibleTrigger>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("has displayName", () => {
    expect(CollapsibleTrigger.displayName).toBe("CollapsibleTrigger");
  });

  it("merges className", () => {
    render(<CollapsibleTrigger className="custom-trigger">Toggle</CollapsibleTrigger>);
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("custom-trigger");
    expect(btn.className).toContain("flex");
  });
});

describe("CollapsibleContent", () => {
  it("renders nothing when open is false", () => {
    const { container } = render(
      <CollapsibleContent open={false}>Hidden content</CollapsibleContent>
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders children when open is true", () => {
    render(<CollapsibleContent open>Visible content</CollapsibleContent>);
    expect(screen.getByText("Visible content")).toBeInTheDocument();
  });

  it("forwards ref when open", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(
      <CollapsibleContent ref={ref} open>
        Content
      </CollapsibleContent>
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has displayName", () => {
    expect(CollapsibleContent.displayName).toBe("CollapsibleContent");
  });

  it("merges className when open", () => {
    render(
      <CollapsibleContent open className="custom-content">
        Content
      </CollapsibleContent>
    );
    const el = screen.getByText("Content");
    expect(el.className).toContain("custom-content");
    expect(el.className).toContain("overflow-hidden");
  });
});

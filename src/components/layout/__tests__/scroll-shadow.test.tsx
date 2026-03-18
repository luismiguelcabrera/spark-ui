import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { createRef } from "react";
import { ScrollShadow } from "../scroll-shadow";

// Helper: mock scrollable state by overriding element properties
function setScroll(
  el: HTMLElement,
  {
    scrollTop = 0,
    scrollLeft = 0,
    scrollHeight = 0,
    scrollWidth = 0,
    clientHeight = 0,
    clientWidth = 0,
  }: Partial<{
    scrollTop: number;
    scrollLeft: number;
    scrollHeight: number;
    scrollWidth: number;
    clientHeight: number;
    clientWidth: number;
  }>,
) {
  Object.defineProperty(el, "scrollTop", { value: scrollTop, configurable: true });
  Object.defineProperty(el, "scrollLeft", { value: scrollLeft, configurable: true });
  Object.defineProperty(el, "scrollHeight", { value: scrollHeight, configurable: true });
  Object.defineProperty(el, "scrollWidth", { value: scrollWidth, configurable: true });
  Object.defineProperty(el, "clientHeight", { value: clientHeight, configurable: true });
  Object.defineProperty(el, "clientWidth", { value: clientWidth, configurable: true });
}

describe("ScrollShadow", () => {
  it("renders children", () => {
    render(
      <ScrollShadow>
        <p>Hello World</p>
      </ScrollShadow>,
    );
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  it("forwards ref to the outer container", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <ScrollShadow ref={ref}>
        <p>Content</p>
      </ScrollShadow>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("applies custom className", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <ScrollShadow ref={ref} className="my-custom">
        <p>Content</p>
      </ScrollShadow>,
    );
    expect(ref.current).toHaveClass("my-custom");
  });

  it("sets data-bottom-scroll when content is scrollable vertically", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <ScrollShadow ref={ref}>
        <p>Content</p>
      </ScrollShadow>,
    );

    // Simulate scrollable content: scrollHeight > clientHeight
    const scrollEl = ref.current!.querySelector("[class*='overflow']") as HTMLElement;
    setScroll(scrollEl, {
      scrollTop: 0,
      scrollHeight: 500,
      clientHeight: 200,
    });
    fireEvent.scroll(scrollEl);

    expect(ref.current).toHaveAttribute("data-bottom-scroll");
  });

  it("sets data-top-scroll when scrolled down", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <ScrollShadow ref={ref}>
        <p>Content</p>
      </ScrollShadow>,
    );

    const scrollEl = ref.current!.querySelector("[class*='overflow']") as HTMLElement;
    setScroll(scrollEl, {
      scrollTop: 100,
      scrollHeight: 500,
      clientHeight: 200,
    });
    fireEvent.scroll(scrollEl);

    expect(ref.current).toHaveAttribute("data-top-scroll");
  });

  it("does not set vertical data attributes for horizontal orientation", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <ScrollShadow ref={ref} orientation="horizontal">
        <p>Content</p>
      </ScrollShadow>,
    );

    const scrollEl = ref.current!.querySelector("[class*='overflow']") as HTMLElement;
    setScroll(scrollEl, {
      scrollTop: 100,
      scrollHeight: 500,
      clientHeight: 200,
      scrollLeft: 0,
      scrollWidth: 200,
      clientWidth: 200,
    });
    fireEvent.scroll(scrollEl);

    expect(ref.current).not.toHaveAttribute("data-top-scroll");
    expect(ref.current).not.toHaveAttribute("data-bottom-scroll");
  });

  it("sets data-right-scroll for horizontal orientation with scrollable content", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <ScrollShadow ref={ref} orientation="horizontal">
        <p>Content</p>
      </ScrollShadow>,
    );

    const scrollEl = ref.current!.querySelector("[class*='overflow']") as HTMLElement;
    setScroll(scrollEl, {
      scrollLeft: 0,
      scrollWidth: 600,
      clientWidth: 200,
    });
    fireEvent.scroll(scrollEl);

    expect(ref.current).toHaveAttribute("data-right-scroll");
  });

  it("sets data-left-scroll when scrolled horizontally", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <ScrollShadow ref={ref} orientation="horizontal">
        <p>Content</p>
      </ScrollShadow>,
    );

    const scrollEl = ref.current!.querySelector("[class*='overflow']") as HTMLElement;
    setScroll(scrollEl, {
      scrollLeft: 50,
      scrollWidth: 600,
      clientWidth: 200,
    });
    fireEvent.scroll(scrollEl);

    expect(ref.current).toHaveAttribute("data-left-scroll");
  });

  it("supports both orientation", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <ScrollShadow ref={ref} orientation="both">
        <p>Content</p>
      </ScrollShadow>,
    );

    const scrollEl = ref.current!.querySelector("[class*='overflow']") as HTMLElement;
    setScroll(scrollEl, {
      scrollTop: 50,
      scrollHeight: 500,
      clientHeight: 200,
      scrollLeft: 30,
      scrollWidth: 600,
      clientWidth: 200,
    });
    fireEvent.scroll(scrollEl);

    expect(ref.current).toHaveAttribute("data-top-scroll");
    expect(ref.current).toHaveAttribute("data-bottom-scroll");
    expect(ref.current).toHaveAttribute("data-left-scroll");
    expect(ref.current).toHaveAttribute("data-right-scroll");
  });

  it("renders shadow overlay divs as aria-hidden", () => {
    const { container } = render(
      <ScrollShadow>
        <p>Content</p>
      </ScrollShadow>,
    );

    const hiddenDivs = container.querySelectorAll("[aria-hidden='true']");
    expect(hiddenDivs.length).toBeGreaterThan(0);
  });

  it("applies overflow-y-auto for vertical orientation", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <ScrollShadow ref={ref} orientation="vertical">
        <p>Content</p>
      </ScrollShadow>,
    );
    const scrollEl = ref.current!.querySelector("[class*='overflow']") as HTMLElement;
    expect(scrollEl).toHaveClass("overflow-y-auto");
  });

  it("applies overflow-x-auto for horizontal orientation", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <ScrollShadow ref={ref} orientation="horizontal">
        <p>Content</p>
      </ScrollShadow>,
    );
    const scrollEl = ref.current!.querySelector("[class*='overflow']") as HTMLElement;
    expect(scrollEl).toHaveClass("overflow-x-auto");
  });

  it("applies overflow-auto for both orientation", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <ScrollShadow ref={ref} orientation="both">
        <p>Content</p>
      </ScrollShadow>,
    );
    const scrollEl = ref.current!.querySelector("[class*='overflow']") as HTMLElement;
    expect(scrollEl).toHaveClass("overflow-auto");
  });

  it("hides scrollbar when hideScrollbar is true", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <ScrollShadow ref={ref} hideScrollbar>
        <p>Content</p>
      </ScrollShadow>,
    );
    const scrollEl = ref.current!.querySelector("[class*='overflow']") as HTMLElement;
    expect(scrollEl).toHaveClass("scrollbar-none");
  });

  it("does not hide scrollbar by default", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <ScrollShadow ref={ref}>
        <p>Content</p>
      </ScrollShadow>,
    );
    const scrollEl = ref.current!.querySelector("[class*='overflow']") as HTMLElement;
    expect(scrollEl).not.toHaveClass("scrollbar-none");
  });

  it("applies custom shadow size", () => {
    const { container } = render(
      <ScrollShadow size={60}>
        <p>Content</p>
      </ScrollShadow>,
    );
    const shadowDivs = container.querySelectorAll("[aria-hidden='true']");
    // At least one should have the height set
    const hasCorrectSize = Array.from(shadowDivs).some(
      (el) => (el as HTMLElement).style.height === "60px",
    );
    expect(hasCorrectSize).toBe(true);
  });

  it("uses default shadow size of 40px", () => {
    const { container } = render(
      <ScrollShadow>
        <p>Content</p>
      </ScrollShadow>,
    );
    const shadowDivs = container.querySelectorAll("[aria-hidden='true']");
    const hasDefaultSize = Array.from(shadowDivs).some(
      (el) => (el as HTMLElement).style.height === "40px",
    );
    expect(hasDefaultSize).toBe(true);
  });
});

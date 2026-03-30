import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Carousel } from "../carousel";

// Mock matchMedia for usePrefersReducedMotion
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe("Carousel", () => {
  it("renders slides", () => {
    render(
      <Carousel>
        <div>Slide 1</div>
        <div>Slide 2</div>
        <div>Slide 3</div>
      </Carousel>
    );
    expect(screen.getByText("Slide 1")).toBeInTheDocument();
    expect(screen.getByText("Slide 2")).toBeInTheDocument();
  });

  it("has carousel role", () => {
    render(
      <Carousel>
        <div>Slide 1</div>
        <div>Slide 2</div>
      </Carousel>
    );
    expect(screen.getByRole("region")).toBeInTheDocument();
  });

  it("renders navigation dots", () => {
    render(
      <Carousel showDots>
        <div>Slide 1</div>
        <div>Slide 2</div>
        <div>Slide 3</div>
      </Carousel>
    );
    expect(screen.getByRole("tablist")).toBeInTheDocument();
  });

  it("renders navigation arrows", () => {
    render(
      <Carousel showArrows>
        <div>Slide 1</div>
        <div>Slide 2</div>
      </Carousel>
    );
    expect(screen.getByLabelText("Previous slide")).toBeInTheDocument();
    expect(screen.getByLabelText("Next slide")).toBeInTheDocument();
  });

  describe("autoplay prop (boolean)", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });
    afterEach(() => {
      vi.useRealTimers();
    });

    it("auto-advances slides when autoplay=true", () => {
      render(
        <Carousel autoplay interval={1000} showDots>
          <div>Slide 1</div>
          <div>Slide 2</div>
          <div>Slide 3</div>
        </Carousel>
      );
      const tabs = screen.getAllByRole("tab");
      expect(tabs[0]).toHaveAttribute("aria-selected", "true");
      act(() => { vi.advanceTimersByTime(1000); });
      expect(tabs[1]).toHaveAttribute("aria-selected", "true");
    });

    it("uses default interval of 5000ms when autoplay=true without interval", () => {
      render(
        <Carousel autoplay showDots>
          <div>Slide 1</div>
          <div>Slide 2</div>
          <div>Slide 3</div>
        </Carousel>
      );
      const tabs = screen.getAllByRole("tab");
      expect(tabs[0]).toHaveAttribute("aria-selected", "true");
      act(() => { vi.advanceTimersByTime(4999); });
      expect(tabs[0]).toHaveAttribute("aria-selected", "true");
      act(() => { vi.advanceTimersByTime(1); });
      expect(tabs[1]).toHaveAttribute("aria-selected", "true");
    });
  });

  describe("continuous prop", () => {
    it("loops from last to first slide", () => {
      render(
        <Carousel continuous showDots>
          <div>Slide 1</div>
          <div>Slide 2</div>
        </Carousel>
      );
      // Navigate to end
      fireEvent.click(screen.getByLabelText("Next slide"));
      const tabs = screen.getAllByRole("tab");
      expect(tabs[1]).toHaveAttribute("aria-selected", "true");
      // Navigate again to loop
      fireEvent.click(screen.getByLabelText("Next slide"));
      expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    });

    it("loops from first to last going backward", () => {
      render(
        <Carousel continuous showDots>
          <div>Slide 1</div>
          <div>Slide 2</div>
        </Carousel>
      );
      fireEvent.click(screen.getByLabelText("Previous slide"));
      const tabs = screen.getAllByRole("tab");
      expect(tabs[1]).toHaveAttribute("aria-selected", "true");
    });
  });

  describe("showArrows prop", () => {
    it("hides arrows when showArrows=false", () => {
      render(
        <Carousel showArrows={false}>
          <div>Slide 1</div>
          <div>Slide 2</div>
        </Carousel>
      );
      expect(screen.queryByLabelText("Previous slide")).not.toBeInTheDocument();
      expect(screen.queryByLabelText("Next slide")).not.toBeInTheDocument();
    });

    it("shows arrows by default", () => {
      render(
        <Carousel>
          <div>Slide 1</div>
          <div>Slide 2</div>
        </Carousel>
      );
      expect(screen.getByLabelText("Previous slide")).toBeInTheDocument();
    });
  });

  describe("progress prop", () => {
    it("renders a progress bar when progress=true", () => {
      render(
        <Carousel progress>
          <div>Slide 1</div>
          <div>Slide 2</div>
          <div>Slide 3</div>
        </Carousel>
      );
      expect(screen.getByRole("progressbar")).toBeInTheDocument();
      expect(screen.getByRole("progressbar")).toHaveAttribute("aria-label", "Carousel progress");
    });

    it("does not render progress bar by default", () => {
      render(
        <Carousel>
          <div>Slide 1</div>
          <div>Slide 2</div>
        </Carousel>
      );
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    it("updates progress when navigating", () => {
      render(
        <Carousel progress showDots>
          <div>Slide 1</div>
          <div>Slide 2</div>
          <div>Slide 3</div>
        </Carousel>
      );
      const progressBar = screen.getByRole("progressbar");
      expect(progressBar).toHaveAttribute("aria-valuenow", "33");
      fireEvent.click(screen.getByLabelText("Next slide"));
      expect(progressBar).toHaveAttribute("aria-valuenow", "67");
    });
  });

  describe("touch support", () => {
    it("navigates on touch swipe left", () => {
      render(
        <Carousel showDots>
          <div>Slide 1</div>
          <div>Slide 2</div>
          <div>Slide 3</div>
        </Carousel>
      );
      const carousel = screen.getByRole("region");
      fireEvent.touchStart(carousel, { touches: [{ clientX: 200 }] });
      fireEvent.touchMove(carousel, { touches: [{ clientX: 100 }] });
      fireEvent.touchEnd(carousel);
      const tabs = screen.getAllByRole("tab");
      expect(tabs[1]).toHaveAttribute("aria-selected", "true");
    });

    it("navigates on touch swipe right", () => {
      render(
        <Carousel showDots continuous>
          <div>Slide 1</div>
          <div>Slide 2</div>
          <div>Slide 3</div>
        </Carousel>
      );
      const carousel = screen.getByRole("region");
      fireEvent.touchStart(carousel, { touches: [{ clientX: 100 }] });
      fireEvent.touchMove(carousel, { touches: [{ clientX: 250 }] });
      fireEvent.touchEnd(carousel);
      const tabs = screen.getAllByRole("tab");
      // With continuous, swiping right from first goes to last
      expect(tabs[2]).toHaveAttribute("aria-selected", "true");
    });

    it("does not navigate on small swipe", () => {
      render(
        <Carousel showDots>
          <div>Slide 1</div>
          <div>Slide 2</div>
        </Carousel>
      );
      const carousel = screen.getByRole("region");
      fireEvent.touchStart(carousel, { touches: [{ clientX: 200 }] });
      fireEvent.touchMove(carousel, { touches: [{ clientX: 180 }] });
      fireEvent.touchEnd(carousel);
      const tabs = screen.getAllByRole("tab");
      expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    });
  });

  it("forwards ref", () => {
    const ref = { current: null };
    render(
      <Carousel ref={ref}>
        <div>Slide 1</div>
      </Carousel>
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

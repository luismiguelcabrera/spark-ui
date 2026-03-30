import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createRef } from "react";
import { Transition } from "../transition";
import { FadeTransition } from "../fade-transition";
import { ScaleTransition } from "../scale-transition";
import { SlideTransition } from "../slide-transition";
import { ExpandTransition } from "../expand-transition";
import { DialogTransition } from "../dialog-transition";

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

beforeEach(() => {
  vi.useFakeTimers();
  // Mock requestAnimationFrame to fire callbacks synchronously
  vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
    cb(0);
    return 0;
  });
  vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

/* -------------------------------------------------------------------------- */
/*  Transition (base)                                                          */
/* -------------------------------------------------------------------------- */

describe("Transition", () => {
  it("renders children when show is true", () => {
    render(
      <Transition show={true}>
        <p>Hello</p>
      </Transition>,
    );
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("does not render children when show is false (unmountOnExit default)", () => {
    render(
      <Transition show={false}>
        <p>Hello</p>
      </Transition>,
    );
    expect(screen.queryByText("Hello")).not.toBeInTheDocument();
  });

  it("keeps element in DOM when unmountOnExit is false", () => {
    render(
      <Transition show={false} unmountOnExit={false}>
        <p>Persist</p>
      </Transition>,
    );
    // The element remains in the DOM even when hidden
    expect(screen.getByText("Persist")).toBeInTheDocument();
  });

  it("applies enter classes when showing", () => {
    const { container } = render(
      <Transition
        show={true}
        enter="transition-opacity"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        duration={300}
      >
        <p>Content</p>
      </Transition>,
    );
    const wrapper = container.firstChild as HTMLElement;
    // After rAF fires, should have enter + enterTo classes
    expect(wrapper).toHaveClass("transition-opacity");
    expect(wrapper).toHaveClass("opacity-100");
  });

  it("clears transition classes after duration completes", () => {
    const { container } = render(
      <Transition
        show={true}
        enter="transition-opacity"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        duration={200}
      >
        <p>Content</p>
      </Transition>,
    );
    const wrapper = container.firstChild as HTMLElement;

    act(() => {
      vi.advanceTimersByTime(200);
    });

    // After duration, transition classes should be cleared
    expect(wrapper).not.toHaveClass("transition-opacity");
  });

  it("unmounts element after leave transition completes", () => {
    const { rerender } = render(
      <Transition show={true} duration={200}>
        <p>Content</p>
      </Transition>,
    );
    expect(screen.getByText("Content")).toBeInTheDocument();

    rerender(
      <Transition show={false} duration={200}>
        <p>Content</p>
      </Transition>,
    );

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(screen.queryByText("Content")).not.toBeInTheDocument();
  });

  it("forwards ref to the wrapper div", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Transition ref={ref} show={true}>
        <p>Ref</p>
      </Transition>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("merges className onto the wrapper", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Transition ref={ref} show={true} className="custom-class">
        <p>Class</p>
      </Transition>,
    );
    expect(ref.current).toHaveClass("custom-class");
  });

  it("has correct displayName", () => {
    expect(Transition.displayName).toBe("Transition");
  });

  it("uses default duration of 200ms", () => {
    const { rerender } = render(
      <Transition show={true}>
        <p>Default</p>
      </Transition>,
    );

    rerender(
      <Transition show={false}>
        <p>Default</p>
      </Transition>,
    );

    // Still mounted before 200ms
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(screen.getByText("Default")).toBeInTheDocument();

    // Unmounted after 200ms
    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(screen.queryByText("Default")).not.toBeInTheDocument();
  });

  it("applies leave classes when hiding", () => {
    const { container, rerender } = render(
      <Transition
        show={true}
        leave="transition-opacity"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        duration={300}
      >
        <p>Content</p>
      </Transition>,
    );

    // Clear initial enter transition
    act(() => {
      vi.advanceTimersByTime(300);
    });

    rerender(
      <Transition
        show={false}
        leave="transition-opacity"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        duration={300}
      >
        <p>Content</p>
      </Transition>,
    );

    const wrapper = container.firstChild as HTMLElement;
    // After rAF fires, should have leave + leaveTo classes
    expect(wrapper).toHaveClass("transition-opacity");
    expect(wrapper).toHaveClass("opacity-0");
  });
});

/* -------------------------------------------------------------------------- */
/*  FadeTransition                                                             */
/* -------------------------------------------------------------------------- */

describe("FadeTransition", () => {
  it("renders children when show is true", () => {
    render(
      <FadeTransition show={true}>
        <p>Fade In</p>
      </FadeTransition>,
    );
    expect(screen.getByText("Fade In")).toBeInTheDocument();
  });

  it("does not render when show is false", () => {
    render(
      <FadeTransition show={false}>
        <p>Fade</p>
      </FadeTransition>,
    );
    expect(screen.queryByText("Fade")).not.toBeInTheDocument();
  });

  it("applies opacity transition classes when entering", () => {
    const { container } = render(
      <FadeTransition show={true}>
        <p>Fade</p>
      </FadeTransition>,
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("transition-opacity");
    expect(wrapper).toHaveClass("opacity-100");
  });

  it("unmounts after leave transition", () => {
    const { rerender } = render(
      <FadeTransition show={true} duration={150}>
        <p>Fade</p>
      </FadeTransition>,
    );

    rerender(
      <FadeTransition show={false} duration={150}>
        <p>Fade</p>
      </FadeTransition>,
    );

    act(() => {
      vi.advanceTimersByTime(150);
    });

    expect(screen.queryByText("Fade")).not.toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <FadeTransition ref={ref} show={true}>
        <p>Ref</p>
      </FadeTransition>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("merges className", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <FadeTransition ref={ref} show={true} className="my-fade">
        <p>Class</p>
      </FadeTransition>,
    );
    expect(ref.current).toHaveClass("my-fade");
  });

  it("has correct displayName", () => {
    expect(FadeTransition.displayName).toBe("FadeTransition");
  });

  it("supports unmountOnExit=false", () => {
    render(
      <FadeTransition show={false} unmountOnExit={false}>
        <p>Persist Fade</p>
      </FadeTransition>,
    );
    expect(screen.getByText("Persist Fade")).toBeInTheDocument();
  });
});

/* -------------------------------------------------------------------------- */
/*  ScaleTransition                                                            */
/* -------------------------------------------------------------------------- */

describe("ScaleTransition", () => {
  it("renders children when show is true", () => {
    render(
      <ScaleTransition show={true}>
        <p>Scale In</p>
      </ScaleTransition>,
    );
    expect(screen.getByText("Scale In")).toBeInTheDocument();
  });

  it("does not render when show is false", () => {
    render(
      <ScaleTransition show={false}>
        <p>Scale</p>
      </ScaleTransition>,
    );
    expect(screen.queryByText("Scale")).not.toBeInTheDocument();
  });

  it("applies scale + opacity transition classes when entering", () => {
    const { container } = render(
      <ScaleTransition show={true}>
        <p>Scale</p>
      </ScaleTransition>,
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("transition-all");
    expect(wrapper).toHaveClass("opacity-100");
    expect(wrapper).toHaveClass("scale-100");
  });

  it("unmounts after leave transition", () => {
    const { rerender } = render(
      <ScaleTransition show={true} duration={100}>
        <p>Scale</p>
      </ScaleTransition>,
    );

    rerender(
      <ScaleTransition show={false} duration={100}>
        <p>Scale</p>
      </ScaleTransition>,
    );

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(screen.queryByText("Scale")).not.toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <ScaleTransition ref={ref} show={true}>
        <p>Ref</p>
      </ScaleTransition>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has correct displayName", () => {
    expect(ScaleTransition.displayName).toBe("ScaleTransition");
  });

  it("applies leave classes when hiding", () => {
    const { container, rerender } = render(
      <ScaleTransition show={true} duration={200}>
        <p>Scale</p>
      </ScaleTransition>,
    );

    act(() => { vi.advanceTimersByTime(200); });

    rerender(
      <ScaleTransition show={false} duration={200}>
        <p>Scale</p>
      </ScaleTransition>,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("scale-95");
    expect(wrapper).toHaveClass("opacity-0");
  });
});

/* -------------------------------------------------------------------------- */
/*  SlideTransition                                                            */
/* -------------------------------------------------------------------------- */

describe("SlideTransition", () => {
  it("renders children when show is true", () => {
    render(
      <SlideTransition show={true}>
        <p>Slide In</p>
      </SlideTransition>,
    );
    expect(screen.getByText("Slide In")).toBeInTheDocument();
  });

  it("does not render when show is false", () => {
    render(
      <SlideTransition show={false}>
        <p>Slide</p>
      </SlideTransition>,
    );
    expect(screen.queryByText("Slide")).not.toBeInTheDocument();
  });

  it.each(["up", "down", "left", "right"] as const)(
    "applies correct classes for direction=%s",
    (direction) => {
      const { container } = render(
        <SlideTransition show={true} direction={direction}>
          <p>Slide</p>
        </SlideTransition>,
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass("transition-all");
      // When entering, enterTo should be applied: translate-x-0, translate-y-0, opacity-100
      expect(wrapper).toHaveClass("opacity-100");
    },
  );

  it("defaults to up direction", () => {
    const { container } = render(
      <SlideTransition show={true}>
        <p>Default Up</p>
      </SlideTransition>,
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("translate-y-0");
  });

  it("unmounts after leave transition", () => {
    const { rerender } = render(
      <SlideTransition show={true} duration={100}>
        <p>Slide</p>
      </SlideTransition>,
    );

    rerender(
      <SlideTransition show={false} duration={100}>
        <p>Slide</p>
      </SlideTransition>,
    );

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(screen.queryByText("Slide")).not.toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <SlideTransition ref={ref} show={true}>
        <p>Ref</p>
      </SlideTransition>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has correct displayName", () => {
    expect(SlideTransition.displayName).toBe("SlideTransition");
  });

  it("applies slide-up leave classes when hiding (direction=up)", () => {
    const { container, rerender } = render(
      <SlideTransition show={true} direction="up" duration={200}>
        <p>Slide</p>
      </SlideTransition>,
    );

    act(() => { vi.advanceTimersByTime(200); });

    rerender(
      <SlideTransition show={false} direction="up" duration={200}>
        <p>Slide</p>
      </SlideTransition>,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("translate-y-4");
    expect(wrapper).toHaveClass("opacity-0");
  });
});

/* -------------------------------------------------------------------------- */
/*  ExpandTransition                                                           */
/* -------------------------------------------------------------------------- */

describe("ExpandTransition", () => {
  it("renders children when show is true", () => {
    render(
      <ExpandTransition show={true}>
        <p>Expand</p>
      </ExpandTransition>,
    );
    expect(screen.getByText("Expand")).toBeInTheDocument();
  });

  it("does not render when show is false", () => {
    render(
      <ExpandTransition show={false}>
        <p>Expand</p>
      </ExpandTransition>,
    );
    expect(screen.queryByText("Expand")).not.toBeInTheDocument();
  });

  it("unmounts after collapse transition", () => {
    const { rerender } = render(
      <ExpandTransition show={true} duration={100}>
        <p>Expand</p>
      </ExpandTransition>,
    );

    rerender(
      <ExpandTransition show={false} duration={100}>
        <p>Expand</p>
      </ExpandTransition>,
    );

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(screen.queryByText("Expand")).not.toBeInTheDocument();
  });

  it("keeps element in DOM when unmountOnExit is false", () => {
    render(
      <ExpandTransition show={false} unmountOnExit={false}>
        <p>Persist Expand</p>
      </ExpandTransition>,
    );
    expect(screen.getByText("Persist Expand")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <ExpandTransition ref={ref} show={true}>
        <p>Ref</p>
      </ExpandTransition>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("merges className", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <ExpandTransition ref={ref} show={true} className="my-expand">
        <p>Class</p>
      </ExpandTransition>,
    );
    expect(ref.current).toHaveClass("my-expand");
  });

  it("has correct displayName", () => {
    expect(ExpandTransition.displayName).toBe("ExpandTransition");
  });

  it("sets inline height style to 0 during collapse", () => {
    const { container, rerender } = render(
      <ExpandTransition show={true} duration={200}>
        <p>Expand</p>
      </ExpandTransition>,
    );

    act(() => { vi.advanceTimersByTime(200); });

    rerender(
      <ExpandTransition show={false} duration={200}>
        <p>Expand</p>
      </ExpandTransition>,
    );

    const wrapper = container.firstChild as HTMLElement;
    // After rAF fires, height should be 0
    expect(wrapper.style.height).toBe("0px");
  });

  it("clears inline styles after expand completes", () => {
    const { container } = render(
      <ExpandTransition show={true} duration={200}>
        <p>Expand</p>
      </ExpandTransition>,
    );

    act(() => {
      vi.advanceTimersByTime(200);
    });

    const wrapper = container.firstChild as HTMLElement;
    // After duration, styles should be cleared (height: auto)
    expect(wrapper.style.height).toBe("");
  });
});

/* -------------------------------------------------------------------------- */
/*  DialogTransition                                                           */
/* -------------------------------------------------------------------------- */

describe("DialogTransition", () => {
  it("renders children when show is true", () => {
    render(
      <DialogTransition show={true}>
        <p>Dialog</p>
      </DialogTransition>,
    );
    expect(screen.getByText("Dialog")).toBeInTheDocument();
  });

  it("does not render when show is false", () => {
    render(
      <DialogTransition show={false}>
        <p>Dialog</p>
      </DialogTransition>,
    );
    expect(screen.queryByText("Dialog")).not.toBeInTheDocument();
  });

  it("applies scale + opacity + translateY classes when entering", () => {
    const { container } = render(
      <DialogTransition show={true}>
        <p>Dialog</p>
      </DialogTransition>,
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("transition-all");
    expect(wrapper).toHaveClass("opacity-100");
    expect(wrapper).toHaveClass("scale-100");
    expect(wrapper).toHaveClass("translate-y-0");
  });

  it("unmounts after leave transition", () => {
    const { rerender } = render(
      <DialogTransition show={true} duration={100}>
        <p>Dialog</p>
      </DialogTransition>,
    );

    rerender(
      <DialogTransition show={false} duration={100}>
        <p>Dialog</p>
      </DialogTransition>,
    );

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(screen.queryByText("Dialog")).not.toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <DialogTransition ref={ref} show={true}>
        <p>Ref</p>
      </DialogTransition>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has correct displayName", () => {
    expect(DialogTransition.displayName).toBe("DialogTransition");
  });

  it("applies leave classes when hiding", () => {
    const { container, rerender } = render(
      <DialogTransition show={true} duration={200}>
        <p>Dialog</p>
      </DialogTransition>,
    );

    act(() => { vi.advanceTimersByTime(200); });

    rerender(
      <DialogTransition show={false} duration={200}>
        <p>Dialog</p>
      </DialogTransition>,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("scale-95");
    expect(wrapper).toHaveClass("opacity-0");
    expect(wrapper).toHaveClass("translate-y-2.5");
  });

  it("supports custom duration", () => {
    const { rerender } = render(
      <DialogTransition show={true} duration={500}>
        <p>Dialog</p>
      </DialogTransition>,
    );

    rerender(
      <DialogTransition show={false} duration={500}>
        <p>Dialog</p>
      </DialogTransition>,
    );

    // Not yet unmounted at 300ms
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(screen.getByText("Dialog")).toBeInTheDocument();

    // Unmounted at 500ms
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(screen.queryByText("Dialog")).not.toBeInTheDocument();
  });
});

/* -------------------------------------------------------------------------- */
/*  Common patterns across all components                                      */
/* -------------------------------------------------------------------------- */

describe("All transition components", () => {
  const components = [
    { name: "FadeTransition", Component: FadeTransition },
    { name: "ScaleTransition", Component: ScaleTransition },
    { name: "SlideTransition", Component: SlideTransition },
    { name: "ExpandTransition", Component: ExpandTransition },
    { name: "DialogTransition", Component: DialogTransition },
  ] as const;

  it.each(components)("$name shows then hides correctly", ({ Component }) => {
    const { rerender } = render(
      <Component show={true} duration={100}>
        <p>Child</p>
      </Component>,
    );
    expect(screen.getByText("Child")).toBeInTheDocument();

    rerender(
      <Component show={false} duration={100}>
        <p>Child</p>
      </Component>,
    );

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(screen.queryByText("Child")).not.toBeInTheDocument();
  });

  it.each(components)("$name forwards ref", ({ Component }) => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Component ref={ref} show={true}>
        <p>Content</p>
      </Component>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it.each(components)("$name supports unmountOnExit=false", ({ Component }) => {
    render(
      <Component show={false} unmountOnExit={false}>
        <p>Persist</p>
      </Component>,
    );
    expect(screen.getByText("Persist")).toBeInTheDocument();
  });
});

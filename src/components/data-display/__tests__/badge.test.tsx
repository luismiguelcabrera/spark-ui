import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Badge } from "../badge";

describe("Badge", () => {
  it("renders text content", () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("applies variant classes", () => {
    render(<Badge variant="success">OK</Badge>);
    expect(screen.getByText("OK").className).toContain("green");
  });

  it("applies size classes", () => {
    render(<Badge size="lg">Big</Badge>);
    expect(screen.getByText("Big").className).toContain("text-sm");
  });

  it("merges custom className", () => {
    render(<Badge className="custom-class">Test</Badge>);
    expect(screen.getByText("Test").className).toContain("custom-class");
  });

  // --- New: dot prop ---
  describe("dot prop", () => {
    it("renders a dot indicator with no text", () => {
      render(<Badge dot variant="success" />);
      const dotEl = screen.getByTestId("badge-dot");
      expect(dotEl).toBeInTheDocument();
      expect(dotEl.className).toContain("rounded-full");
      expect(dotEl.className).toContain("bg-green-500");
    });

    it.each(["sm", "md", "lg"] as const)("renders dot at size %s", (size) => {
      render(<Badge dot size={size} />);
      const el = screen.getByTestId("badge-dot");
      expect(el).toBeInTheDocument();
    });

    it("renders dot with primary variant", () => {
      render(<Badge dot variant="primary" />);
      const dotEl = screen.getByTestId("badge-dot");
      expect(dotEl.className).toContain("bg-primary");
    });
  });

  // --- New: max prop ---
  describe("max prop", () => {
    it("shows max+ when number children exceeds max", () => {
      render(<Badge max={99}>150</Badge>);
      expect(screen.getByText("99+")).toBeInTheDocument();
    });

    it("shows original number when children is within max", () => {
      render(<Badge max={99}>50</Badge>);
      expect(screen.getByText("50")).toBeInTheDocument();
    });

    it("shows exact max value without +", () => {
      render(<Badge max={99}>99</Badge>);
      expect(screen.getByText("99")).toBeInTheDocument();
    });

    it("handles numeric string children", () => {
      render(<Badge max={10}>25</Badge>);
      expect(screen.getByText("10+")).toBeInTheDocument();
    });
  });

  // --- New: floating prop ---
  describe("floating prop", () => {
    it("renders children wrapped with the badge floating over them", () => {
      render(
        <Badge floating content="5" variant="danger">
          <span>Avatar</span>
        </Badge>,
      );
      expect(screen.getByText("Avatar")).toBeInTheDocument();
      expect(screen.getByText("5")).toBeInTheDocument();
    });

    it("renders floating dot badge", () => {
      render(
        <Badge floating dot variant="success">
          <span>Icon</span>
        </Badge>,
      );
      expect(screen.getByText("Icon")).toBeInTheDocument();
      expect(screen.getByTestId("badge-dot")).toBeInTheDocument();
    });

    it("applies max in floating mode", () => {
      render(
        <Badge floating max={99} content="200" variant="danger">
          <span>Mail</span>
        </Badge>,
      );
      expect(screen.getByText("99+")).toBeInTheDocument();
    });
  });

  // --- New: bordered prop ---
  describe("bordered prop", () => {
    it("adds ring-2 ring-white class", () => {
      render(<Badge bordered>Bordered</Badge>);
      const el = screen.getByText("Bordered");
      expect(el.className).toContain("ring-2");
      expect(el.className).toContain("ring-white");
    });

    it("adds ring to dot mode", () => {
      render(<Badge dot bordered variant="danger" />);
      const el = screen.getByTestId("badge-dot");
      expect(el.className).toContain("ring-2");
      expect(el.className).toContain("ring-white");
    });
  });

  // --- Ref forwarding ---
  it("forwards ref", () => {
    const ref = { current: null as HTMLSpanElement | null };
    render(<Badge ref={ref}>Ref</Badge>);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it("forwards ref in floating mode", () => {
    const ref = { current: null as HTMLSpanElement | null };
    render(
      <Badge ref={ref} floating content="3">
        <span>Child</span>
      </Badge>,
    );
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });
});

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Chip } from "../chip";

describe("Chip", () => {
  it("renders children", () => {
    render(<Chip>Tag</Chip>);
    expect(screen.getByText("Tag")).toBeInTheDocument();
  });

  it("applies color and variant classes", () => {
    const { container } = render(
      <Chip color="primary" variant="solid">
        Primary
      </Chip>,
    );
    expect(container.firstElementChild!.className).toContain("bg-primary");
    expect(container.firstElementChild!.className).toContain("text-white");
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<Chip ref={ref}>Ref</Chip>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("renders clickable with role=button", () => {
    render(<Chip clickable>Click</Chip>);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("renders dismissible with close button", () => {
    const onDismiss = vi.fn();
    render(
      <Chip dismissible onDismiss={onDismiss}>
        Remove me
      </Chip>,
    );
    const closeBtn = screen.getByRole("button", { name: "Remove" });
    fireEvent.click(closeBtn);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("renders dot indicator", () => {
    const { container } = render(
      <Chip dot color="success">
        Online
      </Chip>,
    );
    const dotEl = container.querySelector(".rounded-full");
    expect(dotEl).toBeInTheDocument();
  });

  it("applies disabled styles", () => {
    const { container } = render(<Chip disabled>Disabled</Chip>);
    expect(container.firstElementChild!.className).toContain("opacity-50");
  });

  // --- New: filter prop ---
  describe("filter prop", () => {
    it("shows checkmark icon when selected", () => {
      render(
        <Chip filter selected>
          Filter
        </Chip>,
      );
      expect(screen.getByTestId("chip-filter-check")).toBeInTheDocument();
    });

    it("does not show checkmark when not selected", () => {
      render(<Chip filter>Filter</Chip>);
      expect(screen.queryByTestId("chip-filter-check")).not.toBeInTheDocument();
    });

    it("shows checkmark without filter prop even with selected", () => {
      render(<Chip selected>Not filter</Chip>);
      expect(screen.queryByTestId("chip-filter-check")).not.toBeInTheDocument();
    });
  });

  // --- New: selected prop ---
  describe("selected prop", () => {
    it("applies ring classes when selected", () => {
      const { container } = render(<Chip selected>Selected</Chip>);
      expect(container.firstElementChild!.className).toContain("ring-2");
      expect(container.firstElementChild!.className).toContain("ring-primary");
    });

    it("sets aria-selected", () => {
      const { container } = render(<Chip selected>Selected</Chip>);
      expect(container.firstElementChild!).toHaveAttribute("aria-selected", "true");
    });

    it("sets aria-selected=false when explicitly not selected", () => {
      const { container } = render(<Chip selected={false}>Not selected</Chip>);
      expect(container.firstElementChild!).toHaveAttribute("aria-selected", "false");
    });
  });

  // --- New: label prop ---
  describe("label prop", () => {
    it("applies squared corners", () => {
      const { container } = render(<Chip label>Label</Chip>);
      expect(container.firstElementChild!.className).toContain("rounded-sm");
    });
  });

  // --- New: closable prop ---
  describe("closable prop", () => {
    it("renders close button", () => {
      render(<Chip closable>Close me</Chip>);
      expect(screen.getByTestId("chip-close-button")).toBeInTheDocument();
    });

    it("fires onClose callback", () => {
      const onClose = vi.fn();
      render(
        <Chip closable onClose={onClose}>
          Close me
        </Chip>,
      );
      fireEvent.click(screen.getByTestId("chip-close-button"));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("does not render close button when disabled", () => {
      render(
        <Chip closable disabled>
          Disabled close
        </Chip>,
      );
      expect(screen.queryByTestId("chip-close-button")).not.toBeInTheDocument();
    });

    it("stops propagation on close click", () => {
      const onClick = vi.fn();
      const onClose = vi.fn();
      render(
        <Chip closable onClose={onClose} onClick={onClick} clickable>
          Click
        </Chip>,
      );
      fireEvent.click(screen.getByTestId("chip-close-button"));
      expect(onClose).toHaveBeenCalledTimes(1);
      // onClick should not fire since stopPropagation is called
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  // --- Size matrix ---
  it.each(["sm", "md", "lg"] as const)("renders at size %s", (size) => {
    const { container } = render(<Chip size={size}>Size</Chip>);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  // --- Color matrix ---
  it.each([
    "default",
    "primary",
    "secondary",
    "success",
    "warning",
    "destructive",
  ] as const)("renders color %s", (color) => {
    const { container } = render(<Chip color={color}>Color</Chip>);
    expect(container.firstElementChild).toBeInTheDocument();
  });
});

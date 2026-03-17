import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { HoverCard } from "../hover-card";

describe("HoverCard", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders trigger", () => {
    render(<HoverCard content={<div>Card</div>}><button>Hover me</button></HoverCard>);
    expect(screen.getByText("Hover me")).toBeInTheDocument();
  });

  it("shows content on mouse enter after delay", () => {
    render(<HoverCard content={<div>Card content</div>} openDelay={300}><button>Hover me</button></HoverCard>);
    fireEvent.mouseEnter(screen.getByText("Hover me").parentElement!);
    act(() => { vi.advanceTimersByTime(300); });
    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  it("hides content on mouse leave", () => {
    render(<HoverCard content={<div>Card content</div>} openDelay={0} closeDelay={0}><button>Hover me</button></HoverCard>);
    const container = screen.getByText("Hover me").parentElement!;
    fireEvent.mouseEnter(container);
    act(() => { vi.advanceTimersByTime(0); });
    expect(screen.getByText("Card content")).toBeInTheDocument();
    fireEvent.mouseLeave(container);
    act(() => { vi.advanceTimersByTime(0); });
    expect(screen.queryByText("Card content")).not.toBeInTheDocument();
  });
});

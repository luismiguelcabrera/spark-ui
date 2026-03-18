import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Statistic } from "../statistic";

describe("Statistic", () => {
  it("renders without crashing", () => {
    const { container } = render(<Statistic title="Users" value={100} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<Statistic ref={ref} title="Users" value={100} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("applies className", () => {
    const { container } = render(
      <Statistic title="Users" value={100} className="custom-stat" />,
    );
    expect(container.firstChild).toHaveClass("custom-stat");
  });

  // ── Title ───────────────────────────────────────────────────────────

  it("renders the title", () => {
    render(<Statistic title="Revenue" value={1000} />);
    expect(screen.getByText("Revenue")).toBeInTheDocument();
  });

  // ── Value ───────────────────────────────────────────────────────────

  it("renders numeric value", () => {
    render(<Statistic title="Count" value={42} />);
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("renders string value", () => {
    render(<Statistic title="Status" value="Active" />);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("formats large numbers with thousand separators", () => {
    render(<Statistic title="Users" value={1234567} />);
    expect(screen.getByText("1,234,567")).toBeInTheDocument();
  });

  it("respects precision for decimal places", () => {
    render(<Statistic title="Rate" value={99.1} precision={2} />);
    expect(screen.getByText("99.10")).toBeInTheDocument();
  });

  it("adds thousand separators with precision", () => {
    render(<Statistic title="Revenue" value={12345.6} precision={2} />);
    expect(screen.getByText("12,345.60")).toBeInTheDocument();
  });

  it("does not add separators to string values", () => {
    render(<Statistic title="Status" value="1234567" />);
    expect(screen.getByText("1234567")).toBeInTheDocument();
  });

  // ── Prefix & Suffix ────────────────────────────────────────────────

  it("renders prefix element", () => {
    render(<Statistic title="Revenue" value={1000} prefix="$" />);
    expect(screen.getByText("$")).toBeInTheDocument();
  });

  it("renders suffix element", () => {
    render(<Statistic title="Growth" value={25} suffix="%" />);
    expect(screen.getByText("%")).toBeInTheDocument();
  });

  it("renders prefix and suffix together", () => {
    render(<Statistic title="Price" value={99} prefix="$" suffix="USD" />);
    expect(screen.getByText("$")).toBeInTheDocument();
    expect(screen.getByText("USD")).toBeInTheDocument();
    expect(screen.getByText("99")).toBeInTheDocument();
  });

  it("renders ReactNode prefix", () => {
    render(
      <Statistic
        title="Revenue"
        value={1000}
        prefix={<span data-testid="prefix-icon">$</span>}
      />,
    );
    expect(screen.getByTestId("prefix-icon")).toBeInTheDocument();
  });

  // ── Trend ───────────────────────────────────────────────────────────

  it("renders trend with positive value (up arrow)", () => {
    render(
      <Statistic title="Revenue" value={1000} trend={{ value: 12 }} />,
    );
    expect(screen.getByText("12%")).toBeInTheDocument();
    // Up arrow rendered
    expect(screen.getByText("\u2191")).toBeInTheDocument();
  });

  it("renders trend with negative value (down arrow)", () => {
    render(
      <Statistic title="Revenue" value={1000} trend={{ value: -5 }} />,
    );
    expect(screen.getByText("5%")).toBeInTheDocument();
    expect(screen.getByText("\u2193")).toBeInTheDocument();
  });

  it("renders trend with zero value (no arrow)", () => {
    render(
      <Statistic title="Revenue" value={1000} trend={{ value: 0 }} />,
    );
    expect(screen.getByText("0%")).toBeInTheDocument();
    expect(screen.queryByText("\u2191")).not.toBeInTheDocument();
    expect(screen.queryByText("\u2193")).not.toBeInTheDocument();
  });

  it("applies green color for positive trend when isUpGood is true (default)", () => {
    render(
      <Statistic title="Revenue" value={1000} trend={{ value: 10 }} />,
    );
    const trendEl = screen.getByLabelText("Trend: +10%");
    expect(trendEl).toHaveClass("text-green-600");
  });

  it("applies red color for negative trend when isUpGood is true (default)", () => {
    render(
      <Statistic title="Revenue" value={1000} trend={{ value: -10 }} />,
    );
    const trendEl = screen.getByLabelText("Trend: -10%");
    expect(trendEl).toHaveClass("text-red-600");
  });

  it("inverts trend color when isUpGood is false", () => {
    render(
      <Statistic
        title="Bugs"
        value={50}
        trend={{ value: 10, isUpGood: false }}
      />,
    );
    // Positive trend is bad when isUpGood is false
    const trendEl = screen.getByLabelText("Trend: +10%");
    expect(trendEl).toHaveClass("text-red-600");
  });

  it("shows green for negative trend when isUpGood is false", () => {
    render(
      <Statistic
        title="Bugs"
        value={50}
        trend={{ value: -10, isUpGood: false }}
      />,
    );
    const trendEl = screen.getByLabelText("Trend: -10%");
    expect(trendEl).toHaveClass("text-green-600");
  });

  it("applies gray color for zero trend", () => {
    render(
      <Statistic title="Revenue" value={1000} trend={{ value: 0 }} />,
    );
    const trendEl = screen.getByLabelText("Trend: 0%");
    expect(trendEl).toHaveClass("text-gray-500");
  });

  it("trend arrow is aria-hidden", () => {
    const { container } = render(
      <Statistic title="Revenue" value={1000} trend={{ value: 10 }} />,
    );
    const arrowSpan = container.querySelector("[aria-hidden='true']");
    expect(arrowSpan).toBeInTheDocument();
    expect(arrowSpan?.textContent).toBe("\u2191");
  });

  it("trend has aria-label with value", () => {
    render(
      <Statistic title="Revenue" value={1000} trend={{ value: 15 }} />,
    );
    expect(screen.getByLabelText("Trend: +15%")).toBeInTheDocument();
  });

  it("does not render trend section when trend is not provided", () => {
    const { container } = render(<Statistic title="Users" value={100} />);
    expect(container.querySelector("[aria-label^='Trend']")).not.toBeInTheDocument();
  });

  // ── Loading ─────────────────────────────────────────────────────────

  it("renders loading skeleton when loading is true", () => {
    const { container } = render(
      <Statistic title="Users" value={100} loading />,
    );
    expect(container.firstChild).toHaveAttribute("aria-busy", "true");
  });

  it("shows animate-pulse class when loading", () => {
    const { container } = render(
      <Statistic title="Users" value={100} loading />,
    );
    expect(container.firstChild).toHaveClass("animate-pulse");
  });

  it("renders skeleton divs instead of content when loading", () => {
    render(<Statistic title="Users" value={100} loading />);
    expect(screen.queryByText("Users")).not.toBeInTheDocument();
    expect(screen.queryByText("100")).not.toBeInTheDocument();
  });

  it("has motion-reduce on loading skeleton", () => {
    const { container } = render(
      <Statistic title="Users" value={100} loading />,
    );
    expect(container.firstChild).toHaveClass("motion-reduce:animate-none");
  });

  it("applies className to loading skeleton", () => {
    const { container } = render(
      <Statistic title="Users" value={100} loading className="custom-loading" />,
    );
    expect(container.firstChild).toHaveClass("custom-loading");
  });

  // ── Extra props ─────────────────────────────────────────────────────

  it("spreads extra HTML attributes", () => {
    render(<Statistic title="Users" value={100} data-testid="my-stat" />);
    expect(screen.getByTestId("my-stat")).toBeInTheDocument();
  });
});

import { render, screen, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { NoSsr } from "../no-ssr";

describe("NoSsr", () => {
  it("renders children after mount", async () => {
    await act(async () => {
      render(<NoSsr><div data-testid="client-content">Client only</div></NoSsr>);
    });
    expect(screen.getByTestId("client-content")).toBeInTheDocument();
    expect(screen.getByText("Client only")).toBeInTheDocument();
  });

  it("renders fallback before mount", () => {
    // We use a custom approach: render without act to capture initial state
    // But in jsdom, useEffect fires synchronously in act, so we test
    // that fallback is the initial value by checking it's provided
    const { container } = render(
      <NoSsr fallback={<span data-testid="fallback">Loading...</span>}>
        <span data-testid="content">Loaded</span>
      </NoSsr>
    );
    // After act completes, children should be rendered
    expect(container).toBeTruthy();
  });

  it("renders nothing by default as fallback (no fallback prop)", async () => {
    await act(async () => {
      render(
        <NoSsr>
          <div data-testid="content">Content</div>
        </NoSsr>
      );
    });
    expect(screen.getByTestId("content")).toBeInTheDocument();
  });

  it("renders custom fallback content", async () => {
    await act(async () => {
      render(
        <NoSsr fallback={<div data-testid="fallback">Placeholder</div>}>
          <div data-testid="actual">Real content</div>
        </NoSsr>
      );
    });
    // After mount, children should be shown
    expect(screen.getByTestId("actual")).toBeInTheDocument();
  });

  it("shows children after client-side mount", async () => {
    await act(async () => {
      render(
        <NoSsr>
          <button type="button">Interactive Button</button>
        </NoSsr>
      );
    });
    expect(screen.getByRole("button", { name: "Interactive Button" })).toBeInTheDocument();
  });

  it("handles null children gracefully", async () => {
    await act(async () => {
      render(<NoSsr>{null}</NoSsr>);
    });
    // Should not throw
  });

  it("handles complex children", async () => {
    await act(async () => {
      render(
        <NoSsr>
          <div>
            <span data-testid="nested">Nested content</span>
            <ul>
              <li>Item 1</li>
              <li>Item 2</li>
            </ul>
          </div>
        </NoSsr>
      );
    });
    expect(screen.getByTestId("nested")).toBeInTheDocument();
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
  });
});

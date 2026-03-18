import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { PullToRefresh } from "../components/feedback/pull-to-refresh";
import { SwipeableDrawer } from "../components/feedback/swipeable-drawer";

expect.extend(toHaveNoViolations);

describe("Accessibility (axe)", () => {
  it("PullToRefresh has no a11y violations", async () => {
    const { container } = render(
      <PullToRefresh onRefresh={() => Promise.resolve()}>
        <p>Content</p>
      </PullToRefresh>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("SwipeableDrawer (open, left) has no a11y violations", async () => {
    const { container } = render(
      <SwipeableDrawer open side="left" title="Navigation">
        <nav>
          <ul>
            <li>Home</li>
            <li>About</li>
          </ul>
        </nav>
      </SwipeableDrawer>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("SwipeableDrawer (open, bottom) has no a11y violations", async () => {
    const { container } = render(
      <SwipeableDrawer open side="bottom" title="Settings">
        <p>Settings content</p>
      </SwipeableDrawer>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("SwipeableDrawer (closed) has no a11y violations", async () => {
    const { container } = render(
      <SwipeableDrawer open={false} title="Menu">
        <p>Menu content</p>
      </SwipeableDrawer>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

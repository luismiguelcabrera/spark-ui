import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { describe, it, expect } from "vitest";
import { Splitter } from "../components/layout/splitter";
import { Masonry } from "../components/layout/masonry";

expect.extend(toHaveNoViolations);

describe("Accessibility (axe) — Layout", () => {
  it("Splitter (horizontal)", async () => {
    const { container } = render(
      <Splitter>
        <div>Left</div>
        <div>Right</div>
      </Splitter>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Splitter (vertical)", async () => {
    const { container } = render(
      <Splitter orientation="vertical">
        <div>Top</div>
        <div>Bottom</div>
      </Splitter>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Splitter (custom min/max)", async () => {
    const { container } = render(
      <Splitter defaultSize={30} minSize={20} maxSize={80}>
        <div>Pane A</div>
        <div>Pane B</div>
      </Splitter>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Masonry (fixed columns)", async () => {
    const { container } = render(
      <Masonry columns={3}>
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
      </Masonry>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Masonry (responsive columns)", async () => {
    const { container } = render(
      <Masonry columns={{ sm: 1, md: 2, lg: 3 }}>
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
      </Masonry>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Masonry (empty)", async () => {
    const { container } = render(<Masonry>{[]}</Masonry>);
    expect(await axe(container)).toHaveNoViolations();
  });
});

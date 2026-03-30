import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { describe, it, expect, vi, beforeAll } from "vitest";

import { ChipGroup, useChipGroup } from "../components/data-display/chip-group";
import { Parallax } from "../components/data-display/parallax";

expect.extend(toHaveNoViolations);

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation(function (query: string) {
      return {
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      };
    }),
  });
});

/* -------------------------------------------------------------------------- */
/*  Mock Chip for ChipGroup a11y tests                                        */
/* -------------------------------------------------------------------------- */

function MockChip({ value, children }: { value: string; children: string }) {
  const ctx = useChipGroup();
  const isSelected = ctx?.selected.includes(value) ?? false;

  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={() => ctx?.toggle(value)}
    >
      {children}
    </button>
  );
}

describe("Accessibility (axe)", () => {
  it("ChipGroup (single selection)", async () => {
    const { container } = render(
      <ChipGroup defaultValue="a" aria-label="Filter options">
        <MockChip value="a">Alpha</MockChip>
        <MockChip value="b">Beta</MockChip>
        <MockChip value="c">Gamma</MockChip>
      </ChipGroup>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("ChipGroup (multiple selection)", async () => {
    const { container } = render(
      <ChipGroup multiple defaultValue={["a", "b"]} aria-label="Tags">
        <MockChip value="a">React</MockChip>
        <MockChip value="b">Vue</MockChip>
        <MockChip value="c">Angular</MockChip>
      </ChipGroup>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("ChipGroup (empty)", async () => {
    const { container } = render(
      <ChipGroup aria-label="Empty group">
        <MockChip value="a">Only</MockChip>
      </ChipGroup>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Parallax (with alt text)", async () => {
    const { container } = render(
      <Parallax src="/test.jpg" alt="Scenic mountain" height={400} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Parallax (decorative, no alt)", async () => {
    const { container } = render(
      <Parallax src="/bg.jpg" height={300} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

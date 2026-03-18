import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { describe, it, expect } from "vitest";

import { Knob } from "../components/forms/knob";
import { CheckboxCard } from "../components/forms/checkbox-card";
import { RadioCardGroup } from "../components/forms/radio-card";

expect.extend(toHaveNoViolations);

describe("Accessibility (axe)", () => {
  // ── Knob ──────────────────────────────────────────────────────────────
  it("Knob (default)", async () => {
    const { container } = render(<Knob label="Volume" defaultValue={50} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Knob (disabled)", async () => {
    const { container } = render(<Knob label="Volume" disabled defaultValue={50} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Knob (all colors)", async () => {
    const { container } = render(
      <div>
        <Knob label="Primary" color="primary" defaultValue={50} />
        <Knob label="Secondary" color="secondary" defaultValue={50} />
        <Knob label="Success" color="success" defaultValue={50} />
        <Knob label="Warning" color="warning" defaultValue={50} />
        <Knob label="Destructive" color="destructive" defaultValue={50} />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  // ── CheckboxCard ──────────────────────────────────────────────────────
  it("CheckboxCard (unchecked)", async () => {
    const { container } = render(<CheckboxCard title="Option A" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("CheckboxCard (checked)", async () => {
    const { container } = render(<CheckboxCard title="Option A" defaultChecked />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("CheckboxCard (with description)", async () => {
    const { container } = render(
      <CheckboxCard title="Premium" description="Best value plan" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("CheckboxCard (disabled)", async () => {
    const { container } = render(<CheckboxCard title="Unavailable" disabled />);
    expect(await axe(container)).toHaveNoViolations();
  });

  // ── RadioCardGroup ────────────────────────────────────────────────────
  it("RadioCardGroup (default)", async () => {
    const options = [
      { value: "a", title: "Option A" },
      { value: "b", title: "Option B" },
    ];
    const { container } = render(
      <RadioCardGroup options={options} defaultValue="a" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("RadioCardGroup (with descriptions)", async () => {
    const options = [
      { value: "a", title: "Free", description: "Basic features" },
      { value: "b", title: "Pro", description: "Advanced features" },
    ];
    const { container } = render(<RadioCardGroup options={options} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("RadioCardGroup (vertical)", async () => {
    const options = [
      { value: "a", title: "Option A" },
      { value: "b", title: "Option B" },
    ];
    const { container } = render(
      <RadioCardGroup options={options} orientation="vertical" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

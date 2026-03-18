import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Kbd, KbdKey } from "../kbd";

describe("Kbd", () => {
  it("renders single key as text content", () => {
    render(<Kbd>K</Kbd>);
    expect(screen.getByText("K")).toBeInTheDocument();
  });

  it("renders as a kbd element for single key", () => {
    render(<Kbd>K</Kbd>);
    expect(screen.getByText("K").tagName).toBe("KBD");
  });

  it("has correct displayName", () => {
    expect(Kbd.displayName).toBe("Kbd");
  });

  it("merges custom className for single key", () => {
    render(<Kbd className="custom-class">K</Kbd>);
    expect(screen.getByText("K").className).toContain("custom-class");
  });

  it("forwards ref for single key", () => {
    const ref = { current: null as HTMLElement | null };
    render(<Kbd ref={ref}>K</Kbd>);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  it("renders multiple keys from keys prop", () => {
    render(<Kbd keys={["Ctrl", "K"]} platformAware={false} />);
    expect(screen.getByText("Ctrl")).toBeInTheDocument();
    expect(screen.getByText("K")).toBeInTheDocument();
  });

  it("renders keys from combo prop", () => {
    render(<Kbd combo="Ctrl+K" platformAware={false} />);
    expect(screen.getByText("Ctrl")).toBeInTheDocument();
    expect(screen.getByText("K")).toBeInTheDocument();
  });

  it("renders separator between keys", () => {
    render(<Kbd keys={["Ctrl", "K"]} platformAware={false} separator="+" />);
    expect(screen.getByText("+")).toBeInTheDocument();
  });

  it("forwards ref for combo", () => {
    const ref = { current: null as HTMLElement | null };
    render(<Kbd ref={ref} keys={["Ctrl", "K"]} platformAware={false} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  it("merges className for combo", () => {
    const { container } = render(
      <Kbd keys={["Ctrl", "K"]} platformAware={false} className="custom" />,
    );
    expect(container.firstElementChild!.className).toContain("custom");
  });
});

describe("KbdKey", () => {
  it("renders as a kbd element", () => {
    render(<KbdKey>A</KbdKey>);
    expect(screen.getByText("A").tagName).toBe("KBD");
  });

  it("has correct displayName", () => {
    expect(KbdKey.displayName).toBe("KbdKey");
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLElement | null };
    render(<KbdKey ref={ref}>A</KbdKey>);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  it("merges custom className", () => {
    render(<KbdKey className="extra">B</KbdKey>);
    expect(screen.getByText("B").className).toContain("extra");
  });
});

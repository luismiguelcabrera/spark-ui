import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Spacer } from "../spacer";

describe("Spacer", () => {
  it("renders a div with flex: 1 1 auto", () => {
    const { container } = render(<Spacer />);
    const el = container.firstChild as HTMLElement;
    expect(el.tagName).toBe("DIV");
    expect(el.style.flex).toBe("1 1 auto");
  });

  it("is aria-hidden", () => {
    const { container } = render(<Spacer />);
    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
  });

  it("merges className", () => {
    const { container } = render(<Spacer className="custom-spacer" />);
    expect(container.firstChild).toHaveClass("custom-spacer");
  });

  it("merges style without overriding flex", () => {
    const { container } = render(<Spacer style={{ minHeight: "20px" }} />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.flex).toBe("1 1 auto");
    expect(el.style.minHeight).toBe("20px");
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<Spacer ref={ref} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  it("spreads additional HTML attributes", () => {
    const { container } = render(<Spacer data-testid="spacer" id="my-spacer" />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute("data-testid", "spacer");
    expect(el).toHaveAttribute("id", "my-spacer");
  });

  it("works inside a flex container to push items apart", () => {
    const { container } = render(
      <div style={{ display: "flex" }}>
        <span>Left</span>
        <Spacer data-testid="spacer" />
        <span>Right</span>
      </div>
    );
    const spacer = container.querySelector("[data-testid='spacer']") as HTMLElement;
    expect(spacer.style.flex).toBe("1 1 auto");
  });
});

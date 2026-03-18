import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { createRef } from "react";
import { createIcon } from "../create-icon";

describe("createIcon", () => {
  it("returns a valid React component", () => {
    const TestIcon = createIcon("TestIcon", <path d="M5 12h14" />);
    const { container } = render(<TestIcon />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("sets displayName from first argument", () => {
    const MyIcon = createIcon("MyIcon", <circle cx="12" cy="12" r="10" />);
    expect(MyIcon.displayName).toBe("MyIcon");
  });

  it("renders SVG with correct default attributes", () => {
    const TestIcon = createIcon("TestIcon", <path d="M5 12h14" />);
    const { container } = render(<TestIcon />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("xmlns")).toBe("http://www.w3.org/2000/svg");
    expect(svg.getAttribute("viewBox")).toBe("0 0 24 24");
    expect(svg.getAttribute("width")).toBe("24");
    expect(svg.getAttribute("height")).toBe("24");
    expect(svg.getAttribute("fill")).toBe("none");
    expect(svg.getAttribute("stroke")).toBe("currentColor");
    expect(svg.getAttribute("stroke-width")).toBe("2");
    expect(svg.getAttribute("stroke-linecap")).toBe("round");
    expect(svg.getAttribute("stroke-linejoin")).toBe("round");
    expect(svg.getAttribute("aria-hidden")).toBe("true");
  });

  it("accepts custom viewBox", () => {
    const TestIcon = createIcon("TestIcon", <path d="M5 12h14" />, "0 0 48 48");
    const { container } = render(<TestIcon />);
    expect(container.querySelector("svg")!.getAttribute("viewBox")).toBe("0 0 48 48");
  });

  it("accepts custom size prop", () => {
    const TestIcon = createIcon("TestIcon", <path d="M5 12h14" />);
    const { container } = render(<TestIcon size={32} />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("width")).toBe("32");
    expect(svg.getAttribute("height")).toBe("32");
  });

  it("forwards ref to SVG element", () => {
    const TestIcon = createIcon("TestIcon", <path d="M5 12h14" />);
    const ref = createRef<SVGSVGElement>();
    render(<TestIcon ref={ref} />);
    expect(ref.current).toBeInstanceOf(SVGSVGElement);
  });

  it("merges className", () => {
    const TestIcon = createIcon("TestIcon", <path d="M5 12h14" />);
    const { container } = render(<TestIcon className="text-red-500" />);
    const svg = container.querySelector("svg")!;
    expect(svg.classList.contains("text-red-500")).toBe(true);
    expect(svg.classList.contains("shrink-0")).toBe(true);
  });

  it("renders the path content", () => {
    const TestIcon = createIcon("TestIcon", <path d="M5 12h14" />);
    const { container } = render(<TestIcon />);
    const path = container.querySelector("path");
    expect(path).toBeInTheDocument();
    expect(path?.getAttribute("d")).toBe("M5 12h14");
  });

  it("renders multiple path children", () => {
    const TestIcon = createIcon(
      "TestIcon",
      <>
        <path d="M5 12h14" />
        <circle cx="12" cy="12" r="2" />
      </>,
    );
    const { container } = render(<TestIcon />);
    expect(container.querySelector("path")).toBeInTheDocument();
    expect(container.querySelector("circle")).toBeInTheDocument();
  });

  it("passes through additional SVG props", () => {
    const TestIcon = createIcon("TestIcon", <path d="M5 12h14" />);
    const { container } = render(<TestIcon data-testid="my-icon" />);
    expect(container.querySelector("[data-testid='my-icon']")).toBeInTheDocument();
  });
});

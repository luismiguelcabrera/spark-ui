import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import {
  CheckIcon, CloseIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon,
  SearchIcon, PlusIcon, TrashIcon, ArrowRightIcon, InfoIcon,
  CheckCircleIcon, AlertTriangleIcon, AlertCircleIcon, CalendarIcon,
  EyeIcon, HomeIcon, UserIcon, StarIcon, SettingsIcon, MenuIcon,
} from "../icons";
import { Icon } from "../../components/data-display/icon";
import { builtInIcons } from "../registry";

describe("SVG Icon Components", () => {
  it("renders an SVG element", () => {
    const { container } = render(<CheckIcon />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("defaults to 24px", () => {
    const { container } = render(<CheckIcon />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("width")).toBe("24");
    expect(svg.getAttribute("height")).toBe("24");
  });

  it("accepts custom size", () => {
    const { container } = render(<CheckIcon size={32} />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("width")).toBe("32");
  });

  it("uses currentColor", () => {
    const { container } = render(<CheckIcon />);
    expect(container.querySelector("svg")!.getAttribute("stroke")).toBe("currentColor");
  });

  it("is aria-hidden", () => {
    const { container } = render(<CheckIcon />);
    expect(container.querySelector("svg")!.getAttribute("aria-hidden")).toBe("true");
  });

  it("merges className", () => {
    const { container } = render(<CheckIcon className="text-red-500" />);
    expect(container.querySelector("svg")!.classList.contains("text-red-500")).toBe(true);
  });

  it.each([
    ["CheckIcon", CheckIcon],
    ["CloseIcon", CloseIcon],
    ["ChevronDownIcon", ChevronDownIcon],
    ["ChevronLeftIcon", ChevronLeftIcon],
    ["ChevronRightIcon", ChevronRightIcon],
    ["SearchIcon", SearchIcon],
    ["PlusIcon", PlusIcon],
    ["TrashIcon", TrashIcon],
    ["ArrowRightIcon", ArrowRightIcon],
    ["InfoIcon", InfoIcon],
    ["CheckCircleIcon", CheckCircleIcon],
    ["AlertTriangleIcon", AlertTriangleIcon],
    ["AlertCircleIcon", AlertCircleIcon],
    ["CalendarIcon", CalendarIcon],
    ["EyeIcon", EyeIcon],
    ["HomeIcon", HomeIcon],
    ["UserIcon", UserIcon],
    ["StarIcon", StarIcon],
    ["SettingsIcon", SettingsIcon],
    ["MenuIcon", MenuIcon],
  ])("%s renders without error", (_name, IconComp) => {
    const { container } = render(<IconComp />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});

describe("Icon (material-symbols span)", () => {
  it("renders a span with the icon name as text content", () => {
    const { container } = render(<Icon name="check" />);
    const span = container.querySelector("span.material-symbols-outlined");
    expect(span).toBeInTheDocument();
    expect(span!.textContent).toBe("check");
  });

  it("renders material-symbols for any name", () => {
    const { container } = render(<Icon name="chevron_left" />);
    const span = container.querySelector("span.material-symbols-outlined");
    expect(span).toBeInTheDocument();
    expect(span!.textContent).toBe("chevron_left");
  });

  it("is aria-hidden by default", () => {
    const { container } = render(<Icon name="check" />);
    const span = container.querySelector("span")!;
    expect(span.getAttribute("aria-hidden")).toBe("true");
  });

  it("applies size classes", () => {
    const { container } = render(<Icon name="check" size="lg" />);
    const span = container.querySelector("span")!;
    expect(span).toHaveClass("text-[24px]");
  });

  it("applies default md size", () => {
    const { container } = render(<Icon name="check" />);
    const span = container.querySelector("span")!;
    expect(span).toHaveClass("text-[20px]");
  });

  it("applies sm size", () => {
    const { container } = render(<Icon name="check" size="sm" />);
    const span = container.querySelector("span")!;
    expect(span).toHaveClass("text-[16px]");
  });

  it("applies xl size", () => {
    const { container } = render(<Icon name="check" size="xl" />);
    const span = container.querySelector("span")!;
    expect(span).toHaveClass("text-[32px]");
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLSpanElement | null };
    render(<Icon ref={ref} name="check" />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it("merges className", () => {
    const { container } = render(<Icon name="check" className="custom" />);
    const span = container.querySelector("span")!;
    expect(span).toHaveClass("custom");
  });

  it("supports filled prop", () => {
    const { container } = render(<Icon name="star" filled />);
    const span = container.querySelector("span")!;
    expect(span).toHaveClass("icon-filled");
  });

  it("has displayName", () => {
    expect(Icon.displayName).toBe("Icon");
  });
});

describe("Registry", () => {
  it("maps common names to components", () => {
    const required = [
      "check", "close", "search", "add", "edit", "delete",
      "chevron_left", "chevron_right", "expand_more",
      "info", "warning", "error", "check_circle",
      "calendar_today", "visibility",
    ];
    for (const name of required) {
      expect(builtInIcons[name]).toBeDefined();
    }
  });

  it("maps kebab-case names", () => {
    expect(builtInIcons["chevron-left"]).toBeDefined();
    expect(builtInIcons["chevron-right"]).toBeDefined();
    expect(builtInIcons["alert-circle"]).toBeDefined();
  });

  it("maps snake_case Material Symbols names", () => {
    expect(builtInIcons["chevron_left"]).toBeDefined();
    expect(builtInIcons["check_circle"]).toBeDefined();
    expect(builtInIcons["expand_more"]).toBeDefined();
  });
});

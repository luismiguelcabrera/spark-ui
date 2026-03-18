import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import {
  CheckIcon, CloseIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon,
  SearchIcon, PlusIcon, TrashIcon, ArrowRightIcon, InfoIcon,
  CheckCircleIcon, AlertTriangleIcon, AlertCircleIcon, CalendarIcon,
  EyeIcon, HomeIcon, UserIcon, StarIcon, SettingsIcon, MenuIcon,
} from "../icons";
import { Icon } from "../../components/data-display/icon";
import { IconProvider } from "../icon-provider";
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

describe("Icon 3-tier resolution", () => {
  it("renders built-in SVG for registered names", () => {
    const { container } = render(<Icon name="check" />);
    expect(container.querySelector("svg")).toBeInTheDocument();
    expect(container.querySelector("span")).not.toBeInTheDocument();
  });

  it("renders SVG for kebab-case names", () => {
    const { container } = render(<Icon name="chevron-left" />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders SVG for snake_case Material Symbols names", () => {
    const { container } = render(<Icon name="chevron_left" />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("falls back to Material Symbols span for unknown names", () => {
    const { container } = render(<Icon name="unknown_icon_xyz" />);
    const span = container.querySelector("span.material-symbols-outlined");
    expect(span).toBeInTheDocument();
    expect(span!.textContent).toBe("unknown_icon_xyz");
  });

  it("is aria-hidden by default", () => {
    const { container } = render(<Icon name="check" />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("aria-hidden")).toBe("true");
  });

  it("applies SVG size for registered icons", () => {
    const { container } = render(<Icon name="check" size="lg" />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("width")).toBe("24");
    expect(svg.getAttribute("height")).toBe("24");
  });

  it("applies font size classes for fallback icons", () => {
    const { container } = render(<Icon name="unknown_icon_xyz" size="lg" />);
    const span = container.querySelector("span")!;
    expect(span).toHaveClass("text-[24px]");
  });

  it("applies default md size for SVG icons", () => {
    const { container } = render(<Icon name="check" />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("width")).toBe("20");
  });

  it("applies sm size", () => {
    const { container } = render(<Icon name="check" size="sm" />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("width")).toBe("16");
  });

  it("applies xl size", () => {
    const { container } = render(<Icon name="check" size="xl" />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("width")).toBe("32");
  });

  it("merges className on SVG icons", () => {
    const { container } = render(<Icon name="check" className="custom" />);
    const svg = container.querySelector("svg")!;
    expect(svg.classList.contains("custom")).toBe(true);
  });

  it("merges className on fallback span", () => {
    const { container } = render(<Icon name="unknown_icon_xyz" className="custom" />);
    const span = container.querySelector("span")!;
    expect(span).toHaveClass("custom");
  });

  it("supports filled prop on fallback span", () => {
    const { container } = render(<Icon name="unknown_icon_xyz" filled />);
    const span = container.querySelector("span")!;
    expect(span).toHaveClass("icon-filled");
  });

  it("has displayName", () => {
    expect(Icon.displayName).toBe("Icon");
  });
});

describe("Icon with IconProvider (Tier 1)", () => {
  it("uses custom resolver when provided", () => {
    const CustomSvg = ({ size, className, ...props }: { size?: number; className?: string }) => (
      <svg data-testid="custom-icon" width={size} height={size} className={className} {...props} />
    );
    const resolver = (name: string) => (name === "custom" ? CustomSvg : undefined);

    const { container } = render(
      <IconProvider resolver={resolver}>
        <Icon name="custom" />
      </IconProvider>
    );
    expect(container.querySelector("[data-testid='custom-icon']")).toBeInTheDocument();
  });

  it("falls back to built-in when resolver returns undefined", () => {
    const resolver = () => undefined;

    const { container } = render(
      <IconProvider resolver={resolver}>
        <Icon name="check" />
      </IconProvider>
    );
    expect(container.querySelector("svg")).toBeInTheDocument();
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

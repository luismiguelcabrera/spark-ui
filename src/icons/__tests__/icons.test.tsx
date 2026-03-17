import { render, screen } from "@testing-library/react";
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

describe("Icon (string name resolver)", () => {
  it("resolves built-in icon by name", () => {
    const { container } = render(<Icon name="check" />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("resolves Material Symbols snake_case names", () => {
    const { container } = render(<Icon name="chevron_left" />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("resolves kebab-case names", () => {
    const { container } = render(<Icon name="chevron-left" />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("falls back to material-symbols span for unknown names", () => {
    const { container } = render(<Icon name="some_unknown_icon" />);
    const span = container.querySelector("span.material-symbols-outlined");
    expect(span).toBeInTheDocument();
    expect(span!.textContent).toBe("some_unknown_icon");
  });

  it("applies size", () => {
    const { container } = render(<Icon name="check" size="lg" />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("width")).toBe("24");
  });
});

describe("IconProvider", () => {
  it("overrides icon resolution", () => {
    function CustomStar({ className }: { size?: number; className?: string }) {
      return <span data-testid="custom-star" className={className}>custom</span>;
    }

    render(
      <IconProvider resolver={(name) => (name === "star" ? CustomStar : undefined)}>
        <Icon name="star" />
      </IconProvider>,
    );
    expect(screen.getByTestId("custom-star")).toBeInTheDocument();
  });

  it("falls back to built-in when resolver returns undefined", () => {
    render(
      <IconProvider resolver={() => undefined}>
        <Icon name="check" />
      </IconProvider>,
    );
    expect(document.querySelector("svg")).toBeInTheDocument();
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
});

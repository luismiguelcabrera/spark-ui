import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import {
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  InputLeftElement,
  InputRightElement,
} from "../input-group";
import { Input } from "../input";
import { Icon } from "../../data-display/icon";

describe("InputGroup", () => {
  it("renders children", () => {
    render(
      <InputGroup>
        <Input placeholder="test" />
      </InputGroup>,
    );
    expect(screen.getByPlaceholderText("test")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(
      <InputGroup ref={ref}>
        <Input />
      </InputGroup>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("merges className", () => {
    const { container } = render(
      <InputGroup className="custom-class">
        <Input />
      </InputGroup>,
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it.each(["sm", "md", "lg"] as const)("applies %s size height", (size) => {
    const { container } = render(
      <InputGroup size={size}>
        <Input />
      </InputGroup>,
    );
    const heightClass = { sm: "h-9", md: "h-12", lg: "h-14" }[size];
    expect(container.firstChild).toHaveClass(heightClass);
  });
});

describe("InputLeftAddon", () => {
  it("renders text content", () => {
    render(
      <InputGroup>
        <InputLeftAddon>https://</InputLeftAddon>
        <Input placeholder="domain" />
      </InputGroup>,
    );
    expect(screen.getByText("https://")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<InputLeftAddon ref={ref}>$</InputLeftAddon>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("merges className", () => {
    const { container } = render(
      <InputLeftAddon className="extra">@</InputLeftAddon>,
    );
    expect(container.firstChild).toHaveClass("extra");
  });

  it.each(["sm", "md", "lg"] as const)("applies %s font size", (size) => {
    const fontClass = { sm: "text-xs", md: "text-sm", lg: "text-base" }[size];
    const { container } = render(
      <InputLeftAddon size={size}>$</InputLeftAddon>,
    );
    expect(container.firstChild).toHaveClass(fontClass);
  });
});

describe("InputRightAddon", () => {
  it("renders text content", () => {
    render(
      <InputGroup>
        <Input placeholder="amount" />
        <InputRightAddon>.00</InputRightAddon>
      </InputGroup>,
    );
    expect(screen.getByText(".00")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<InputRightAddon ref={ref}>kg</InputRightAddon>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe("InputLeftElement", () => {
  it("renders children inside the element", () => {
    render(
      <div className="relative">
        <InputLeftElement>
          <Icon name="search" size="md" />
        </InputLeftElement>
        <Input placeholder="search" />
      </div>,
    );
    expect(screen.getByPlaceholderText("search")).toBeInTheDocument();
  });

  it("has pointer-events-none by default", () => {
    const { container } = render(
      <InputLeftElement>
        <Icon name="search" size="md" />
      </InputLeftElement>,
    );
    expect(container.firstChild).toHaveClass("pointer-events-none");
  });

  it("enables pointer events when clickable", () => {
    const { container } = render(
      <InputLeftElement clickable>
        <button type="button">click</button>
      </InputLeftElement>,
    );
    expect(container.firstChild).not.toHaveClass("pointer-events-none");
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(
      <InputLeftElement ref={ref}>
        <span>icon</span>
      </InputLeftElement>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe("InputRightElement", () => {
  it("renders children", () => {
    render(
      <div className="relative">
        <Input placeholder="email" />
        <InputRightElement>
          <Icon name="check-circle" size="md" />
        </InputRightElement>
      </div>,
    );
    expect(screen.getByPlaceholderText("email")).toBeInTheDocument();
  });

  it("has pointer-events-none by default", () => {
    const { container } = render(
      <InputRightElement>
        <span>x</span>
      </InputRightElement>,
    );
    expect(container.firstChild).toHaveClass("pointer-events-none");
  });

  it("enables pointer events when clickable", () => {
    const { container } = render(
      <InputRightElement clickable>
        <button type="button">clear</button>
      </InputRightElement>,
    );
    expect(container.firstChild).not.toHaveClass("pointer-events-none");
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(
      <InputRightElement ref={ref}>
        <span>x</span>
      </InputRightElement>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe("InputGroup composition", () => {
  it("renders left addon + input + right addon together", () => {
    render(
      <InputGroup>
        <InputLeftAddon>https://</InputLeftAddon>
        <Input placeholder="example.com" />
        <InputRightAddon>/path</InputRightAddon>
      </InputGroup>,
    );
    expect(screen.getByText("https://")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("example.com")).toBeInTheDocument();
    expect(screen.getByText("/path")).toBeInTheDocument();
  });

  it("renders with element overlays inside relative wrapper", () => {
    render(
      <InputGroup>
        <InputLeftAddon>$</InputLeftAddon>
        <div className="relative flex-1">
          <Input placeholder="0.00" />
          <InputRightElement>
            <span data-testid="currency">USD</span>
          </InputRightElement>
        </div>
      </InputGroup>,
    );
    expect(screen.getByText("$")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("0.00")).toBeInTheDocument();
    expect(screen.getByTestId("currency")).toHaveTextContent("USD");
  });
});

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { IconProvider, useIconResolver } from "../icon-provider";
import { Icon } from "../../components/data-display/icon";

function ResolverConsumer() {
  const resolver = useIconResolver();
  return <span data-testid="resolver">{resolver ? "has-resolver" : "no-resolver"}</span>;
}

describe("IconProvider", () => {
  it("renders children", () => {
    const resolver = () => undefined;
    render(
      <IconProvider resolver={resolver}>
        <div>Icon content</div>
      </IconProvider>,
    );
    expect(screen.getByText("Icon content")).toBeInTheDocument();
  });

  it("provides resolver to consumers", () => {
    const resolver = () => undefined;
    render(
      <IconProvider resolver={resolver}>
        <ResolverConsumer />
      </IconProvider>,
    );
    expect(screen.getByTestId("resolver")).toHaveTextContent("has-resolver");
  });

  it("returns null resolver when no provider", () => {
    render(<ResolverConsumer />);
    expect(screen.getByTestId("resolver")).toHaveTextContent("no-resolver");
  });

  it("uses custom resolver for icon resolution", () => {
    const CustomIcon = ({ size, className }: { size?: number; className?: string }) => (
      <svg data-testid="custom-svg" width={size} height={size} className={className} />
    );
    const resolver = (name: string) => (name === "my-icon" ? CustomIcon : undefined);

    render(
      <IconProvider resolver={resolver}>
        <Icon name="my-icon" />
      </IconProvider>,
    );
    expect(screen.getByTestId("custom-svg")).toBeInTheDocument();
  });

  it("falls back to built-in icons when resolver returns undefined", () => {
    const resolver = () => undefined;
    const { container } = render(
      <IconProvider resolver={resolver}>
        <Icon name="check" />
      </IconProvider>,
    );
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("falls back to Material Symbols when resolver returns undefined for unknown name", () => {
    const resolver = () => undefined;
    const { container } = render(
      <IconProvider resolver={resolver}>
        <Icon name="completely_unknown_icon" />
      </IconProvider>,
    );
    expect(container.querySelector("span.material-symbols-outlined")).toBeInTheDocument();
  });

  it("resolver takes priority over built-in icons", () => {
    const OverrideCheck = ({ size, className }: { size?: number; className?: string }) => (
      <svg data-testid="override-check" width={size} height={size} className={className} />
    );
    const resolver = (name: string) => (name === "check" ? OverrideCheck : undefined);

    render(
      <IconProvider resolver={resolver}>
        <Icon name="check" />
      </IconProvider>,
    );
    expect(screen.getByTestId("override-check")).toBeInTheDocument();
  });

  it("supports nesting providers (inner takes priority)", () => {
    const OuterIcon = () => <svg data-testid="outer" />;
    const InnerIcon = () => <svg data-testid="inner" />;
    const outerResolver = (name: string) => (name === "test" ? OuterIcon : undefined);
    const innerResolver = (name: string) => (name === "test" ? InnerIcon : undefined);

    render(
      <IconProvider resolver={outerResolver}>
        <IconProvider resolver={innerResolver}>
          <Icon name="test" />
        </IconProvider>
      </IconProvider>,
    );
    expect(screen.getByTestId("inner")).toBeInTheDocument();
  });
});

describe("useIconResolver", () => {
  it("returns null when no IconProvider is present", () => {
    render(<ResolverConsumer />);
    expect(screen.getByTestId("resolver")).toHaveTextContent("no-resolver");
  });

  it("returns the resolver function from the nearest IconProvider", () => {
    const resolver = () => undefined;
    render(
      <IconProvider resolver={resolver}>
        <ResolverConsumer />
      </IconProvider>,
    );
    expect(screen.getByTestId("resolver")).toHaveTextContent("has-resolver");
  });
});

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import {
  DefaultsProvider,
  useComponentDefaults,
  createDefaults,
} from "../defaults-provider";

type TestProps = {
  variant?: string;
  size?: string;
  disabled?: boolean;
};

function TestConsumer(props: TestProps) {
  const merged = useComponentDefaults("Button", props as Record<string, unknown>) as TestProps;
  return (
    <div data-testid="consumer">
      <span data-testid="variant">{merged.variant ?? "none"}</span>
      <span data-testid="size">{merged.size ?? "none"}</span>
      <span data-testid="disabled">{String(merged.disabled ?? "none")}</span>
    </div>
  );
}

describe("createDefaults", () => {
  it("creates a frozen defaults object", () => {
    const defaults = createDefaults({
      Button: { variant: "outline", size: "sm" },
    });
    expect(Object.isFrozen(defaults)).toBe(true);
    expect(defaults.Button.variant).toBe("outline");
  });

  it("returns empty frozen object for empty input", () => {
    const defaults = createDefaults({});
    expect(Object.isFrozen(defaults)).toBe(true);
    expect(Object.keys(defaults)).toHaveLength(0);
  });
});

describe("DefaultsProvider + useComponentDefaults", () => {
  it("merges defaults with props — props win", () => {
    render(
      <DefaultsProvider
        defaults={{ Button: { variant: "outline", size: "sm" } }}
      >
        <TestConsumer variant="solid" />
      </DefaultsProvider>,
    );
    expect(screen.getByTestId("variant")).toHaveTextContent("solid");
    expect(screen.getByTestId("size")).toHaveTextContent("sm");
  });

  it("uses defaults when no props given", () => {
    render(
      <DefaultsProvider
        defaults={{ Button: { variant: "ghost", size: "lg" } }}
      >
        <TestConsumer />
      </DefaultsProvider>,
    );
    expect(screen.getByTestId("variant")).toHaveTextContent("ghost");
    expect(screen.getByTestId("size")).toHaveTextContent("lg");
  });

  it("returns props unchanged when no defaults exist for component", () => {
    render(
      <DefaultsProvider defaults={{ Input: { size: "lg" } }}>
        <TestConsumer variant="solid" />
      </DefaultsProvider>,
    );
    expect(screen.getByTestId("variant")).toHaveTextContent("solid");
    expect(screen.getByTestId("size")).toHaveTextContent("none");
  });

  it("returns props unchanged when no provider is present", () => {
    render(<TestConsumer variant="outline" />);
    expect(screen.getByTestId("variant")).toHaveTextContent("outline");
    expect(screen.getByTestId("size")).toHaveTextContent("none");
  });

  it("handles boolean defaults correctly", () => {
    render(
      <DefaultsProvider defaults={{ Button: { disabled: true } }}>
        <TestConsumer />
      </DefaultsProvider>,
    );
    expect(screen.getByTestId("disabled")).toHaveTextContent("true");
  });

  it("explicit undefined prop does not override default", () => {
    render(
      <DefaultsProvider
        defaults={{ Button: { variant: "ghost" } }}
      >
        <TestConsumer variant={undefined} />
      </DefaultsProvider>,
    );
    expect(screen.getByTestId("variant")).toHaveTextContent("ghost");
  });

  it("nearest provider wins (nested)", () => {
    render(
      <DefaultsProvider defaults={{ Button: { variant: "solid" } }}>
        <DefaultsProvider defaults={{ Button: { variant: "ghost" } }}>
          <TestConsumer />
        </DefaultsProvider>
      </DefaultsProvider>,
    );
    expect(screen.getByTestId("variant")).toHaveTextContent("ghost");
  });

  it("renders children", () => {
    render(
      <DefaultsProvider defaults={{}}>
        <div data-testid="child">Hello</div>
      </DefaultsProvider>,
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });
});

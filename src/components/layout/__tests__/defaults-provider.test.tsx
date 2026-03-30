import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { DefaultsProvider, useDefaults } from "../defaults-provider";

// Test consumer component
function TestConsumer({ name }: { name: string }) {
  const defaults = useDefaults<{ variant?: string; size?: string }>(name);
  return (
    <div data-testid="consumer">
      <span data-testid="variant">{defaults.variant ?? "none"}</span>
      <span data-testid="size">{defaults.size ?? "none"}</span>
    </div>
  );
}

describe("DefaultsProvider", () => {
  it("provides defaults to child components via useDefaults", () => {
    render(
      <DefaultsProvider defaults={{ Button: { variant: "outline", size: "sm" } }}>
        <TestConsumer name="Button" />
      </DefaultsProvider>
    );
    expect(screen.getByTestId("variant")).toHaveTextContent("outline");
    expect(screen.getByTestId("size")).toHaveTextContent("sm");
  });

  it("returns empty object for unregistered component names", () => {
    render(
      <DefaultsProvider defaults={{ Button: { variant: "solid" } }}>
        <TestConsumer name="Input" />
      </DefaultsProvider>
    );
    expect(screen.getByTestId("variant")).toHaveTextContent("none");
    expect(screen.getByTestId("size")).toHaveTextContent("none");
  });

  it("returns empty object when no DefaultsProvider wraps the consumer", () => {
    render(<TestConsumer name="Button" />);
    expect(screen.getByTestId("variant")).toHaveTextContent("none");
    expect(screen.getByTestId("size")).toHaveTextContent("none");
  });

  it("supports multiple component defaults", () => {
    function MultiConsumer() {
      const btnDefaults = useDefaults<{ variant?: string }>("Button");
      const inputDefaults = useDefaults<{ size?: string }>("Input");
      return (
        <div>
          <span data-testid="btn-variant">{btnDefaults.variant ?? "none"}</span>
          <span data-testid="input-size">{inputDefaults.size ?? "none"}</span>
        </div>
      );
    }

    render(
      <DefaultsProvider
        defaults={{
          Button: { variant: "ghost" },
          Input: { size: "lg" },
        }}
      >
        <MultiConsumer />
      </DefaultsProvider>
    );
    expect(screen.getByTestId("btn-variant")).toHaveTextContent("ghost");
    expect(screen.getByTestId("input-size")).toHaveTextContent("lg");
  });

  it("renders children", () => {
    render(
      <DefaultsProvider defaults={{}}>
        <div data-testid="child">Hello</div>
      </DefaultsProvider>
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("nearest provider wins (nested providers)", () => {
    render(
      <DefaultsProvider defaults={{ Button: { variant: "solid" } }}>
        <DefaultsProvider defaults={{ Button: { variant: "ghost" } }}>
          <TestConsumer name="Button" />
        </DefaultsProvider>
      </DefaultsProvider>
    );
    expect(screen.getByTestId("variant")).toHaveTextContent("ghost");
  });
});

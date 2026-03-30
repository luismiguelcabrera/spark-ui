import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { DensityProvider, useDensity } from "../density";

function DensityConsumer() {
  const density = useDensity();
  return <span data-testid="density">{density}</span>;
}

describe("DensityProvider", () => {
  it("provides density value to children", () => {
    render(
      <DensityProvider density="compact">
        <DensityConsumer />
      </DensityProvider>,
    );
    expect(screen.getByTestId("density")).toHaveTextContent("compact");
  });

  it("provides 'comfortable' density", () => {
    render(
      <DensityProvider density="comfortable">
        <DensityConsumer />
      </DensityProvider>,
    );
    expect(screen.getByTestId("density")).toHaveTextContent("comfortable");
  });

  it("provides 'default' density", () => {
    render(
      <DensityProvider density="default">
        <DensityConsumer />
      </DensityProvider>,
    );
    expect(screen.getByTestId("density")).toHaveTextContent("default");
  });

  it("renders children", () => {
    render(
      <DensityProvider density="default">
        <div data-testid="child">Hello</div>
      </DensityProvider>,
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("nearest provider wins (nested)", () => {
    render(
      <DensityProvider density="default">
        <DensityProvider density="compact">
          <DensityConsumer />
        </DensityProvider>
      </DensityProvider>,
    );
    expect(screen.getByTestId("density")).toHaveTextContent("compact");
  });
});

describe("useDensity", () => {
  it("returns 'default' when no provider is present", () => {
    render(<DensityConsumer />);
    expect(screen.getByTestId("density")).toHaveTextContent("default");
  });
});

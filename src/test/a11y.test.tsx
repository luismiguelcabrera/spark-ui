import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { describe, it, expect } from "vitest";
import { Result } from "../components/feedback/result";
import { NavigationProgress } from "../components/feedback/navigation-progress";
import { Tour } from "../components/feedback/tour";

expect.extend(toHaveNoViolations);

describe("Accessibility (axe)", () => {
  it("Result - success has no a11y violations", async () => {
    const { container } = render(
      <Result status="success" title="Success" subtitle="It worked." />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("Result - error has no a11y violations", async () => {
    const { container } = render(
      <Result status="error" title="Error" subtitle="Something failed." />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("Result - 404 has no a11y violations", async () => {
    const { container } = render(
      <Result status="404" title="Not Found" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("NavigationProgress - loading has no a11y violations", async () => {
    const { container } = render(<NavigationProgress loading />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("NavigationProgress - determinate has no a11y violations", async () => {
    const { container } = render(<NavigationProgress progress={50} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("Tour - open has no a11y violations", async () => {
    const { container } = render(
      <Tour
        steps={[
          { title: "Step 1", description: "Description 1" },
          { title: "Step 2", description: "Description 2" },
        ]}
        open
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AlertBanner } from "../alert-banner";

describe("AlertBanner", () => {
  it("renders with alert role", () => {
    render(<AlertBanner title="Warning" />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("renders title and description", () => {
    render(<AlertBanner title="Heads up" description="Something happened" />);
    expect(screen.getByText("Heads up")).toBeInTheDocument();
    expect(screen.getByText("Something happened")).toBeInTheDocument();
  });

  it("renders actions", () => {
    render(<AlertBanner title="Alert" actions={<button>Dismiss</button>} />);
    expect(screen.getByRole("button", { name: "Dismiss" })).toBeInTheDocument();
  });

  it("applies variant styles", () => {
    render(<AlertBanner title="Danger" variant="danger" />);
    expect(screen.getByRole("alert")).toHaveClass("bg-red-50");
  });
});

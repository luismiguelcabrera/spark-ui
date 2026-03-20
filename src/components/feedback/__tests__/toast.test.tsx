import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Toast } from "../toast";

describe("Toast", () => {
  it("renders title", () => {
    render(<Toast title="Success!" />);
    expect(screen.getByText("Success!")).toBeInTheDocument();
  });

  it("renders description", () => {
    render(<Toast title="Done" description="Your changes were saved" />);
    expect(screen.getByText("Your changes were saved")).toBeInTheDocument();
  });

  it("renders actions", () => {
    render(<Toast title="Info" actions={<button>Undo</button>} />);
    expect(screen.getByRole("button", { name: "Undo" })).toBeInTheDocument();
  });

  it("applies variant styling", () => {
    const { container } = render(<Toast title="Err" variant="error" />);
    expect(container.firstChild).toHaveClass("bg-destructive/10");
  });
});

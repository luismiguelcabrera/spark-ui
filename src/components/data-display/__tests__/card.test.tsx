import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Card } from "../card";

describe("Card", () => {
  it("renders children", () => {
    render(<Card>Content</Card>);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("renders title and subtitle", () => {
    render(<Card title="Title" subtitle="Subtitle">Body</Card>);
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Subtitle")).toBeInTheDocument();
  });

  it("renders footer", () => {
    render(<Card footer={<span>Footer</span>}>Body</Card>);
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });

  it("renders actions when title is provided", () => {
    render(
      <Card title="Card" actions={<button>Edit</button>}>
        Body
      </Card>,
    );
    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<Card ref={ref}>Ref</Card>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

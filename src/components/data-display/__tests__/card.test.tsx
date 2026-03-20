import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
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

  it("merges custom className", () => {
    const { container } = render(<Card className="my-custom">Content</Card>);
    const card = container.firstElementChild as HTMLElement;
    expect(card.className).toContain("my-custom");
  });

  it("applies default variant classes", () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstElementChild as HTMLElement;
    expect(card.className).toContain("transition-all");
  });

  it("applies padding variant", () => {
    const { container } = render(<Card padding="lg">Content</Card>);
    const card = container.firstElementChild as HTMLElement;
    expect(card.className).toContain("p-8");
  });

  it("applies variant=outline classes", () => {
    const { container } = render(<Card variant="outline">Content</Card>);
    const card = container.firstElementChild as HTMLElement;
    expect(card.className).toContain("border-muted");
  });

  it("renders footer in title mode", () => {
    render(
      <Card title="Title" footer={<span>TitleFooter</span>}>
        Body
      </Card>,
    );
    expect(screen.getByText("TitleFooter")).toBeInTheDocument();
  });

  it("renders footer in default mode", () => {
    render(<Card footer={<span>DefaultFooter</span>}>Body</Card>);
    expect(screen.getByText("DefaultFooter")).toBeInTheDocument();
  });

  it("fires onClick callback", () => {
    const handleClick = vi.fn();
    const { container } = render(
      <Card onClick={handleClick}>Content</Card>,
    );
    fireEvent.click(container.firstElementChild!);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ChatBubble } from "../chat-bubble";

describe("ChatBubble", () => {
  it("renders message text", () => {
    render(<ChatBubble message="Hello world" timestamp="10:00" />);
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<ChatBubble ref={ref} message="Hi" timestamp="10:00" />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  it("has displayName", () => {
    expect(ChatBubble.displayName).toBe("ChatBubble");
  });

  it("merges className", () => {
    const { container } = render(
      <ChatBubble message="Hi" timestamp="10:00" className="custom-class" />
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("renders timestamp with aria-label", () => {
    render(<ChatBubble message="Hi" timestamp="2:30 PM" />);
    expect(screen.getByText("2:30 PM")).toBeInTheDocument();
    expect(screen.getByLabelText("Sent at 2:30 PM")).toBeInTheDocument();
  });

  it("uses flex-row-reverse for sent variant", () => {
    const { container } = render(
      <ChatBubble message="Sent msg" variant="sent" timestamp="10:00" />
    );
    expect(container.firstChild).toHaveClass("flex-row-reverse");
  });

  it("uses flex-row for received variant", () => {
    const { container } = render(
      <ChatBubble message="Received msg" variant="received" timestamp="10:00" />
    );
    expect(container.firstChild).toHaveClass("flex-row");
  });

  it("renders avatar when initials are provided", () => {
    render(<ChatBubble message="Hi" timestamp="10:00" initials="AB" />);
    expect(screen.getByText("AB")).toBeInTheDocument();
  });

  it("does not render timestamp if omitted", () => {
    const { container } = render(<ChatBubble message="No time" />);
    expect(container.querySelector("[aria-label^='Sent at']")).not.toBeInTheDocument();
  });
});

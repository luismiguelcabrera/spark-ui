import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Avatar } from "../avatar";

describe("Avatar", () => {
  it("renders initials when no src", () => {
    render(<Avatar initials="JD" />);
    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("derives initial from alt text", () => {
    render(<Avatar alt="Alice" />);
    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("shows fallback when no src or alt", () => {
    render(<Avatar />);
    expect(screen.getByText("?")).toBeInTheDocument();
  });

  it("renders an img when src is provided", () => {
    render(<Avatar src="https://example.com/photo.jpg" alt="User" />);
    expect(screen.getByAltText("User")).toBeInTheDocument();
  });
});

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Navbar, NavbarLink } from "../navbar";

describe("Navbar", () => {
  it("renders logo", () => {
    render(<Navbar logo={<span>Logo</span>} />);
    expect(screen.getByText("Logo")).toBeInTheDocument();
  });

  it("renders nav links", () => {
    render(
      <Navbar>
        <NavbarLink href="/">Home</NavbarLink>
        <NavbarLink href="/about">About</NavbarLink>
      </Navbar>
    );
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
  });

  it("renders actions", () => {
    render(<Navbar actions={<button>Login</button>} />);
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  it("toggles mobile menu", () => {
    render(
      <Navbar>
        <NavbarLink href="/">Home</NavbarLink>
      </Navbar>
    );
    const toggle = screen.getByLabelText("Toggle navigation menu");
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
  });
});

describe("NavbarLink", () => {
  it("renders with active state", () => {
    render(<NavbarLink active href="/">Home</NavbarLink>);
    expect(screen.getByText("Home")).toHaveAttribute("aria-current", "page");
  });
});

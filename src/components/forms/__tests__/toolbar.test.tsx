import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Toolbar, ToolbarButton, ToolbarSeparator, ToolbarGroup } from "../toolbar";

describe("Toolbar", () => {
  it("renders with role='toolbar'", () => {
    render(<Toolbar>content</Toolbar>);
    expect(screen.getByRole("toolbar")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<Toolbar ref={ref}>content</Toolbar>);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  it("has displayName", () => {
    expect(Toolbar.displayName).toBe("Toolbar");
  });

  it("merges className", () => {
    render(<Toolbar className="custom">content</Toolbar>);
    expect(screen.getByRole("toolbar")).toHaveClass("custom");
  });

  it("defaults to horizontal orientation", () => {
    render(<Toolbar>content</Toolbar>);
    expect(screen.getByRole("toolbar")).toHaveAttribute("aria-orientation", "horizontal");
  });

  it("sets aria-orientation to vertical", () => {
    render(<Toolbar orientation="vertical">content</Toolbar>);
    expect(screen.getByRole("toolbar")).toHaveAttribute("aria-orientation", "vertical");
  });

  it("applies vertical flex direction", () => {
    render(<Toolbar orientation="vertical">content</Toolbar>);
    expect(screen.getByRole("toolbar")).toHaveClass("flex-col");
  });
});

describe("ToolbarButton", () => {
  it("renders a button with type='button'", () => {
    render(<ToolbarButton>Bold</ToolbarButton>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<ToolbarButton ref={ref}>B</ToolbarButton>);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
  });

  it("has displayName", () => {
    expect(ToolbarButton.displayName).toBe("ToolbarButton");
  });

  it("merges className", () => {
    render(<ToolbarButton className="custom">B</ToolbarButton>);
    expect(screen.getByRole("button")).toHaveClass("custom");
  });

  it("sets aria-pressed when active", () => {
    render(<ToolbarButton active>Bold</ToolbarButton>);
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
  });

  it("sets title from tooltip prop", () => {
    render(<ToolbarButton tooltip="Bold text">B</ToolbarButton>);
    expect(screen.getByRole("button")).toHaveAttribute("title", "Bold text");
  });

  it("supports disabled state", () => {
    render(<ToolbarButton disabled>B</ToolbarButton>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("fires onClick", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<ToolbarButton onClick={onClick}>B</ToolbarButton>);
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });
});

describe("ToolbarSeparator", () => {
  it("renders with role='separator'", () => {
    render(<ToolbarSeparator />);
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<ToolbarSeparator ref={ref} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  it("has displayName", () => {
    expect(ToolbarSeparator.displayName).toBe("ToolbarSeparator");
  });

  it("merges className", () => {
    render(<ToolbarSeparator className="custom" />);
    expect(screen.getByRole("separator")).toHaveClass("custom");
  });
});

describe("ToolbarGroup", () => {
  it("renders with role='group'", () => {
    render(<ToolbarGroup>items</ToolbarGroup>);
    expect(screen.getByRole("group")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<ToolbarGroup ref={ref}>items</ToolbarGroup>);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  it("has displayName", () => {
    expect(ToolbarGroup.displayName).toBe("ToolbarGroup");
  });

  it("merges className", () => {
    render(<ToolbarGroup className="custom">items</ToolbarGroup>);
    expect(screen.getByRole("group")).toHaveClass("custom");
  });
});

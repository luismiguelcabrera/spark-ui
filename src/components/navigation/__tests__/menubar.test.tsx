import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { createRef } from "react";
import { Menubar } from "../menubar";

const menus = [
  {
    label: "File",
    items: [
      { label: "New", shortcut: "Ctrl+N" },
      { label: "Open", shortcut: "Ctrl+O" },
      { separator: true as const },
      { label: "Save", shortcut: "Ctrl+S" },
    ],
  },
  {
    label: "Edit",
    items: [
      { label: "Undo", shortcut: "Ctrl+Z" },
      { label: "Redo", shortcut: "Ctrl+Y" },
    ],
  },
];

describe("Menubar", () => {
  it("renders without error", () => {
    render(<Menubar menus={menus} />);
    expect(screen.getByRole("menubar")).toBeInTheDocument();
  });

  it("renders menu trigger labels", () => {
    render(<Menubar menus={menus} />);
    expect(screen.getByText("File")).toBeInTheDocument();
    expect(screen.getByText("Edit")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Menubar ref={ref} menus={menus} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has displayName", () => {
    expect(Menubar.displayName).toBe("Menubar");
  });

  it("merges className", () => {
    render(<Menubar menus={menus} className="custom-menubar" />);
    expect(screen.getByRole("menubar")).toHaveClass("custom-menubar");
  });

  it("opens menu on click", () => {
    render(<Menubar menus={menus} />);
    fireEvent.click(screen.getByText("File"));
    expect(screen.getByText("New")).toBeInTheDocument();
    expect(screen.getByText("Open")).toBeInTheDocument();
    expect(screen.getByText("Save")).toBeInTheDocument();
  });

  it("closes menu on second click", () => {
    render(<Menubar menus={menus} />);
    fireEvent.click(screen.getByText("File"));
    expect(screen.getByText("New")).toBeInTheDocument();
    fireEvent.click(screen.getByText("File"));
    expect(screen.queryByText("New")).not.toBeInTheDocument();
  });

  it("shows shortcuts in menu items", () => {
    render(<Menubar menus={menus} />);
    fireEvent.click(screen.getByText("File"));
    expect(screen.getByText("Ctrl+N")).toBeInTheDocument();
    expect(screen.getByText("Ctrl+O")).toBeInTheDocument();
  });

  it("sets aria-expanded on trigger buttons", () => {
    render(<Menubar menus={menus} />);
    const fileButton = screen.getByText("File");
    expect(fileButton).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(fileButton);
    expect(fileButton).toHaveAttribute("aria-expanded", "true");
  });

  it("sets aria-haspopup on trigger buttons", () => {
    render(<Menubar menus={menus} />);
    expect(screen.getByText("File")).toHaveAttribute("aria-haspopup", "true");
  });

  it("calls onClick on menu item click", () => {
    const onClick = vi.fn();
    const clickMenus = [
      {
        label: "File",
        items: [{ label: "New", onClick }],
      },
    ];
    render(<Menubar menus={clickMenus} />);
    fireEvent.click(screen.getByText("File"));
    fireEvent.click(screen.getByText("New"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("closes menu after item click", () => {
    const clickMenus = [
      {
        label: "File",
        items: [{ label: "New", onClick: vi.fn() }],
      },
    ];
    render(<Menubar menus={clickMenus} />);
    fireEvent.click(screen.getByText("File"));
    fireEvent.click(screen.getByText("New"));
    expect(screen.queryByText("New")).not.toBeInTheDocument();
  });

  it("renders disabled items", () => {
    const disabledMenus = [
      {
        label: "File",
        items: [{ label: "Save", disabled: true }],
      },
    ];
    render(<Menubar menus={disabledMenus} />);
    fireEvent.click(screen.getByText("File"));
    expect(screen.getByText("Save").closest("button")).toBeDisabled();
  });

  it("renders danger items with red styling", () => {
    const dangerMenus = [
      {
        label: "File",
        items: [{ label: "Delete", danger: true }],
      },
    ];
    render(<Menubar menus={dangerMenus} />);
    fireEvent.click(screen.getByText("File"));
    expect(screen.getByText("Delete").closest("button")).toHaveClass("text-destructive");
  });
});

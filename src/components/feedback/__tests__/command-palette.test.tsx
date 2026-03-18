import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CommandPalette } from "../command-palette";

describe("CommandPalette", () => {
  const groups = [
    {
      label: "Actions",
      items: [
        { label: "New File", icon: "add", shortcut: "⌘N" },
        { label: "Open", icon: "folder_open" },
      ],
    },
  ];

  it("renders with legacy groups", () => {
    render(<CommandPalette groups={groups} />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("has displayName", () => {
    expect(CommandPalette.displayName).toBe("CommandPalette");
  });

  it("renders group labels", () => {
    render(<CommandPalette groups={groups} />);
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("renders item labels", () => {
    render(<CommandPalette groups={groups} />);
    expect(screen.getByText("New File")).toBeInTheDocument();
    expect(screen.getByText("Open")).toBeInTheDocument();
  });

  it("renders shortcuts", () => {
    render(<CommandPalette groups={groups} />);
    expect(screen.getByText("⌘N")).toBeInTheDocument();
  });

  it("renders search placeholder", () => {
    render(<CommandPalette groups={groups} placeholder="Search commands..." />);
    expect(screen.getByPlaceholderText("Search commands...")).toBeInTheDocument();
  });

  it("merges className", () => {
    render(<CommandPalette groups={groups} className="custom-class" />);
    expect(screen.getByRole("combobox")).toHaveClass("custom-class");
  });

  it("has aria-expanded and aria-haspopup on combobox", () => {
    render(<CommandPalette groups={groups} />);
    const combobox = screen.getByRole("combobox");
    expect(combobox).toHaveAttribute("aria-expanded", "true");
    expect(combobox).toHaveAttribute("aria-haspopup", "listbox");
  });

  it("renders compound children API", () => {
    render(
      <CommandPalette>
        <CommandPalette.Group label="Recent">
          <CommandPalette.Item>Item One</CommandPalette.Item>
        </CommandPalette.Group>
      </CommandPalette>
    );
    expect(screen.getByText("Recent")).toBeInTheDocument();
    expect(screen.getByText("Item One")).toBeInTheDocument();
  });

  it("Item onClick fires when clicked", async () => {
    const onClick = vi.fn();
    render(
      <CommandPalette>
        <CommandPalette.Item onClick={onClick}>Clickable</CommandPalette.Item>
      </CommandPalette>
    );
    screen.getByText("Clickable").closest('[role="option"]')!.click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

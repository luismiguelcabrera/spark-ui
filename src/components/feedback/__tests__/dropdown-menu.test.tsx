import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { DropdownMenu } from "../dropdown-menu";

describe("DropdownMenu", () => {
  const items = [
    { label: "Edit", icon: "edit" },
    { label: "Delete", danger: true },
    { label: "---", divider: true },
  ];

  it("has displayName", () => {
    expect(DropdownMenu.displayName).toBe("DropdownMenu");
  });

  it("renders legacy inline menu with role='menu'", () => {
    render(<DropdownMenu items={items} />);
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("renders menu items as menuitems", () => {
    render(<DropdownMenu items={items} />);
    expect(screen.getAllByRole("menuitem")).toHaveLength(2);
  });

  it("renders divider as separator", () => {
    render(<DropdownMenu items={items} />);
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  it("calls onItemClick when an item is clicked", async () => {
    const user = userEvent.setup();
    const onItemClick = vi.fn();
    render(<DropdownMenu items={items} onItemClick={onItemClick} />);
    await user.click(screen.getByRole("menuitem", { name: "Edit" }));
    expect(onItemClick).toHaveBeenCalledWith(items[0]);
  });

  it("renders trigger and opens on click", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu
        trigger={<button>Open</button>}
        items={items}
        defaultOpen={false}
      />
    );
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    await user.click(screen.getByText("Open"));
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("trigger opens the menu on click", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu
        trigger={<button>Open</button>}
        items={items}
        defaultOpen={false}
      />
    );
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    await user.click(screen.getByText("Open"));
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("renders compound children API", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <DropdownMenu trigger={<button>Menu</button>} defaultOpen={false}>
        <DropdownMenu.Item onClick={onClick}>Action</DropdownMenu.Item>
        <DropdownMenu.Divider />
      </DropdownMenu>
    );
    await user.click(screen.getByText("Menu"));
    expect(screen.getByText("Action")).toBeInTheDocument();
    await user.click(screen.getByRole("menuitem", { name: "Action" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

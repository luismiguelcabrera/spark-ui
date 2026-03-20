import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Rating } from "../rating";
import { Tooltip } from "../tooltip";
import { DropdownMenu } from "../dropdown-menu";
import { ChatBubble } from "../chat-bubble";
import { NotificationItem } from "../notification-item";
import { Popover } from "../popover";
import { Drawer } from "../drawer";
import { CommandPalette } from "../command-palette";
import { Divider } from "../divider";
import { ContextMenu } from "../context-menu";
import { SpeedDial } from "../speed-dial";

// ── Rating ───────────────────────────────────────────────────────

describe("Rating", () => {
  it("renders with role='img'", () => {
    render(<Rating value={3} />);
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  it("has correct aria-label for value and max", () => {
    render(<Rating value={3} max={5} />);
    expect(screen.getByRole("img")).toHaveAttribute(
      "aria-label",
      "3 out of 5 stars"
    );
  });

  it("uses custom max value", () => {
    render(<Rating value={7} max={10} />);
    expect(screen.getByRole("img")).toHaveAttribute(
      "aria-label",
      "7 out of 10 stars"
    );
  });

  it("clamps value to max", () => {
    render(<Rating value={8} max={5} />);
    expect(screen.getByRole("img")).toHaveAttribute(
      "aria-label",
      "5 out of 5 stars"
    );
  });

  it("clamps value to 0", () => {
    render(<Rating value={-2} max={5} />);
    expect(screen.getByRole("img")).toHaveAttribute(
      "aria-label",
      "0 out of 5 stars"
    );
  });

  it("merges className", () => {
    render(<Rating value={3} className="custom" />);
    expect(screen.getByRole("img")).toHaveClass("custom");
  });
});

// ── Tooltip ──────────────────────────────────────────────────────

describe("Tooltip", () => {
  it("renders children", () => {
    render(
      <Tooltip content="Help text">
        <button>Hover me</button>
      </Tooltip>
    );
    expect(screen.getByText("Hover me")).toBeInTheDocument();
  });

  it("renders tooltip content with role='tooltip'", () => {
    render(
      <Tooltip content="Help text">
        <button>Hover me</button>
      </Tooltip>
    );
    // Tooltip content is always in DOM (shown on hover via CSS)
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    expect(screen.getByRole("tooltip")).toHaveTextContent("Help text");
  });

  it("merges className", () => {
    const { container } = render(
      <Tooltip content="Tip" className="custom-tooltip">
        <span>Target</span>
      </Tooltip>
    );
    expect(container.firstChild).toHaveClass("custom-tooltip");
  });
});

// ── DropdownMenu ─────────────────────────────────────────────────

describe("DropdownMenu", () => {
  const items = [
    { label: "Edit", icon: "edit" },
    { label: "Delete", icon: "delete", danger: true },
  ];

  it("renders trigger element", () => {
    render(
      <DropdownMenu trigger={<button>Open menu</button>} items={items}>
        <span>menu content</span>
      </DropdownMenu>
    );
    expect(screen.getByText("Open menu")).toBeInTheDocument();
  });

  it("opens menu on trigger click", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu trigger={<button>Open</button>} items={items} />
    );
    await user.click(screen.getByText("Open"));
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("calls onItemClick when an item is clicked", async () => {
    const user = userEvent.setup();
    const onItemClick = vi.fn();
    render(
      <DropdownMenu
        trigger={<button>Open</button>}
        items={items}
        onItemClick={onItemClick}
      />
    );
    await user.click(screen.getByText("Open"));
    await user.click(screen.getByText("Edit"));
    expect(onItemClick).toHaveBeenCalledWith(
      expect.objectContaining({ label: "Edit" })
    );
  });

  it("renders legacy inline mode without trigger", () => {
    render(<DropdownMenu items={items} />);
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });
});

// ── ChatBubble ───────────────────────────────────────────────────

describe("ChatBubble", () => {
  it("renders message text", () => {
    render(<ChatBubble message="Hello there!" />);
    expect(screen.getByText("Hello there!")).toBeInTheDocument();
  });

  it("renders timestamp when provided", () => {
    render(<ChatBubble message="Hi" timestamp="10:30 AM" />);
    expect(screen.getByText("10:30 AM")).toBeInTheDocument();
  });

  it("does not render timestamp when absent", () => {
    render(<ChatBubble message="Hi" />);
    expect(screen.queryByText("10:30 AM")).not.toBeInTheDocument();
  });

  it("renders avatar with initials", () => {
    render(<ChatBubble message="Hey" initials="AB" />);
    expect(screen.getByText("AB")).toBeInTheDocument();
  });

  it("defaults to received variant", () => {
    const { container } = render(<ChatBubble message="Hi" />);
    // received variant should not have flex-row-reverse
    expect(container.firstChild).not.toHaveClass("flex-row-reverse");
  });

  it("applies sent variant styles", () => {
    const { container } = render(
      <ChatBubble message="Hi" variant="sent" />
    );
    expect(container.firstChild).toHaveClass("flex-row-reverse");
  });
});

// ── NotificationItem ─────────────────────────────────────────────

describe("NotificationItem", () => {
  it("renders title", () => {
    render(<NotificationItem title="New message" timestamp="2m ago" />);
    expect(screen.getByText("New message")).toBeInTheDocument();
  });

  it("renders timestamp", () => {
    render(<NotificationItem title="Alert" timestamp="5m ago" />);
    expect(screen.getByText("5m ago")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(
      <NotificationItem
        title="Update"
        description="Version 2.0 released"
        timestamp="1h ago"
      />
    );
    expect(screen.getByText("Version 2.0 released")).toBeInTheDocument();
  });

  it("does not render description when absent", () => {
    render(<NotificationItem title="Alert" timestamp="now" />);
    expect(screen.queryByText("Version")).not.toBeInTheDocument();
  });

  it("shows unread dot for unread state", () => {
    const { container } = render(
      <NotificationItem title="Unread" timestamp="now" state="unread" />
    );
    // The unread dot has a specific class pattern
    // Since we use style tokens, check for the dot's presence via the container
    expect(container.firstChild?.childNodes.length).toBeGreaterThanOrEqual(2);
  });
});

// ── Popover ──────────────────────────────────────────────────────

describe("Popover", () => {
  it("renders trigger", () => {
    render(
      <Popover trigger={<button>Open</button>}>
        <p>Popover content</p>
      </Popover>
    );
    expect(screen.getByText("Open")).toBeInTheDocument();
  });

  it("opens on trigger click", async () => {
    const user = userEvent.setup();
    render(
      <Popover trigger={<button>Open</button>}>
        <p>Popover content</p>
      </Popover>
    );
    await user.click(screen.getByText("Open"));
    expect(screen.getByText("Popover content")).toBeInTheDocument();
  });

  it("has role='dialog' when open", async () => {
    const user = userEvent.setup();
    render(
      <Popover trigger={<button>Open</button>}>
        <p>Content</p>
      </Popover>
    );
    await user.click(screen.getByText("Open"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("opens and closes dialog on trigger click", async () => {
    const user = userEvent.setup();
    render(
      <Popover trigger={<button>Open</button>}>
        <p>Content</p>
      </Popover>
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await user.click(screen.getByText("Open"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.click(screen.getByText("Open"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("is not visible initially", () => {
    render(
      <Popover trigger={<button>Open</button>}>
        <p>Hidden content</p>
      </Popover>
    );
    expect(screen.queryByText("Hidden content")).not.toBeInTheDocument();
  });
});

// ── Drawer ───────────────────────────────────────────────────────

describe("Drawer", () => {
  it("does not render when closed", () => {
    render(
      <Drawer open={false}>
        <p>Drawer content</p>
      </Drawer>
    );
    expect(screen.queryByText("Drawer content")).not.toBeInTheDocument();
  });

  it("renders when open", () => {
    render(
      <Drawer open>
        <p>Drawer content</p>
      </Drawer>
    );
    expect(screen.getByText("Drawer content")).toBeInTheDocument();
  });

  it("has role='dialog' and aria-modal", () => {
    render(
      <Drawer open title="Settings">
        <p>Content</p>
      </Drawer>
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-label", "Settings");
  });

  it("renders title", () => {
    render(
      <Drawer open title="Settings">
        <p>Content</p>
      </Drawer>
    );
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("renders close button with aria-label", () => {
    render(
      <Drawer open title="Settings">
        <p>Content</p>
      </Drawer>
    );
    expect(
      screen.getByRole("button", { name: "Close drawer" })
    ).toBeInTheDocument();
  });

  it("calls onOpenChange with false when close button is clicked", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Drawer open title="Settings" onOpenChange={onOpenChange}>
        <p>Content</p>
      </Drawer>
    );
    await user.click(screen.getByRole("button", { name: "Close drawer" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("renders footer when provided", () => {
    render(
      <Drawer open footer={<button>Save</button>}>
        <p>Content</p>
      </Drawer>
    );
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("closes on Escape key", () => {
    const onOpenChange = vi.fn();
    render(
      <Drawer open onOpenChange={onOpenChange} title="Test">
        <p>Content</p>
      </Drawer>
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});

// ── CommandPalette ───────────────────────────────────────────────

describe("CommandPalette", () => {
  const groups = [
    {
      label: "Navigation",
      items: [
        { label: "Go to Dashboard", icon: "dashboard", shortcut: "G D" },
        { label: "Go to Settings", icon: "settings" },
      ],
    },
    {
      label: "Actions",
      items: [{ label: "Create project", icon: "add" }],
    },
  ];

  it("renders search input with placeholder", () => {
    render(<CommandPalette groups={groups} />);
    expect(
      screen.getByPlaceholderText("Type a command or search\u2026")
    ).toBeInTheDocument();
  });

  it("renders group labels", () => {
    render(<CommandPalette groups={groups} />);
    expect(screen.getByText("Navigation")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("renders item labels", () => {
    render(<CommandPalette groups={groups} />);
    expect(screen.getByText("Go to Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Go to Settings")).toBeInTheDocument();
    expect(screen.getByText("Create project")).toBeInTheDocument();
  });

  it("renders keyboard shortcuts", () => {
    render(<CommandPalette groups={groups} />);
    expect(screen.getByText("G D")).toBeInTheDocument();
  });

  it("accepts custom placeholder", () => {
    render(
      <CommandPalette groups={groups} placeholder="Search commands..." />
    );
    expect(
      screen.getByPlaceholderText("Search commands...")
    ).toBeInTheDocument();
  });

  it("renders compound children when no groups", () => {
    render(
      <CommandPalette>
        <CommandPalette.Group label="Custom">
          <CommandPalette.Item icon="star">Starred</CommandPalette.Item>
        </CommandPalette.Group>
      </CommandPalette>
    );
    expect(screen.getByText("Custom")).toBeInTheDocument();
    expect(screen.getByText("Starred")).toBeInTheDocument();
  });
});

// ── Divider ──────────────────────────────────────────────────────

describe("Divider", () => {
  it("renders an hr element when no label", () => {
    const { container } = render(<Divider />);
    expect(container.querySelector("hr")).toBeInTheDocument();
  });

  it("renders label text when label is provided", () => {
    render(<Divider label="OR" />);
    expect(screen.getByText("OR")).toBeInTheDocument();
  });

  it("does not render hr when label is provided", () => {
    const { container } = render(<Divider label="OR" />);
    expect(container.querySelector("hr")).not.toBeInTheDocument();
  });

  it("merges className", () => {
    const { container } = render(<Divider className="my-4" />);
    expect(container.querySelector("hr")).toHaveClass("my-4");
  });
});

// ── ContextMenu ──────────────────────────────────────────────────

describe("ContextMenu", () => {
  const items = [
    { label: "Cut", shortcut: "Ctrl+X", onClick: vi.fn() },
    { label: "Copy", shortcut: "Ctrl+C", onClick: vi.fn() },
    { separator: true as const },
    { label: "Delete", danger: true, onClick: vi.fn() },
  ];

  it("renders children (trigger area)", () => {
    render(
      <ContextMenu items={items}>
        <div>Right click here</div>
      </ContextMenu>
    );
    expect(screen.getByText("Right click here")).toBeInTheDocument();
  });

  it("does not show menu initially", () => {
    render(
      <ContextMenu items={items}>
        <div>Target</div>
      </ContextMenu>
    );
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("shows menu on right-click (contextmenu event)", () => {
    render(
      <ContextMenu items={items}>
        <div>Target</div>
      </ContextMenu>
    );
    fireEvent.contextMenu(screen.getByText("Target"));
    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(screen.getByText("Cut")).toBeInTheDocument();
    expect(screen.getByText("Copy")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("renders menu items with role='menuitem'", () => {
    render(
      <ContextMenu items={items}>
        <div>Target</div>
      </ContextMenu>
    );
    fireEvent.contextMenu(screen.getByText("Target"));
    const menuItems = screen.getAllByRole("menuitem");
    expect(menuItems).toHaveLength(3);
  });

  it("renders shortcuts", () => {
    render(
      <ContextMenu items={items}>
        <div>Target</div>
      </ContextMenu>
    );
    fireEvent.contextMenu(screen.getByText("Target"));
    expect(screen.getByText("Ctrl+X")).toBeInTheDocument();
    expect(screen.getByText("Ctrl+C")).toBeInTheDocument();
  });

  it("does not open when disabled", () => {
    render(
      <ContextMenu items={items} disabled>
        <div>Target</div>
      </ContextMenu>
    );
    fireEvent.contextMenu(screen.getByText("Target"));
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(
      <ContextMenu items={items} ref={ref}>
        <div>Target</div>
      </ContextMenu>
    );
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });
});

// ── SpeedDial ────────────────────────────────────────────────────

describe("SpeedDial", () => {
  const actions = [
    { icon: "edit", label: "Edit", onClick: vi.fn() },
    { icon: "delete", label: "Delete", onClick: vi.fn() },
  ];

  it("renders main button", () => {
    render(<SpeedDial actions={actions} />);
    expect(
      screen.getByRole("button", { name: "Open menu" })
    ).toBeInTheDocument();
  });

  it("has aria-expanded on main button", () => {
    render(<SpeedDial actions={actions} />);
    expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute(
      "aria-expanded",
      "false"
    );
  });

  it("does not show actions initially", () => {
    render(<SpeedDial actions={actions} />);
    // Actions are rendered in DOM but visually hidden (opacity-0 + pointer-events-none)
    const edit = screen.getByLabelText("Edit");
    const del = screen.getByLabelText("Delete");
    expect(edit.parentElement?.className).toMatch(/opacity-0/);
    expect(del.parentElement?.className).toMatch(/opacity-0/);
  });

  it("shows actions on main button click", async () => {
    const user = userEvent.setup();
    render(<SpeedDial actions={actions} />);
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    expect(screen.getByLabelText("Edit")).toBeInTheDocument();
    expect(screen.getByLabelText("Delete")).toBeInTheDocument();
  });

  it("changes aria-expanded when opened", async () => {
    const user = userEvent.setup();
    render(<SpeedDial actions={actions} />);
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    expect(
      screen.getByRole("button", { name: "Close menu" })
    ).toHaveAttribute("aria-expanded", "true");
  });

  it("calls action onClick and closes menu", async () => {
    const user = userEvent.setup();
    const editClick = vi.fn();
    const testActions = [
      { icon: "edit", label: "Edit", onClick: editClick },
    ];
    render(<SpeedDial actions={testActions} />);
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    await user.click(screen.getByLabelText("Edit"));
    expect(editClick).toHaveBeenCalledOnce();
    // Menu should close after action (actions stay in DOM but become visually hidden)
    const editBtn = screen.getByLabelText("Edit");
    expect(editBtn.parentElement?.className).toMatch(/opacity-0/);
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<SpeedDial actions={actions} ref={ref} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });
});

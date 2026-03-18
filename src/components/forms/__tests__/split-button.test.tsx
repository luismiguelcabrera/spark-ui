import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { SplitButton, type SplitButtonAction } from "../split-button";

const actions: SplitButtonAction[] = [
  { label: "Save as Draft", value: "draft", icon: "drafts" },
  { label: "Save and Publish", value: "publish", icon: "publish" },
  { label: "Schedule", value: "schedule", icon: "schedule" },
  { label: "Disabled Action", value: "disabled", disabled: true },
];

describe("SplitButton", () => {
  it("renders without error", () => {
    render(<SplitButton actions={actions}>Save</SplitButton>);
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "More actions" })).toBeInTheDocument();
  });

  it("fires onClick on primary button click", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <SplitButton actions={actions} onClick={onClick}>
        Save
      </SplitButton>,
    );

    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("opens dropdown on trigger click", async () => {
    const user = userEvent.setup();
    render(<SplitButton actions={actions}>Save</SplitButton>);

    await user.click(screen.getByRole("button", { name: "More actions" }));
    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(screen.getByText("Save as Draft")).toBeInTheDocument();
    expect(screen.getByText("Save and Publish")).toBeInTheDocument();
    expect(screen.getByText("Schedule")).toBeInTheDocument();
  });

  it("fires onAction when dropdown item is clicked", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(
      <SplitButton actions={actions} onAction={onAction}>
        Save
      </SplitButton>,
    );

    await user.click(screen.getByRole("button", { name: "More actions" }));
    await user.click(screen.getByText("Save as Draft"));
    expect(onAction).toHaveBeenCalledWith("draft");
  });

  it("closes dropdown after action selection", async () => {
    const user = userEvent.setup();
    render(<SplitButton actions={actions}>Save</SplitButton>);

    await user.click(screen.getByRole("button", { name: "More actions" }));
    await user.click(screen.getByText("Schedule"));
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("does not fire onAction for disabled actions", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(
      <SplitButton actions={actions} onAction={onAction}>
        Save
      </SplitButton>,
    );

    await user.click(screen.getByRole("button", { name: "More actions" }));
    await user.click(screen.getByText("Disabled Action"));
    expect(onAction).not.toHaveBeenCalled();
  });

  it("closes dropdown on outside click", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <SplitButton actions={actions}>Save</SplitButton>
        <button type="button">Outside</button>
      </div>,
    );

    await user.click(screen.getByRole("button", { name: "More actions" }));
    expect(screen.getByRole("menu")).toBeInTheDocument();

    await user.click(screen.getByText("Outside"));
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  // ── Disabled ──

  it("disables both buttons when disabled", () => {
    render(
      <SplitButton actions={actions} disabled>
        Save
      </SplitButton>,
    );

    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "More actions" })).toBeDisabled();
  });

  it("does not open dropdown when disabled", async () => {
    const user = userEvent.setup();
    render(
      <SplitButton actions={actions} disabled>
        Save
      </SplitButton>,
    );

    await user.click(screen.getByRole("button", { name: "More actions" }));
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  // ── Loading ──

  it("disables both buttons when loading", () => {
    render(
      <SplitButton actions={actions} loading>
        Save
      </SplitButton>,
    );

    const buttons = screen.getAllByRole("button");
    // Primary button (first) and dropdown trigger (second) should both be disabled
    const primaryBtn = buttons.find((b) => b.textContent?.includes("Save"));
    expect(primaryBtn).toBeDisabled();
    expect(screen.getByRole("button", { name: "More actions" })).toBeDisabled();
  });

  it("shows spinner when loading", () => {
    render(
      <SplitButton actions={actions} loading>
        Save
      </SplitButton>,
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("sets aria-busy when loading", () => {
    render(
      <SplitButton actions={actions} loading>
        Save
      </SplitButton>,
    );

    const buttons = screen.getAllByRole("button");
    const primaryBtn = buttons.find((b) => b.textContent?.includes("Save"));
    expect(primaryBtn).toHaveAttribute("aria-busy", "true");
  });

  // ── Variants ──

  it.each(["solid", "outline", "ghost"] as const)(
    "renders %s variant",
    (variant) => {
      render(
        <SplitButton actions={actions} variant={variant}>
          Save
        </SplitButton>,
      );
      expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    },
  );

  // ── Colors ──

  it.each(["primary", "secondary", "destructive", "success", "warning"] as const)(
    "renders %s color",
    (color) => {
      render(
        <SplitButton actions={actions} color={color}>
          Save
        </SplitButton>,
      );
      expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    },
  );

  // ── Sizes ──

  it.each(["sm", "md", "lg"] as const)("renders %s size", (size) => {
    render(
      <SplitButton actions={actions} size={size}>
        Save
      </SplitButton>,
    );
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  // ── Keyboard ──

  it("opens dropdown on Enter key on trigger", async () => {
    const user = userEvent.setup();
    render(<SplitButton actions={actions}>Save</SplitButton>);

    screen.getByRole("button", { name: "More actions" }).focus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("navigates dropdown with arrow keys", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(
      <SplitButton actions={actions} onAction={onAction}>
        Save
      </SplitButton>,
    );

    screen.getByRole("button", { name: "More actions" }).focus();
    await user.keyboard("{Enter}");
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{Enter}");
    expect(onAction).toHaveBeenCalledWith("publish");
  });

  it("closes dropdown on Escape key", async () => {
    const user = userEvent.setup();
    render(<SplitButton actions={actions}>Save</SplitButton>);

    screen.getByRole("button", { name: "More actions" }).focus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("menu")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  // ── Accessibility ──

  it("dropdown trigger has correct ARIA attributes", () => {
    render(<SplitButton actions={actions}>Save</SplitButton>);

    const trigger = screen.getByRole("button", { name: "More actions" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
  });

  it("sets aria-expanded to true when dropdown is open", async () => {
    const user = userEvent.setup();
    render(<SplitButton actions={actions}>Save</SplitButton>);

    await user.click(screen.getByRole("button", { name: "More actions" }));
    expect(
      screen.getByRole("button", { name: "More actions" }),
    ).toHaveAttribute("aria-expanded", "true");
  });

  it("disabled menu items have aria-disabled", async () => {
    const user = userEvent.setup();
    render(<SplitButton actions={actions}>Save</SplitButton>);

    await user.click(screen.getByRole("button", { name: "More actions" }));
    const disabledItem = screen.getByText("Disabled Action").closest('[role="menuitem"]');
    expect(disabledItem).toHaveAttribute("aria-disabled", "true");
  });

  // ── className + ref ──

  it("merges className", () => {
    const { container } = render(
      <SplitButton actions={actions} className="my-split">
        Save
      </SplitButton>,
    );
    expect(container.firstElementChild?.className).toContain("my-split");
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(
      <SplitButton ref={ref} actions={actions}>
        Save
      </SplitButton>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

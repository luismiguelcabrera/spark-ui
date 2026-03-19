import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { Popover } from "../popover";

describe("Popover", () => {
  it("renders trigger", () => {
    render(
      <Popover trigger={<button>Open</button>}>
        <p>Content</p>
      </Popover>
    );
    expect(screen.getByRole("button", { name: "Open" })).toBeInTheDocument();
  });

  it("does not show content initially", () => {
    render(
      <Popover trigger={<button>Open</button>}>
        <p>Content</p>
      </Popover>
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("shows dialog on trigger click", async () => {
    const user = userEvent.setup();
    render(
      <Popover trigger={<button>Open</button>}>
        <p>Popover content</p>
      </Popover>
    );
    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Popover content")).toBeInTheDocument();
  });

  it("opens dialog on trigger click and closes on second click", async () => {
    const user = userEvent.setup();
    render(
      <Popover trigger={<button>Open</button>}>
        <p>Content</p>
      </Popover>
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes on second click (toggle)", async () => {
    const user = userEvent.setup();
    render(
      <Popover trigger={<button>Open</button>}>
        <p>Content</p>
      </Popover>
    );
    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("merges className on dialog", async () => {
    const user = userEvent.setup();
    render(
      <Popover trigger={<button>Open</button>} className="custom-class">
        <p>Content</p>
      </Popover>
    );
    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("dialog")).toHaveClass("custom-class");
  });
});

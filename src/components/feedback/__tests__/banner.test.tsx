import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Banner } from "../banner";

describe("Banner", () => {
  it("renders with text", () => {
    render(<Banner text="System maintenance scheduled" />);
    expect(screen.getByText("System maintenance scheduled")).toBeInTheDocument();
  });

  it("has banner role", () => {
    render(<Banner text="Notice" />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it.each(["info", "warning", "danger", "success"] as const)(
    "renders %s color without error",
    (color) => {
      const { container } = render(<Banner text="Message" color={color} />);
      expect(container.firstChild).toBeInTheDocument();
    },
  );

  it("defaults to info color", () => {
    render(<Banner text="Default" />);
    const banner = screen.getByRole("banner");
    expect(banner).toHaveClass("bg-blue-600");
  });

  it("applies warning color styles", () => {
    render(<Banner text="Warning" color="warning" />);
    const banner = screen.getByRole("banner");
    expect(banner).toHaveClass("bg-amber-500");
    expect(banner).toHaveClass("text-amber-950");
  });

  it("applies danger color styles", () => {
    render(<Banner text="Danger" color="danger" />);
    const banner = screen.getByRole("banner");
    expect(banner).toHaveClass("bg-red-600");
  });

  it("applies success color styles", () => {
    render(<Banner text="Success" color="success" />);
    const banner = screen.getByRole("banner");
    expect(banner).toHaveClass("bg-green-600");
  });

  it("renders actions", () => {
    render(
      <Banner
        text="Update available"
        actions={<button type="button">Update now</button>}
      />,
    );
    expect(screen.getByText("Update now")).toBeInTheDocument();
  });

  it("applies sticky positioning when sticky is true", () => {
    render(<Banner text="Sticky" sticky />);
    const banner = screen.getByRole("banner");
    expect(banner).toHaveClass("sticky");
    expect(banner).toHaveClass("top-0");
  });

  it("does not apply sticky positioning by default", () => {
    render(<Banner text="Not sticky" />);
    const banner = screen.getByRole("banner");
    expect(banner).not.toHaveClass("sticky");
  });

  it("shows dismiss button when dismissible is true", () => {
    render(<Banner text="Dismissible" dismissible onDismiss={() => {}} />);
    expect(screen.getByLabelText("Dismiss banner")).toBeInTheDocument();
  });

  it("does not show dismiss button by default", () => {
    render(<Banner text="Not dismissible" />);
    expect(screen.queryByLabelText("Dismiss banner")).not.toBeInTheDocument();
  });

  it("calls onDismiss when dismiss button is clicked", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(<Banner text="Message" dismissible onDismiss={onDismiss} />);
    await user.click(screen.getByLabelText("Dismiss banner"));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<Banner ref={ref} text="With ref" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("merges className", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<Banner ref={ref} text="Custom" className="custom-banner" />);
    expect(ref.current).toHaveClass("custom-banner");
  });

  it("renders custom icon", () => {
    // When custom icon is provided it should render (no default icon)
    const { container } = render(<Banner text="Custom icon" icon="settings" />);
    // The icon component should be present
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  });
});

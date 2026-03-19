import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { CronInput, describeCron, parseCron, buildCron } from "../cron-input";

describe("CronInput", () => {
  it("renders in basic mode by default", () => {
    render(<CronInput />);
    expect(screen.getByRole("tablist")).toBeInTheDocument();
  });

  it("renders tab buttons (Minute, Hourly, Daily, Weekly, Monthly)", () => {
    render(<CronInput />);
    expect(screen.getByRole("tab", { name: "Minute" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Hourly" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Daily" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Weekly" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Monthly" })).toBeInTheDocument();
  });

  it("switching tabs changes the selector UI", async () => {
    const user = userEvent.setup();
    render(<CronInput />);

    // Click Daily tab
    await user.click(screen.getByRole("tab", { name: "Daily" }));
    // Should show hour and minute selects
    expect(screen.getByRole("combobox", { name: "Hour" })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Minute" })).toBeInTheDocument();

    // Click Weekly tab
    await user.click(screen.getByRole("tab", { name: "Weekly" }));
    // Should show day buttons
    expect(screen.getByRole("button", { name: "Mon" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sun" })).toBeInTheDocument();
  });

  it("generates correct cron for 'every 5 minutes' (*/5 * * * *)", () => {
    const onChange = vi.fn();
    render(<CronInput defaultValue="*/5 * * * *" onChange={onChange} />);
    // Should show description
    expect(screen.getByText("Every 5 minutes")).toBeInTheDocument();
  });

  it("generates correct cron for 'daily at 9:00' (0 9 * * *)", async () => {
    const onChange = vi.fn();
    render(<CronInput defaultValue="0 9 * * *" onChange={onChange} />);
    expect(screen.getByText("At 09:00, every day")).toBeInTheDocument();
  });

  it("generates correct cron for 'weekly on Mon,Wed,Fri at 9:00'", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<CronInput onChange={onChange} />);

    // Switch to weekly tab — defaults to "0 9 * * 1" (Mon selected)
    await user.click(screen.getByRole("tab", { name: "Weekly" }));
    expect(onChange).toHaveBeenLastCalledWith("0 9 * * 1");

    // Click Wed (day 3) and Fri (day 5) to add them
    await user.click(screen.getByRole("button", { name: "Wed" }));
    expect(onChange).toHaveBeenLastCalledWith("0 9 * * 1,3");

    await user.click(screen.getByRole("button", { name: "Fri" }));
    expect(onChange).toHaveBeenLastCalledWith("0 9 * * 1,3,5");
  });

  it("advanced mode shows text input", () => {
    render(<CronInput mode="advanced" />);
    expect(screen.getByRole("textbox", { name: "Cron expression" })).toBeInTheDocument();
    // Should NOT show tabs
    expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
  });

  it("advanced mode updates cron on typing", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<CronInput mode="advanced" defaultValue="" onChange={onChange} />);
    const input = screen.getByRole("textbox", { name: "Cron expression" });
    await user.clear(input);
    await user.type(input, "0 9 * * 1-5");
    expect(onChange).toHaveBeenCalled();
    // Last call should be the final typed string
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall).toBe("0 9 * * 1-5");
  });

  it("calls onChange when cron changes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<CronInput onChange={onChange} />);

    // Click on Daily tab - should trigger onChange
    await user.click(screen.getByRole("tab", { name: "Daily" }));
    expect(onChange).toHaveBeenCalled();
  });

  it("forwards ref (HTMLDivElement)", () => {
    const ref = vi.fn();
    render(<CronInput ref={ref} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  it("has displayName", () => {
    expect(CronInput.displayName).toBe("CronInput");
  });

  it("merges className", () => {
    const ref = vi.fn();
    render(<CronInput ref={ref} className="my-custom-class" />);
    const el = ref.mock.calls[0][0] as HTMLDivElement;
    expect(el.classList.contains("my-custom-class")).toBe(true);
  });

  it("disabled state", () => {
    render(<CronInput disabled />);
    const tabs = screen.getAllByRole("tab");
    tabs.forEach((tab) => {
      expect(tab).toBeDisabled();
    });
  });

  it("error message renders", () => {
    render(<CronInput error="Invalid cron expression" />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Invalid cron expression")).toBeInTheDocument();
  });

  it("shows human-readable description", () => {
    render(<CronInput defaultValue="0 9 * * 1-5" />);
    expect(screen.getByText("At 09:00, Monday through Friday")).toBeInTheDocument();
  });

  it("shows label when provided", () => {
    render(<CronInput label="Schedule" />);
    expect(screen.getByText("Schedule")).toBeInTheDocument();
  });
});

describe("parseCron", () => {
  it("correctly splits cron string", () => {
    const result = parseCron("0 9 * * 1-5");
    expect(result).toEqual({
      minute: "0",
      hour: "9",
      dayOfMonth: "*",
      month: "*",
      dayOfWeek: "1-5",
    });
  });

  it("handles default * * * * *", () => {
    const result = parseCron("* * * * *");
    expect(result).toEqual({
      minute: "*",
      hour: "*",
      dayOfMonth: "*",
      month: "*",
      dayOfWeek: "*",
    });
  });

  it("handles step values", () => {
    const result = parseCron("*/15 * * * *");
    expect(result.minute).toBe("*/15");
  });
});

describe("buildCron", () => {
  it("joins parts correctly", () => {
    const result = buildCron({
      minute: "0",
      hour: "9",
      dayOfMonth: "*",
      month: "*",
      dayOfWeek: "1-5",
    });
    expect(result).toBe("0 9 * * 1-5");
  });

  it("handles all wildcards", () => {
    const result = buildCron({
      minute: "*",
      hour: "*",
      dayOfMonth: "*",
      month: "*",
      dayOfWeek: "*",
    });
    expect(result).toBe("* * * * *");
  });
});

describe("describeCron", () => {
  it("returns 'Every minute' for * * * * *", () => {
    expect(describeCron("* * * * *")).toBe("Every minute");
  });

  it("returns 'Every 5 minutes' for */5 * * * *", () => {
    expect(describeCron("*/5 * * * *")).toBe("Every 5 minutes");
  });

  it("returns 'Every hour' for 0 * * * *", () => {
    expect(describeCron("0 * * * *")).toBe("Every hour");
  });

  it("returns 'At 09:00, every day' for 0 9 * * *", () => {
    expect(describeCron("0 9 * * *")).toBe("At 09:00, every day");
  });

  it("returns 'At 09:00, Monday through Friday' for 0 9 * * 1-5", () => {
    expect(describeCron("0 9 * * 1-5")).toBe("At 09:00, Monday through Friday");
  });

  it("returns 'At 09:00, on day 1 of the month' for 0 9 1 * *", () => {
    expect(describeCron("0 9 1 * *")).toBe("At 09:00, on day 1 of the month");
  });

  it("returns 'At 09:30, every Monday' for 30 9 * * 1", () => {
    expect(describeCron("30 9 * * 1")).toBe("At 09:30, every Monday");
  });

  it("returns 'Every 15 minutes' for */15 * * * *", () => {
    expect(describeCron("*/15 * * * *")).toBe("Every 15 minutes");
  });
});

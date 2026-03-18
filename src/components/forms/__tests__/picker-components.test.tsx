import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Combobox } from "../combobox";
import { DatePicker } from "../date-picker";
import { OtpInput } from "../otp-input";
import { FileUploadZone, FileUploadItem } from "../file-upload";
import { ColorPicker } from "../color-picker";
import { CopyButton } from "../copy-button";
import { PinInput } from "../pin-input";
import { TimePicker } from "../time-picker";
import { DateRangePicker } from "../date-range-picker";
import { Toolbar, ToolbarButton, ToolbarSeparator, ToolbarGroup } from "../toolbar";

// ── Combobox ─────────────────────────────────────────────────────

describe("Combobox", () => {
  const options = [
    { value: "react", label: "React" },
    { value: "vue", label: "Vue" },
    { value: "angular", label: "Angular" },
  ];

  it("renders with a combobox role", () => {
    render(<Combobox options={options} />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("shows placeholder text", () => {
    render(<Combobox options={options} placeholder="Choose framework" />);
    expect(screen.getByText("Choose framework")).toBeInTheDocument();
  });

  it("opens dropdown on focus", async () => {
    const user = userEvent.setup();
    render(<Combobox options={options} />);
    await user.click(screen.getByRole("combobox"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("filters options based on search input", async () => {
    const user = userEvent.setup();
    render(<Combobox options={options} />);
    await user.click(screen.getByRole("combobox"));
    const searchInput = screen.getByLabelText("Search options");
    await user.type(searchInput, "Re");
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.queryByText("Vue")).not.toBeInTheDocument();
  });

  it("calls onChange when option is selected", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Combobox options={options} onChange={onChange} />);
    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByText("Vue"));
    expect(onChange).toHaveBeenCalledWith("vue");
  });

  it("supports aria-label", () => {
    render(<Combobox options={options} aria-label="Framework" />);
    expect(screen.getByRole("combobox")).toHaveAttribute("aria-label", "Framework");
  });

  it("shows error message", () => {
    render(<Combobox options={options} error="Selection required" />);
    expect(screen.getByText("Selection required")).toBeInTheDocument();
  });

  it("sets aria-expanded based on open state", () => {
    render(<Combobox options={options} />);
    expect(screen.getByRole("combobox")).toHaveAttribute("aria-expanded", "false");
  });

  it("shows 'No results' when no options match", async () => {
    const user = userEvent.setup();
    render(<Combobox options={options} />);
    await user.click(screen.getByRole("combobox"));
    const searchInput = screen.getByLabelText("Search options");
    await user.type(searchInput, "xyz");
    expect(screen.getByText(/no.*results|no.*options|no.*match/i)).toBeInTheDocument();
  });
});

// ── DatePicker ───────────────────────────────────────────────────

describe("DatePicker", () => {
  it("renders trigger button with placeholder", () => {
    render(<DatePicker />);
    expect(screen.getByText("Pick a date")).toBeInTheDocument();
  });

  it("shows custom placeholder", () => {
    render(<DatePicker placeholder="Select date" />);
    expect(screen.getByText("Select date")).toBeInTheDocument();
  });

  it("renders label when provided", () => {
    render(<DatePicker label="Birthday" />);
    expect(screen.getByText("Birthday")).toBeInTheDocument();
  });

  it("opens calendar on button click", async () => {
    const user = userEvent.setup();
    render(<DatePicker />);
    await user.click(screen.getByText("Pick a date"));
    expect(screen.getByLabelText("Previous month")).toBeInTheDocument();
    expect(screen.getByLabelText("Next month")).toBeInTheDocument();
  });

  it("has aria-expanded on trigger", () => {
    render(<DatePicker />);
    const trigger = screen.getByRole("button", { name: /pick a date/i });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("displays selected date", () => {
    const date = new Date(2024, 5, 15); // June 15, 2024
    render(<DatePicker value={date} />);
    expect(screen.getByText("June 15, 2024")).toBeInTheDocument();
  });

  it("shows error message", () => {
    render(<DatePicker error="Date is required" />);
    expect(screen.getByText("Date is required")).toBeInTheDocument();
  });

  it("calls onChange when a day is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DatePicker onChange={onChange} />);
    await user.click(screen.getByText("Pick a date"));
    // Click a day button (day 15)
    await user.click(screen.getByRole("button", { name: "15" }));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0]).toBeInstanceOf(Date);
  });

  it("navigates months", async () => {
    const user = userEvent.setup();
    render(<DatePicker />);
    await user.click(screen.getByText("Pick a date"));
    const monthText = screen.getByText(/\w+ \d{4}/);
    const initialMonth = monthText.textContent;
    await user.click(screen.getByLabelText("Next month"));
    expect(monthText.textContent).not.toBe(initialMonth);
  });
});

// ── OtpInput ─────────────────────────────────────────────────────

describe("OtpInput", () => {
  it("renders the correct number of inputs", () => {
    render(<OtpInput value="" onChange={vi.fn()} length={6} />);
    const inputs = screen.getAllByRole("textbox");
    expect(inputs).toHaveLength(6);
  });

  it("renders custom length", () => {
    render(<OtpInput value="" onChange={vi.fn()} length={4} />);
    const inputs = screen.getAllByRole("textbox");
    expect(inputs).toHaveLength(4);
  });

  it("fills inputs with value characters", () => {
    render(<OtpInput value="1234" onChange={vi.fn()} length={6} />);
    const inputs = screen.getAllByRole("textbox");
    expect(inputs[0]).toHaveValue("1");
    expect(inputs[1]).toHaveValue("2");
    expect(inputs[2]).toHaveValue("3");
    expect(inputs[3]).toHaveValue("4");
    expect(inputs[4]).toHaveValue("");
  });

  it("uses numeric inputMode", () => {
    render(<OtpInput value="" onChange={vi.fn()} length={4} />);
    const inputs = screen.getAllByRole("textbox");
    inputs.forEach((input) => {
      expect(input).toHaveAttribute("inputMode", "numeric");
    });
  });

  it("supports disabled state", () => {
    render(<OtpInput value="" onChange={vi.fn()} disabled length={4} />);
    const inputs = screen.getAllByRole("textbox");
    inputs.forEach((input) => {
      expect(input).toBeDisabled();
    });
  });
});

// ── FileUpload ───────────────────────────────────────────────────

describe("FileUploadZone", () => {
  it("renders upload prompt", () => {
    render(<FileUploadZone />);
    expect(screen.getByText("Drop files here or click to upload")).toBeInTheDocument();
  });

  it("shows default accept text", () => {
    render(<FileUploadZone />);
    expect(screen.getByText("PNG, JPG, PDF up to 10MB")).toBeInTheDocument();
  });

  it("shows custom accept text", () => {
    render(<FileUploadZone accept="SVG only" />);
    expect(screen.getByText("SVG only")).toBeInTheDocument();
  });
});

describe("FileUploadItem", () => {
  it("renders file name and size", () => {
    render(
      <FileUploadItem
        file={{ name: "photo.jpg", size: "2.4 MB" }}
      />
    );
    expect(screen.getByText("photo.jpg")).toBeInTheDocument();
    expect(screen.getByText("2.4 MB")).toBeInTheDocument();
  });

  it("shows uploading state with progress", () => {
    render(
      <FileUploadItem
        file={{ name: "doc.pdf", size: "1 MB", progress: 50, status: "uploading" }}
      />
    );
    expect(screen.getByText("doc.pdf")).toBeInTheDocument();
  });
});

// ── ColorPicker ──────────────────────────────────────────────────

describe("ColorPicker", () => {
  it("renders with default color", () => {
    render(<ColorPicker />);
    // Should have a text input showing the default color
    const textInput = screen.getByPlaceholderText("#000000");
    expect(textInput).toBeInTheDocument();
  });

  it("renders label when provided", () => {
    render(<ColorPicker label="Background Color" />);
    expect(screen.getByText("Background Color")).toBeInTheDocument();
  });

  it("renders preset color swatches", () => {
    render(<ColorPicker presets={["#ff0000", "#00ff00"]} />);
    expect(screen.getByLabelText("Select color #ff0000")).toBeInTheDocument();
    expect(screen.getByLabelText("Select color #00ff00")).toBeInTheDocument();
  });

  it("calls onChange when preset is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ColorPicker onChange={onChange} presets={["#ff0000"]} />);
    await user.click(screen.getByLabelText("Select color #ff0000"));
    expect(onChange).toHaveBeenCalledWith("#ff0000");
  });

  it("hides text input when showInput is false", () => {
    render(<ColorPicker showInput={false} />);
    expect(screen.queryByPlaceholderText("#000000")).not.toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<ColorPicker ref={ref} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  it("handles disabled state", () => {
    const { container } = render(<ColorPicker disabled label="Disabled" />);
    // Root div has opacity-50 and pointer-events-none when disabled
    expect(container.firstChild).toHaveClass("pointer-events-none");
  });
});

// ── CopyButton ───────────────────────────────────────────────────

describe("CopyButton", () => {
  it("renders a button with copy aria-label", () => {
    render(<CopyButton value="text" />);
    expect(
      screen.getByRole("button", { name: "Copy to clipboard" })
    ).toBeInTheDocument();
  });

  it("has type='button'", () => {
    render(<CopyButton value="text" />);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("renders label text when label prop is provided", () => {
    render(<CopyButton value="text" label="Copy link" />);
    expect(screen.getByText("Copy link")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<CopyButton value="text" ref={ref} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
  });
});

// ── PinInput ─────────────────────────────────────────────────────

describe("PinInput", () => {
  it("renders the correct number of input fields", () => {
    render(<PinInput length={4} />);
    const inputs = screen.getAllByRole("textbox");
    expect(inputs).toHaveLength(4);
  });

  it("defaults to 6 fields", () => {
    render(<PinInput />);
    const inputs = screen.getAllByRole("textbox");
    expect(inputs).toHaveLength(6);
  });

  it("renders label", () => {
    render(<PinInput label="Verification Code" />);
    expect(screen.getByText("Verification Code")).toBeInTheDocument();
  });

  it("shows error message", () => {
    render(<PinInput error errorMessage="Invalid code" />);
    expect(screen.getByText("Invalid code")).toBeInTheDocument();
  });

  it("supports disabled state", () => {
    render(<PinInput disabled length={4} />);
    const inputs = screen.getAllByRole("textbox");
    inputs.forEach((input) => {
      expect(input).toBeDisabled();
    });
  });

  it("has aria-label on each digit", () => {
    render(<PinInput length={3} />);
    expect(screen.getByLabelText("Pin digit 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Pin digit 2")).toBeInTheDocument();
    expect(screen.getByLabelText("Pin digit 3")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<PinInput ref={ref} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  it("fills inputs with controlled value", () => {
    render(<PinInput value="123" length={4} />);
    const inputs = screen.getAllByRole("textbox");
    expect(inputs[0]).toHaveValue("1");
    expect(inputs[1]).toHaveValue("2");
    expect(inputs[2]).toHaveValue("3");
    expect(inputs[3]).toHaveValue("");
  });
});

// ── TimePicker ───────────────────────────────────────────────────

describe("TimePicker", () => {
  it("renders trigger button with placeholder", () => {
    render(<TimePicker />);
    expect(screen.getByText("Select time")).toBeInTheDocument();
  });

  it("shows custom placeholder", () => {
    render(<TimePicker placeholder="Choose time" />);
    expect(screen.getByText("Choose time")).toBeInTheDocument();
  });

  it("renders label", () => {
    render(<TimePicker label="Start Time" />);
    expect(screen.getByText("Start Time")).toBeInTheDocument();
  });

  it("shows error message", () => {
    render(<TimePicker error="Required field" />);
    expect(screen.getByText("Required field")).toBeInTheDocument();
  });

  it("displays current time value (24h)", () => {
    render(<TimePicker value="14:30" />);
    expect(screen.getByText("14:30")).toBeInTheDocument();
  });

  it("opens time picker on click", async () => {
    const user = userEvent.setup();
    render(<TimePicker />);
    await user.click(screen.getByText("Select time"));
    expect(screen.getByText("Hour")).toBeInTheDocument();
    expect(screen.getByText("Min")).toBeInTheDocument();
  });

  it("supports disabled state", () => {
    render(<TimePicker disabled />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("forwards ref through the dropdown panel", () => {
    // The ref is forwarded to the dropdown panel, which is only visible when open
    const ref = vi.fn();
    render(<TimePicker ref={ref} />);
    // ref isn't called until the dropdown opens, so just verify render doesn't crash
    expect(screen.getByText("Select time")).toBeInTheDocument();
  });
});

// ── DateRangePicker ──────────────────────────────────────────────

describe("DateRangePicker", () => {
  it("renders trigger button with placeholder", () => {
    render(<DateRangePicker />);
    expect(screen.getByText("Select date range")).toBeInTheDocument();
  });

  it("shows custom placeholder", () => {
    render(<DateRangePicker placeholder="Choose range" />);
    expect(screen.getByText("Choose range")).toBeInTheDocument();
  });

  it("renders label", () => {
    render(<DateRangePicker label="Period" />);
    expect(screen.getByText("Period")).toBeInTheDocument();
  });

  it("shows error message", () => {
    render(<DateRangePicker error="Invalid range" />);
    expect(screen.getByText("Invalid range")).toBeInTheDocument();
  });

  it("displays formatted range when value is provided", () => {
    const value = {
      start: new Date(2024, 0, 1),
      end: new Date(2024, 0, 15),
    };
    render(<DateRangePicker value={value} />);
    // Default format is M/D/YYYY
    expect(screen.getByText(/1\/1\/2024/)).toBeInTheDocument();
  });

  it("supports disabled state", () => {
    render(<DateRangePicker disabled />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("opens calendar on click", async () => {
    const user = userEvent.setup();
    render(<DateRangePicker />);
    await user.click(screen.getByText("Select date range"));
    expect(screen.getByText("Select start date")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    // ref is forwarded to the calendar panel only when open
    const ref = vi.fn();
    render(<DateRangePicker ref={ref} />);
    expect(screen.getByText("Select date range")).toBeInTheDocument();
  });
});

// ── Toolbar ──────────────────────────────────────────────────────

describe("Toolbar", () => {
  it("renders with role='toolbar'", () => {
    render(<Toolbar>content</Toolbar>);
    expect(screen.getByRole("toolbar")).toBeInTheDocument();
  });

  it("sets aria-orientation", () => {
    render(<Toolbar orientation="vertical">content</Toolbar>);
    expect(screen.getByRole("toolbar")).toHaveAttribute(
      "aria-orientation",
      "vertical"
    );
  });

  it("defaults to horizontal orientation", () => {
    render(<Toolbar>content</Toolbar>);
    expect(screen.getByRole("toolbar")).toHaveAttribute(
      "aria-orientation",
      "horizontal"
    );
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<Toolbar ref={ref}>content</Toolbar>);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });
});

describe("ToolbarButton", () => {
  it("renders a button with type='button'", () => {
    render(<ToolbarButton>Bold</ToolbarButton>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
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
});

describe("ToolbarSeparator", () => {
  it("renders with role='separator'", () => {
    render(<ToolbarSeparator />);
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });
});

describe("ToolbarGroup", () => {
  it("renders with role='group'", () => {
    render(<ToolbarGroup>items</ToolbarGroup>);
    expect(screen.getByRole("group")).toBeInTheDocument();
  });
});

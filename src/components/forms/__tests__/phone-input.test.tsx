import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PhoneInput } from "../phone-input";
import { createRef } from "react";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getCountryButton() {
  return screen.getByRole("button", { name: /selected country/i });
}

function getPhoneInput() {
  return screen.getByRole("textbox", { name: /phone number/i });
}

function openDropdown() {
  fireEvent.click(getCountryButton());
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("PhoneInput", () => {
  // ---- Basic rendering ----

  it("renders with default country (US) flag and dial code", () => {
    render(<PhoneInput />);
    const btn = getCountryButton();
    expect(btn).toHaveTextContent("+1");
  });

  it("applies mask to input (type digits, formatted output appears)", () => {
    render(<PhoneInput />);
    const input = getPhoneInput();
    fireEvent.change(input, { target: { value: "4155552671" } });
    expect(input).toHaveValue("(415) 555-2671");
  });

  it("opens country dropdown on country button click", () => {
    render(<PhoneInput />);
    openDropdown();
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("filters countries by search query", () => {
    render(<PhoneInput />);
    openDropdown();
    const searchInput = screen.getByPlaceholderText("Search...");
    fireEvent.change(searchInput, { target: { value: "United Kingdom" } });
    expect(screen.getByText("United Kingdom")).toBeInTheDocument();
    expect(screen.queryByText("United States")).not.toBeInTheDocument();
  });

  it("selects country from dropdown", () => {
    render(<PhoneInput />);
    openDropdown();
    fireEvent.mouseDown(screen.getByText("United Kingdom"));
    // Dropdown should close
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    // Dial code should update
    const btn = getCountryButton();
    expect(btn).toHaveTextContent("+44");
  });

  it("calls onChange with E.164 format", () => {
    const onChange = vi.fn();
    render(<PhoneInput onChange={onChange} />);
    const input = getPhoneInput();
    fireEvent.change(input, { target: { value: "4155552671" } });
    expect(onChange).toHaveBeenCalledWith("+14155552671", "US");
  });

  it("calls onChange when country changes", () => {
    const onChange = vi.fn();
    render(<PhoneInput onChange={onChange} />);
    openDropdown();
    fireEvent.mouseDown(screen.getByText("United Kingdom"));
    expect(onChange).toHaveBeenCalledWith("+44", "GB");
  });

  // ---- Ref forwarding ----

  it("forwards ref to HTMLInputElement", () => {
    const ref = createRef<HTMLInputElement>();
    render(<PhoneInput ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current?.getAttribute("inputmode")).toBe("tel");
  });

  // ---- displayName ----

  it("has displayName", () => {
    expect(PhoneInput.displayName).toBe("PhoneInput");
  });

  // ---- className merging ----

  it("merges className", () => {
    const { container } = render(<PhoneInput className="my-custom-class" />);
    expect(container.firstChild).toHaveClass("my-custom-class");
  });

  // ---- Disabled state ----

  it("disabled state prevents interaction", () => {
    render(<PhoneInput disabled />);
    const input = getPhoneInput();
    expect(input).toBeDisabled();
    const btn = getCountryButton();
    expect(btn).toBeDisabled();
  });

  it("disabled state does not open dropdown", () => {
    render(<PhoneInput disabled />);
    fireEvent.click(getCountryButton());
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  // ---- Error state ----

  it("error state renders error text and aria-invalid", () => {
    render(<PhoneInput error="Invalid phone number" />);
    expect(screen.getByText("Invalid phone number")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();
    const input = getPhoneInput();
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  // ---- Label ----

  it("label renders", () => {
    render(<PhoneInput label="Phone" />);
    expect(screen.getByText("Phone")).toBeInTheDocument();
  });

  // ---- Preferred countries ----

  it("preferred countries appear at top", () => {
    render(<PhoneInput preferredCountries={["GB", "CA"]} />);
    openDropdown();
    const listbox = screen.getByRole("listbox");
    const options = listbox.querySelectorAll("button[role='option']");
    // First two options should be GB and CA
    expect(options[0]).toHaveTextContent("United Kingdom");
    expect(options[1]).toHaveTextContent("Canada");
  });

  // ---- Click outside ----

  it("closes dropdown on outside click", () => {
    render(
      <div>
        <PhoneInput />
        <button data-testid="outside">Outside</button>
      </div>
    );
    openDropdown();
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    fireEvent.mouseDown(screen.getByTestId("outside"));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  // ---- Size variants ----

  it.each(["sm", "md", "lg"] as const)("size '%s' applies correct classes", (size) => {
    render(<PhoneInput size={size} />);
    const input = getPhoneInput();
    const sizeClasses = { sm: "h-8", md: "h-10", lg: "h-12" };
    expect(input.className).toContain(sizeClasses[size]);
  });

  // ---- Default country ----

  it("respects defaultCountry prop", () => {
    render(<PhoneInput defaultCountry="GB" />);
    const btn = getCountryButton();
    expect(btn).toHaveTextContent("+44");
  });

  // ---- Clamps digits to mask slots ----

  it("clamps digits to the mask length", () => {
    render(<PhoneInput />);
    const input = getPhoneInput();
    // US mask has 10 digit slots, provide 12 digits
    fireEvent.change(input, { target: { value: "123456789012" } });
    // Should only use 10 digits
    expect(input).toHaveValue("(123) 456-7890");
  });

  // ---- Country filter ----

  it("filters available countries when countries prop is set", () => {
    render(<PhoneInput countries={["US", "GB"]} />);
    openDropdown();
    const listbox = screen.getByRole("listbox");
    const options = listbox.querySelectorAll("button[role='option']");
    expect(options).toHaveLength(2);
  });

  // ---- Search by dial code ----

  it("filters countries by dial code", () => {
    render(<PhoneInput />);
    openDropdown();
    const searchInput = screen.getByPlaceholderText("Search...");
    fireEvent.change(searchInput, { target: { value: "+44" } });
    expect(screen.getByText("United Kingdom")).toBeInTheDocument();
  });

  // ---- Clears digits on country change ----

  it("clears phone digits when country changes", () => {
    render(<PhoneInput />);
    const input = getPhoneInput();
    fireEvent.change(input, { target: { value: "4155552671" } });
    expect(input).toHaveValue("(415) 555-2671");
    openDropdown();
    fireEvent.mouseDown(screen.getByText("United Kingdom"));
    expect(input).toHaveValue("");
  });
});

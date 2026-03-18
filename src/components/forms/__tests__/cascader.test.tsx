import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Cascader, type CascaderOption } from "../cascader";

const options: CascaderOption[] = [
  {
    label: "United States",
    value: "us",
    children: [
      {
        label: "California",
        value: "ca",
        children: [
          { label: "Los Angeles", value: "la" },
          { label: "San Francisco", value: "sf" },
        ],
      },
      {
        label: "New York",
        value: "ny",
        children: [
          { label: "New York City", value: "nyc" },
          { label: "Buffalo", value: "buf" },
        ],
      },
    ],
  },
  {
    label: "Canada",
    value: "ca-country",
    children: [
      {
        label: "Ontario",
        value: "on",
        children: [
          { label: "Toronto", value: "tor" },
          { label: "Ottawa", value: "ott" },
        ],
      },
    ],
  },
  {
    label: "Mexico",
    value: "mx",
    disabled: true,
    children: [
      { label: "Mexico City", value: "mxc" },
    ],
  },
];

describe("Cascader", () => {
  it("renders without error", () => {
    render(<Cascader options={options} />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("shows placeholder text when nothing selected", () => {
    render(<Cascader options={options} placeholder="Pick a location" />);
    expect(screen.getByText("Pick a location")).toBeInTheDocument();
  });

  it("opens dropdown on click", async () => {
    const user = userEvent.setup();
    render(<Cascader options={options} />);

    await user.click(screen.getByRole("combobox"));
    expect(screen.getByRole("combobox")).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("shows first column options when opened", async () => {
    const user = userEvent.setup();
    render(<Cascader options={options} />);

    await user.click(screen.getByRole("combobox"));
    expect(screen.getByText("United States")).toBeInTheDocument();
    expect(screen.getByText("Canada")).toBeInTheDocument();
  });

  it("expands child column on option click", async () => {
    const user = userEvent.setup();
    render(<Cascader options={options} />);

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByText("United States"));
    expect(screen.getByText("California")).toBeInTheDocument();
    expect(screen.getByText("New York")).toBeInTheDocument();
  });

  it("selects a leaf node and closes dropdown", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Cascader options={options} onChange={onChange} />);

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByText("United States"));
    await user.click(screen.getByText("California"));
    await user.click(screen.getByText("Los Angeles"));

    expect(onChange).toHaveBeenCalledWith(
      ["us", "ca", "la"],
      expect.arrayContaining([
        expect.objectContaining({ value: "us" }),
        expect.objectContaining({ value: "ca" }),
        expect.objectContaining({ value: "la" }),
      ]),
    );
    expect(screen.getByText("United States / California / Los Angeles")).toBeInTheDocument();
  });

  it("supports controlled value", () => {
    render(
      <Cascader options={options} value={["us", "ny", "nyc"]} />,
    );
    expect(
      screen.getByText("United States / New York / New York City"),
    ).toBeInTheDocument();
  });

  it("supports uncontrolled defaultValue", () => {
    render(
      <Cascader options={options} defaultValue={["us", "ca", "sf"]} />,
    );
    expect(
      screen.getByText("United States / California / San Francisco"),
    ).toBeInTheDocument();
  });

  it("supports custom displayRender", () => {
    render(
      <Cascader
        options={options}
        value={["us", "ca", "la"]}
        displayRender={(labels) => labels.join(" -> ")}
      />,
    );
    expect(
      screen.getByText("United States -> California -> Los Angeles"),
    ).toBeInTheDocument();
  });

  it("closes on outside click", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Cascader options={options} />
        <button type="button">Outside</button>
      </div>,
    );

    await user.click(screen.getByRole("combobox"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    await user.click(screen.getByText("Outside"));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("disables interaction when disabled", async () => {
    const user = userEvent.setup();
    render(<Cascader options={options} disabled />);

    const combobox = screen.getByRole("combobox");
    expect(combobox).toHaveAttribute("aria-disabled", "true");
    expect(combobox).toHaveAttribute("tabindex", "-1");

    await user.click(combobox);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("does not allow clicking disabled options", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Cascader options={options} onChange={onChange} />);

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByText("Mexico"));
    // Should not trigger onChange for disabled options
    expect(onChange).not.toHaveBeenCalled();
  });

  it("merges className", () => {
    render(<Cascader options={options} className="my-custom-class" />);
    const wrapper = screen.getByRole("combobox").parentElement?.parentElement;
    expect(wrapper?.className).toContain("my-custom-class");
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<Cascader ref={ref} options={options} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  // ── Sizes ──

  it.each(["sm", "md", "lg"] as const)("renders %s size", (size) => {
    render(<Cascader options={options} size={size} />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  // ── Search ──

  it("filters options when searchable", async () => {
    const user = userEvent.setup();
    render(<Cascader options={options} searchable />);

    await user.click(screen.getByRole("combobox"));
    const input = screen.getByLabelText("Search options");
    await user.type(input, "Toronto");
    expect(screen.getByText(/Toronto/)).toBeInTheDocument();
  });

  it("shows no results message when search has no matches", async () => {
    const user = userEvent.setup();
    render(<Cascader options={options} searchable />);

    await user.click(screen.getByRole("combobox"));
    const input = screen.getByLabelText("Search options");
    await user.type(input, "zzzzzzz");
    expect(screen.getByText("No results found.")).toBeInTheDocument();
  });

  // ── Keyboard ──

  it("opens on Enter key", async () => {
    const user = userEvent.setup();
    render(<Cascader options={options} />);

    screen.getByRole("combobox").focus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("closes on Escape key", async () => {
    const user = userEvent.setup();
    render(<Cascader options={options} />);

    await user.click(screen.getByRole("combobox"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  // ── Accessibility ──

  it("has correct ARIA attributes", () => {
    render(<Cascader options={options} />);
    const combobox = screen.getByRole("combobox");
    expect(combobox).toHaveAttribute("aria-expanded", "false");
    expect(combobox).toHaveAttribute("aria-haspopup", "listbox");
  });

  it("sets aria-expanded to true when open", async () => {
    const user = userEvent.setup();
    render(<Cascader options={options} />);

    await user.click(screen.getByRole("combobox"));
    expect(screen.getByRole("combobox")).toHaveAttribute("aria-expanded", "true");
  });

  // ── Hover expand trigger ──

  it("expands on hover when expandTrigger is hover", async () => {
    const user = userEvent.setup();
    render(<Cascader options={options} expandTrigger="hover" />);

    await user.click(screen.getByRole("combobox"));
    await user.hover(screen.getByText("United States"));
    // Should show children after hover
    expect(screen.getByText("California")).toBeInTheDocument();
  });
});

import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MobileFilterSheet } from "./mobile-filter-sheet";

const meta = {
  title: "Feedback/MobileFilterSheet",
  component: MobileFilterSheet,
  tags: ["autodocs"],
  argTypes: {
    collapseAt: {
      control: "select",
      options: ["md", "lg", "xl", "@640px", "@768px", "@900px", "@1024px", "@1050px"],
    },
    activeCount: { control: "number" },
    label: { control: "text" },
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
} satisfies Meta<typeof MobileFilterSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

function FilterDemo({
  label = "Filters",
  activeCount: initialCount = 0,
  collapseAt,
}: {
  label?: string;
  activeCount?: number;
  collapseAt?: "md" | "lg" | "xl";
}) {
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const activeCount = initialCount || sizes.length + colors.length;

  const toggleSize = (s: string) =>
    setSizes((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  const toggleColor = (c: string) =>
    setColors((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  return (
    <MobileFilterSheet label={label} activeCount={activeCount} collapseAt={collapseAt}>
      <MobileFilterSheet.Section label="Size">
        {["XS", "S", "M", "L", "XL"].map((s) => (
          <MobileFilterSheet.Pill key={s} active={sizes.includes(s)} onClick={() => toggleSize(s)}>
            {s}
          </MobileFilterSheet.Pill>
        ))}
      </MobileFilterSheet.Section>
      <MobileFilterSheet.Section label="Color">
        {["Red", "Blue", "Green", "Black", "White"].map((c) => (
          <MobileFilterSheet.Pill key={c} active={colors.includes(c)} onClick={() => toggleColor(c)}>
            {c}
          </MobileFilterSheet.Pill>
        ))}
      </MobileFilterSheet.Section>
    </MobileFilterSheet>
  );
}

export const Default: Story = {
  args: { children: null, label: "Filters" },
  render: (args) => <FilterDemo label={args.label} collapseAt={args.collapseAt as "md" | "lg" | "xl"} />,
};

export const WithActiveFilters: Story = {
  args: { children: null, label: "Filters", activeCount: 3 },
  render: (args) => <FilterDemo label={args.label} activeCount={args.activeCount} />,
};

export const CustomLabel: Story = {
  args: { children: null, label: "Sort & Filter" },
  render: (args) => <FilterDemo label={args.label ?? "Sort & Filter"} />,
};

export const NoLabel: Story = {
  args: { children: null },
  render: () => <FilterDemo label="" />,
};

export const ManySections: Story = {
  args: { children: null, label: "Filters" },
  render: (args) => (
    <MobileFilterSheet label={args.label ?? "Filters"} activeCount={2}>
      <MobileFilterSheet.Section label="Category">
        {["Electronics", "Clothing", "Books", "Home", "Sports"].map((c) => (
          <MobileFilterSheet.Pill key={c} active={c === "Electronics"} onClick={() => {}}>
            {c}
          </MobileFilterSheet.Pill>
        ))}
      </MobileFilterSheet.Section>
      <MobileFilterSheet.Section label="Price Range">
        {["Under $25", "$25-$50", "$50-$100", "$100+"].map((p) => (
          <MobileFilterSheet.Pill key={p} active={p === "$25-$50"} onClick={() => {}}>
            {p}
          </MobileFilterSheet.Pill>
        ))}
      </MobileFilterSheet.Section>
      <MobileFilterSheet.Section label="Rating">
        {["4+ Stars", "3+ Stars", "2+ Stars", "Any"].map((r) => (
          <MobileFilterSheet.Pill key={r} active={false} onClick={() => {}}>
            {r}
          </MobileFilterSheet.Pill>
        ))}
      </MobileFilterSheet.Section>
      <MobileFilterSheet.Section label="Brand">
        {["Nike", "Adidas", "Puma", "Reebok", "Under Armour"].map((b) => (
          <MobileFilterSheet.Pill key={b} active={false} onClick={() => {}}>
            {b}
          </MobileFilterSheet.Pill>
        ))}
      </MobileFilterSheet.Section>
    </MobileFilterSheet>
  ),
};

export const SingleSection: Story = {
  args: { children: null, label: "Sort" },
  render: (args) => (
    <MobileFilterSheet label={args.label ?? "Sort"}>
      <MobileFilterSheet.Section label="Sort By">
        {["Newest", "Price: Low to High", "Price: High to Low", "Most Popular"].map((s) => (
          <MobileFilterSheet.Pill key={s} active={s === "Newest"} onClick={() => {}}>
            {s}
          </MobileFilterSheet.Pill>
        ))}
      </MobileFilterSheet.Section>
    </MobileFilterSheet>
  ),
};

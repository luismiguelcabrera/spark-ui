import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { Accordion } from "../accordion";

describe("Accordion (legacy API)", () => {
  const items = [
    { title: "Section 1", content: "Content 1" },
    { title: "Section 2", content: "Content 2" },
  ];

  it("renders all item titles", () => {
    render(<Accordion items={items} />);
    expect(screen.getByText("Section 1")).toBeInTheDocument();
    expect(screen.getByText("Section 2")).toBeInTheDocument();
  });

  it("toggles content on click", async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} />);
    await user.click(screen.getByText("Section 1"));
    expect(screen.getByText("Content 1")).toBeInTheDocument();
  });
});

describe("Accordion (compound API)", () => {
  it("renders and toggles items", async () => {
    const user = userEvent.setup();
    render(
      <Accordion defaultValue={["a"]}>
        <Accordion.Item value="a" title="First">
          First content
        </Accordion.Item>
        <Accordion.Item value="b" title="Second">
          Second content
        </Accordion.Item>
      </Accordion>,
    );
    expect(screen.getByText("First content")).toBeInTheDocument();
    await user.click(screen.getByText("Second"));
    expect(screen.getByText("Second content")).toBeInTheDocument();
  });
});

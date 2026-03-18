import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { describe, it, expect } from "vitest";

import { Button } from "../components/forms/button";
import { Input } from "../components/forms/input";
import { InputGroup, InputLeftAddon, InputRightAddon } from "../components/forms/input-group";
import { Select } from "../components/forms/select";
import { Checkbox } from "../components/forms/checkbox";
import { Toggle } from "../components/forms/toggle";
import { MultiSelect } from "../components/forms/multi-select";
import { Badge } from "../components/data-display/badge";
import { Card } from "../components/data-display/card";
import { Avatar } from "../components/data-display/avatar";
import { ProgressBar } from "../components/data-display/progress-bar";
import { DataTable, type Column } from "../components/data-display/data-table";
import { Spinner } from "../components/feedback/spinner";
import { Toast } from "../components/feedback/toast";
import { Alert } from "../components/feedback/alert";
import { AlertBanner } from "../components/feedback/alert-banner";
import { Modal } from "../components/feedback/modal";
import { Pagination } from "../components/navigation/pagination";
import { Tabs } from "../components/navigation/tabs";
import { Accordion } from "../components/navigation/accordion";

expect.extend(toHaveNoViolations);

describe("Accessibility (axe)", () => {
  it("Button", async () => {
    const { container } = render(<Button>Click me</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Button (loading)", async () => {
    const { container } = render(<Button loading>Saving</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Button (icon-only with aria-label)", async () => {
    const { container } = render(<Button icon="add" size="icon" aria-label="Add item" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Button variants", async () => {
    const { container } = render(
      <div>
        <Button variant="solid">Solid</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="soft">Soft</Button>
        <Button variant="link">Link</Button>
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Input", async () => {
    const { container } = render(<Input label="Name" placeholder="Enter name" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Input (with error)", async () => {
    const { container } = render(<Input label="Email" error="Required" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("InputGroup (with addons)", async () => {
    const { container } = render(
      <InputGroup>
        <InputLeftAddon>https://</InputLeftAddon>
        <Input placeholder="example.com" aria-label="Website URL" />
        <InputRightAddon>.com</InputRightAddon>
      </InputGroup>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("InputGroup (with left addon)", async () => {
    const { container } = render(
      <InputGroup>
        <InputLeftAddon>$</InputLeftAddon>
        <Input placeholder="0.00" aria-label="Amount" type="number" />
      </InputGroup>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("MultiSelect (default)", async () => {
    const options = [
      { value: "a", label: "Alpha" },
      { value: "b", label: "Beta" },
    ];
    const { container } = render(
      <MultiSelect options={options} label="Choose" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("MultiSelect (with selections)", async () => {
    const options = [
      { value: "a", label: "Alpha" },
      { value: "b", label: "Beta" },
    ];
    const { container } = render(
      <MultiSelect options={options} value={["a"]} label="Choose" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Select", async () => {
    const { container } = render(
      <label>
        Pick one
        <Select>
          <option value="a">Alpha</option>
          <option value="b">Beta</option>
        </Select>
      </label>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Checkbox", async () => {
    const { container } = render(<Checkbox label="Agree" id="agree" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Toggle", async () => {
    const { container } = render(<Toggle label="Notifications" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Badge", async () => {
    const { container } = render(<Badge>Active</Badge>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Card", async () => {
    const { container } = render(<Card title="Title">Content</Card>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Avatar", async () => {
    const { container } = render(<Avatar initials="JD" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("ProgressBar", async () => {
    const { container } = render(<ProgressBar value={50} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("DataTable (with sortable columns)", async () => {
    type Row = { name: string; score: number };
    const cols: Column<Row>[] = [
      { key: "name", header: "Name", render: (r) => r.name, sortable: true },
      { key: "score", header: "Score", render: (r) => String(r.score) },
    ];
    const data = [
      { name: "Alice", score: 95 },
      { name: "Bob", score: 80 },
    ];
    const { container } = render(
      <DataTable columns={cols} data={data} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Spinner", async () => {
    const { container } = render(<Spinner />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Toast", async () => {
    const { container } = render(<Toast title="Done" description="Saved." variant="success" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Alert (info)", async () => {
    const { container } = render(<Alert>This is an informational alert.</Alert>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Alert (with title)", async () => {
    const { container } = render(<Alert variant="success" title="Done">Saved successfully.</Alert>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Alert (dismissible)", async () => {
    const { container } = render(<Alert dismissible onDismiss={() => {}}>Dismissible alert</Alert>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Alert variants", async () => {
    const { container } = render(
      <div>
        <Alert variant="info">Info</Alert>
        <Alert variant="success">Success</Alert>
        <Alert variant="warning">Warning</Alert>
        <Alert variant="error">Error</Alert>
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("AlertBanner", async () => {
    const { container } = render(<AlertBanner title="Warning" variant="warning" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Modal (inline)", async () => {
    const { container } = render(<Modal title="Confirm">Are you sure?</Modal>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Pagination", async () => {
    const { container } = render(<Pagination total={100} pageSize={10} defaultCurrent={1} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Tabs (legacy)", async () => {
    const { container } = render(
      <Tabs tabs={[
        { label: "Tab 1", value: "t1", active: true },
        { label: "Tab 2", value: "t2" },
      ]} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Tabs (compound)", async () => {
    const { container } = render(
      <Tabs defaultValue="a">
        <Tabs.List>
          <Tabs.Tab value="a">First</Tabs.Tab>
          <Tabs.Tab value="b">Second</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="a">Panel A</Tabs.Panel>
      </Tabs>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Tabs (vertical compound)", async () => {
    const { container } = render(
      <Tabs defaultValue="a" orientation="vertical">
        <Tabs.List>
          <Tabs.Tab value="a">General</Tabs.Tab>
          <Tabs.Tab value="b">Security</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="a">General content</Tabs.Panel>
      </Tabs>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Tabs (vertical legacy)", async () => {
    const { container } = render(
      <Tabs
        orientation="vertical"
        tabs={[
          { label: "Tab 1", value: "t1", active: true },
          { label: "Tab 2", value: "t2" },
        ]}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Accordion (legacy)", async () => {
    const { container } = render(
      <Accordion items={[
        { title: "Q1", content: "A1" },
        { title: "Q2", content: "A2" },
      ]} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Accordion (compound)", async () => {
    const { container } = render(
      <Accordion defaultValue={["a"]}>
        <Accordion.Item value="a" title="First">Content A</Accordion.Item>
        <Accordion.Item value="b" title="Second">Content B</Accordion.Item>
      </Accordion>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

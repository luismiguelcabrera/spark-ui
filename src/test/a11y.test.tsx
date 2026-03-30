import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { describe, it, expect } from "vitest";
import { Parallax } from "../components/data-display/parallax";

import { Button } from "../components/forms/button";
import { Input } from "../components/forms/input";
import { InputGroup, InputLeftAddon, InputRightAddon } from "../components/forms/input-group";
import { Select } from "../components/forms/select";
import { Checkbox } from "../components/forms/checkbox";
import { Toggle } from "../components/forms/toggle";
import { MultiSelect } from "../components/forms/multi-select";
import { Badge } from "../components/data-display/badge";
import { Image } from "../components/data-display/image";
import { SortableList } from "../components/data-display/sortable-list";
import { VirtualList } from "../components/data-display/virtual-list";
import { Card } from "../components/data-display/card";
import { Avatar } from "../components/data-display/avatar";
import { ProgressBar } from "../components/data-display/progress-bar";
import { ProgressSteps } from "../components/data-display/progress-steps";
import { DataTable, type Column } from "../components/data-display/data-table";
import { Spinner } from "../components/feedback/spinner";
import { Toast } from "../components/feedback/toast";
import { Alert } from "../components/feedback/alert";
import { AlertBanner } from "../components/feedback/alert-banner";
import { Modal } from "../components/feedback/modal";
import { Dialog } from "../components/feedback/dialog";
import { Tooltip } from "../components/feedback/tooltip";
import { Overlay } from "../components/feedback/overlay";
import { BottomSheet } from "../components/feedback/bottom-sheet";
import { Banner } from "../components/feedback/banner";
import { Breadcrumb } from "../components/navigation/breadcrumb";
import { Pagination } from "../components/navigation/pagination";
import { Tabs } from "../components/navigation/tabs";
import { Accordion } from "../components/navigation/accordion";
import { RangeSlider } from "../components/forms/range-slider";
import { ConfirmEdit } from "../components/forms/confirm-edit";
import { MaskInput } from "../components/forms/mask-input";
import { Fab } from "../components/forms/fab";
import { Footer } from "../components/navigation/footer";
import { SystemBar } from "../components/navigation/system-bar";
import { SlideGroup } from "../components/navigation/slide-group";
import { ItemGroup, ItemGroupItem } from "../components/navigation/item-group";

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

  it("Image (with src)", async () => {
    const { container } = render(
      <Image src="/test.jpg" alt="Test image" width={200} height={150} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Image (no src — fallback)", async () => {
    const { container } = render(
      <Image alt="Missing image" width={200} height={150} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("SortableList", async () => {
    const items = [
      { id: "1", title: "First" },
      { id: "2", title: "Second" },
    ];
    const { container } = render(
      <SortableList
        items={items}
        onReorder={() => {}}
        renderItem={(item, handle) => (
          <div className="flex items-center gap-2 p-2 flex-1">
            {handle}
            <span>{item.title}</span>
          </div>
        )}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("VirtualList", async () => {
    const items = Array.from({ length: 50 }, (_, i) => ({ id: `${i}`, label: `Item ${i}` }));
    const { container } = render(
      <VirtualList
        items={items}
        itemHeight={40}
        height={200}
        renderItem={(item) => <div className="px-4 py-2">{item.label}</div>}
        getKey={(item) => item.id}
      />,
    );
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

  it("ProgressSteps", async () => {
    const steps = [
      { label: "Step 1" },
      { label: "Step 2" },
      { label: "Step 3" },
    ];
    const { container } = render(
      <ProgressSteps steps={steps} value={50} />,
    );
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

  it("Dialog (default)", async () => {
    const { container } = render(
      <Dialog
        open={true}
        onOpenChange={() => {}}
        title="Confirm action"
        description="Are you sure?"
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Dialog (danger, no cancel)", async () => {
    const { container } = render(
      <Dialog
        open={true}
        onOpenChange={() => {}}
        title="Delete?"
        variant="danger"
        showCancel={false}
        confirmText="Delete"
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Tooltip (open)", async () => {
    const { container } = render(
      <Tooltip content="Help text" open={true}>
        <button type="button">Trigger</button>
      </Tooltip>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Tooltip (light variant)", async () => {
    const { container } = render(
      <Tooltip content="Light tip" open={true} variant="light">
        <span>Info</span>
      </Tooltip>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Breadcrumb (basic)", async () => {
    const { container } = render(
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: "Widget" },
        ]}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Breadcrumb (with icons)", async () => {
    const { container } = render(
      <Breadcrumb
        items={[
          { label: "Home", href: "/", icon: "home" },
          { label: "Settings" },
        ]}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Breadcrumb (collapsed)", async () => {
    const { container } = render(
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "A", href: "/a" },
          { label: "B", href: "/b" },
          { label: "C", href: "/c" },
          { label: "Current" },
        ]}
        maxItems={3}
      />,
    );
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

  it("Footer", async () => {
    const { container } = render(
      <Footer bordered>
        <p>Copyright 2024</p>
      </Footer>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Footer (fixed)", async () => {
    const { container } = render(
      <Footer fixed bordered>
        <p>Fixed footer</p>
      </Footer>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("SystemBar", async () => {
    const { container } = render(
      <SystemBar>9:41 AM</SystemBar>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("SystemBar (window mode)", async () => {
    const { container } = render(
      <SystemBar window color="bg-blue-600">My App</SystemBar>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("SlideGroup", async () => {
    const { container } = render(
      <SlideGroup>
        <span>Item 1</span>
        <span>Item 2</span>
        <span>Item 3</span>
      </SlideGroup>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("ItemGroup", async () => {
    const { container } = render(
      <ItemGroup>
        <ItemGroupItem value="a">Alpha</ItemGroupItem>
        <ItemGroupItem value="b">Beta</ItemGroupItem>
      </ItemGroup>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("ItemGroup (with selection)", async () => {
    const { container } = render(
      <ItemGroup defaultValue="a">
        <ItemGroupItem value="a">Alpha</ItemGroupItem>
        <ItemGroupItem value="b">Beta</ItemGroupItem>
      </ItemGroup>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("RangeSlider", async () => {
    const { container } = render(
      <RangeSlider defaultValue={[20, 80]} label="Price range" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("ConfirmEdit", async () => {
    const { container } = render(
      <ConfirmEdit value="Editable text" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("MaskInput", async () => {
    const { container } = render(
      <MaskInput mask="(999) 999-9999" label="Phone" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Fab", async () => {
    const { container } = render(
      <Fab icon="plus" aria-label="Add item" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Fab (extended)", async () => {
    const { container } = render(
      <Fab icon="plus" extended label="Create new" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Overlay (open)", async () => {
    const { container } = render(
      <Overlay open={true} onOpenChange={() => {}}>
        <div>Overlay content</div>
      </Overlay>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Overlay (with blur)", async () => {
    const { container } = render(
      <Overlay open={true} onOpenChange={() => {}} blur>
        <div>Blurred overlay</div>
      </Overlay>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("BottomSheet (open with title)", async () => {
    const { container } = render(
      <BottomSheet open={true} onOpenChange={() => {}} title="Actions">
        <p>Sheet content</p>
      </BottomSheet>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("BottomSheet (fullscreen)", async () => {
    const { container } = render(
      <BottomSheet open={true} onOpenChange={() => {}} title="Full" fullscreen>
        <p>Fullscreen content</p>
      </BottomSheet>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Banner (info)", async () => {
    const { container } = render(
      <Banner text="System update available." color="info" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Banner (all colors)", async () => {
    const { container } = render(
      <div>
        <Banner text="Info" color="info" />
        <Banner text="Warning" color="warning" />
        <Banner text="Danger" color="danger" />
        <Banner text="Success" color="success" />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Banner (dismissible)", async () => {
    const { container } = render(
      <Banner text="Dismissible" color="info" dismissible onDismiss={() => {}} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Parallax (with alt)", async () => {
    const { container } = render(
      <Parallax src="/test.jpg" alt="Mountain" height={400} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Parallax (decorative)", async () => {
    const { container } = render(
      <Parallax src="/bg.jpg" height={300} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

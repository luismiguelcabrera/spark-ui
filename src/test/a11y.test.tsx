import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { describe, it, expect } from "vitest";
import { FieldLabel } from "../components/forms/field-label";
import { FieldDescription } from "../components/forms/field-description";
import { FieldError } from "../components/forms/field-error";
import { Transfer } from "../components/data-display/transfer";
import { Descriptions } from "../components/data-display/descriptions";
import { Galleria } from "../components/data-display/galleria";
import { Cascader } from "../components/forms/cascader";
import { TreeSelect } from "../components/forms/tree-select";
import { SplitButton } from "../components/forms/split-button";
import { BarChart } from "../components/data-display/charts/bar-chart";
import { LineChart } from "../components/data-display/charts/line-chart";
import { AreaChart } from "../components/data-display/charts/area-chart";
import { DonutChart } from "../components/data-display/charts/donut-chart";
import { Result } from "../components/feedback/result";
import { NavigationProgress } from "../components/feedback/navigation-progress";
import { Tour } from "../components/feedback/tour";
import { Parallax } from "../components/data-display/parallax";
import { Window } from "../components/data-display/window";
import { Pie } from "../components/data-display/pie";
import { Video } from "../components/data-display/video";

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

  it("Window (default)", async () => {
    const { container } = render(
      <Window defaultValue="a">
        <Window.Item value="a">Panel A</Window.Item>
        <Window.Item value="b">Panel B</Window.Item>
      </Window>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Window (controlled)", async () => {
    const { container } = render(
      <Window value="b" onValueChange={() => {}}>
        <Window.Item value="a">Alpha</Window.Item>
        <Window.Item value="b">Beta</Window.Item>
      </Window>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Pie (basic)", async () => {
    const { container } = render(
      <Pie
        data={[
          { value: 60, color: "#3b82f6", label: "Blue" },
          { value: 40, color: "#ef4444", label: "Red" },
        ]}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Pie (donut with center)", async () => {
    const { container } = render(
      <Pie
        data={[
          { value: 70, color: "#22c55e", label: "Complete" },
          { value: 30, color: "#e2e8f0", label: "Remaining" },
        ]}
        donut
        strokeWidth={30}
      >
        <span>70%</span>
      </Pie>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  // Video a11y tests skipped — axe + <video> in jsdom causes timeouts.
  // The Video component wraps a native <video> element with no custom ARIA needed.

  it("Result - success", async () => {
    const { container } = render(
      <Result status="success" title="Success" subtitle="It worked." />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Result - error", async () => {
    const { container } = render(
      <Result status="error" title="Error" subtitle="Something failed." />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Result - 404", async () => {
    const { container } = render(
      <Result status="404" title="Not Found" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("NavigationProgress - loading", async () => {
    const { container } = render(<NavigationProgress loading />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("NavigationProgress - determinate", async () => {
    const { container } = render(<NavigationProgress progress={50} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Tour - open", async () => {
    const { container } = render(
      <Tour
        steps={[
          { title: "Step 1", description: "Description 1" },
          { title: "Step 2", description: "Description 2" },
        ]}
        open
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("BarChart (vertical)", async () => {
    const { container } = render(
      <BarChart data={[{ label: "Jan", value: 100 }, { label: "Feb", value: 200 }]} animate={false} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("BarChart (horizontal)", async () => {
    const { container } = render(
      <BarChart data={[{ label: "Jan", value: 100 }, { label: "Feb", value: 200 }]} orientation="horizontal" animate={false} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("BarChart (empty)", async () => {
    const { container } = render(<BarChart data={[]} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("LineChart (default)", async () => {
    const { container } = render(
      <LineChart data={[{ label: "Jan", value: 100 }, { label: "Feb", value: 200 }]} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("LineChart (with area)", async () => {
    const { container } = render(
      <LineChart data={[{ label: "Jan", value: 100 }, { label: "Feb", value: 200 }]} showArea smooth />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("LineChart (empty)", async () => {
    const { container } = render(<LineChart data={[]} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("AreaChart (single series)", async () => {
    const { container } = render(
      <AreaChart data={[{ label: "Jan", value: 100 }, { label: "Feb", value: 200 }]} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("AreaChart (multi series)", async () => {
    const { container } = render(
      <AreaChart
        series={[
          { data: [{ label: "Jan", value: 100 }], name: "A", color: "#6366f1" },
          { data: [{ label: "Jan", value: 80 }], name: "B", color: "#10b981" },
        ]}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("AreaChart (empty)", async () => {
    const { container } = render(<AreaChart data={[]} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("DonutChart (default)", async () => {
    const donutData = [
      { label: "React", value: 45, color: "#6366f1" },
      { label: "Vue", value: 25, color: "#10b981" },
    ];
    const { container } = render(<DonutChart data={donutData} animate={false} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("DonutChart (with legend)", async () => {
    const donutData = [
      { label: "React", value: 45, color: "#6366f1" },
      { label: "Vue", value: 25, color: "#10b981" },
    ];
    const { container } = render(<DonutChart data={donutData} showLegend animate={false} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("DonutChart (with center label)", async () => {
    const donutData = [
      { label: "React", value: 45, color: "#6366f1" },
      { label: "Vue", value: 25, color: "#10b981" },
    ];
    const { container } = render(
      <DonutChart data={donutData} centerLabel={<span>Total</span>} animate={false} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("DonutChart (empty)", async () => {
    const { container } = render(<DonutChart data={[]} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Cascader (default)", async () => {
    const cascaderOptions = [
      { label: "US", value: "us", children: [{ label: "CA", value: "ca", children: [{ label: "LA", value: "la" }] }] },
      { label: "Canada", value: "canada" },
    ];
    const { container } = render(<Cascader options={cascaderOptions} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Cascader (disabled)", async () => {
    const { container } = render(<Cascader options={[]} disabled />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("TreeSelect (default)", async () => {
    const treeData = [
      { label: "Docs", value: "docs", children: [{ label: "README", value: "readme" }] },
      { label: "photo.png", value: "photo" },
    ];
    const { container } = render(<TreeSelect data={treeData} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("TreeSelect (disabled)", async () => {
    const { container } = render(<TreeSelect data={[]} disabled />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("SplitButton (default)", async () => {
    const actions = [{ label: "Draft", value: "draft" }, { label: "Publish", value: "publish" }];
    const { container } = render(<SplitButton actions={actions}>Save</SplitButton>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("SplitButton (disabled)", async () => {
    const actions = [{ label: "Draft", value: "draft" }];
    const { container } = render(<SplitButton actions={actions} disabled>Save</SplitButton>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("SplitButton (loading)", async () => {
    const actions = [{ label: "Draft", value: "draft" }];
    const { container } = render(<SplitButton actions={actions} loading>Save</SplitButton>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Transfer (default)", async () => {
    const items = [
      { key: "a", label: "Alpha" },
      { key: "b", label: "Beta" },
    ];
    const { container } = render(<Transfer dataSource={items} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Transfer (with search)", async () => {
    const items = [
      { key: "a", label: "Alpha" },
      { key: "b", label: "Beta" },
    ];
    const { container } = render(<Transfer dataSource={items} searchable />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Transfer (with target keys)", async () => {
    const items = [
      { key: "a", label: "Alpha" },
      { key: "b", label: "Beta" },
    ];
    const { container } = render(
      <Transfer dataSource={items} defaultTargetKeys={["a"]} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Descriptions (default)", async () => {
    const items = [
      { label: "Name", children: "John Doe" },
      { label: "Email", children: "john@example.com" },
    ];
    const { container } = render(<Descriptions items={items} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Descriptions (bordered)", async () => {
    const items = [
      { label: "Name", children: "John Doe" },
      { label: "Email", children: "john@example.com" },
    ];
    const { container } = render(<Descriptions items={items} bordered />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Descriptions (with title)", async () => {
    const items = [
      { label: "Name", children: "John Doe" },
    ];
    const { container } = render(
      <Descriptions items={items} title="User Info" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Galleria (default)", async () => {
    const images = [
      { src: "/img1.jpg", alt: "Image 1" },
      { src: "/img2.jpg", alt: "Image 2" },
    ];
    const { container } = render(<Galleria images={images} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Galleria (with indicators)", async () => {
    const images = [
      { src: "/img1.jpg", alt: "Image 1" },
      { src: "/img2.jpg", alt: "Image 2" },
    ];
    const { container } = render(
      <Galleria images={images} showIndicators showThumbnails={false} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Galleria (empty)", async () => {
    const { container } = render(<Galleria images={[]} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("FieldLabel (default)", async () => {
    const { container } = render(<FieldLabel>Email</FieldLabel>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("FieldLabel (required with htmlFor)", async () => {
    const { container } = render(
      <div>
        <FieldLabel required htmlFor="email-input">Email</FieldLabel>
        <input id="email-input" type="email" />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("FieldDescription", async () => {
    const { container } = render(
      <FieldDescription>Helper text for the field</FieldDescription>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("FieldError (with message)", async () => {
    const { container } = render(
      <FieldError>This field is required</FieldError>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("FieldError (empty — renders nothing)", async () => {
    const { container } = render(<FieldError>{null}</FieldError>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Full field group", async () => {
    const { container } = render(
      <div>
        <FieldLabel htmlFor="email-field" required>Email</FieldLabel>
        <input id="email-field" type="email" aria-describedby="email-desc email-err" />
        <FieldDescription id="email-desc">Enter your email</FieldDescription>
        <FieldError id="email-err">Invalid email address</FieldError>
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

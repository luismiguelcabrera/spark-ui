import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SortableList, type SortableItem } from "./sortable-list";
import { Icon } from "./icon";
import { Badge } from "./badge";

type Task = SortableItem & { title: string; priority: "low" | "medium" | "high" };

const initialTasks: Task[] = [
  { id: "1", title: "Design landing page", priority: "high" },
  { id: "2", title: "Write API docs", priority: "medium" },
  { id: "3", title: "Fix login bug", priority: "high" },
  { id: "4", title: "Update dependencies", priority: "low" },
  { id: "5", title: "Add unit tests", priority: "medium" },
];

const meta = {
  title: "Data Display/SortableList",
  component: SortableList,
  tags: ["autodocs"],
} satisfies Meta<typeof SortableList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [items, setItems] = useState(initialTasks);
    return (
      <div className="max-w-md">
        <SortableList
          items={items}
          onReorder={setItems}
          renderItem={(item, handle) => (
            <div className="flex items-center gap-3 p-3 flex-1">
              {handle}
              <span className="text-sm font-medium text-slate-700">{item.title}</span>
            </div>
          )}
        />
      </div>
    );
  },
};

export const WithBadges: Story = {
  render: () => {
    const [items, setItems] = useState(initialTasks);
    const priorityVariant = {
      high: "danger" as const,
      medium: "warning" as const,
      low: "secondary" as const,
    };
    return (
      <div className="max-w-lg">
        <SortableList
          items={items}
          onReorder={setItems}
          renderItem={(item, handle) => (
            <div className="flex items-center gap-3 p-3 flex-1">
              {handle}
              <span className="text-sm font-medium text-slate-700 flex-1">
                {item.title}
              </span>
              <Badge variant={priorityVariant[item.priority]} size="sm">
                {item.priority}
              </Badge>
            </div>
          )}
        />
      </div>
    );
  },
};

export const WithIcons: Story = {
  render: () => {
    type IconItem = SortableItem & { title: string; icon: string };
    const initial: IconItem[] = [
      { id: "a", title: "Dashboard", icon: "layout-dashboard" },
      { id: "b", title: "Users", icon: "user" },
      { id: "c", title: "Settings", icon: "settings" },
      { id: "d", title: "Analytics", icon: "bar-chart" },
    ];
    const [items, setItems] = useState(initial);
    return (
      <div className="max-w-sm">
        <SortableList
          items={items}
          onReorder={setItems}
          renderItem={(item, handle) => (
            <div className="flex items-center gap-3 p-3 flex-1">
              {handle}
              <Icon name={item.icon} size="md" className="text-slate-500" />
              <span className="text-sm font-medium text-slate-700">
                {item.title}
              </span>
            </div>
          )}
        />
      </div>
    );
  },
};

export const CardStyle: Story = {
  render: () => {
    const [items, setItems] = useState(initialTasks);
    return (
      <div className="max-w-md">
        <SortableList
          items={items}
          onReorder={setItems}
          className="gap-2"
          renderItem={(item, handle) => (
            <div className="flex items-center gap-3 p-3 flex-1 bg-white border border-slate-200 rounded-xl shadow-sm">
              {handle}
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                <p className="text-xs text-slate-500">Task #{item.id}</p>
              </div>
            </div>
          )}
        />
      </div>
    );
  },
};

export const WithLabelKey: Story = {
  name: "Label Key (no renderItem)",
  render: () => {
    const [items, setItems] = useState(initialTasks);
    return (
      <div className="max-w-md">
        <SortableList items={items} onReorder={setItems} labelKey="title" />
      </div>
    );
  },
};

export const LabelKeyFallback: Story = {
  name: "Label Key Fallback (uses id)",
  render: () => {
    const [items, setItems] = useState([
      { id: "alpha" },
      { id: "bravo" },
      { id: "charlie" },
    ]);
    return (
      <div className="max-w-sm">
        <SortableList items={items} onReorder={setItems} />
      </div>
    );
  },
};

export const CustomHandle: Story = {
  render: () => {
    const [items, setItems] = useState(initialTasks.slice(0, 4));
    return (
      <div className="max-w-md">
        <SortableList
          items={items}
          onReorder={setItems}
          showHandle={false}
          renderItem={(item, _handle, index) => (
            <div className="flex items-center gap-3 p-3 flex-1 bg-white border border-slate-200 rounded-lg">
              <div className="w-7 h-7 rounded-md bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 shrink-0 cursor-grab">
                {index + 1}
              </div>
              <span className="text-sm font-medium text-slate-700 flex-1">
                {item.title}
              </span>
              <Icon name="move" size="sm" className="text-slate-500" />
            </div>
          )}
        />
      </div>
    );
  },
};

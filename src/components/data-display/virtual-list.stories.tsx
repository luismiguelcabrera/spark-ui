import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { VirtualList } from "./virtual-list";
import { Avatar } from "./avatar";
import { Badge } from "./badge";

const meta = {
  title: "Data Display/VirtualList",
  component: VirtualList,
  tags: ["autodocs"],
} satisfies Meta<typeof VirtualList>;

export default meta;
type Story = StoryObj<typeof meta>;

// Generate large datasets
const simpleItems = Array.from({ length: 10000 }, (_, i) => ({
  id: `item-${i}`,
  label: `Item ${i + 1}`,
}));

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
};

const users: User[] = Array.from({ length: 5000 }, (_, i) => ({
  id: `user-${i}`,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: ["Admin", "Editor", "Viewer"][i % 3],
  status: i % 5 === 0 ? ("inactive" as const) : ("active" as const),
}));

export const Default: Story = {
  render: () => (
    <VirtualList
      items={simpleItems}
      itemHeight={40}
      height={400}
      renderItem={(item) => (
        <div className="px-4 py-2 text-sm text-slate-700 border-b border-slate-100 h-full flex items-center">
          {item.label}
        </div>
      )}
      getKey={(item) => item.id}
    />
  ),
};

export const TenThousandItems: Story = {
  name: "10,000 Items",
  render: () => (
    <div className="max-w-md">
      <p className="text-xs text-slate-500 mb-2">10,000 items — only visible ones render</p>
      <VirtualList
        items={simpleItems}
        itemHeight={36}
        height={300}
        className="border border-slate-200 rounded-xl"
        renderItem={(item, index) => (
          <div className="px-4 h-full flex items-center justify-between text-sm border-b border-slate-50">
            <span className="text-slate-700">{item.label}</span>
            <span className="text-xs text-slate-500">#{index + 1}</span>
          </div>
        )}
        getKey={(item) => item.id}
      />
    </div>
  ),
};

export const UserList: Story = {
  name: "5,000 Users",
  render: () => (
    <div className="max-w-lg">
      <VirtualList
        items={users}
        itemHeight={56}
        height={400}
        className="border border-slate-200 rounded-xl"
        renderItem={(user) => (
          <div className="px-4 h-full flex items-center gap-3 border-b border-slate-50">
            <Avatar initials={user.name.slice(0, 2)} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
            <Badge
              variant={user.status === "active" ? "success" : "secondary"}
              size="sm"
            >
              {user.status}
            </Badge>
          </div>
        )}
        getKey={(user) => user.id}
      />
    </div>
  ),
};

export const CustomWidth: Story = {
  render: () => (
    <VirtualList
      items={simpleItems.slice(0, 100)}
      itemHeight={40}
      height={250}
      width={300}
      className="border border-slate-200 rounded-lg"
      renderItem={(item) => (
        <div className="px-3 h-full flex items-center text-sm text-slate-600 border-b border-slate-100">
          {item.label}
        </div>
      )}
    />
  ),
};

export const HighOverscan: Story = {
  name: "High Overscan (10)",
  render: () => (
    <VirtualList
      items={simpleItems}
      itemHeight={40}
      height={300}
      overscan={10}
      className="border border-slate-200 rounded-xl"
      renderItem={(item) => (
        <div className="px-4 h-full flex items-center text-sm text-slate-700 border-b border-slate-50">
          {item.label}
        </div>
      )}
      getKey={(item) => item.id}
    />
  ),
};

export const WithSelection: Story = {
  render: () => {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    return (
      <div className="max-w-md">
        <p className="text-xs text-slate-500 mb-2">
          Click to select. Selected: {selectedId ?? "none"}
        </p>
        <VirtualList
          items={simpleItems.slice(0, 500)}
          itemHeight={40}
          height={300}
          className="border border-slate-200 rounded-xl"
          renderItem={(item) => (
            <button
              type="button"
              onClick={() => setSelectedId(item.id)}
              className={`px-4 h-full w-full flex items-center text-sm text-left border-b border-slate-50 transition-colors ${
                selectedId === item.id
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              {item.label}
            </button>
          )}
          getKey={(item) => item.id}
        />
      </div>
    );
  },
};

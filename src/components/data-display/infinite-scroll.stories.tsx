import { useState, useCallback } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { InfiniteScroll } from "./infinite-scroll";

const meta = {
  title: "Data Display/InfiniteScroll",
  component: InfiniteScroll,
  tags: ["autodocs"],
  argTypes: {
    hasMore: { control: "boolean" },
    loading: { control: "boolean" },
    threshold: { control: "number" },
  },
} satisfies Meta<typeof InfiniteScroll>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [items, setItems] = useState(() => Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`));
    const [loading, setLoading] = useState(false);
    const hasMore = items.length < 100;

    const loadMore = useCallback(() => {
      setLoading(true);
      setTimeout(() => {
        setItems((prev) => [
          ...prev,
          ...Array.from({ length: 20 }, (_, i) => `Item ${prev.length + i + 1}`),
        ]);
        setLoading(false);
      }, 1000);
    }, []);

    return (
      <InfiniteScroll
        hasMore={hasMore}
        loading={loading}
        onLoadMore={loadMore}
        className="max-h-96 overflow-auto border border-slate-200 rounded-xl"
        tabIndex={0}
      >
        {items.map((item) => (
          <div key={item} className="px-4 py-3 border-b border-slate-100 text-sm text-slate-700">
            {item}
          </div>
        ))}
      </InfiniteScroll>
    );
  },
};

export const WithEndMessage: Story = {
  render: () => {
    const [items, setItems] = useState(() => Array.from({ length: 10 }, (_, i) => `Item ${i + 1}`));
    const [loading, setLoading] = useState(false);
    const hasMore = items.length < 30;

    const loadMore = useCallback(() => {
      setLoading(true);
      setTimeout(() => {
        setItems((prev) => [
          ...prev,
          ...Array.from({ length: 10 }, (_, i) => `Item ${prev.length + i + 1}`),
        ]);
        setLoading(false);
      }, 800);
    }, []);

    return (
      <InfiniteScroll
        hasMore={hasMore}
        loading={loading}
        onLoadMore={loadMore}
        endMessage="You have reached the end."
        className="max-h-96 overflow-auto border border-slate-200 rounded-xl"
        tabIndex={0}
      >
        {items.map((item) => (
          <div key={item} className="px-4 py-3 border-b border-slate-100 text-sm text-slate-700">
            {item}
          </div>
        ))}
      </InfiniteScroll>
    );
  },
};

export const LoadingState: Story = {
  args: {
    hasMore: true,
    loading: true,
    onLoadMore: () => {},
    children: (
      <div>
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="px-4 py-3 border-b border-slate-100 text-sm text-slate-700">
            Item {i + 1}
          </div>
        ))}
      </div>
    ),
  },
};

export const CustomLoader: Story = {
  args: {
    hasMore: true,
    loading: true,
    onLoadMore: () => {},
    loader: (
      <div className="flex items-center gap-2 text-sm text-primary font-medium">
        <span className="animate-spin inline-block w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
        Fetching more data...
      </div>
    ),
    children: (
      <div>
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="px-4 py-3 border-b border-slate-100 text-sm text-slate-700">
            Item {i + 1}
          </div>
        ))}
      </div>
    ),
  },
};

export const NoMoreItems: Story = {
  args: {
    hasMore: false,
    loading: false,
    onLoadMore: () => {},
    endMessage: "No more items to load.",
    children: (
      <div>
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="px-4 py-3 border-b border-slate-100 text-sm text-slate-700">
            Item {i + 1}
          </div>
        ))}
      </div>
    ),
  },
};

export const CardLayout: Story = {
  render: () => {
    const [items, setItems] = useState(() => Array.from({ length: 12 }, (_, i) => i + 1));
    const [loading, setLoading] = useState(false);
    const hasMore = items.length < 48;

    const loadMore = useCallback(() => {
      setLoading(true);
      setTimeout(() => {
        setItems((prev) => [
          ...prev,
          ...Array.from({ length: 12 }, (_, i) => prev.length + i + 1),
        ]);
        setLoading(false);
      }, 1000);
    }, []);

    return (
      <InfiniteScroll
        hasMore={hasMore}
        loading={loading}
        onLoadMore={loadMore}
        endMessage="All items loaded."
        className="max-h-[500px] overflow-auto"
      >
        <div className="grid grid-cols-3 gap-3 p-3">
          {items.map((num) => (
            <div
              key={num}
              className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm"
            >
              <div className="text-2xl font-bold text-primary">{num}</div>
              <div className="text-xs text-slate-500 mt-1">Card {num}</div>
            </div>
          ))}
        </div>
      </InfiniteScroll>
    );
  },
};

import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ErrorBoundary } from "./error-boundary";

const meta = {
  title: "Feedback/ErrorBoundary",
  component: ErrorBoundary,
  tags: ["autodocs"],
} satisfies Meta<typeof ErrorBoundary>;

export default meta;
type Story = StoryObj<typeof meta>;

// A component that throws an error when triggered
function BuggyComponent({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error("Something went wrong in BuggyComponent!");
  }
  return (
    <div className="p-4 border border-green-200 bg-green-50 rounded-xl">
      <p className="text-sm font-medium text-green-800">
        Component is working fine.
      </p>
    </div>
  );
}

// A component that always throws
function AlwaysThrows(): never {
  throw new Error("This component always crashes!");
}

export const Default: Story = {
  args: {
    children: null,
  },
  render: () => (
    <ErrorBoundary>
      <AlwaysThrows />
    </ErrorBoundary>
  ),
};

export const WithStaticFallback: Story = {
  args: {
    children: null,
  },
  render: () => (
    <ErrorBoundary
      fallback={
        <div className="p-6 text-center border border-red-200 bg-red-50 rounded-xl">
          <p className="text-sm font-semibold text-red-800">
            Oops! Something went wrong.
          </p>
          <p className="text-xs text-red-800 mt-1">
            Please try refreshing the page.
          </p>
        </div>
      }
    >
      <AlwaysThrows />
    </ErrorBoundary>
  ),
};

export const WithFunctionFallback: Story = {
  args: {
    children: null,
  },
  render: () => (
    <ErrorBoundary
      fallback={(error, reset) => (
        <div className="p-6 border border-red-200 bg-red-50 rounded-xl text-center">
          <p className="text-sm font-semibold text-red-800">Error caught!</p>
          <p className="text-xs text-red-800 mt-1 font-mono">{error.message}</p>
          <button
            type="button"
            onClick={reset}
            className="mt-3 px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
    >
      <AlwaysThrows />
    </ErrorBoundary>
  ),
};

export const WorkingChild: Story = {
  args: {
    children: null,
  },
  render: () => (
    <ErrorBoundary>
      <div className="p-4 border border-green-200 bg-green-50 rounded-xl">
        <p className="text-sm font-medium text-green-800">
          This child renders without errors.
        </p>
      </div>
    </ErrorBoundary>
  ),
};

export const Interactive: Story = {
  args: {
    children: null,
  },
  render: () => {
    const Controller = () => {
      const [shouldThrow, setShouldThrow] = useState(false);
      return (
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => setShouldThrow(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium"
          >
            Trigger Error
          </button>
          <ErrorBoundary
            fallback={(error, reset) => (
              <div className="p-6 border border-red-200 bg-red-50 rounded-xl text-center">
                <p className="text-sm font-semibold text-red-800">Caught: {error.message}</p>
                <button
                  type="button"
                  onClick={() => {
                    setShouldThrow(false);
                    reset();
                  }}
                  className="mt-3 px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg"
                >
                  Reset
                </button>
              </div>
            )}
          >
            <BuggyComponent shouldThrow={shouldThrow} />
          </ErrorBoundary>
        </div>
      );
    };
    return <Controller />;
  },
};

export const WithOnError: Story = {
  args: {
    children: null,
  },
  render: () => (
    <ErrorBoundary
      onError={(error) => {
        console.log("Error caught by onError callback:", error.message);
      }}
    >
      <AlwaysThrows />
    </ErrorBoundary>
  ),
};

export const CustomStyledFallback: Story = {
  args: {
    children: null,
  },
  render: () => (
    <ErrorBoundary
      fallback={(error, reset) => (
        <div className="flex flex-col items-center justify-center p-8 bg-slate-50 border border-slate-200 rounded-xl text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">&#9888;</span>
          </div>
          <h3 className="text-lg font-bold text-slate-800">We hit a snag</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-xs">{error.message}</p>
          <div className="flex gap-2 mt-4">
            <button
              type="button"
              onClick={reset}
              className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg"
            >
              Retry
            </button>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-sm font-medium border border-slate-200 text-slate-600 rounded-lg"
            >
              Reload Page
            </button>
          </div>
        </div>
      )}
    >
      <AlwaysThrows />
    </ErrorBoundary>
  ),
};

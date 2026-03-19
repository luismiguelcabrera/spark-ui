import type { Meta, StoryObj } from "@storybook/react-vite";
import { AuthLayout } from "./auth-layout";

const meta = {
  title: "Layout/AuthLayout",
  component: AuthLayout,
  tags: ["autodocs"],
} satisfies Meta<typeof AuthLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

function BrandPanel() {
  return (
    <div className="h-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center p-12">
      <div className="text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Spark UI</h2>
        <p className="text-white/80 text-sm max-w-xs">
          A modern component library for building beautiful interfaces.
        </p>
      </div>
    </div>
  );
}

function LoginForm() {
  return (
    <div className="space-y-6 max-w-sm w-full">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
        <p className="text-sm text-slate-500 mt-1">Sign in to your account</p>
      </div>
      <div className="space-y-4">
        <div>
          <label htmlFor="login-email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input
            id="login-email"
            type="email"
            placeholder="you@example.com"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label htmlFor="login-pw" className="block text-sm font-medium text-slate-700 mb-1">Password</label>
          <input
            id="login-pw"
            type="password"
            placeholder="Enter password"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <button
          type="button"
          className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
        >
          Sign In
        </button>
      </div>
    </div>
  );
}

export const Default: Story = {
  render: () => (
    <div className="h-[600px] border border-slate-200 rounded-xl overflow-hidden">
      <AuthLayout leftPanel={<BrandPanel />}>
        <LoginForm />
      </AuthLayout>
    </div>
  ),
};

export const WithTopAction: Story = {
  render: () => (
    <div className="h-[600px] border border-slate-200 rounded-xl overflow-hidden">
      <AuthLayout
        leftPanel={<BrandPanel />}
        topAction={
          <a href="#" className="text-sm text-primary font-medium hover:underline">
            Create an account
          </a>
        }
      >
        <LoginForm />
      </AuthLayout>
    </div>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <div className="h-[600px] border border-slate-200 rounded-xl overflow-hidden">
      <AuthLayout
        leftPanel={<BrandPanel />}
        footer={
          <div className="mt-auto pt-8 text-center text-xs text-slate-500">
            By signing in, you agree to our{" "}
            <a href="#" className="text-primary hover:underline">Terms</a> and{" "}
            <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
          </div>
        }
      >
        <LoginForm />
      </AuthLayout>
    </div>
  ),
};

export const SignUpPage: Story = {
  render: () => (
    <div className="h-[700px] border border-slate-200 rounded-xl overflow-hidden">
      <AuthLayout
        leftPanel={
          <div className="h-full bg-slate-900 flex items-center justify-center p-12">
            <div className="text-center text-white">
              <h2 className="text-3xl font-bold mb-4">Join today</h2>
              <p className="text-white/60 text-sm">Start building beautiful UIs in minutes.</p>
            </div>
          </div>
        }
        topAction={
          <a href="#" className="text-sm text-primary font-medium hover:underline">
            Already have an account? Sign in
          </a>
        }
      >
        <div className="space-y-6 max-w-sm w-full">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Create account</h1>
            <p className="text-sm text-slate-500 mt-1">Fill in the details below</p>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="signup-first" className="block text-sm font-medium text-slate-700 mb-1">First name</label>
                <input id="signup-first" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label htmlFor="signup-last" className="block text-sm font-medium text-slate-700 mb-1">Last name</label>
                <input id="signup-last" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
              </div>
            </div>
            <div>
              <label htmlFor="signup-email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input id="signup-email" type="email" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label htmlFor="signup-pw" className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input id="signup-pw" type="password" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <button
              type="button"
              className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
            >
              Create Account
            </button>
          </div>
        </div>
      </AuthLayout>
    </div>
  ),
};

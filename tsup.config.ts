import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/theme.css"],
  format: ["esm", "cjs"],
  dts: true,
  splitting: true,
  treeshake: true,
  clean: true,
  external: ["react", "react-dom", "next", "next/link", "react-hook-form"],
  esbuildOptions(options) {
    options.banner = {
      js: '"use client";',
    };
  },
});

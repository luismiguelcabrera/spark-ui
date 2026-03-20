import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/theme.css", "src/locales/index.ts"],
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

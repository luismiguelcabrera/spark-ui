/** Global type declarations for build-time constants */

declare const process: {
  env: {
    NODE_ENV: "development" | "production" | "test";
  };
};

declare const global: typeof globalThis;

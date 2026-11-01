import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    environment: "node",
    // Every test starts clean: no leaked fetch stubs, env vars or mock call history.
    mockReset: true,
    unstubGlobals: true,
    unstubEnvs: true,
    coverage: {
      provider: "istanbul",
      include: ["src/**/*.ts"],
      exclude: ["src/main.ts", "src/**/*.test.ts", "src/**/*.fixtures.ts"],
      reporter: ["text", "lcov"],
    },
  },
});

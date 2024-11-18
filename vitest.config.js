import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    server: {
      deps: {
        inline: [/src\/.*/, /test\/.*/],
      },
    },
    coverage: {
      provider: "istanbul",
      include: ["src/**/*.js"],
    },
  },
});

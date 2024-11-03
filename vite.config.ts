import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  plugins: [solidPlugin()],
  build: {
    target: "esnext",
  },
  test: {
    setupFiles: ["./tests/vitest.setup.ts"],
    server: {
      deps: {
        inline: ["html-parse-string"],
      },
    },
    clearMocks: true,
    mockReset: true,
    restoreMocks: true,
  },
});

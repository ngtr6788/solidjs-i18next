import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  plugins: [solidPlugin()],
  build: {
    target: "esnext",
  },
  test: {
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

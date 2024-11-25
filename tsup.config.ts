import { solidPlugin } from "esbuild-plugin-solid";
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  minify: true,
  clean: true,
  dts: true,
  format: ["esm", "cjs"],
  esbuildPlugins: [solidPlugin()],
});

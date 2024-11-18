import { defineConfig } from "tsup";
import { solidPlugin } from "esbuild-plugin-solid";

export default defineConfig({
  entry: ["src/index.ts"],
  minify: true,
  clean: true,
  dts: true,
  format: ["esm", "cjs"],
  esbuildPlugins: [solidPlugin()],
});

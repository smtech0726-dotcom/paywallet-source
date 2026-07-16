import { build } from "esbuild";

try {
  await build({
    entryPoints: ["./src/index.ts"],
    bundle: false,
    platform: "node",
    format: "esm",
    target: ["node22"],
    outfile: "./dist/index.mjs",
    sourcemap: true,
    logLevel: "info",
  });
} catch (error) {
  console.error(error);
  process.exit(1);
}

import { build } from "esbuild";

try {
  await build({
    entryPoints: ["./src/index.ts"],
    bundle: true,
    platform: "node",
    format: "esm",
    target: ["node18"],
    outfile: "./dist/index.mjs",
    sourcemap: "external",
    external: ["pino-pretty", "pg", "drizzle-zod"],
    logLevel: "info",
  });
} catch (error) {
  console.error(error);
  process.exit(1);
}

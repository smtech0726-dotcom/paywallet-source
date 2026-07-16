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
    external: [
      "pino-pretty", 
      "pg", 
      "drizzle-zod", 
      "tty", 
      "util", 
      "os", 
      "crypto", 
      "path", 
      "fs", 
      "net", 
      "stream", 
      "http", 
      "tls", 
      "zlib"
    ],
    banner: {
      js: "import { createRequire } from 'module'; const require = createRequire(import.meta.url);",
    },
    logLevel: "info",
  });
} catch (error) {
  console.error(error);
  process.exit(1);
}

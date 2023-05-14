const esbuild = require("esbuild");
const path = require("path");

esbuild
  .build({
    entryPoints: [path.resolve(__dirname, "index.ts")],
    bundle: true,
    outfile: path.resolve(__dirname, "index.js"),
    tsconfig: path.resolve(__dirname, "tsconfig.json"),
    sourcemap: true,
  })
  .catch(() => process.exit(1));

import { defineConfig } from "tsup";

import { dependencies, devDependencies } from "./package.json";

export default defineConfig((options) => {
  // entries
  const entry = Array.isArray(options.entry) ? options.entry : [];
  return {
    entry: options.entry
      ? options.entry
      : ["src/index.ts", "src/server.ts", "src/action.ts"],
    outDir: "dist",
    splitting: false,
    sourcemap: true,
    clean: true,
    // If we are building the action we need to include all the dependencies since actions do not install dependencies before running.
    noExternal:
      entry.includes("src/action.ts") || entry.includes("src/lambdaFunction.ts")
        ? Object.keys(dependencies).concat(Object.keys(devDependencies))
        : [],
  };
});

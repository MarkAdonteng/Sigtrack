import { execSync } from "child_process";
import { resolve } from "path";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import  EnvironmentPlugin  from "vite-plugin-environment";
import react from "@vitejs/plugin-react";

let hash = "";

try {
  hash = execSync("git describe --always").toString().trim();
} catch (error) {
  hash = "DEVELOPMENT";
}

export default defineConfig({
  plugins: [
    react(),
    EnvironmentPlugin({
      COMMIT_HASH: hash,
    }),
  ],
  build: {
    target: "esnext",
    assetsDir: "",
    rollupOptions: {
      plugins: [
        visualizer({
          // Output to a file named stats.html in the dist folder
          template: "treemap" // Choose the visualization template
        })
      ],
    },
  },
  resolve: {
    alias: {
      "@app": resolve(__dirname, "./src"),
      "@pages": resolve(__dirname, "./src/pages"),
      "@components": resolve(__dirname, "./src/components"),
      "@core": resolve(__dirname, "./src/core"),
      "@layouts": resolve(__dirname, "./src/layouts"),
    },
  },
});

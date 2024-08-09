import react from "@vitejs/plugin-react"
import path from "node:path"
import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig({
  root: path.resolve(__dirname),
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: "src",
        replacement: path.resolve(__dirname, "src/"),
      },
    ],
  },
  server: {
    proxy: {
      "/api": "http://127.0.0.1:3020",
    },
  },
  optimizeDeps: {
    needsInterop: ["@tscircuit/schematic-viewer"],
  },
  define: {
    // Global var used by some dep inside schematic-viewer
    global: {},
  },
  build: {
    outDir: path.resolve(__dirname, "dist"),
  },
  base: "/preview",
  // css: {
  //   postcss: path.resolve(__dirname, "postcss.config.js"),
  // },
})

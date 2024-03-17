import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: "src", replacement: path.resolve(__dirname, "src/") }],
  },
  server: {
    proxy: {
      "/api": "http://localhost:3021",
    },
  },
  optimizeDeps: {
    needsInterop: ["@tscircuit/schematic-viewer"],
  },
  define: {
    // Global var used by some dep inside schematic-viewer
    global: {},
  },
})

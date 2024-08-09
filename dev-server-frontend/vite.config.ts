import react from "@vitejs/plugin-react"
import path from "path"
import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: "src", replacement: path.resolve(__dirname, "src/") }],
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
})

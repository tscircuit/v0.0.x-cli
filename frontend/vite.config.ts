import react from "@vitejs/plugin-react"
import path from "node:path"
import { defineConfig } from "vite"
import tailwindcss from "tailwindcss"
import autoprefixer from "autoprefixer"

// https://vitejs.dev/config/
export default defineConfig({
  root: path.resolve(__dirname),
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: "frontend",
        replacement: path.resolve(__dirname),
      },
      {
        find: "src",
        replacement: path.resolve(__dirname),
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
    rollupOptions: {
      input: path.resolve(__dirname, "main.tsx"),
    },
  },
  base: "/preview",
  css: {
    postcss: {
      plugins: [
        tailwindcss(path.resolve(__dirname, "tailwind.config.js")),
        autoprefixer,
      ],
    },
  },
})

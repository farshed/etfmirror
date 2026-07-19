import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
// import { analyzer } from "vite-bundle-analyzer"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), 
    // analyzer()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:5100",
    },
  },
})

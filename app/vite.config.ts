import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

const requestedPreviewPort = Number.parseInt(process.env.PORT ?? '', 10)
const previewPort = Number.isInteger(requestedPreviewPort) && requestedPreviewPort > 0
  ? requestedPreviewPort
  : 3000

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [inspectAttr(), react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
  },
  preview: {
    host: '0.0.0.0',
    port: previewPort,
    strictPort: true,
    // Vite blocks requests whose Host header isn't localhost/IP unless whitelisted.
    // Coolify's reverse proxy (and any CDN in front of it) may forward Host headers
    // that aren't exactly the domain list, so relax the check entirely in preview:
    // this is a static site behind a proxy, not a public dev server.
    allowedHosts: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

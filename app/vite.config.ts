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
    // Allow only explicit proxy hosts; operators can add other trusted domains.
    allowedHosts: ['agawane.com','www.agawane.com',...(process.env.VITE_ALLOWED_HOSTS ?? '').split(',').map(h=>h.trim()).filter(Boolean)],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

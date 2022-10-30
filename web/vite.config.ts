import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  server: {
    watch: { usePolling: true },
    host: true,
    port: 8000,
    strictPort: true,
    proxy: {
      "/api": "http://oath_api:8001"
    }
  }
})

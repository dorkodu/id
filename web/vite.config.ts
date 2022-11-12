import { defineConfig } from 'vite'

import react from '@vitejs/plugin-react';
import viteCompression from 'vite-plugin-compression';
import { VitePWA } from 'vite-plugin-pwa';
import { createHtmlPlugin as html } from 'vite-plugin-html';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
    html({ minify: true }),
    viteCompression({ algorithm: "gzip" }),
    viteCompression({ algorithm: "brotliCompress" }),
    VitePWA({
      devOptions: { enabled: true },
      minify: true,
      registerType: "prompt",
      injectRegister: "inline",
      workbox: {
        globPatterns: ["**/*.{html,css,js,ico}"]
      },
      manifest: {}
    })
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

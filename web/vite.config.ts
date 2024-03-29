import { defineConfig } from "vite";

import path from "path";

import react from "@vitejs/plugin-react";
import viteCompression from "vite-plugin-compression";
import { VitePWA } from "vite-plugin-pwa";
import { createHtmlPlugin as html } from "vite-plugin-html";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({}),
    html({ minify: true }),
    viteCompression({ algorithm: "gzip" }),
    viteCompression({ algorithm: "brotliCompress" }),
    VitePWA({
      devOptions: { enabled: false },
      minify: true,
      registerType: "prompt",
      injectRegister: "inline",
      workbox: {
        globPatterns: ["**/*.{html,css,js,ico,json,png,svg,webp,woff2}"],
      },
      base: "/",
      manifest: {
        name: "Dorkodu ID",
        short_name: "Dorkodu ID",
        description: "Dorkodu User Identity Service",
        categories: [],
        start_url: "/",
        display: "standalone",
        orientation: "portrait",
        theme_color: "#000000",
        background_color: "#000000",
        icons: [
          {
            src: "/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "/maskable_icon_x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable"
          },
          {
            src: "/maskable_icon_x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          },
        ],
      },
    }),
  ],
  server: {
    watch: { usePolling: true },
    host: true,
    port: 8000,
    strictPort: true,
    proxy: {
      "/api": "http://id_api:8001",
    },
  },
  resolve: {
    alias: {
      "@api": path.resolve(__dirname, "../api/src"),
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    reportCompressedSize: false,
  },
  base:
    process.env.NODE_ENV === "production" ? "https://cdn.dorkodu.com/id/" : "",
});

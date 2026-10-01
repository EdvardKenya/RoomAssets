/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// BASE_PATH задаётся в CI как "/<имя-репозитория>/" для GitHub Pages
// (см. .github/workflows/deploy.yml). Локально не задан -> "/".
export default defineConfig({
  base: process.env.BASE_PATH || "/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  test: {
    environment: "jsdom",
  },
});

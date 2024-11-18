import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from 'path'; // Agrega esta línea

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: "./postcss.config.cjs", // Configura PostCSS
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});

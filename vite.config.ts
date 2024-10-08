import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true,
    port: 4477,
  },
  build: {
    sourcemap: true,
  },
  plugins: [vue()],
});

import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

// This is a standard ES module JavaScript file
export default defineConfig({
  plugins: [vue()],
  base: "./",
});
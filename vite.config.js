import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  publicDir: resolve(__dirname, "public"),
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "src/popup/index.html"),
      },
      output: {
        entryFileNames: "src/popup/[name].js",
        assetFileNames: "src/popup/[name].[ext]",
      },
    },
    outDir: "dist",
    emptyOutDir: true,
  },
});

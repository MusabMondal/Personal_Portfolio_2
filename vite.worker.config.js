import { defineConfig } from "vite";

export default defineConfig({
  build: {
    emptyOutDir: false,
    outDir: "dist/server",
    ssr: "server/worker.js",
    rollupOptions: {
      output: {
        entryFileNames: "index.js",
        format: "es",
      },
    },
  },
});

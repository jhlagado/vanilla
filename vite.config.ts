import { defineConfig } from "vite";

export default defineConfig({
  server: {
    proxy: {
      "/contacts": {
        // target: "http://jsonplaceholder.typicode.com",
        // changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});

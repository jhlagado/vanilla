import { defineConfig } from "vite";

export default defineConfig({
  server: {
    proxy: {
      "/contacts": {
        target: "http://localhost",
      },
    },
  },
});

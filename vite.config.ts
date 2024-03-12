import { defineConfig } from "vite";
import { serviceWorkerPlugin } from '@gautemo/vite-plugin-service-worker'

export default defineConfig({
  plugins: [
    serviceWorkerPlugin({
      filename: "sw.ts",
    }),
  ],
  server: {
    proxy: {
      "/contacts": {
        target: "http://localhost",
      },
    },
  },
});

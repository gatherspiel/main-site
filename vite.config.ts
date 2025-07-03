import { defineConfig } from "vite";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
// https://vite.dev/config/

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: "./",


  root: "src/",
  publicDir: "../public",
  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        feedback: resolve(__dirname, "src/feedback.html"),
        help: resolve(__dirname, "src/help.html"),
        vision: resolve(__dirname, "src/vision.html"),
        picker: resolve(__dirname, "src/picker.html")
      },
    },
  },
});
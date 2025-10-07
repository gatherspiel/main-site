import { defineConfig } from "vite";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import handlebars from 'vite-plugin-handlebars';// https://vite.dev/config/

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: "./",
  plugins:[
    handlebars({
      partialDirectory: resolve(__dirname, 'src/shared'),
    }),
  ],
  root: "src/",
  publicDir: "../public",
  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        designers: resolve(__dirname, "src/designers.html"),
        feedback: resolve(__dirname, "src/feedback.html"),
        help: resolve(__dirname, "src/help.html"),
        main: resolve(__dirname, "src/index.html"),
        picker: resolve(__dirname, "src/picker.html"),
        score: resolve(__dirname, "src/score.html"),
        vision: resolve(__dirname, "src/vision.html"),
      },
    },
  },
});
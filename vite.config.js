import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "/recipe-adjuster/",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        scale: resolve(__dirname, "scale-rcp.html"),
        convert: resolve(__dirname, "conv-unit.html"),
        substitute: resolve(__dirname, "sub-ingr.html"),
        adjust: resolve(__dirname, "adj-envir.html"),
        hydration: resolve(__dirname, "hydr-calc.html"),
        starter: resolve(__dirname, "start-calc.html"),
      },
    },
  },
});

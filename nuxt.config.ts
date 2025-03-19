import tailwindcss from "@tailwindcss/vite";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss(), wasm(), topLevelAwait()],
  },
  modules: ["@nuxthub/core"],
  hub: {
    blob: true,
    bindings: {
      compatibilityFlags: ["nodejs_compat"],
    },
  },
  nitro: {
    experimental: {
      wasm: true,
    },
  },
});

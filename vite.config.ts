import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      events: "events",
      path: "path-browserify",
      stream: "stream-browserify",
      crypto: "crypto-browserify",
    },
  },
  define: {
    global: "globalThis",
    "process.env": "{}",
    "process.browser": "true",
    "process.version": JSON.stringify(""),
  },
  optimizeDeps: {
    include: ["buffer", "events", "gun"],
    esbuildOptions: {
      define: { global: "globalThis" },
    },
  },
  build: {
    target: "es2020",
    commonjsOptions: { transformMixedEsModules: true },
    rollupOptions: {
      output: {
        manualChunks: { gun: ["gun"] },
      },
    },
  },
}));

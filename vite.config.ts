import basicSsl from "@vitejs/plugin-basic-ssl";
import { componentTagger } from "lovable-tagger";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import path from "path";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080
  },
  plugins: [
    basicSsl(),
    nodePolyfills({
      globals: {
        global: true
      }
    }),
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

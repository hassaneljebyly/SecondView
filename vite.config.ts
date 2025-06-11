import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        content: "src/content/index.tsx",
      },
      output: {
        entryFileNames: (chunk) => {
          if (chunk.name === "content") return `${chunk.name}/index.js`;
          return "[name]/[name].js";
        },
      },
    },
    outDir: "dist",
  },
});

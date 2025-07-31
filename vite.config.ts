import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  root: ".",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "extension/src"),
      "@components": path.resolve(__dirname, "extension/src/components"),
      "@hooks": path.resolve(__dirname, "extension/src/hooks"),
      "@mocks": path.resolve(__dirname, "extension/src/mocks"),
      "@styles": path.resolve(__dirname, "extension/src/styles"),
      "@types": path.resolve(__dirname, "extension/src/types"),
      "@utils": path.resolve(__dirname, "extension/src/utils"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
  server: {
    fs: {
      allow: [".."],
    },
  },
  build: {
    rollupOptions: {
      input: {
        // background: path.resolve(__dirname, "extension/src/background.ts"),
        content: path.resolve(__dirname, "extension/src/content/index.tsx"),
        // popup: path.resolve(__dirname, "extension/src/popup/index.html"),
      },
      output: {
        // entryFileNames: (assetInfo) => {
        //   // Keep folder structure
        //   if (assetInfo.name?.includes("content/")) {
        //     return "content/[name]/index.js";
        //   }
        //   if (assetInfo.name?.includes("popup/")) {
        //     return "popup/[name]/index.js";
        //   }
        //   return "[name].js";
        // },
        // assetFileNames: "assets/[name]-[hash][extname]",
        // chunkFileNames: "chunks/[name]-[hash].js",
        entryFileNames: (chunk) => {
          if (chunk.name === "content") return `${chunk.name}/index.js`;
          return "[name]/[name].js";
        },
        assetFileNames: ({ name }) => {
          if (name && name.endsWith(".css")) {
            // [📐 ARCHITECTURE]:  adjust for options, and popup styles
            return `content/index.css`;
          }
          return `[name]`;
        },
      },
    },
    // rollupOptions: {
    //   input: {
    //     "content/index": path.resolve(
    //       __dirname,
    //       "extension/src/content/index.tsx"
    //     ),
    //     // "popup/index": path.resolve(
    //     //   __dirname,
    //     //   "extension/src/popup/index.html"
    //     // ),
    //     // background: path.resolve(__dirname, "extension/src/background.ts"),
    //   },
    //   output: {
    //     entryFileNames: "[name].js", // [name] is now "content/index"
    //     chunkFileNames: "chunks/[name]-[hash].js",
    //     assetFileNames: "assets/[name]-[hash][extname]",
    //   },
    // },
    outDir: "dist",
  },
});

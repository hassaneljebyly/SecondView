import { mergeConfig, defineConfig } from 'vite';
import path from 'path';
import { baseConfig } from './vite.config.shared.js';

export default defineConfig(() =>
  mergeConfig(baseConfig, {
    build: {
      rollupOptions: {
        input: {
          content: path.resolve(__dirname, 'extension/src/content/index.tsx'),
        },
        output: {
          entryFileNames: chunk => {
            if (chunk.name === 'content') return `second-view-content.js`;
            return '[name]/[name].js';
          },
          assetFileNames: ({ name }) => {
            if (name && name.endsWith('.css')) {
              return `second-view-content.css`;
            }
            return `[name]`;
          },
        },
      },
      outDir: 'dist/content',
    },
  })
);

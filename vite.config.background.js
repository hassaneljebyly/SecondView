import { mergeConfig, defineConfig } from 'vite';
import path from 'path';
import baseConfig from './vite.config.shared.js';

export default defineConfig(() =>
  mergeConfig(baseConfig, {
    build: {
      rollupOptions: {
        input: {
          background: path.resolve(__dirname, 'extension/src/background/index.ts'),
        },
        output: {
          entryFileNames: chunk => {
            if (chunk.name === 'background') return `second-view-background.js`;
            return '[name]/[name].js';
          },
        },
      },
      outDir: 'dist/background',
    },
  })
);

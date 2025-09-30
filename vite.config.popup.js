import { mergeConfig, defineConfig } from 'vite';
import path from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import baseConfig from './vite.config.shared.js';

export default defineConfig(() =>
  mergeConfig(baseConfig, {
    plugins: [
      viteStaticCopy({
        targets: [
          {
            src: 'extension/src/popup/index.html',
            dest: '.',
            rename: 'second-view-popup.html',
          },
        ],
      }),
    ],
    build: {
      rollupOptions: {
        input: {
          popup: path.resolve(__dirname, 'extension/src/popup/index.tsx'),
        },
        output: {
          entryFileNames: chunk => {
            if (chunk.name === 'popup') return `second-view-popup.js`;
            return '[name]/[name].js';
          },
          assetFileNames: ({ name }) => {
            if (name && name.endsWith('.css')) {
              return `second-view-popup.css`;
            }
            return `[name]`;
          },
        },
      },
      outDir: 'dist/popup',
    },
  })
);

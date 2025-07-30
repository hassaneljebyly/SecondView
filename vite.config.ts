import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@mocks': path.resolve(__dirname, 'src/mocks'),
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@types': path.resolve(__dirname, 'src/types'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@shared': path.resolve(__dirname, '../shared/src'),
    },
  },
  server: {
    fs: {
      allow: ['..'],
    },
  },
  build: {
    rollupOptions: {
      input: {
        content: 'src/content/index.tsx',
      },
      output: {
        entryFileNames: chunk => {
          if (chunk.name === 'content') return `${chunk.name}/index.js`;
          return '[name]/[name].js';
        },
        assetFileNames: ({ name }) => {
          if (name && name.endsWith('.css')) {
            // [📐 ARCHITECTURE]:  adjust for options, and popup styles
            return `content/index.css`;
          }
          return `[name]`;
        },
      },
    },
    outDir: 'dist',
  },
});

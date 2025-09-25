import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import autoprefixer from 'autoprefixer';

export const baseConfig = defineConfig({
  plugins: [
    react(),
    // shared static copy
    viteStaticCopy({
      targets: [
        {
          src: 'extension/public/*',
          dest: '..',
        },
      ],
    }),
  ],
  css: {
    postcss: {
      plugins: [autoprefixer()],
    },
  },
  root: '.',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'extension/src'),
      '@components': path.resolve(__dirname, 'extension/src/components'),
      '@hooks': path.resolve(__dirname, 'extension/src/hooks'),
      '@mocks': path.resolve(__dirname, 'extension/src/mocks'),
      '@styles': path.resolve(__dirname, 'extension/src/styles'),
      '@types': path.resolve(__dirname, 'extension/src/types'),
      '@utils': path.resolve(__dirname, 'extension/src/utils'),
      '@shared': path.resolve(__dirname, 'shared'),
    },
  },
  server: {
    fs: {
      allow: ['..'],
    },
  },
});

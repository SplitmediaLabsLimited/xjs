import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'chrome103',
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      name: 'XJS',
      formats: ['iife'],
      fileName: () => 'xjs.js',
    },
    outDir: 'dist',
    emptyOutDir: false,
    minify: false,
  },
});

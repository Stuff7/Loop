import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@Loop': path.resolve(__dirname, './src'),
    },
  },
});

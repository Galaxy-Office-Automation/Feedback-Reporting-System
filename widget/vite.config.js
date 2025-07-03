import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/main.jsx',
      name: 'FeedbackWidget',
      fileName: 'feedback-sdk',
      formats: ['iife'],
    },
    outDir: 'dist',
  },
  define: {
    'process.env.NODE_ENV': '"production"',
  },
  plugins: [react()],
});

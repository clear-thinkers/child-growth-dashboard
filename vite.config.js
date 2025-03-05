import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/child-growth-dashboard/',
  plugins: [react()],
  build: {
    outDir: 'build', // Ensure build output is placed in the 'build' directory
  },
});

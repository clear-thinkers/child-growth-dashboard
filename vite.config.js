import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/child-growth-dashboard/', // Make sure this matches the repository name
  plugins: [react()],
});

import { copyFileSync } from 'node:fs';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

function spaFallback(): Plugin {
  return {
    name: 'spa-fallback',
    closeBundle() {
      copyFileSync('dist/index.html', 'dist/404.html');
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), spaFallback()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const isOffline = mode === 'offline';

  return {
    plugins: [react()],
    server: {
      port: 5173,
    },
    build: {
      outDir: isOffline ? 'dist-offline' : 'dist',
    },
  };
});

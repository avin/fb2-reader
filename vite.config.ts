import react from '@vitejs/plugin-react';
import { URL, fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import localhostCerts from 'vite-plugin-localhost-certs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [localhostCerts(), react()],
  resolve: {
    alias: [{ find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) }],
  },
  server: {
    port: 8888,
  },
});

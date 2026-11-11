import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// base './' + singlefile: hasil build satu file HTML mandiri, tanpa CDN.
export default defineConfig({
  base: './',
  plugins: [react(), viteSingleFile()],
});

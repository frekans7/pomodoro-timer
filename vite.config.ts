import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import manifest from './public/manifest.json'

export default defineConfig({
  plugins: [
    react(),
    crx({ manifest: manifest as any }),
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        // Root-level index.html → chrome-extension://[id]/index.html
        popup: 'index.html',
      },
    },
  },
})

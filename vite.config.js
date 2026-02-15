import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Custom domain (Synthector.com) => base should be '/'
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})

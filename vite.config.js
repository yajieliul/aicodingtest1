import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.js']
  }
})

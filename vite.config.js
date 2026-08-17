import { defineConfig } from 'vite'

export default defineConfig({
  // 关键：产物内资源改用相对路径，保证 Electron 以 file:// 加载 dist/index.html 时不丢失 JS/CSS
  base: './',
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

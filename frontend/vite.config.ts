import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteImagemin from 'vite-plugin-imagemin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteImagemin({
      gifsicle: { optimizationLevel: 7 },
      mozjpeg: { quality: 80 },
      pngquant: { quality: [0.7, 0.8], speed: 4 },
      webp: { quality: 80 }
    })
  ],
  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: true
  },
  preview: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: true
  }
})

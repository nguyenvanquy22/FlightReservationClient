import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4000,
    proxy: {
      '/api': {
        target: 'https://flight-reservation-server.onrender.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})

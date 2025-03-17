import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['aa94c983-32e7-4966-bb20-cd6e5f954242-00-2fs46r3dxbmsl.spock.replit.dev','career-vision.vercel.app']
      },
    build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          pdf: ['pdfjs-dist']
        }
      }
    }
  }
})

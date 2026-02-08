import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

const isDev = process.env.NODE_ENV !== 'production'

// declare dev backends once
const devConnectSrc = [
  "'self'",
  "ws:",
  "http://localhost:8081",
  "http://localhost:8082",
  "http://localhost:8095",
]

export default defineConfig({
  plugins: [react()],
  server: {
    hmr: {
      clientLogLevel: 'silent',
    },
    headers: {
      'X-Frame-Options': 'DENY',
      'Content-Security-Policy': isDev
        ? [
          "default-src 'self'",
          `script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net`,
          `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net`,
          `font-src 'self' https://fonts.gstatic.com`,
          `img-src 'self' data:`,
          `connect-src ${devConnectSrc.join(' ')}`,
          "object-src 'none'",
          "base-uri 'self'",
          "frame-ancestors 'none'",
        ].join('; ')
        : [
          "default-src 'self'",
          "script-src 'self' https://cdn.jsdelivr.net",
          "style-src 'self' https://fonts.googleapis.com https://cdn.jsdelivr.net",
          "font-src 'self' https://fonts.gstatic.com",
          "img-src 'self' data:",
          "connect-src 'self' https://api.example.com",
          "object-src 'none'",
          "base-uri 'self'",
          "frame-ancestors 'none'",
        ].join('; ')
    }
  }
})

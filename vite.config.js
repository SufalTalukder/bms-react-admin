import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

const env = process.env.NODE_ENV || 'local'

const isLocal = env === 'local'
const isDev = env === 'development'
const isProd = env === 'production'

/**
 * Local / dev backends (HMR, APIs, sockets)
 */
const devConnectSrc = [
  "'self'",
  "ws:",
  "http://localhost:5173",
  "http://localhost:8081",
  "http://localhost:8082",
  "http://localhost:8083",
  "http://localhost:8084",
  "http://localhost:8085",
  "http://localhost:8086",
  "http://localhost:8088",
  "http://localhost:8091",
  "http://localhost:8092",
  "http://localhost:8095",
  "http://localhost:8100",
]

/**
 * Production backends
 */
const prodConnectSrc = [
  "'self'",
  "https://api.example.com",
]

function csp(isLocal, isDev, isProd) {
  if (isLocal || isDev) {
    return [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob:",
      "connect-src 'self' ws: http:",
      "object-src 'none'",
    ].join('; ')
  }

  if (isProd) {
    return [
      "default-src 'self'",
      "script-src 'self' https://cdn.jsdelivr.net",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data:",
      "connect-src 'self'",
      "object-src 'none'",
    ].join('; ')
  }
}

export default defineConfig(({ mode }) => {

  const isLocal = mode === 'local'
  const isDev = mode === 'development'
  const isProd = mode === 'production'

  return {
    base: '/bms-book-store/',
    plugins: [react()],
    server: {
      headers: {
        'Content-Security-Policy': csp(isLocal, isDev, isProd),
      },
    },
  }
})


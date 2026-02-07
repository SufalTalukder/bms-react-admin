import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    hmr: {
      clientLogLevel: "silent",
    },
    headers: {
      "X-Frame-Options": "DENY",
      "Content-Security-Policy": "frame-ancestors 'none'"
    }
  },
})

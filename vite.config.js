import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Dev server proxy to avoid CORS when calling the remote Elasticsearch cluster
  // In development the app will call `/api/search` and Vite will forward that
  // request to the Elasticsearch endpoint, rewriting the path to the actual
  // `_search` API path. This keeps the browser request same-origin so CORS
  // errors are avoided.
  server: {
    port: 3000,
    allowedHosts: ['mite-intense-polliwog.ngrok-free.app'],
    strictPort: true,
    // add CSP header that allows ngrok assets plus external image hosts
    headers: {
      'Content-Security-Policy':
        "default-src 'self' https://cdn.ngrok.com 'unsafe-eval' 'unsafe-inline'; " +
        "img-src 'self' https://images.contentstack.io https://cdn-img.wemall.com https://assets.ngrok.com https://cdn.ngrok.com data: blob:; " +
        "font-src 'self' https://assets.ngrok.com https://cdn.ngrok.com; "
    },
    proxy: {
      '/api/search': {
        target: 'https://my-elasticsearch-project-ad20fd.es.us-central1.gcp.elastic.cloud:443',
        changeOrigin: true,
        secure: true,
        // rewrite the incoming path `/api/search` to the real ES path
        // NOTE: we do not include the scroll query here — the client will send
        // `scroll=1m` as a request param when needed.
        rewrite: (path) => path.replace(/^\/api\/search/, '/true_th_api_1_products/_search'),
      },
    },
  },
})

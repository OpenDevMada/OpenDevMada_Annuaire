// Simple CORS proxy server for development
const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')
const cors = require('cors')

const app = express()
const PORT = 3001

// Enable CORS for all routes
app.use(cors())

// Proxy API requests with better headers
app.use('/api', createProxyMiddleware({
  target: 'https://opendevmadaannuaire.infinityfree.me',
  changeOrigin: true,
  secure: true,
  logLevel: 'info',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  },
  onProxyRes: function (proxyRes, req, res) {
    console.log('Response from API:', proxyRes.statusCode, proxyRes.headers['content-type'])
    if (proxyRes.headers['content-type'] && proxyRes.headers['content-type'].includes('text/html')) {
      console.warn('⚠️  API returned HTML instead of JSON for:', req.url)
    }
  }
}))

// Proxy public assets (images)
app.use('/public', createProxyMiddleware({
  target: 'https://opendevmadaannuaire.infinityfree.me',
  changeOrigin: true,
  secure: true,
  logLevel: 'info'
}))

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`)
  console.log('Update your API_BASE to: http://localhost:3001/api/opendevmada')
  console.log('Update your IMG_BASE to: http://localhost:3001/public/')
})
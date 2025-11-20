// Vercel serverless function to proxy /api/search to the Elasticsearch cluster
// Mirrors the Vite dev proxy used during local development.
// Recommended: set a server-only env var named `ELASTIC_API_KEY` (not VITE_*)
// for improved security. For backward compatibility the function will fall
// back to `VITE_API_KEY` if `ELASTIC_API_KEY` is not present.

const ES_BASE = 'https://my-elasticsearch-project-ad20fd.es.us-central1.gcp.elastic.cloud:443'
const ES_PATH = '/true_th_api_1_products/_search'

module.exports = async (req, res) => {
  // Prefer a server-only env var to avoid exposing secrets to the client build.
  const apiKey = process.env.ELASTIC_API_KEY || process.env.VITE_API_KEY

  // Simple CORS handling: echo the Origin header when present, otherwise allow all.
  const origin = req.headers.origin || '*'
  const corsHeaders = {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': req.headers['access-control-request-headers'] || 'Content-Type,Authorization',
    'Access-Control-Allow-Credentials': 'true',
  }

  // Handle preflight OPTIONS request early
  if (req.method === 'OPTIONS') {
    Object.entries(corsHeaders).forEach(([k, v]) => res.setHeader(k, v))
    res.statusCode = 204
    res.end()
    return
  }

  try {
    // Build upstream URL and preserve query params (e.g. scroll=1m)
    const upstreamUrl = new URL(ES_BASE + ES_PATH)
    const incomingUrl = new URL(req.url, `http://${req.headers.host}`)
    for (const [k, v] of incomingUrl.searchParams.entries()) upstreamUrl.searchParams.append(k, v)

    const headers = {
      // Prefer the incoming content-type if provided
      'content-type': req.headers['content-type'] || 'application/json',
    }
    if (apiKey) headers['authorization'] = `ApiKey ${apiKey}`

    // Read request body (if any)
    let bodyBuffer = undefined
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      const chunks = []
      for await (const chunk of req) chunks.push(Buffer.from(chunk))
      bodyBuffer = Buffer.concat(chunks)
      if (bodyBuffer.length === 0) bodyBuffer = undefined
    }

    // Use global fetch (Node 18+ on Vercel supports it)
    const fetchOptions = {
      method: req.method,
      headers,
      body: bodyBuffer,
    }

    const upstreamResp = await fetch(upstreamUrl.toString(), fetchOptions)

    // If upstream returned an error status, capture the body for logs
    let upstreamBodyBuffer = undefined
    try {
      const arr = await upstreamResp.arrayBuffer()
      upstreamBodyBuffer = Buffer.from(arr)
    } catch (e) {
      // ignore body read errors
      upstreamBodyBuffer = undefined
    }

    // Forward status
    res.statusCode = upstreamResp.status

    // Forward selected headers (avoid hop-by-hop headers)
    upstreamResp.headers.forEach((value, name) => {
      const hopByHop = ['connection', 'keep-alive', 'proxy-authenticate', 'proxy-authorization', 'te', 'trailers', 'transfer-encoding', 'upgrade']
      if (!hopByHop.includes(name.toLowerCase())) {
        res.setHeader(name, value)
      }
    })

    // Ensure CORS headers are present on responses from the proxy
    Object.entries(corsHeaders).forEach(([k, v]) => res.setHeader(k, v))

    // If upstream returned non-2xx, log useful debug info and return a JSON error
    if (!upstreamResp.ok) {
      const upstreamText = upstreamBodyBuffer ? upstreamBodyBuffer.toString('utf8') : '<no body>'
      // Log upstream status and body for debugging
      // eslint-disable-next-line no-console
      console.error('api/search upstream error', { status: upstreamResp.status, url: upstreamUrl.toString(), body: upstreamText })

      // In production we avoid echoing upstream details to the client. In non-production include details.
      const safeBody = (process.env.NODE_ENV && process.env.NODE_ENV === 'production')
        ? { error: 'upstream_error', status: upstreamResp.status }
        : { error: 'upstream_error', status: upstreamResp.status, upstream: upstreamText }

      res.setHeader('content-type', 'application/json')
      res.end(JSON.stringify(safeBody))
      return
    }

    // Success: stream the body back to the client
    if (upstreamBodyBuffer) {
      res.end(upstreamBodyBuffer)
    } else {
      res.end()
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('api/search proxy error:', err)
    res.statusCode = 500
    res.setHeader('content-type', 'application/json')
    Object.entries(corsHeaders).forEach(([k, v]) => res.setHeader(k, v))
    // Avoid leaking internals in production
    const safeMessage = (process.env.NODE_ENV && process.env.NODE_ENV === 'production')
      ? { error: 'proxy_failed' }
      : { error: 'proxy_failed', message: err?.message || String(err) }
    res.end(JSON.stringify(safeMessage))
  }
}

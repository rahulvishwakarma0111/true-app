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

    const arrayBuf = await upstreamResp.arrayBuffer()
    res.end(Buffer.from(arrayBuf))
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('api/search proxy error:', err)
    res.statusCode = 500
    res.setHeader('content-type', 'application/json')
    Object.entries(corsHeaders).forEach(([k, v]) => res.setHeader(k, v))
    res.end(JSON.stringify({ error: 'proxy_failed', message: err?.message || String(err) }))
  }
}

// Vercel serverless function to proxy /api/search to the Elasticsearch cluster
// Mirrors the Vite dev proxy used during local development.
// Ensure you set VITE_API_KEY in the Vercel environment variables.

const ES_BASE = 'https://my-elasticsearch-project-ad20fd.es.us-central1.gcp.elastic.cloud:443'
const ES_PATH = '/true_th_api_1_products/_search'

module.exports = async (req, res) => {
  try {
    const apiKey = process.env.VITE_API_KEY

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

    const arrayBuf = await upstreamResp.arrayBuffer()
    res.end(Buffer.from(arrayBuf))
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('api/search proxy error:', err)
    res.statusCode = 500
    res.setHeader('content-type', 'application/json')
    res.end(JSON.stringify({ error: 'proxy_failed', message: err?.message || String(err) }))
  }
}

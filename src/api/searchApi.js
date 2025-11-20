import axios from 'axios'

// Centralized API wrapper for Elasticsearch _search POST
// Reads the API key from Vite env: import.meta.env.VITE_API_KEY
// Usage: import { postSearch } from '../api/searchApi';

// Build the API URL. By default we call the real Elasticsearch endpoint
// directly (this will be used in development and production unless you
// override). If you prefer the previous proxied behavior, set
// VITE_USE_PROXY=true in your env and ensure your dev server provides
// the `/api/search` proxy (Vite dev proxy or a serverless function).
const ES_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_ES_BASE)
  ? import.meta.env.VITE_ES_BASE
  : 'https://my-elasticsearch-project-ad20fd.es.us-central1.gcp.elastic.cloud:443'
const ES_PATH = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_ES_PATH)
  ? import.meta.env.VITE_ES_PATH
  : '/true_th_api_1_products/_search'

// Prefer the proxy in deployed/browser builds by default (avoids CORS).
// VITE_USE_PROXY (true/false) can still explicitly override this behavior.
const USE_PROXY = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_USE_PROXY)
  ? import.meta.env.VITE_USE_PROXY === 'true'
  : (typeof window !== 'undefined' && window.location && window.location.hostname !== 'localhost')

const API_URL = USE_PROXY ? '/api/search' : `${ES_BASE}${ES_PATH}`

function getApiKey() {
  // Vite exposes env vars with the VITE_ prefix via import.meta.env
  // In Node contexts process.env may also be available; we try both for flexibility.
  const key = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_KEY
    ? import.meta.env.VITE_API_KEY
    : (typeof process !== 'undefined' && process.env && process.env.VITE_API_KEY ? process.env.VITE_API_KEY : undefined)

  if (!key) {
    // Don't throw here — allow caller to handle failures. Warn to help debugging.
    // eslint-disable-next-line no-console
    console.warn('[searchApi] VITE_API_KEY is not set. Requests will be sent without Authorization header.')
  }

  return key
}

export async function postSearch(body = {}) {
  const apiKey = getApiKey()

  const headers = {
    'Content-Type': 'application/json',
  }

  if (apiKey) headers['Authorization'] = `ApiKey ${apiKey}`

  try {
  // Send scroll as a request param for this specific search call. Using
  // axios `params` keeps the API URL clean while the dev proxy will
  // forward the path to `/products/_search` and the query param will be
  // preserved.
  const resp = await axios.post(API_URL, body, { headers, params: { scroll: '1m' } })
    return resp.data
  } catch (err) {
    // Re-throw with a clearer message for callers
    const message = err?.response?.data || err?.message || 'Unknown error'
    const e = new Error(`searchApi.postSearch failed: ${JSON.stringify(message)}`)
    e.cause = err
    throw e
  }
}

export default { postSearch }

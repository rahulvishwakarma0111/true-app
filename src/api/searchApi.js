import axios from 'axios'
// Attempt to load wordsninja if available. It's optional — fall back to a simple regex-based splitter.
let WordNinja
try {
  // wordsninja exposes a split function. Import may fail in some environments so wrap in try/catch.
  // eslint-disable-next-line import/no-extraneous-dependencies
  WordNinja = require('wordsninja')
} catch (e) {
  WordNinja = null
}

// Centralized API wrapper for Elasticsearch _search POST
// Reads the API key from Vite env: import.meta.env.VITE_API_KEY
// Usage: import { postSearch } from '../api/searchApi';

// Use a relative URL which will be proxied in development by Vite.
// The dev proxy rewrites `/api/search` to the real Elasticsearch path.
const API_URL = '/api/search'

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

// Normalize a search query by separating adjacent letters and digits and
// optionally splitting concatenated words using wordsninja when available.
// Examples:
//  "iphone13" -> "iphone 13"
//  "Android15" -> "Android 15"
//  "samsunggalaxys21" -> "samsung galaxy s 21" (if wordsninja is present)
export function normalizeQuery(q) {
  if (!q || typeof q !== 'string') return q

  // First, insert spaces between letters+digits and digits+letters
  let s = q.replace(/([A-Za-z]+)(\d+)/g, '$1 $2').replace(/(\d+)([A-Za-z]+)/g, '$1 $2')

  // Split camelCase boundaries like "iPhoneAir" -> "iPhone Air"
  s = s.replace(/([a-z])([A-Z])/g, '$1 $2')

  // Collapse multiple spaces
  s = s.replace(/\s+/g, ' ').trim()

  // Normalize case to lowercase to improve word-splitting accuracy and
  // to produce consistent queries (search analyzers typically lowercase).
  s = s.toLowerCase()

  // If wordsninja is available, further split any pure-letter tokens that
  // look like concatenated words (e.g., "samsunggalaxy"). For tokens that
  // are already short or contain digits we keep them as-is.
  try {
    // dictionary used as a robust fallback for common device/brand tokens
    const dict = new Set([
      'iphone', 'ipad', 'air', 'pro', 'max', 'mini', 'plus', 'ultra', 's', 'note', 'galaxy', 'pixel', 'one', 'realme', 'nokia', 'huawei', 'sony', 'motorola', 'asus', 'google', 'honor', 'lenovo', 'infinix', 'tecno', 'vivo', 'oppo', 'xiaomi', 'redmi'
    ])

    function wordBreakToken(tok) {
      // dynamic programming word break: find a split into dictionary words
      const n = tok.length
      const dp = Array(n + 1).fill(null)
      dp[0] = []
      for (let i = 0; i < n; i++) {
        if (dp[i] == null) continue
        for (let j = i + 1; j <= n; j++) {
          const piece = tok.slice(i, j)
          if (dict.has(piece)) {
            if (dp[j] == null) dp[j] = dp[i].concat([piece])
          }
        }
      }
      return dp[n] ? dp[n].join(' ') : tok
    }

    const parts = s.split(' ').map((tok) => {
      if (!/^[a-z]+$/.test(tok) || tok.length <= 3) return tok

      if (WordNinja && typeof WordNinja.split === 'function') {
        try {
          const split = WordNinja.split(tok)
          // Validate WordNinja output: prefer it only if it produced a meaningful split
          const joined = Array.isArray(split) ? split.join(' ') : tok
          const good = Array.isArray(split) && split.length > 1 && split.some((p) => p.length > 1)
          if (good) return joined
          // else fall through to dictionary-based breaking
        } catch (err) {
          // If wordsninja failed, fall back to dictionary
        }
      }

      // dictionary fallback
      return wordBreakToken(tok)
    })

    s = parts.join(' ').replace(/\s+/g, ' ').trim()
  } catch (e) {
    // If anything goes wrong with the library, just return the lightly normalized string.
    // eslint-disable-next-line no-console
    console.warn('[searchApi.normalizeQuery] wordsninja failed, falling back to regex-only normalization', e)
  }

  return s
}

export default { postSearch }

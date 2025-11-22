import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// Base URL for the provided ngrok endpoints
const API_BASE = 'https://true-th-api.vercel.app'

function getApiKey() {
  // Prefer Vite env in the browser: import.meta.env.VITE_API_KEY
  const key = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_KEY
    ? import.meta.env.VITE_API_KEY
    : (typeof process !== 'undefined' && process.env && process.env.VITE_API_KEY ? process.env.VITE_API_KEY : undefined)

  return key
}

function buildHeaders() {
  const apiKey = getApiKey()
  const headers = { 'Content-Type': 'application/json' }
  if (apiKey) headers['x-api-key'] = apiKey
  return headers
}

// GET /products/all
export const fetchAllProducts = createAsyncThunk(
  'homepage/fetchAllProducts',
  async (_, { rejectWithValue }) => {
    try {
      const resp = await axios.get(`${API_BASE}/products/all`, { headers: buildHeaders() })
      // Return whatever the API responds with — slice will handle arrays or wrapped payloads
      return resp.data
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message)
    }
  }
)

// GET /products/search?q=...  (accepts raw query string)
export const searchProducts = createAsyncThunk(
  'homepage/searchProducts',
  async (q, { rejectWithValue }) => {
    try {
      // encode query and pass as `q` param
      const resp = await axios.get(`${API_BASE}/products/search`, { params: { q }, headers: buildHeaders() })
      return resp.data
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message)
    }
  }
)

export const searchAutocomplete = createAsyncThunk(
  'homepage/searchAutocomplete',
  async (q, { rejectWithValue }) => {
    try {
      // encode query and pass as `q` param
      const resp = await axios.get(`${API_BASE}/products/autocomplete`, { params: { q }, headers: buildHeaders() })
      return resp.data
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message)
    }
  }
)

export default { fetchAllProducts, searchProducts }

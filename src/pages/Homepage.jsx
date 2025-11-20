import React, { useState, useRef, useEffect } from 'react'
import './Homepage.css'
import { postSearch, normalizeQuery } from '../api/searchApi'


const Homepage = () => {
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const [brandsOpen, setBrandsOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [selectedBrand, setSelectedBrand] = useState('All Brands')
  const [sortBy, setSortBy] = useState('Popularity')

  const categories = [
    'Telecommunication (Telco)',
    'Hardline Electronics'
  ]

  // Assumption: include major mobile brands commonly available in Thailand
  const brands = [
    'All Mobile Brands',
    'Apple',
    'Samsung',
    'Xiaomi',
    'OPPO',
    'vivo',
    'realme',
    'Huawei',
    'Nokia',
    'OnePlus',
    'Infinix',
    'TECNO',
    'Sony',
    'Motorola',
    'ASUS',
    'Google',
    'HONOR',
    'Lenovo'
  ]

  // sample product list (using web images from picsum.photos for now)
  const products = [
    { id: 1, title: 'iPhone 17 Pro Max', price: '41,900.-', discount: '-14%', image: 'https://picsum.photos/seed/iphone1/360/300' },
    { id: 2, title: 'iPhone 17 Pro', price: '36,900.-', discount: '-15%', image: 'https://picsum.photos/seed/iphone2/360/300' },
    { id: 3, title: 'iPhone Air', price: '32,900.-', discount: '-17%', image: 'https://picsum.photos/seed/iphone3/360/300' },
    { id: 4, title: 'iPhone 17', price: '22,900.-', discount: '-23%', image: 'https://picsum.photos/seed/iphone4/360/300' },
    { id: 5, title: 'iPhone 16 Plus', price: '24,240.-', discount: '-30%', image: 'https://picsum.photos/seed/iphone5/360/300' },
    { id: 6, title: 'iPhone 16', price: '19,160.-', discount: '-35%', image: 'https://picsum.photos/seed/iphone6/360/300' },
  ]

  // close dropdowns when clicking outside
  const wrapperRef = useRef(null)
  // ref for tracking mounted/cancelled state so fetchProducts can be called from anywhere
  const cancelledRef = useRef(false)
  // API state: results from Elasticsearch
  const [apiHits, setApiHits] = useState(null)
  const [apiLoading, setApiLoading] = useState(false)
  const [apiError, setApiError] = useState(null)
  // controlled search input
  const [searchTerm, setSearchTerm] = useState('')
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setCategoriesOpen(false)
        setBrandsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [wrapperRef])

  // Fetch products from Elasticsearch on mount using the centralized API wrapper
  useEffect(() => {
    // mark mounted
    cancelledRef.current = false

    // call shared fetchProducts on mount
    fetchProducts()

    return () => {
      // mark cancelled on unmount
      cancelledRef.current = true
    }
  }, [])

  // fetchProducts is exposed so we can reuse it when clearing search or on-demand
  async function fetchProducts() {
    setApiLoading(true)
    setApiError(null)
    try {
      // Basic match_all body — adjust query as needed
      const body = { size: 1000, query: { match_all: {} } }
      const data = await postSearch(body)
      if (cancelledRef.current) return
      const hits = data?.hits?.hits ?? []
      setApiHits(hits)
    } catch (e) {
      if (cancelledRef.current) return
      setApiError(e.message || String(e))
    } finally {
      if (!cancelledRef.current) setApiLoading(false)
    }
  }

  // Trigger a search using the centralized API wrapper with the required
  // static body shape. If query is empty, clear results.
  async function handleSearch(query) {
    const raw = typeof query === 'string' ? query.trim() : ''
    // normalize common patterns like "iphone13" -> "iphone 13"
    const q = normalizeQuery(raw)
    if (!q) {
      // don't call API for empty query; clear results
      setApiHits(null)
      return
    }

    setApiLoading(true)
    setApiError(null)
    try {
      const body = {
        size: 20,
        query: {
          multi_match: {
            // use the normalized query for better matching of model+number tokens
            query: q,
            fields: [
              'title.th',
              'description',
              'variants.color',
              'images',
              'variants.capacity'
            ]
          }
        }
      }

      const data = await postSearch(body)
      const hits = data?.hits?.hits ?? []
      setApiHits(hits)
    } catch (e) {
      setApiError(e.message || String(e))
    } finally {
      setApiLoading(false)
    }
  }

  console.log("apiHits", apiHits)

  return (
    <div className="homepage">
      <header className="homepage-header">
        <div className="header-inner">
          {/* Search area centered */}
          <div className="searchbar-wrapper">
            <div className="search-input-wrapper">
              <span className="search-icon" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              </span>
              <input
                className="search-input"
                type="search"
                placeholder="Search"
                aria-label="Search"
                value={searchTerm}
                onChange={(e) => {
                  const val = e.target.value
                  setSearchTerm(val)
                  // If the user cleared the input, re-fetch the full product list
                  if (val.trim() === '') {
                    fetchProducts()
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    const q = (searchTerm || '').trim()
                    // Ignore Enter when the input is empty (avoid showing data or re-fetching)
                    if (!q) return
                    handleSearch(searchTerm)
                  }
                }}
              />
            </div>
          </div>

          {/* Right side small icons and auth links */}
          <div className="right-area">
            <button className="icon-btn" aria-label="shipping">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="1.5" /><circle cx="18.5" cy="18.5" r="1.5" /></svg>
            </button>

            <button className="icon-btn" aria-label="cart">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
            </button>

            <div className="account-area">
              <button className="icon-btn user" aria-label="account">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              </button>
              <div className="auth-links">
                <a href="#">Sign Up</a>
                <span className="sep">|</span>
                <a href="#">Log In</a>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Filters bar below header */}
      <div className="filters-bar" ref={wrapperRef}>
        <div className="filters-inner">
          <div className="filter-item">
            <div className="filter-label">Categories</div>
            <div className="pill dropdown-pill" onClick={() => { setCategoriesOpen(!categoriesOpen); setBrandsOpen(false); }} role="button" tabIndex={0} aria-expanded={categoriesOpen}>
              <span>{selectedCategory}</span>
              <svg className="caret" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
            </div>

            {categoriesOpen && (
              <div className="dropdown-menu">
                {categories.map((c) => (
                  <div key={c} className="dropdown-item" onClick={() => { setSelectedCategory(c); setCategoriesOpen(false); }}>
                    {c}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="filter-item">
            <div className="filter-label">Brands</div>
            <div className="pill dropdown-pill" onClick={() => { setBrandsOpen(!brandsOpen); setCategoriesOpen(false); }} role="button" tabIndex={0} aria-expanded={brandsOpen}>
              <span>{selectedBrand}</span>
              <svg className="caret" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
            </div>

            {brandsOpen && (
              <div className="dropdown-menu brands-menu">
                {brands.map((b) => (
                  <div key={b} className="dropdown-item" onClick={() => { setSelectedBrand(b); setBrandsOpen(false); }}>
                    {b}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="spacer" />

          <div className="sort-area">
            <div className="sort-label">Sort By</div>
            <div className="sort-pills">
              {['Popularity', 'Lastest', 'Price'].map((s) => (
                <button key={s} className={`sort-pill ${sortBy === s ? 'active' : ''}`} onClick={() => setSortBy(s)}>{s}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Products grid */}
      <section className="products-section">
        <div className="products-inner">
          {/* API status / summary */}
          <div className="api-status" style={{ marginBottom: 12 }}>
            {apiError && <div className="error">API error: {apiError}</div>}
          </div>
          {/* Show a friendly message when API returned an empty list */}
          {!apiLoading && apiHits !== null && Array.isArray(apiHits) && apiHits.length === 0 && (
            <div className="no-results" style={{ padding: 12, color: '#666' }}>
              No results found
            </div>
          )}
          <div className="products-grid">
            {/* While API is loading show skeleton cards (card-loading placeholders) */}
            {apiLoading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <article className="product-card skeleton-card" key={`skeleton-${i}`}>
                  <div className="product-image">
                    <div className="skeleton skeleton-image" />
                  </div>
                  <div className="product-body">
                    <div className="skeleton skeleton-line" style={{ width: '70%', height: 18, marginBottom: 8 }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                      <div className="skeleton skeleton-line" style={{ width: '40%', height: 20 }} />
                      <div className="skeleton skeleton-small" style={{ width: 48, height: 20 }} />
                    </div>
                  </div>
                </article>
              ))
            ) : (
              /* Render API hits when available */
              apiHits?.map((p) => {
              const src = p?._source || {}
              const titleObj = src.title || {}
              // title.en can be an array or a string — prefer a non-empty English title when present
              const enTitle = Array.isArray(titleObj.en)
                ? titleObj.en.find((t) => typeof t === 'string' && t.trim())
                : typeof titleObj.en === 'string'
                ? titleObj.en
                : null
              const displayTitle = (enTitle && String(enTitle).trim()) || titleObj.th || src.product_slug || ''
              // images array contains objects with url property
              const imageUrl = src.images?.[0]?.url || src.images?.[0]?.file_name || ''
              const priceMin = src.price_min
              const discountPercent = src.discount_percent

              return (
                <article className="product-card" key={p?._id}>
                  <div className="product-image">
                    <img src={imageUrl} alt={displayTitle} />
                  </div>
                  <div className="product-body">
                    <h3 className="product-title" title={displayTitle}>{displayTitle}</h3>
                    <div className="product-meta">
                      <div className="label">Start at</div>
                      <div className="price-row">
                        <div className="price">{priceMin != null ? `${Number(priceMin).toLocaleString()}.-` : src.price || ''}</div>
                        {typeof discountPercent !== 'undefined' && discountPercent !== null && (
                          <div className="discount">-{discountPercent}%</div>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              )
              })
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Homepage
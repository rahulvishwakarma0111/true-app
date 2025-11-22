import React, { useState, useRef, useEffect } from 'react'
import './Homepage.css'
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProducts, searchAutocomplete, searchProducts } from '../store/homepage/homepageThunk';
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import ProductsCard from './components/ProductsCard';
import FilterOptions from './components/FilterOptions';
import { ShippingIcon, CartIcon, UserIcon } from '../assets/icons.jsx'
import { brands, categories } from '../constants/FilterOptionsList.js';

const Homepage = () => {
  const dispatch = useDispatch();
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const [brandsOpen, setBrandsOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [selectedBrand, setSelectedBrand] = useState('All Brands')
  const [sortBy, setSortBy] = useState('Popularity')
  const [searchText, setSearchText] = useState(''); // track current input
  const { productList, loading, error, autoCompleteList } = useSelector((state) => state.homepage);

  // Map ES hit objects into the shape ReactSearchAutocomplete expects
  const searchItems = (autoCompleteList || []).map((hit, index) => ({
    id: hit._id || index,
    name: hit?._source?.title?.th || hit?._source?.title || '',
    _hit: hit, // keep original hit if you need other fields in formatResult/onSelect
  }));

  // close dropdowns when clicking outside
  const wrapperRef = useRef(null)

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

  const handleSearch = async (query) => {
    let q = typeof query === 'string' ? query.trim() : '';

    if (!q) {
      return;
    }

    await dispatch(searchProducts(q));
  }

  const handleAutoComplete = async (query) => {
    let q = typeof query === 'string' ? query.trim() : '';

    if (!q) {
      return;
    }

    await dispatch(searchAutocomplete(q));
  }

  // Handler when an item is selected from autocomplete
  const handleOnSelect = (item) => {
    console.log('Selected item:', item)
    handleSearch(item.name)
  }

  // Handler for search input changes
  const handleOnSearch = (string, results) => {
    // only run autocomplete on typing
    setSearchText(typeof string === 'string' ? string : '');
    handleAutoComplete(string);
  }

  // detect Enter key to perform an explicit search
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // use the tracked latest input
      handleSearch(searchText);
    }
  }

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch])

  return (
    <div className="homepage">
      <header className="homepage-header">
        <div className="header-inner">
          {/* Search area centered */}
          <div className="searchbar-wrapper">
            <div className="search-input-wrapper" style={{ width: '100%', position: 'relative' }}>
              <div onKeyDown={handleKeyDown}>
                <ReactSearchAutocomplete
                  items={searchItems}
                  onSearch={handleOnSearch}
                  onSelect={handleOnSelect}
                  onClear={() => {
                    dispatch(fetchAllProducts());
                  }}
                  styling={{
                    height: "44px",
                    border: "1px solid #e1e5e9",
                    borderRadius: "18px", // Increased border radius
                    backgroundColor: "white",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    hoverBackgroundColor: "#f8f9fa",
                    color: "#333",
                    fontSize: "14px",
                    fontFamily: "inherit",
                    iconColor: "#6c757d",
                    lineColor: "#e1e5e9",
                    placeholderColor: "#6c757d",
                    clearIconMargin: '0 12px 0 0',
                    zIndex: 1000,
                    // Additional border radius properties for different elements
                    searchIconMargin: '0 0 0 12px',
                    clearIconMargin: '0 12px 0 0',
                    borderRadius: "18px", // Main container
                    // For the dropdown results
                    resultsContainer: {
                      borderRadius: "18px",
                      border: "1px solid #e1e5e9",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    },
                    // For individual result items
                    result: {
                      borderRadius: "8px",
                      margin: "2px 4px",
                    },
                    // For the input field
                    input: {
                      borderRadius: "12px",
                    }
                  }}
                  placeholder="Search for products..."
                  showNoResults={true}
                  showNoResultsText="No products found"
                  showItemsOnFocus={true}
                  maxResults={20}
                  autoFocus={false}
                  formatResult={(item) => {
                    console.log("items",item);
                    // item is the mapped object above; use item.name or the original hit
                    const title = item?.name || item?._hit?._source?.title?.th;
                    const image = item?._hit?._source?.images?.[0]?.url || item?._hit?._source?.images?.[0]?.file_name || '';

                    return (
                      <div
                        className="search-result-item"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '8px'
                        }}
                      >
                        {image ? (
                          <img
                            src={image}
                            alt={title || 'product image'}
                            style={{
                              width: 48,
                              height: 48,
                              objectFit: 'cover',
                              borderRadius: 8,
                              flexShrink: 0
                            }}
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        ) : null}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', overflow: 'hidden' }}>
                          <span style={{ display: 'block', textAlign: 'left', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</span>
                        </div>
                      </div>
                    )
                  }}
                />
              </div>
            </div>

            {/* Right side small icons and auth links */}
            <div className="right-area">
              <button className="icon-btn" aria-label="shipping">
                <ShippingIcon />
              </button>

              <button className="icon-btn" aria-label="cart">
                <CartIcon />
              </button>

              <div className="account-area">
                <button className="icon-btn user" aria-label="account">
                  <UserIcon />
                </button>
                <div className="auth-links">
                  <a href="#">Sign Up</a>
                  <span className="sep">|</span>
                  <a href="#">Log In</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Rest of your component remains the same */}
      <FilterOptions
        wrapperRef={wrapperRef}
        categoriesOpen={categoriesOpen}
        brandsOpen={brandsOpen}
        selectedCategory={selectedCategory}
        selectedBrand={selectedBrand}
        setCategoriesOpen={setCategoriesOpen}
        setBrandsOpen={setBrandsOpen}
        setSelectedCategory={setSelectedCategory}
        setSelectedBrand={setSelectedBrand}
        sortBy={sortBy}
        setSortBy={setSortBy}
        categories={categories}
        brands={brands}
      />

      {/* Products grid */}
      <ProductsCard productList={productList} loading={loading} error={error} />
    </div>
  )
}

export default Homepage
import React, { useState, useRef, useEffect } from 'react'
import './Homepage.css'
import WordsNinja from 'wordsninja';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProducts, searchProducts } from '../store/homepage/homepageThunk';
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import ProductsCard from './components/ProductsCard';
import FilterOptions from './components/FilterOptions';
import { ShippingIcon, CartIcon, UserIcon } from '../assets/icons.jsx'
import { brands, categories, searchSuggestions } from '../constants/FilterOptionsList.js';

const Homepage = () => {
  const dispatch = useDispatch();
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const [brandsOpen, setBrandsOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [selectedBrand, setSelectedBrand] = useState('All Brands')
  const [sortBy, setSortBy] = useState('Popularity')
  const [wordNinjaReady, setWordNinjaReady] = useState(false);
  const { productList, loading, error } = useSelector((state) => state.homepage);
  const [autocompleteItems, setAutocompleteItems] = useState(searchSuggestions)

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

  useEffect(() => {
    async function loadWordNinja() {
      await WordsNinja.loadDictionary();
      setWordNinjaReady(true);
    }
    loadWordNinja();
  }, []);

  const handleSearch = async (query) => {
    let q = typeof query === 'string' ? query.trim() : '';

    // Auto-split words like "iphoneair" -> "iphone air"
    if (wordNinjaReady && q) {
      const result = WordsNinja.splitSentence(q);
      q = result.join(" ");
    }

    if (!q) {
      return;
    }

    await dispatch(searchProducts(q));
  }

  // Handler when an item is selected from autocomplete
  const handleOnSelect = (item) => {
    console.log('Selected item:', item)
    handleSearch(item.name)
  }

  // Handler for search input changes
  const handleOnSearch = (string, results) => {
    // You can add additional logic here when user types
    console.log('Search string:', string)
    console.log('Results:', results)
  }

  // Format search results
  const formatResult = (item) => {
    return (
      <div className="search-result-item">
        <span style={{ display: 'block', textAlign: 'left' }}>{item.name}</span>
      </div>
    )
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
              <ReactSearchAutocomplete
                items={autocompleteItems}
                onSearch={handleOnSearch}
                onSelect={handleOnSelect}
                onClear={() => console.log('Cleared')}
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
                autoFocus={false}
                formatResult={formatResult}
              />
            </div>
          </div>

          {/* Right side small icons and auth links */}
          <div className="right-area">
            <button className="icon-btn" aria-label="shipping">
                <ShippingIcon/>
            </button>

            <button className="icon-btn" aria-label="cart">
                <CartIcon/>
            </button>

            <div className="account-area">
              <button className="icon-btn user" aria-label="account">
                <UserIcon/>
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
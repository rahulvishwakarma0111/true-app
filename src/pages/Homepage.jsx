import React, { useState, useRef, useEffect, useCallback } from 'react'
import './Homepage.css'
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProducts, searchAutocomplete, searchProducts } from '../store/homepage/homepageThunk';
import ProductsCard from './components/ProductsCard';
import FilterOptions from './components/FilterOptions';
import { ShippingIcon, CartIcon, UserIcon } from '../assets/icons.jsx'
import { brands, categories } from '../constants/FilterOptionsList.js';
import CustomSearchAutocomplete from '../components/CustomSearchAutocomplete.jsx';

const Homepage = () => {
  const dispatch = useDispatch();
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const [brandsOpen, setBrandsOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [selectedBrand, setSelectedBrand] = useState('All Brands')
  const [sortBy, setSortBy] = useState('popularity')
  const [searchText, setSearchText] = useState('');
  const { productList, loading, error, autoCompleteList,autocompleteLoading } = useSelector((state) => state.homepage);

  // New: collapse toggle to instruct CustomSearchAutocomplete to close dropdown
  const [collapseAutocomplete, setCollapseAutocomplete] = useState(false);

  // Local override for autocomplete items:
  // - null = use store's autoCompleteList
  // - [] = show no suggestions (used after Enter)
  // - custom array = explicitly show given suggestions
  const [localAutoCompleteItems, setLocalAutoCompleteItems] = useState(null);

  // Debounce timer ref
  const debounceTimer = useRef(null);

  // Map ES hit objects
  const storeItems = (autoCompleteList || []).map((hit, index) => ({
    id: hit._id || index,
    name: hit?._source?.title?.th || hit?._source?.title || '',
    _hit: hit,
  }));
  
  // Placeholder item shown while autocomplete is loading (shows "Loader" instead of "Loading")
  const loaderItem = { id: '__loader__', name: 'Loader', _hit: null };
  
  // Final items passed into CustomSearchAutocomplete:
  const itemsToPass = localAutoCompleteItems !== null
    ? localAutoCompleteItems
    : (loading ? [loaderItem] : storeItems);

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
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      // Clear debounce timer on unmount
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    }
  }, [wrapperRef])

  const handleSearch = useCallback(async (query) => {
    let q = typeof query === 'string' ? query.trim() : '';

    if (!q) {
      dispatch(fetchAllProducts());
      return;
    }

    await dispatch(searchProducts(q));
  }, [dispatch]);

  const handleAutoComplete = useCallback(async (query) => {
    let q = typeof query === 'string' ? query.trim() : '';

    if (!q) {
      return;
    }

    await dispatch(searchAutocomplete(q));
  }, [dispatch]);

  // Debounced autocomplete handler
  const debouncedAutoComplete = useCallback((query) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      handleAutoComplete(query);
    }, 300); // 300ms delay
  }, [handleAutoComplete]);

  // Handler when an item is selected from autocomplete
  const handleOnSelect = useCallback((item) => {
    // ignore loader placeholder selection
    if (!item || item.id === '__loader__') return;
    setSearchText(item.name);
    // hide suggestions after selecting
    setLocalAutoCompleteItems([]);
    // also collapse autocomplete dropdown
    setCollapseAutocomplete(true);
    handleSearch(item.name);
  }, [handleSearch]);

  // Handler for search input changes
  const handleOnSearch = useCallback((string, results) => {
    const searchString = typeof string === 'string' ? string : '';
    setSearchText(searchString);

    // If input cleared, treat as clear: collapse + show all products
    if (searchString.trim().length === 0) {
      // stop any pending autocomplete calls
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      setLocalAutoCompleteItems([]);        // hide suggestions
      setCollapseAutocomplete(true);       // collapse dropdown in child
      dispatch(fetchAllProducts());        // show all products
      return;
    }

    // allow suggestions from store again while typing
    if (localAutoCompleteItems !== null) {
      setLocalAutoCompleteItems(null);
    }

    // If user starts typing again, reopen autocomplete
    if (collapseAutocomplete) {
      setCollapseAutocomplete(false);
    }
    
    // Use debounced autocomplete for typing
    if (searchString.trim().length > 0) {
      debouncedAutoComplete(searchString);
    }
  }, [debouncedAutoComplete, localAutoCompleteItems, collapseAutocomplete, dispatch]);

  // detect Enter key to perform an explicit search
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Clear any pending autocomplete requests
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      // hide suggestion list immediately when user presses Enter
      setLocalAutoCompleteItems([]);
      // collapse the autocomplete dropdown in the child
      setCollapseAutocomplete(true);
      handleSearch(searchText);
    }
  }, [searchText, handleSearch]);

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch])

  // New: clear handler passed into child to call fetchAllProducts
  const handleClear = useCallback(() => {
    setSearchText('');
    setLocalAutoCompleteItems([]);
    setCollapseAutocomplete(true);
    dispatch(fetchAllProducts());
  }, [dispatch]);

  // helper to read fields from different shapes (plain or ES hit)
  const getField = (item, field) => {
    if (!item) return undefined
    if (item._source && item._source[field] !== undefined) return item._source[field]
    if (item[field] !== undefined) return item[field]
    return undefined
  }

  // memoized sorted products according to sortBy
  const sortedProducts = React.useMemo(() => {
    if (!productList || !Array.isArray(productList)) return productList

    // don't mutate original
    const list = [...productList]

    if (sortBy === 'popularity') {
      // sort by common popularity fields (descending = most popular first)
      list.sort((a, b) => {
        const pa = parseFloat(getField(a, 'popularity') ?? getField(a, 'popularity_score') ?? getField(a, 'views') ?? getField(a, 'sold') ?? getField(a, 'sold_count') ?? 0) || 0
        const pb = parseFloat(getField(b, 'popularity') ?? getField(b, 'popularity_score') ?? getField(b, 'views') ?? getField(b, 'sold') ?? getField(b, 'sold_count') ?? 0) || 0
        return pb - pa
      })
    } else if (sortBy === 'latest') {
      // sort by update_date (newest first)
      list.sort((a, b) => {
        const da = new Date(getField(a, 'update_date') || getField(a, 'updated_at') || 0).getTime()
        const db = new Date(getField(b, 'update_date') || getField(b, 'updated_at') || 0).getTime()
        return db - da
      })
    } else if (sortBy === 'price_asc' || sortBy === 'price_desc') {
      // sort by price (numeric)
      list.sort((a, b) => {
        const pa = parseFloat(getField(a, 'price') ?? getField(a, 'sale_price') ?? getField(a, 'price_value') ?? 0) || 0
        const pb = parseFloat(getField(b, 'price') ?? getField(b, 'sale_price') ?? getField(b, 'price_value') ?? 0) || 0
        return sortBy === 'price_asc' ? pa - pb : pb - pa
      })
    } else {
      // default: return as-is (server order / fetched order)
    }

    return list
  }, [productList, sortBy])

  // toggle price sort between asc/desc
  const togglePriceSort = useCallback(() => {
    setSortBy((s) => (s === 'price_asc' ? 'price_desc' : 'price_asc'))
  }, [])

  // set latest sort
  const showLatest = useCallback(() => setSortBy('latest'), [])

  // set popularity sort
  const showPopularity = useCallback(() => setSortBy('popularity'), [])

  console.log("collapseAutocomplete",collapseAutocomplete)

  return (
    <div className="homepage">
      <header className="homepage-header">
        <div className="header-inner">
          {/* Search area centered */}
          <div className="searchbar-wrapper">
            <div className="search-input-wrapper" style={{ width: '100%', position: 'relative' }}>
              <div onKeyDown={handleKeyDown}>
                <CustomSearchAutocomplete
                  items={itemsToPass}
                  onSearch={handleOnSearch}
                  onSelect={handleOnSelect}
                  placeholder="Search for products..."
                  loading={autocompleteLoading}
                  // New prop to instruct child to collapse its dropdown
                  collapse={collapseAutocomplete}
                  // New: onClear will be called when user clicks the cross icon
                  onClear={handleClear}
                  // make autocomplete controlled by parent
                  value={searchText}
                />
              </div>
            </div>

            {/* Rest of your component remains the same */}
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
        onTogglePriceSort={togglePriceSort}
        onShowLatest={showLatest}
        onShowPopularity={showPopularity}
        categories={categories}
        brands={brands}
      />

      {/* Products grid */}
      <ProductsCard productList={sortedProducts} loading={loading} error={error} />
    </div>
  )
}

export default Homepage
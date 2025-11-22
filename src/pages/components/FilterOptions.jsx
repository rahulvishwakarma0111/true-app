import React from 'react'

const FilterOptions = ({
  wrapperRef,
  categoriesOpen,
  brandsOpen,
  selectedCategory,
  selectedBrand,
  setCategoriesOpen,
  setBrandsOpen,
  setSelectedCategory,
  setSelectedBrand,
  sortBy,
  setSortBy,
  categories,
  brands
}) => {
  return (
    <div className="filters-bar" ref={wrapperRef}>
      <div className="filters-inner">
        <div className="filter-item">
          <div className="filter-label">Categories</div>
          <div
            className="pill dropdown-pill"
            onClick={() => { setCategoriesOpen(!categoriesOpen); setBrandsOpen(false); }}
            role="button"
            tabIndex={0}
            aria-expanded={categoriesOpen}
          >
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
          <div
            className="pill dropdown-pill"
            onClick={() => { setBrandsOpen(!brandsOpen); setCategoriesOpen(false); }}
            role="button"
            tabIndex={0}
            aria-expanded={brandsOpen}
          >
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
  )
}

export default FilterOptions
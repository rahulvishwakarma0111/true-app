import React, { useMemo } from 'react'
import { useLocation, useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const ViewProduct = () => {
  const location = useLocation()
  const params = useParams()
  const navigate = useNavigate()

  // product passed via navigate state
  const stateProduct = location.state?.p

  console.log("stateProduct", stateProduct);

  // fallback: try to find product in redux product list by id
  const productList = useSelector((s) => s.homepage?.productList || [])
  const productId = params.id
  const product = useMemo(() => {
    if (stateProduct) return stateProduct
    return productList.find(p => (p._id || p.id || String(p.id)) === String(productId))
  }, [stateProduct, productList, productId])

  // normalize product shape (handles ES hit with _source)
  const displayProduct = useMemo(() => {
    if (!product) return null
    const src = product._source || product

    const resolveTitle = () => {
      if (!src.title) return src.name || src.product_slug || src.id
      if (typeof src.title === 'string') return src.title
      if (typeof src.title === 'object') {
        if (src.title.th) return src.title.th
        if (Array.isArray(src.title.en) && src.title.en.length) return src.title.en[0]
        // fallback to first string value found
        for (const v of Object.values(src.title)) {
          if (typeof v === 'string' && v) return v
          if (Array.isArray(v) && v.length) return v[0]
        }
      }
      return src.name || src.id
    }

    const imageUrl = src.images?.[0]?.url || src.image || src.image_url || ''
    const priceDisplay = typeof src.price === 'number'
      ? `$${src.price}`
      : src.price_with_max_discount_device_bundle_new_customer
        ? `$${src.price_with_max_discount_device_bundle_new_customer}`
        : src.price || (src.price_min ? `$${src.price_min}` : null)

    const priceMin = src.price_min ?? src.min_price ?? null
    const priceMax = src.price_max ?? src.max_price ?? null

    const description = src.description || src._source?.description || ''

    // parse item_variant.th pipe separated string into an array of variant labels
    const variants = (() => {
      const vStr = src.item_variant?.th || src.item_variant?.en || ''
      if (!vStr || typeof vStr !== 'string') return []
      return vStr.split('|').map(s => s.trim()).filter(Boolean)
    })()

    const totalOrdersLastWeek = src.total_order_last_week ?? src.total_orders_last_week ?? src.total_orders_last_7_days ?? null

    return {
      ...src,
      title: resolveTitle(),
      imageUrl,
      priceDisplay,
      priceMin,
      priceMax,
      description,
      variants,
      totalOrdersLastWeek
    }
  }, [product])

  const handleBack = () => {
    navigate(-1)
  }

  if (!product) {
    return (
      <div className="product-not-found" style={styles.notFoundContainer}>
        <div style={styles.notFoundContent}>
          <h2 style={styles.notFoundTitle}>Product Not Found</h2>
          <p style={styles.notFoundText}>
            We couldn't find the product you're looking for. This might happen if you navigated directly to this page.
          </p>
          <button 
            onClick={handleBack}
            style={styles.backButton}
          >
            ← Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="view-product" style={styles.container}>
      {/* Back Button */}
      <button 
        onClick={handleBack}
        style={styles.backButton}
      >
        ← Back to Products
      </button>

      <div style={styles.content}>
        {/* Image Section */}
        <div style={styles.imageSection}>
          <div style={styles.imageContainer}>
            <img
              src={displayProduct?.imageUrl}
              alt={displayProduct?.title}
              style={styles.image}
              onError={(e) => { 
                e.currentTarget.style.display = 'none'
                e.currentTarget.nextSibling.style.display = 'flex'
              }}
            />
            <div style={styles.imagePlaceholder}>
              <span>No Image Available</span>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div style={styles.detailsSection}>
          <h1 style={styles.title}>{displayProduct?.title}</h1>
          
          {/* Price Display */}
          <div style={styles.priceSection}>
            <h3 style={styles.price}>{displayProduct?.priceDisplay || 'Price not available'}</h3>
            
            {/* Price Range */}
            {(displayProduct?.priceMin != null || displayProduct?.priceMax != null) && (
              <div style={styles.priceRange}>
                <span style={styles.priceRangeLabel}>Price Range: </span>
                <span style={styles.priceRangeValue}>
                  {displayProduct.priceMin != null ? `$${displayProduct.priceMin}` : 'N/A'}
                  {displayProduct.priceMax != null ? ` – $${displayProduct.priceMax}` : ''}
                </span>
              </div>
            )}
          </div>

          {/* Total Orders */}
          {displayProduct?.totalOrdersLastWeek != null && (
            <div style={styles.ordersBadge}>
              <span style={styles.ordersIcon}>📦</span>
              <span>{displayProduct.totalOrdersLastWeek} orders last week</span>
            </div>
          )}

          {/* Description */}
          <div style={styles.descriptionSection}>
            <h4 style={styles.sectionTitle}>Description</h4>
            <p style={styles.description}>
              {displayProduct?.description || 'No description available for this product.'}
            </p>
          </div>

          {/* Variants */}
          {displayProduct?.variants?.length > 0 && (
            <div style={styles.variantsSection}>
              <h4 style={styles.sectionTitle}>Available Variants</h4>
              <div style={styles.variantsContainer}>
                {displayProduct.variants.map((v, i) => (
                  <span
                    key={i}
                    style={styles.variantChip}
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={styles.actionSection}>
            <button style={styles.primaryButton}>
              Add to Cart
            </button>
            <button style={styles.secondaryButton}>
              Save to Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    padding: '32px',
    maxWidth: '1200px',
    margin: '0 auto',
    backgroundColor: '#f8fafc',
    minHeight: '100vh'
  },
  backButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    backgroundColor: 'transparent',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    transition: 'all 0.2s ease',
    marginBottom: '24px'
  },
  content: {
    display: 'flex',
    gap: '48px',
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
  },
  imageSection: {
    flex: '0 0 400px'
  },
  imageContainer: {
    position: 'relative',
    borderRadius: '12px',
    overflow: 'hidden',
    backgroundColor: '#f9fafb'
  },
  image: {
    width: '100%',
    height: '400px',
    objectFit: 'cover',
    display: 'block'
  },
  imagePlaceholder: {
    display: 'none',
    width: '100%',
    height: '400px',
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#6b7280',
    fontSize: '16px',
    fontWeight: '500'
  },
  detailsSection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1f2937',
    margin: 0,
    lineHeight: 1.2
  },
  priceSection: {
    padding: '16px 0',
    borderBottom: '1px solid #e5e7eb'
  },
  price: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#059669',
    margin: '0 0 12px 0'
  },
  priceRange: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '16px'
  },
  priceRangeLabel: {
    fontWeight: '500',
    color: '#6b7280'
  },
  priceRangeValue: {
    fontWeight: '600',
    color: '#374151'
  },
  ordersBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: '#fef3c7',
    color: '#92400e',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '500',
    width: 'fit-content'
  },
  ordersIcon: {
    fontSize: '16px'
  },
  descriptionSection: {
    padding: '16px 0'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1f2937',
    margin: '0 0 12px 0'
  },
  description: {
    fontSize: '16px',
    lineHeight: 1.6,
    color: '#4b5563',
    margin: 0
  },
  variantsSection: {
    padding: '16px 0'
  },
  variantsContainer: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap'
  },
  variantChip: {
    padding: '8px 16px',
    borderRadius: '20px',
    border: '1px solid #d1d5db',
    background: '#f9fafb',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    transition: 'all 0.2s ease'
  },
  actionSection: {
    display: 'flex',
    gap: '16px',
    padding: '24px 0',
    borderTop: '1px solid #e5e7eb'
  },
  primaryButton: {
    padding: '14px 32px',
    backgroundColor: '#059669',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  },
  secondaryButton: {
    padding: '14px 32px',
    backgroundColor: 'transparent',
    color: '#059669',
    border: '1px solid #059669',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  notFoundContainer: {
    padding: '48px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    backgroundColor: '#f8fafc'
  },
  notFoundContent: {
    textAlign: 'center',
    maxWidth: '480px'
  },
  notFoundTitle: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '16px'
  },
  notFoundText: {
    fontSize: '16px',
    color: '#6b7280',
    lineHeight: 1.6,
    marginBottom: '32px'
  }
}

export default ViewProduct
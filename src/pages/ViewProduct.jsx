import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import styles from './ViewProduct.styles' // new import
import { searchProducts } from '../store/homepage/homepageThunk'
import ProductsCard from './components/ProductsCard'

const ViewProduct = () => {
    const location = useLocation()
    const params = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { productList, loading, error, autoCompleteList, autocompleteLoading } = useSelector((state) => state.homepage);

    const [imgError, setImgError] = useState(false)
    const [selectedVariant, setSelectedVariant] = useState(null)
    // improved UI state
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [quantity, setQuantity] = useState(1)

    const broughtTogetherProducts = useMemo(() => [
        {
            _id: 'bt-1',
            _source: {
                title: { en: ['Fast Wireless Charger'] },
                images: [{ url: 'https://m.media-amazon.com/images/I/61C5H3FnI4L._AC_UF1000,1000_QL80_.jpg' }],
                price_min: 29.99,
                discount_percent: 0,
                product_slug: 'fast-wireless-charger',
                description: '15W Fast Wireless Charging Pad with LED Indicator'
            }
        },
        {
            _id: 'bt-2',
            _source: {
                title: { en: ['Premium Phone Case'] },
                images: [{ url: 'https://riggear-web-images.s3.ap-south-1.amazonaws.com/UploadImages/3541a23a-72a9-4c40-bfcd-393451b5c6d4_big.jpg' }],
                price_min: 19.99,
                discount_percent: 10,
                product_slug: 'premium-phone-case',
                description: 'Shockproof Protective Case with Military Grade Protection'
            }
        },
        {
            _id: 'bt-3',
            _source: {
                title: { en: ['Tempered Glass Screen Guard'] },
                images: [{ url: 'https://winskart.co.in/cdn/shop/products/Vivo_V21E_Matte_Tempered_Glass.jpg?v=1679656995' }],
                price_min: 12.99,
                discount_percent: 5,
                product_slug: 'tempered-glass-screen-guard',
                description: '9H Hardness Anti-Scratch Screen Protector'
            }
        },
        {
            _id: 'bt-4',
            _source: {
                title: { en: ['Camera Lens Protector'] },
                images: [{ url: 'https://ringke.co.in/cdn/shop/products/61u6hxy5CJL._SL1500__1.jpg?v=1672916567' }],
                price_min: 8.99,
                discount_percent: null,
                product_slug: 'camera-lens-protector',
                description: 'Camera Lens Protection Kit with Easy Installation'
            }
        }
    ], []);

    // product passed via navigate state
    const stateProduct = location.state?.p
    const searchQuery = stateProduct?._source?.title?.th?.split(" ")[0] || stateProduct?._source?.title?.en?.[0]?.split(" ")[0] || stateProduct?.name?.split(" ")[0] || ''

    // fallback: try to find product in redux product list by id
    const productListSpecific = useSelector((s) => s.homepage?.productListSpecific || [])
    const productId = params.id

    const product = useMemo(() => {
        if (stateProduct) return stateProduct
        return productListSpecific.find(p => (p._id || p.id || String(p.id)) === String(productId))
    }, [stateProduct, productListSpecific, productId])

    useEffect(() => {
        dispatch(searchProducts(searchQuery));
    }, [dispatch, searchQuery])

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
        const images = Array.isArray(src.images) && src.images.length
            ? src.images.map(i => i.url || i)
            : (imageUrl ? [imageUrl] : [])

        const priceDisplay = typeof src.price === 'number'
            ? `$${src.price.toFixed(2)}`
            : src.price_with_max_discount_device_bundle_new_customer
                ? `$${Number(src.price_with_max_discount_device_bundle_new_customer).toFixed(2)}`
                : src.price || (src.price_min ? `$${Number(src.price_min).toFixed(2)}` : null)

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

        const discountPercent = src.discount_percent ?? src.discount ?? null

        return {
            ...src,
            title: resolveTitle(),
            images,
            imageUrl,
            priceDisplay,
            priceMin,
            priceMax,
            description,
            variants,
            totalOrdersLastWeek,
            discountPercent
        }
    }, [product])

    // set initial selected variant when product loads
    useEffect(() => {
        if (displayProduct?.variants?.length) {
            setSelectedVariant(displayProduct.variants[0])
        } else {
            setSelectedVariant(null)
        }
        // reset image error and current image when product changes
        setImgError(false)
        setCurrentImageIndex(0)
        setQuantity(1)
    }, [displayProduct])

    const handleBack = () => {
        navigate('/')
    }

    const formatCurrency = (value) => {
        if (value == null) return ''
        const num = Number(String(value).replace(/[^0-9.-]+/g, '')) || 0
        return `$${num.toFixed(2)}`
    }

    const increaseQty = () => setQuantity(q => Math.min(99, q + 1))
    const decreaseQty = () => setQuantity(q => Math.max(1, q - 1))

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

    const mainImage = displayProduct?.images?.[currentImageIndex] || displayProduct?.imageUrl || ''
    const singlePriceValue = displayProduct?.priceMin ?? displayProduct?.price ?? null
    const computedTotal = singlePriceValue ? (Number(singlePriceValue) * quantity) : null

    return (
        <div className="view-product" style={styles.container}>
            {/* Breadcrumb */}
            <div style={styles.breadcrumb}>
                <button onClick={handleBack} aria-label="Back to products" style={styles.breadcrumbLink}>Products</button>
                <span style={styles.breadcrumbSep}>/</span>
                <span style={styles.breadcrumbCurrent} title={displayProduct?.title}>{displayProduct?.title}</span>
            </div>

            <div style={styles.content}>
                {/* Image Section */}
                <div style={styles.imageSection}>
                    <div style={styles.imageContainer}>
                        {mainImage && !imgError ? (
                            <img
                                src={mainImage}
                                alt={displayProduct.title}
                                style={styles.image}
                                onError={() => setImgError(true)}
                                onLoad={() => setImgError(false)}
                            />
                        ) : (
                            <div style={{ ...styles.imagePlaceholder, display: 'flex' }} role="img" aria-label="No image available">
                                <div style={styles.imageFallback}>
                                    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M3 15l4-4 4 4 5-6 4 6" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    <div style={{ marginTop: 8, color: '#6b7280' }}>No image</div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* thumbnails */}
                    {displayProduct?.images?.length > 1 && (
                        <div style={styles.thumbnailContainer} role="list" aria-label="Product images">
                            {displayProduct.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentImageIndex(idx)}
                                    aria-current={currentImageIndex === idx}
                                    style={currentImageIndex === idx ? { ...styles.thumbnail, ...styles.thumbnailActive } : styles.thumbnail}
                                >
                                    <img src={img} alt={`${displayProduct.title} ${idx + 1}`} style={styles.thumbnailImg} />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Details */}
                <div style={styles.detailsSection}>
                    <h1 style={styles.title}>{displayProduct?.title}</h1>

                    {/* Price Display */}
                    <div style={styles.priceSection}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                            <h3 style={styles.price}>{displayProduct?.priceDisplay || 'Price not available'}</h3>

                            {/* Discount badge */}
                            {displayProduct?.discountPercent != null && Number(displayProduct.discountPercent) > 0 && (
                                <div style={styles.discountBadge}>
                                    {Number(displayProduct.discountPercent)}% OFF
                                </div>
                            )}
                        </div>

                        {/* Price Range */}
                        {(displayProduct?.priceMin != null || displayProduct?.priceMax != null) && (
                            <div style={styles.priceRange}>
                                <span style={styles.priceRangeLabel}>Price Range:</span>
                                <span style={styles.priceRangeValue}>
                                    {displayProduct.priceMin != null ? `$${Number(displayProduct.priceMin).toFixed(2)}` : 'N/A'}
                                    {displayProduct.priceMax != null ? ` – $${Number(displayProduct.priceMax).toFixed(2)}` : ''}
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
                                    <button
                                        key={i}
                                        onClick={() => setSelectedVariant(v)}
                                        aria-pressed={selectedVariant === v}
                                        style={selectedVariant === v ? { ...styles.variantChip, ...styles.variantActive } : styles.variantChip}
                                    >
                                        {v}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quantity & Actions */}
                    <div style={styles.actionSection}>
                        <div style={styles.qtyControl} aria-label="Quantity selector">
                            <button onClick={decreaseQty} style={styles.qtyButton} aria-label="Decrease quantity">−</button>
                            <div style={styles.qtyDisplay}>{quantity}</div>
                            <button onClick={increaseQty} style={styles.qtyButton} aria-label="Increase quantity">+</button>
                        </div>

                        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                            <button style={styles.primaryButton} aria-label="Add to cart">
                                🛒 Add to Cart
                                {computedTotal != null && <span style={{ marginLeft: 10, fontWeight: 600 }}>{formatCurrency(computedTotal)}</span>}
                            </button>
                            <button style={styles.secondaryButton} aria-label="Save to wishlist">
                                💖 Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* sticky bar for small screens */}
            <div style={styles.stickyBar} role="region" aria-hidden={false}>
                <div style={styles.stickyBarContent}>
                    <div style={styles.stickyPrice}>
                        <div style={{ fontSize: 13, color: '#6b7280' }}>Total</div>
                        <div style={{ fontWeight: 700 }}>{computedTotal != null ? formatCurrency(computedTotal) : (displayProduct?.priceDisplay)}</div>
                    </div>
                    <div style={styles.stickyButtons}>
                        <button style={styles.primaryButton}>Add</button>
                    </div>
                </div>
            </div>

            {/* Brought Together */}
            <div style={styles.relatedProductsSection}>
                <h2 style={styles.relatedProductsTitle}>Brought Together</h2>
                <ProductsCard productList={broughtTogetherProducts.slice(0, 4)} loading={loading} error={error} clickable={false} />
            </div>

            {/* Related Products */}
            <div style={styles.relatedProductsSection}>
                <h2 style={styles.relatedProductsTitle}>Related Products</h2>
                <ProductsCard productList={productList.slice(0, 4)} loading={loading} error={error} clickable={true} />
            </div>
        </div>
    )
}

export default ViewProduct
import React from 'react'
import { useNavigate } from 'react-router-dom'

const ProductsCard = ({productList, loading, error}) => {

    const navigate = useNavigate()

    return (
        <section className="products-section">
            <div className="products-inner">
                {!loading && productList !== null && Array.isArray(productList) && productList.length === 0 && (
                    <div className="no-results" style={{ padding: 12, color: '#666' }}>
                        No results found
                    </div>
                )}
                <div className="products-grid">
                    {loading ? (
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
                        productList?.map((p) => {
                            const src = p?._source || {}
                            const titleObj = src.title || {}
                            const enTitle = Array.isArray(titleObj.en)
                                ? titleObj.en.find((t) => typeof t === 'string' && t.trim())
                                : typeof titleObj.en === 'string'
                                    ? titleObj.en
                                    : null
                            const displayTitle = (enTitle && String(enTitle).trim()) || titleObj.th || src.product_slug || ''
                            const imageUrl = src.images?.[0]?.url || src.images?.[0]?.file_name || ''
                            const priceMin = src.price_min
                            const discountPercent = src.discount_percent

                            return (
                                <article className="product-card" key={p?._id} onClick={() => navigate(`/view-product/${p?._id}`, { state: { p } })}>
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
    )
}

export default ProductsCard
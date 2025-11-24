export default {
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
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
    color: '#6b7280',
    fontSize: '14px'
  },
  breadcrumbLink: {
    background: 'transparent',
    border: 'none',
    color: '#ef4444',
    cursor: 'pointer',
    padding: 0,
    fontSize: '14px'
  },
  breadcrumbSep: {
    opacity: 0.5
  },
  breadcrumbCurrent: {
    color: '#374151',
    fontWeight: 600,
    maxWidth: '60%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
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
    backgroundColor: '#f9fafb',
    minHeight: '220px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    width: '100%',
    height: '400px',
    objectFit: 'contain',
    display: 'block',
    background: '#fff'
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
  imageFallback: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  thumbnailContainer: {
    marginTop: 12,
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap'
  },
  thumbnail: {
    width: 64,
    height: 64,
    padding: 6,
    borderRadius: 8,
    border: '1px solid rgba(0,0,0,0.06)',
    background: '#fff',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  thumbnailActive: {
    boxShadow: '0 6px 18px rgba(12, 18, 28, 0.06)',
    border: '2px solid rgba(239,68,68,0.12)',
    transform: 'translateY(-2px)'
  },
  thumbnailImg: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'cover',
    display: 'block',
    borderRadius: 6
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
    color: '#ef4444',
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
    transition: 'all 0.2s ease',
    cursor: 'pointer'
  },
  variantActive: {
    background: 'linear-gradient(90deg, #ef4444, #ec4899)',
    color: '#fff',
    border: 'none',
    transform: 'translateY(-2px)'
  },
  actionSection: {
    display: 'flex',
    gap: '16px',
    padding: '24px 0',
    borderTop: '1px solid #e5e7eb',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  qtyControl: {
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: 8,
    border: '1px solid #e5e7eb',
    overflow: 'hidden',
    background: '#fff'
  },
  qtyButton: {
    padding: '8px 12px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: 18
  },
  qtyDisplay: {
    minWidth: 40,
    textAlign: 'center',
    fontWeight: 700
  },
  primaryButton: {
    padding: '12px 20px',
    background: 'linear-gradient(90deg, #ef4444, #ec4899)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'transform 120ms ease, box-shadow 120ms ease',
    boxShadow: '0 6px 18px rgba(236,72,153,0.12)'
  },
  secondaryButton: {
    padding: '12px 20px',
    backgroundColor: 'transparent',
    color: '#ef4444',
    border: '1px solid rgba(239,68,68,0.12)',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  discountBadge: {
    background: 'linear-gradient(90deg,#ef4444,#ec4899)',
    color: '#fff',
    padding: '6px 10px',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: '700'
  },
  relatedProductsSection: {
    marginTop: '28px'
  },
  relatedProductsTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '12px'
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
  },

  // sticky purchase bar (hidden on desktop, shown on small screens via media override)
  stickyBar: {
    display: 'none'
  },
  stickyBarContent: {
    maxWidth: 1200,
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    padding: '8px 12px'
  },
  stickyPrice: {
    display: 'flex',
    flexDirection: 'column'
  },
  stickyButtons: {
    display: 'flex',
    gap: 8
  },

  // responsive adjustments
  '@media (max-width: 900px)': {
    content: {
      flexDirection: 'column',
      padding: '20px'
    },
    imageSection: {
      flex: '0 0 auto'
    },
    image: {
      height: '260px'
    },
    price: {
      fontSize: '22px'
    },
    title: {
      fontSize: '22px'
    },
    actionSection: {
      width: '100%'
    },
    primaryButton: {
      width: '100%',
      minWidth: '0'
    },
    secondaryButton: {
      width: '100%'
    },
    // show sticky purchase bar on small screens
    stickyBar: {
      display: 'block',
      position: 'fixed',
      left: 0,
      right: 0,
      bottom: 0,
      background: '#ffffff',
      borderTop: '1px solid rgba(0,0,0,0.06)',
      padding: '10px 12px',
      zIndex: 60
    }
  }
}


